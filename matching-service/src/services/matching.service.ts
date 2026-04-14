import { Server } from 'socket.io';
import { queueService } from './queue.service';
import { QuestionClient } from '../clients/question.client';
import { CollabClient } from '../clients/collab.client';

class MatchingService {
  /**
   * When a user joins the queue, it attempts an immediate exact match.
   */
  public async findMatch(io: Server, userId: string, topics: string[], difficulties: string[]): Promise<void> {
    const isMatched = await this.tryExactMatch(io, userId, topics, difficulties);  
  }

  /**
   * Attempts to find a user with overlapping topics and difficulties.
   */
  private async tryExactMatch(io: Server, userId: string, topics: string[], difficulties: string[]): Promise<boolean> {
    // Gather all unique candidates from every queue the user is in, tracking which queues we found them in
    const candidatesMap = new Map<string, { topic: string, difficulty: string }[]>();

    for (const topic of topics) {
      for (const difficulty of difficulties) {
        const candidates = await queueService.getCandidatesInQueue(topic, difficulty);
        for (const c of candidates) {
           if (c !== userId) {
             if (!candidatesMap.has(c)) {
               candidatesMap.set(c, []);
             }
             candidatesMap.get(c)!.push({ topic, difficulty });
           }
        }
      }
    }

    const validPartners = [];

    for (const [candidateId, foundInQueues] of candidatesMap.entries()) {
      const candidateTicket = await queueService.getTicket(candidateId);        

      if (!candidateTicket) {
          console.log(`Ticket is not valid for ${candidateId}. Removing stale candidate from queue.`);
          // Remove stale user from the Redis Sets we found them in to prevent queue build up
          for (const queue of foundInQueues) {
            queueService.removeUserFromQueue(candidateId, queue.topic, queue.difficulty);
          }
          continue;
      }

      // Check if there is an intersection between our topics/difficulties and candidate's topic/difficulty
      const sharedTopics = candidateTicket.topic.filter(t => topics.includes(t));
      const sharedDifficulties = candidateTicket.difficulty.filter(d => difficulties.includes(d));

      const isMatchingTicketValid = sharedTopics.length > 0 && sharedDifficulties.length > 0;

      if (!isMatchingTicketValid) {
          // Candidate re-queued with different preferences but is still in our queue bucket
          console.log(`Candidate ${candidateId} preference mismatch. Removing stale queue entries.`);
          for (const queue of foundInQueues) {
            if (!candidateTicket.topic.includes(queue.topic) || !candidateTicket.difficulty.includes(queue.difficulty)) {
              queueService.removeUserFromQueue(candidateId, queue.topic, queue.difficulty);
            }
          }
          continue;
      }

      validPartners.push({
         ticket: candidateTicket,
         sharedTopics,
         sharedDifficulties
      });
    }

    // Sort partners by longest waiting time (oldest first)
    validPartners.sort((a, b) => a.ticket.joinedAt - b.ticket.joinedAt);

    // Iteratively try to match with valid partners in case another concurrent request grabbed our first choice
    for (const partner of validPartners) {
      const isMatched = await this.executeMatch(io, userId, partner.ticket.userId, partner.sharedTopics as string[], partner.sharedDifficulties as string[]);
      if (isMatched) {
        return true;
      }
    }

    return false;
  }

  /**
   * Attempts to find a user with overlapping topics but an expanded difficulty.
   */
  public async tryExpandedMatch(io: Server, userId: string, topics: string[], originalDifficulties: string[], failedExpandedCandidates: Set<string>): Promise<boolean> {
    const allDifficulties = ['easy', 'medium', 'hard'];
    // We only want to search difficulties that are NOT in the original difficulties
    const expandedDifficulties = allDifficulties.filter(d => !originalDifficulties.includes(d));

    if (expandedDifficulties.length === 0) return false;

    const candidatesMap = new Map<string, { topic: string, difficulty: string }[]>();

    for (const topic of topics) {
      for (const difficulty of expandedDifficulties) {
        const candidates = await queueService.getCandidatesInQueue(topic, difficulty);
        for (const c of candidates) {
           if (c !== userId && !failedExpandedCandidates.has(c)) {
             if (!candidatesMap.has(c)) {
               candidatesMap.set(c, []);
             }
             candidatesMap.get(c)!.push({ topic, difficulty });
           }
        }
      }
    }

    const validPartners = [];

    for (const [candidateId, foundInQueues] of candidatesMap.entries()) {
      const candidateTicket = await queueService.getTicket(candidateId);        

      if (!candidateTicket) {
          console.log(`Ticket is not valid for ${candidateId}. Removing stale candidate from queue.`);
          for (const queue of foundInQueues) {
            queueService.removeUserFromQueue(candidateId, queue.topic, queue.difficulty);
          }
          continue;
      }

      // Ensure that we at least share one topic with the candidate
      const sharedTopics = candidateTicket.topic.filter(t => topics.includes(t));
      // Ensure the candidate officially supports the expanded difficulty
      const sharedExpandedDifficulties = candidateTicket.difficulty.filter(d => expandedDifficulties.includes(d));

      if (sharedTopics.length === 0 || sharedExpandedDifficulties.length === 0) {
          console.log(`Candidate ${candidateId} preference mismatch in expanded search.`);
          for (const queue of foundInQueues) {
            if (!candidateTicket.topic.includes(queue.topic) || !candidateTicket.difficulty.includes(queue.difficulty)) {
              queueService.removeUserFromQueue(candidateId, queue.topic, queue.difficulty);
            }
          }
          continue;
      }

      validPartners.push({
         ticket: candidateTicket,
         sharedTopics,
         sharedExpandedDifficulties
      });
    }

    // Sort partners by longest waiting time (oldest first)
    validPartners.sort((a, b) => a.ticket.joinedAt - b.ticket.joinedAt);

    for (const partner of validPartners) {
      const ticketA = await queueService.getTicket(userId);
      if (!ticketA) return false;

      // Propose match by getting the user's socket ID and emitting
      io.to(ticketA.socketId).emit('PROPOSE_RELAXED_MATCH', {
        candidateId: partner.ticket.userId,
        sharedTopics: partner.sharedTopics,
        sharedDifficulties: partner.sharedExpandedDifficulties
      });
      return true; // We only propose one match at a time
    }

    return false;
  }

  /**
   * Atomically removes both users from Redis and create a session.
   */
  public async executeMatch(io: Server, userA: string, userB: string, sharedTopics: string[], sharedDifficulties: string[]): Promise<boolean> {
    const ticketA = await queueService.getTicket(userA);
    const ticketB = await queueService.getTicket(userB);

    if (!ticketA || !ticketB) return false;

    // Verify users still have overlapping properties, but respect the accepted relaxed difficulties 
    // userA is the one who initiated or relaxed the match, so we verify against the proposed shared parameters
    const currentSharedTopics = sharedTopics.filter(t => ticketA.topic.includes(t) && ticketB.topic.includes(t));
    const currentSharedDifficulties = sharedDifficulties.filter(d => ticketB.difficulty.includes(d)); // User A might not have this difficulty historically

    if (currentSharedTopics.length === 0 || currentSharedDifficulties.length === 0) {
      return false;
    }

    const isRemovedSuccess = await queueService.removeBothUserFromMatchPool(ticketA, ticketB);

    if (!isRemovedSuccess) {
      return false;
    }

    let question: any = null;
    let matchedTopic = '';
    let matchedDifficulty = '';

    try {
      if (ticketA.filterUnattempted || ticketB.filterUnattempted) {
        question = await QuestionClient.getRandomUnattemptedQuestion(userA, userB, currentSharedTopics, currentSharedDifficulties);
        if (question) {
          // Unattempted question API doesn't return the exact topic matched, so we pick the first overlapped topic of the question for session creation.
          // Fallback to random if no intersection (shouldn't happen)
          const qTopics = question.topics;
          const intersectionTopic = currentSharedTopics.find(t => qTopics.includes(t));
          matchedTopic = intersectionTopic || currentSharedTopics[Math.floor(Math.random() * currentSharedTopics.length)]!;
          matchedDifficulty = question.difficulty;
        }
      } else {
        matchedTopic = currentSharedTopics[Math.floor(Math.random() * currentSharedTopics.length)]!;
        matchedDifficulty = currentSharedDifficulties[Math.floor(Math.random() * currentSharedDifficulties.length)]!;
        question = await QuestionClient.getRandomQuestion(matchedTopic, matchedDifficulty);
      }

      if (!question) {
        throw new Error('NO_SUITABLE_QUESTION');
      }
    } catch (error: any) {
      if (error?.message === 'NO_SUITABLE_QUESTION' || error?.message?.includes('No questions found')) {
        console.log(`[MATCH_SKIPPED] No suitable question found for ${userA} & ${userB}. Re-inserting to queue.`);
        
        // Re-insert both users with their original joinedAt to preserve TTL
        await queueService.addUserToMatchPool(ticketA.userId, ticketA.socketId, ticketA.topic, ticketA.difficulty, ticketA.filterUnattempted, ticketA.joinedAt);
        await queueService.addUserToMatchPool(ticketB.userId, ticketB.socketId, ticketB.topic, ticketB.difficulty, ticketB.filterUnattempted, ticketB.joinedAt);
        return false;
      }

      console.log(`[MATCH_EXECUTION_ERROR] Failed to fetch question for ${userA} & ${userB}:`, error);

      const errMsg = error instanceof Error ? error.message : 'Unable to get a question or create a session';

      io.to(ticketA.socketId).emit('MATCH_ERROR', { message: errMsg });
      io.to(ticketB.socketId).emit('MATCH_ERROR', { message: errMsg });
      return false;
    }

    console.log(`🎉 MATCH SUCCESS: ${userA} & ${userB} (Topic: ${matchedTopic}, Difficulty: ${matchedDifficulty})`);

    try {
      // Create a new session from the Collaboration Service
      const session = await CollabClient.createSession(userA, userB, question.id.toString());

      // Broadcast the success event to both users.
      const payload = {
        roomId: session.id,
        question: question,
        userId: userA,
        partnerId: userB, // For User A
      };

      // Emit Match Found to User A
      io.to(ticketA.socketId).emit('MATCH_FOUND', payload);

      payload.userId = userB;
      payload.partnerId = userA; // Swap partner ID for User B

      // Emit Match Found to User B
      io.to(ticketB.socketId).emit('MATCH_FOUND', payload);

      return true;

    } catch (error) {
      console.log(`[MATCH_EXECUTION_ERROR] Failed to create session for ${userA} & ${userB}:`, error);

      const errMsg = error instanceof Error ? error.message : 'Unable to get a question or create a session';

      // Notify users of the error
      io.to(ticketA.socketId).emit('MATCH_ERROR', { message: errMsg });
      io.to(ticketB.socketId).emit('MATCH_ERROR', { message: errMsg });
      return false;
    }
  }
}

export const matchingService = new MatchingService();

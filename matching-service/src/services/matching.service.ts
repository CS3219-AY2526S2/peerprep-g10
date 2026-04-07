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
      // Pick random topic and difficulty from intersection
      const randomTopic = partner.sharedTopics[Math.floor(Math.random() * partner.sharedTopics.length)];
      const randomDifficulty = partner.sharedDifficulties[Math.floor(Math.random() * partner.sharedDifficulties.length)];

      const isMatched = await this.executeMatch(io, userId, partner.ticket.userId, randomTopic as string, randomDifficulty as string);
      if (isMatched) {
        return true;
      }
    }

    return false;
  }

  /**
   * Atomically removes both users from Redis and create a session.
   */
  private async executeMatch(io: Server, userA: string, userB: string, matchedTopic: string, matchedDifficulty: string): Promise<boolean> {
    const ticketA = await queueService.getTicket(userA);
    const ticketB = await queueService.getTicket(userB);

    if (!ticketA || !ticketB) return false;

    // Verify both users still have this topic and difficulty in their current tickets
    if (
      !ticketA.topic.includes(matchedTopic) || !ticketA.difficulty.includes(matchedDifficulty) ||
      !ticketB.topic.includes(matchedTopic) || !ticketB.difficulty.includes(matchedDifficulty)
    ) {
      return false;
    }

    const isRemovedSuccess = await queueService.removeBothUserFromMatchPool(ticketA, ticketB);

    if (!isRemovedSuccess) {
      return false;
    }

    console.log(`🎉 MATCH SUCCESS: ${userA} & ${userB} (Topic: ${matchedTopic}, Difficulty: ${matchedDifficulty})`);

    try {
      // Fetch a random question from the Question Service
      const question = await QuestionClient.getRandomQuestion(matchedTopic, matchedDifficulty);

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
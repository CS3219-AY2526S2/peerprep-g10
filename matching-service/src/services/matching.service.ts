import { Server } from 'socket.io';
import { queueService, MatchTicket } from './queue.service';
import { redisClient } from '../config/redis';

import { QuestionClient } from '../clients/question.client';
import { CollabClient } from '../clients/collab.client';

class MatchingService {
  /**
   * When a user joins the queue, it attempts an immediate exact match.
   */
  public async findMatch(io: Server, userId: string, topic: string, difficulty: string): Promise<void> {
    console.log("Finding Match...");
    const isMatched = await this.tryExactMatch(io, userId, topic, difficulty);
  }

  /**
   * Attempts to find a user with the exact same topic and difficulty.
   */
  private async tryExactMatch(io: Server, userId: string, topic: string, difficulty: string): Promise<boolean> {
    const candidates = await queueService.getCandidatesInQueue(topic, difficulty);
    console.log(`Get Candidates ${candidates.join(", ")}`);
    let partnerId = null;
    let partnerQueueTime = Infinity;

    for (let i = 0; i < candidates.length; i++) {
      let candidateId: string | undefined = candidates[i];
      if (!candidateId || userId === candidateId) {
        // Candidate is invalid or is current user
        continue;
      }

      const candidateTicket = await queueService.getTicket(candidateId);
      console.log(`Candidate Ticket Retrieved: ${candidateTicket?.userId}, ${candidateTicket?.joinedAt}`);
      console.log(`Difficulty: ${candidateTicket?.difficulty}, ${difficulty.toLowerCase()}`);
      console.log(`Topic: ${candidateTicket?.topic}, ${topic.toLowerCase()}`);

      const isMatchingTicketValid = candidateTicket 
          && candidateTicket.difficulty === difficulty 
          && candidateTicket.topic === topic;

      // Candidate does not have a valid matching ticket (timeout)
      if (!isMatchingTicketValid) {
          console.log("Ticket is not valid");
          continue;
      }

      // Found a candidate that joined queue earlier
      if (candidateTicket.joinedAt < partnerQueueTime) {
          console.log(`Partner Found`);
          partnerId = candidateId;
          partnerQueueTime = candidateTicket.joinedAt;
      }
    }

    console.log(`Partner is ${partnerId}`);
    if (partnerId) {
      return await this.executeMatch(io, userId, partnerId, topic, difficulty);
    }
    return false;
  }

  /**
   * Atomically removes both users from Redis and create a session.
   */
  private async executeMatch(io: Server, userA: string, userB: string, topic: string, difficulty: string): Promise<boolean> {
    console.log("Executing Match...");
    const ticketA = await queueService.getTicket(userA);
    const ticketB = await queueService.getTicket(userB);

    if (!ticketA || !ticketB) return false;

    // Remove both users and their tickets simultaneously.
    const results = await redisClient.multi()
        .sRem(queueService.getQueueKey(ticketA.topic, ticketA.difficulty), userA)
        .sRem(queueService.getQueueKey(ticketB.topic, ticketB.difficulty), userB)
        .del(queueService.getTicketKey(userA))
        .del(queueService.getTicketKey(userB))
        .execTyped();
    
    console.log("Removing users from queue...");
    
    // If sRem returns 0, it means another server already matched them in the last millisecond.
    // We abort to prevent creating duplicate rooms.
    if (results[0] === 0 || results[1] === 0) {
      console.log(`[RACE CONDITION AVERTED] Users ${userA} or ${userB} were already matched.`);
      return false; 
    }

    console.log(`🎉 MATCH SUCCESS: ${userA} & ${userB}`);

    try {
      // Fetch a random question from the Question Service
      const question = await QuestionClient.getRandomQuestion(topic, difficulty);

      // Create a new session from the Collaboration Service
      const session = await CollabClient.createSession(userA, userB, question.id);

      // Broadcast the success event to both users.
      const payload = {
        roomId: session.roomId,
        question: question,
        partnerId: userB, // For User A
      };

      // TO-DO: Emit Match Found to User A
      
      payload.partnerId = userA; // Swap partner ID for User B
      // TO-DO: Emit Match Found to User B

      return true;

    } catch (error) {
      console.error(`[MATCH_EXECUTION_ERROR] Failed to provision session for ${userA} & ${userB}:`, error);
      // TO-DO: Notify users of the error
      
      return false;
    }
  }
}

export const matchingService = new MatchingService();
import { Server } from 'socket.io';
import { queueService } from './queue.service';

import { QuestionClient } from '../clients/question.client';
import { CollabClient } from '../clients/collab.client';

class MatchingService {
  /**
   * When a user joins the queue, it attempts an immediate exact match.
   */
  public async findMatch(io: Server, userId: string, topic: string, difficulty: string): Promise<void> {
    const isMatched = await this.tryExactMatch(io, userId, topic, difficulty);
  }

  /**
   * Attempts to find a user with the exact same topic and difficulty.
   */
  private async tryExactMatch(io: Server, userId: string, topic: string, difficulty: string): Promise<boolean> {
    const candidates = await queueService.getCandidatesInQueue(topic, difficulty);
    let partnerId = null;
    let partnerQueueTime = Infinity;

    for (let i = 0; i < candidates.length; i++) {
      let candidateId: string | undefined = candidates[i];
      if (!candidateId || userId === candidateId) {
        // Candidate is invalid or is current user
        continue;
      }

      const candidateTicket = await queueService.getTicket(candidateId);

      const isMatchingTicketValid = candidateTicket 
          && candidateTicket.difficulty === difficulty 
          && candidateTicket.topic === topic;

      // Candidate does not have a valid matching ticket (timeout)
      if (!isMatchingTicketValid) {
          console.log(`Ticket is not valid for ${candidateId}. Removing stale candidate from queue.`);
          // Remove stale user from the Redis Set to prevent queue build up
          queueService.removeUserFromQueue(candidateId, topic, difficulty);
          continue;
      }

      // Found a candidate that joined queue earlier
      if (candidateTicket.joinedAt < partnerQueueTime) {
          partnerId = candidateId;
          partnerQueueTime = candidateTicket.joinedAt;
      }
    }

    if (partnerId) {
      return await this.executeMatch(io, userId, partnerId, topic, difficulty);
    }
    return false;
  }

  /**
   * Atomically removes both users from Redis and create a session.
   */
  private async executeMatch(io: Server, userA: string, userB: string, topic: string, difficulty: string): Promise<boolean> {
    const ticketA = await queueService.getTicket(userA);
    const ticketB = await queueService.getTicket(userB);

    if (!ticketA || !ticketB) return false;

    const isRemovedSuccess = await queueService.removeBothUserFromMatchPool(ticketA, ticketB);

    if (!isRemovedSuccess) {
      return false;
    }

    console.log(`🎉 MATCH SUCCESS: ${userA} & ${userB}`);

    try {
      // Fetch a random question from the Question Service
      const question = await QuestionClient.getRandomQuestion(topic, difficulty);

      // Create a new session from the Collaboration Service
      const session = await CollabClient.createSession(userA, userB, question.id.toString());

      // Broadcast the success event to both users.
      const payload = {
        roomId: session.id,
        question: question,
        partnerId: userB, // For User A
      };

      // Emit Match Found to User A
      io.to(ticketA.socketId).emit('MATCH_FOUND', payload);
      
      payload.partnerId = userA; // Swap partner ID for User B
      // Emit Match Found to User B
      io.to(ticketB.socketId).emit('MATCH_FOUND', payload);

      return true;

    } catch (error) {
      console.error(`[MATCH_EXECUTION_ERROR] Failed to create session for ${userA} & ${userB}:`, error);

      const errMsg = error instanceof Error ? error.message : 'Unable to get a question or create a session';
      
      // Notify users of the error
      io.to(ticketA.socketId).emit('MATCH_ERROR', { message: errMsg });
      io.to(ticketB.socketId).emit('MATCH_ERROR', { message: errMsg });
      return false;
    }
  }
}

export const matchingService = new MatchingService();
import { redisClient } from '../config/redis'; 

const MATCH_TIMEOUT_SECONDS = 120;

export interface MatchTicket {
  userId: string;
  socketId: string;
  topic: string;
  difficulty: string;
  joinedAt: number;
}

class QueueService {
  /**
   * Generates the deterministic key for a specific topic/difficulty bucket.
   */
  public getQueueKey(topic: string, difficulty: string): string {
    // Normalize strings to omit case-sensitivity bugs
    return `queue:${topic.toLowerCase()}:${difficulty.toLowerCase()}`;
  }

  /**
   * Generates the deterministic key for a user match ticket.
   */
  public getTicketKey(userId: string): string {
    return `ticket:${userId}`;
  }

  /**
   * Place user into the matching queue and creates a timeout ticket.
   */
  public async addUserToQueue(userId: string, socketId: string, topic: string, difficulty: string): Promise<void> {
    const queueKey = this.getQueueKey(topic, difficulty);
    const ticketKey = this.getTicketKey(userId);

    const ticket: MatchTicket = {
      userId,
      socketId,
      topic,
      difficulty,
      joinedAt: Date.now(),
    };

    // Use multi to execute operations at same time
    const multi = redisClient.multi();

    // Add user ID to the specific topic & difficulty set
    multi.sAdd(queueKey, userId);
    
    // Create user matching ticket in Redis
    multi.setEx(ticketKey, MATCH_TIMEOUT_SECONDS, JSON.stringify(ticket));

    await multi.exec();
    console.log(`[QUEUE] Added user ${userId} to ${queueKey}`);
  }

  /**
   * Removes a user from the matching queue (for cancellations or disconnects).
   */
  public async removeUserFromQueue(userId: string): Promise<void> {
    const ticketKey = this.getTicketKey(userId);
    
    // Get user's ticket to find their queue
    const ticketData = await redisClient.get(ticketKey);
    
    if (!ticketData) {
      // User is not in queue (timeout or removed)
      return; 
    }

    const ticket: MatchTicket = JSON.parse(ticketData);
    const queueKey = this.getQueueKey(ticket.topic, ticket.difficulty);

    // Remove user from the Set and delete their ticket (atomic operation)
    const multi = redisClient.multi();
    multi.sRem(queueKey, userId);
    multi.del(ticketKey);

    await multi.exec();
    console.log(`[QUEUE] Removed user ${userId} from ${queueKey} (Cancellation/Disconnect)`);
  }

  /**
   * Retrieves user's current match ticket to check if they are still active.
   */
  public async getTicket(userId: string): Promise<MatchTicket | null> {
    const ticketData = await redisClient.get(this.getTicketKey(userId));
    if (!ticketData) return null;
    return JSON.parse(ticketData);
  }

  /**
   * Fetches all potential match candidates from a specific queue.
   */
  public async getCandidatesInQueue(topic: string, difficulty: string): Promise<string[]> {
    const queueKey = this.getQueueKey(topic, difficulty);
    // SMembers returns an array of userIds currently in this Set
    return await redisClient.sMembers(queueKey);
  }
}

export const queueService = new QueueService();
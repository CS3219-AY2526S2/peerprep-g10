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
  public async addUserToMatchPool(userId: string, socketId: string, topic: string, difficulty: string): Promise<void> {
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
   * Removes user ticket and user from all matching queue (for cancellations or disconnects).
   */
  public async removeUserFromMatchPool(userId: string): Promise<void> {
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
   * Removes both users ticket and users from all matching queue (for match found).
   */
  public async removeBothUserFromMatchPool(ticketA: MatchTicket, ticketB: MatchTicket): Promise<boolean> {
    const userA = ticketA.userId;
    const userB = ticketB.userId;
    
    // Remove both users and their tickets simultaneously.
    const ticketAQueueKey = this.getQueueKey(ticketA.topic, ticketA.difficulty);
    const ticketBQueueKey = this.getQueueKey(ticketB.topic, ticketB.difficulty);
    const results = await redisClient.multi()
        .sRem(ticketAQueueKey, userA)
        .sRem(ticketBQueueKey, userB)
        .del(this.getTicketKey(userA))
        .del(this.getTicketKey(userB))
        .execTyped();
        
    // If sRem returns 0, it means another server already matched them in the last millisecond.
    // We abort to prevent creating duplicate rooms.
    if (results[0] === 0 || results[1] === 0) {
      console.log(`[RACE CONDITION AVERTED] Users ${userA} or ${userB} were already matched.`);
      return false; 
    }

    console.log(`[QUEUE] Removed user ${userA} from ${ticketAQueueKey} (Match Found)`);
    console.log(`[QUEUE] Removed user ${userB} from ${ticketBQueueKey} (Match Found)`);

    return true;
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

  /**
   * Removes user from a specific queue.
   */
  public async removeUserFromQueue(userId: string, topic: string, difficulty: string): Promise<void> {
    await redisClient.sRem(queueService.getQueueKey(topic, difficulty), userId);
  }
}

export const queueService = new QueueService();
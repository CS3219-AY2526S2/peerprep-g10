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
    
    const luaScript = `
      local ticketData = redis.call("GET", KEYS[1])
      if not ticketData then return 0 end
      
      local decoded = cjson.decode(ticketData)
      local queueKey = "queue:" .. string.lower(decoded.topic) .. ":" .. string.lower(decoded.difficulty)
      
      redis.call("SREM", queueKey, ARGV[1])
      redis.call("DEL", KEYS[1])
      return 1
    `;

    const result = await redisClient.eval(luaScript, {
      keys: [ticketKey],
      arguments: [userId]
    });

    if (result === 1) {
      console.log(`[QUEUE] Removed user ${userId} from queue (Cancellation/Disconnect)`);
    }
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
    const ticketAKey = this.getTicketKey(userA);
    const ticketBKey = this.getTicketKey(userB);

    const luaScript = `
      local aInQueue = redis.call("SISMEMBER", KEYS[1], ARGV[1])
      local bInQueue = redis.call("SISMEMBER", KEYS[2], ARGV[2])
      
      if aInQueue == 1 and bInQueue == 1 then
        redis.call("SREM", KEYS[1], ARGV[1])
        redis.call("SREM", KEYS[2], ARGV[2])
        redis.call("DEL", KEYS[3])
        redis.call("DEL", KEYS[4])
        return 1
      else
        return 0
      end
    `;

    const result = await redisClient.eval(
      luaScript,
      {
        keys: [ticketAQueueKey, ticketBQueueKey, ticketAKey, ticketBKey],
        arguments: [userA, userB]
      }
    );
        
    // If eval returns 0, it means another server already matched them in the last millisecond.
    // We abort to prevent creating duplicate rooms.
    if (result === 0) {
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
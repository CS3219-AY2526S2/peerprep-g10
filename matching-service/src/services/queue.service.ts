/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: GPT-5.3-Codex), date: 2026-03-06
 * Scope: I used Copilot to help with implementation work in this file, mainly drafting/refactoring code and troubleshooting issues.
 * Author review: I reviewed each suggestion, kept only what fit this project, rewrote parts where needed, and tested the final behavior myself.
 */
import { redisClient } from '../config/redis'; 

const MATCH_TIMEOUT_SECONDS = 125;

export interface MatchTicket {
  userId: string;
  socketId: string;
  topic: string[];
  difficulty: string[];
  joinedAt: number;
  filterUnattempted: boolean;
}

class QueueService {
  /**
   * Generates the deterministic key for a specific topic/difficulty bucket.    
   */
  public getQueueKey(topic: string, difficulty: string): string {
    // Normalize strings to omit case-sensitivity bugs
    return `queue:${topic.toLowerCase()}:${difficulty.toLowerCase()}`;
  }

  public getQueueKeys(topics: string[], difficulties: string[]): string[] {
    const keys: string[] = [];
    for (const t of topics) {
      for (const d of difficulties) {
        keys.push(this.getQueueKey(t, d));
      }
    }
    return keys;
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
  public async addUserToMatchPool(userId: string, socketId: string, topics: string[], difficulties: string[], filterUnattempted: boolean = false, joinedAt: number = Date.now()): Promise<void> {
    const queueKeys = this.getQueueKeys(topics, difficulties);
    const ticketKey = this.getTicketKey(userId);

    const ticket: MatchTicket = {
      userId,
      socketId,
      topic: topics,
      difficulty: difficulties,
      joinedAt: joinedAt,
      filterUnattempted: filterUnattempted
    };

    // Calculate the remaining time left on the ticket
    const elapsedSeconds = Math.floor((Date.now() - joinedAt) / 1000);
    const remainingTimeSeconds = Math.max(0, MATCH_TIMEOUT_SECONDS - elapsedSeconds);

    // If the TTL is already expired, skip re-insertion
    if (remainingTimeSeconds === 0) {
      console.log(`[QUEUE] Ticket for user ${userId} expired. Did not re-insert.`);
      return;
    }

    // Use multi to execute operations at same time
    const multi = redisClient.multi();

    // Add user ID to the specific topic & difficulty set
    for (const key of queueKeys) {
      multi.sAdd(key, userId);
    }

    // Create user matching ticket in Redis
    multi.setEx(ticketKey, remainingTimeSeconds, JSON.stringify(ticket));      

    await multi.exec();
    console.log(`[QUEUE] Added user ${userId} to ${queueKeys.length} queues with ${remainingTimeSeconds}s TTL`);
  }

  /**
   * Removes user ticket and user from all matching queue (for cancellations or disconnects).
   */
  public async removeUserFromMatchPool(userId: string): Promise<void> {
    const ticketKey = this.getTicketKey(userId);

    // Lua script reads the ticket JSON and removes user from all arrays
    const luaScript = `
      local ticketData = redis.call("GET", KEYS[1])
      if not ticketData then return 0 end
      
      local decoded = cjson.decode(ticketData)
      for _, topic in ipairs(decoded.topic) do
        for _, difficulty in ipairs(decoded.difficulty) do
            local queueKey = "queue:" .. string.lower(topic) .. ":" .. string.lower(difficulty)
            redis.call("SREM", queueKey, ARGV[1])
        end
      end

      redis.call("DEL", KEYS[1])
      return 1
    `;

    const result = await redisClient.eval(luaScript, {
      keys: [ticketKey],
      arguments: [userId]
    });

    if (result === 1) {
      console.log(`[QUEUE] Removed user ${userId} from all queues (Cancellation/Disconnect)`);
    }
  }

  /**
   * Removes both users ticket and users from all matching queue (for match found).
   */
  public async removeBothUserFromMatchPool(ticketA: MatchTicket, ticketB: MatchTicket): Promise<boolean> {
    const userA = ticketA.userId;
    const userB = ticketB.userId;

    const ticketAKey = this.getTicketKey(userA);
    const ticketBKey = this.getTicketKey(userB);

    const luaScript = `
      local ticketDataA = redis.call("GET", KEYS[1])
      local ticketDataB = redis.call("GET", KEYS[2])
      if not ticketDataA or not ticketDataB then return 0 end

      local aDecoded = cjson.decode(ticketDataA)
      local bDecoded = cjson.decode(ticketDataB)

      for _, t in ipairs(aDecoded.topic) do
        for _, d in ipairs(aDecoded.difficulty) do
          redis.call("SREM", "queue:" .. string.lower(t) .. ":" .. string.lower(d), ARGV[1])
        end
      end

      for _, t in ipairs(bDecoded.topic) do
        for _, d in ipairs(bDecoded.difficulty) do
          redis.call("SREM", "queue:" .. string.lower(t) .. ":" .. string.lower(d), ARGV[2])
        end
      end

      redis.call("DEL", KEYS[1])
      redis.call("DEL", KEYS[2])
      return 1
    `;

    const result = await redisClient.eval(
      luaScript,
      {
        keys: [ticketAKey, ticketBKey],       
        arguments: [userA, userB]
      }
    );

    if (result === 0) {
      console.log(`[RACE CONDITION AVERTED] Users ${userA} or ${userB} were already matched.`);
      return false;
    }

    console.log(`[QUEUE] Removed matched users ${userA} & ${userB} from all queues`);
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
    const queueKey = this.getQueueKey(topic, difficulty);
    await redisClient.sRem(queueKey, userId);
  }
}

export const queueService = new QueueService();

import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import type { MatchTicket } from "../queue.service";

describe("QueueService Integration Logic", () => {
  let redisContainer: StartedRedisContainer;
  let redisClient: any;
  let queueService: any;

  beforeAll(async () => {
    // Start Redis container
    redisContainer = await new RedisContainer("redis:alpine").start();

    // Override env var before modules are required
    process.env.REDIS_URL = redisContainer.getConnectionUrl();

    // Dynamically require the modules so they use the new REDIS_URL        
    const redisModule = require('../../config/redis');
    redisClient = redisModule.redisClient;
    await redisModule.connectRedis();

    const queueModule = require('../queue.service');
    queueService = queueModule.queueService;
  }, 30000); // 30s timeout for container startup

  afterAll(async () => {
    // Close redis clients and stop container
    const redisModule = require('../../config/redis');
    if (redisModule.redisClient && redisModule.redisClient.isOpen) {
      await redisModule.redisClient.quit();
    }
    if (redisModule.pubClient && redisModule.pubClient.isOpen) {
      await redisModule.pubClient.quit();
    }
    if (redisModule.subClient && redisModule.subClient.isOpen) {
      await redisModule.subClient.quit();
    }
    if (redisContainer) {
      await redisContainer.stop();
    }
  });

  beforeEach(async () => {
    // Flush all data before each test
    await redisClient.flushAll();
  });

  describe("addUserToMatchPool & getTicket", () => {
    it("should add a user ticket and add them to the queue set", async () => {  
      await queueService.addUserToMatchPool("user1", "socket1", ["Arrays"], ["Easy"]);

      // Check ticket
      const ticket = await queueService.getTicket("user1");
      expect(ticket).not.toBeNull();
      expect(ticket.userId).toBe("user1");
      expect(ticket.socketId).toBe("socket1");
      expect(ticket.topic).toEqual(["Arrays"]);
      expect(ticket.difficulty).toEqual(["Easy"]);

      // Check queue members
      const candidates = await queueService.getCandidatesInQueue("Arrays", "Easy");
      expect(candidates).toContain("user1");
    });
  });

  describe("removeUserFromMatchPool", () => {
    it("should remove user from queue and delete their ticket", async () => {   
      await queueService.addUserToMatchPool("user1", "socket1", ["Arrays"], ["Easy"]);

      let ticket = await queueService.getTicket("user1");
      expect(ticket).not.toBeNull();

      // Remove user
      await queueService.removeUserFromMatchPool("user1");

      // Verify removal
      ticket = await queueService.getTicket("user1");
      expect(ticket).toBeNull();
      const candidates = await queueService.getCandidatesInQueue("Arrays", "Easy");
      expect(candidates).not.toContain("user1");
    });

    it("should do nothing if ticket doesn't exist", async () => {
      // Should not throw
      await queueService.removeUserFromMatchPool("nonexistent");
    });
  });

  describe("removeBothUserFromMatchPool", () => {
    it("should successfully remove both users if they are in the queue", async () => {
      await queueService.addUserToMatchPool("userA", "socketA", ["Arrays"], ["Easy"]);
      await queueService.addUserToMatchPool("userB", "socketB", ["Arrays", "Hash Table"], ["Easy", "Medium"]);

      const ticketA: MatchTicket = await queueService.getTicket("userA");       
      const ticketB: MatchTicket = await queueService.getTicket("userB");       

      const result = await queueService.removeBothUserFromMatchPool(ticketA, ticketB);
      expect(result).toBe(true);

      // Verify they are gone
      const aAfter = await queueService.getTicket("userA");
      const bAfter = await queueService.getTicket("userB");
      expect(aAfter).toBeNull();
      expect(bAfter).toBeNull();

      const candidatesA = await queueService.getCandidatesInQueue("Arrays", "Easy");
      expect(candidatesA).not.toContain("userA");
      expect(candidatesA).not.toContain("userB");

      const candidatesB = await queueService.getCandidatesInQueue("Hash Table", "Medium");
      expect(candidatesB).not.toContain("userB");
    });

    it("should return false and abort if userA is no longer in the queue (simulated race condition)", async () => {
      await queueService.addUserToMatchPool("userA", "socketA", ["Arrays"], ["Easy"]);
      await queueService.addUserToMatchPool("userB", "socketB", ["Arrays"], ["Easy"]);

      const ticketA: MatchTicket = await queueService.getTicket("userA");       
      const ticketB: MatchTicket = await queueService.getTicket("userB");       

      // Simulate thread 2 removing userA right before thread 1 matches them    
      await queueService.removeUserFromMatchPool("userA");

      // Lua script should abort
      const result = await queueService.removeBothUserFromMatchPool(ticketA, ticketB);
      expect(result).toBe(false);

      // userB should still be in the ticket system because transaction aborted 
      const bAfter = await queueService.getTicket("userB");
      expect(bAfter).not.toBeNull();

      const candidates = await queueService.getCandidatesInQueue("Arrays", "Easy");
      expect(candidates).toContain("userB");
    });
  });

  describe("removeUserFromQueue", () => {
    it("should remove user from the specified queue only", async () => {        
       await queueService.addUserToMatchPool("user1", "socket1", ["Arrays", "Strings"], ["Easy"]);
       await queueService.removeUserFromQueue("user1", "Arrays", "Easy");       
       
       const candidatesRemoved = await queueService.getCandidatesInQueue("Arrays", "Easy");
       expect(candidatesRemoved).not.toContain("user1");

       const candidatesRemaining = await queueService.getCandidatesInQueue("Strings", "Easy");
       expect(candidatesRemaining).toContain("user1");

       // ticket should not be deleted by removeUserFromQueue
       const ticket = await queueService.getTicket("user1");
       expect(ticket).not.toBeNull();
    });
  });

});

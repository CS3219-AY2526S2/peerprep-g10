import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import nock from "nock";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";

describe("Matching Service Integration Tests", () => {
  let io: SocketIOServer, serverSocket: any, clientSocket1: ClientSocket, clientSocket2: ClientSocket;
  let httpServer: http.Server;
  let port: number;
  let redisContainer: StartedRedisContainer;
  let redisClient: any;
  let app: any;
  let matchingService: any;
  let queueService: any;
  const JWT_SECRET = "test-secret";

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;

    // Start Redis container
    redisContainer = await new RedisContainer("redis:alpine").start();
    process.env.REDIS_URL = redisContainer.getConnectionUrl();

    const redisModule = require('../config/redis');
    redisClient = redisModule.redisClient;
    await redisModule.connectRedis();

    app = require("../app").default;
    matchingService = require("../services/matching.service").matchingService;
    queueService = require("../services/queue.service").queueService;

    // Start HTTP Server
    httpServer = http.createServer(app);
    io = new SocketIOServer(httpServer);

    // Setup io logic identically to server.ts
    io.use((socket, next) => {
      try {
        const query = socket.handshake.query;
        const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

        if (!token) return next(new Error("Authentication error: Missing token"));

        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { userId: number };
        socket.data.userId = String(decoded.userId);
        socket.data.topic = [query.topic as string];
        socket.data.difficulty = [query.difficulty as string];

        next();
      } catch (error) {
        return next(new Error("Authentication error: Invalid or expired token"));
      }
    });

    io.on("connection", async (socket) => {
      await queueService.addUserToMatchPool(socket.data.userId, socket.id, socket.data.topic as string[], socket.data.difficulty as string[]);

      await matchingService.findMatch(io, socket.data.userId, socket.data.topic as string[], socket.data.difficulty as string[]);

      const failedExpandedCandidates = new Set<string>();
      let relaxationTimer: NodeJS.Timeout | null = null;
      let relaxationInterval: NodeJS.Timeout | null = null;

      const cleanupTimers = () => {
        if (relaxationTimer) clearTimeout(relaxationTimer);
        if (relaxationInterval) clearInterval(relaxationInterval);
      };

      // FAST TIMERS FOR TESTING
      if (socket.data.difficulty.length < 3) {
        relaxationTimer = setTimeout(async () => {
          const ticket = await queueService.getTicket(socket.data.userId);
          if (!ticket) return;
          const tryExpand = async () => {
            const currentTicket = await queueService.getTicket(socket.data.userId);
            if (!currentTicket) {
              cleanupTimers();
              return;
            }
            if (socket.data.isPrompting) return;

            const found = await matchingService.tryExpandedMatch(io, socket.data.userId, socket.data.topic, socket.data.difficulty, failedExpandedCandidates);
            if (found) {
              socket.data.isPrompting = true;
            }
          };

          await tryExpand();
          relaxationInterval = setInterval(tryExpand, 200); // 200ms instead of 5s
        }, 300); // 300ms instead of 60s
      }

      socket.on('ACCEPT_RELAXED_MATCH', async (data: { candidateId: string, sharedTopics: string[], sharedDifficulties: string[] }) => {
        const matchResult = await matchingService.executeMatch(io, socket.data.userId, data.candidateId, data.sharedTopics, data.sharedDifficulties);
        if (!matchResult.success) {
          failedExpandedCandidates.add(data.candidateId);
          socket.data.isPrompting = false;
          socket.emit('RELAXED_MATCH_UNAVAILABLE', { reason: matchResult.reason });
        } else {
          cleanupTimers();
        }
      });

      socket.on('DECLINE_RELAXED_MATCH', (data: { candidateId: string }) => {
        failedExpandedCandidates.add(data.candidateId);
        socket.data.isPrompting = false;
      });

      socket.on("disconnect", () => {
        queueService.removeUserFromMatchPool(socket.data.userId);
        cleanupTimers();
      });
    });

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        port = (httpServer.address() as AddressInfo).port;
        resolve();
      });
    });
  }, 30000);

  afterAll(async () => {
    io.close();
    httpServer.close();
    const redisModule = require('../config/redis');
    if (redisModule.redisClient && redisModule.redisClient.isOpen) await redisModule.redisClient.quit();
    if (redisModule.pubClient && redisModule.pubClient.isOpen) await redisModule.pubClient.quit();
    if (redisModule.subClient && redisModule.subClient.isOpen) await redisModule.subClient.quit();
    if (redisContainer) await redisContainer.stop();
    nock.cleanAll();
  });

  beforeEach(async () => {
    await redisClient.flushAll();
  });

  afterEach(() => {
    if (clientSocket1 && clientSocket1.connected) clientSocket1.disconnect();
    if (clientSocket2 && clientSocket2.connected) clientSocket2.disconnect();
    nock.cleanAll();
  });

  const createTestToken = (userId: number) => jwt.sign({ userId }, JWT_SECRET);

  it("should establish a connection, mock APIs, and successfully match two users", (done) => {
    const topic = "Arrays";
    const difficulty = "Easy";

    nock(process.env.QUESTION_SERVICE_URL || 'http://localhost:3003')
      .get('/questions/random')
      .query({ topic, difficulty })
      .reply(200, { id: "q1", title: "Two Sum" });

    nock(process.env.COLLAB_SERVICE_URL || 'http://localhost:3001')
      .post('/rooms')
      .reply(201, { id: "room-abc" });

    clientSocket1 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(1) }, query: { topic, difficulty } });

    clientSocket1.on("connect", () => {
       clientSocket2 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(2) }, query: { topic, difficulty } });
       clientSocket2.on("MATCH_FOUND", (payload) => {
         try {
           expect(payload.roomId).toBe("room-abc");
           expect(payload.question.title).toBe("Two Sum");
           expect(payload.userId).toBe("2");
           expect(payload.partnerId).toBe("1");
           done();
         } catch (error) {
           done(error);
         }
       });
    });
  });

  it("should trigger PROPOSE_RELAXED_MATCH after timeout", (done) => {
    const topic = "Arrays";

    clientSocket1 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(1) }, query: { topic, difficulty: "easy" } });

    clientSocket1.on("connect", () => {
       clientSocket2 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(2) }, query: { topic, difficulty: "medium" } });
       
       // Client 1 should receive PROPOSE_RELAXED_MATCH after ~300ms because they selected only "Easy"
       // and Client 2 is in "Medium" which overlaps topics
       clientSocket1.on("PROPOSE_RELAXED_MATCH", (payload) => {
          try {
            expect(payload.candidateId).toBe("2");
            expect(payload.sharedTopics).toContain(topic);
            expect(payload.sharedDifficulties).toContain("medium");
            done();
          } catch(err) {
            done(err);
          }
       });
    });
  });

  it("should successfully accept relaxed match", (done) => {
    const topic = "Arrays";

    nock(process.env.QUESTION_SERVICE_URL || 'http://localhost:3003')
      .get('/questions/random')
      .query({ topic, difficulty: "medium" })
      .reply(200, { id: "q2", title: "Medium Q" });

    nock(process.env.COLLAB_SERVICE_URL || 'http://localhost:3001')
      .post('/rooms')
      .reply(201, { id: "room-abc-relax" });

    clientSocket1 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(1) }, query: { topic, difficulty: "easy" } });

    clientSocket1.on("connect", () => {
       clientSocket2 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(2) }, query: { topic, difficulty: "medium" } });
       
       clientSocket1.on("PROPOSE_RELAXED_MATCH", (payload) => {
          // Send accept decision back
          clientSocket1.emit("ACCEPT_RELAXED_MATCH", payload);
       });

       clientSocket1.on("MATCH_FOUND", (payload) => {
          try {
            expect(payload.roomId).toBe("room-abc-relax");
            expect(payload.question.title).toBe("Medium Q");
            done();
          } catch(e) { done(e); }
       });
    });
  });

  it("should emit RELAXED_MATCH_UNAVAILABLE if match fails (race cond)", (done) => {
    const topic = "Arrays";

    clientSocket1 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(1) }, query: { topic, difficulty: "easy" } });

    clientSocket1.on("connect", () => {
       clientSocket2 = Client(`http://localhost:${port}`, { auth: { token: createTestToken(2) }, query: { topic, difficulty: "medium" } });
       
       clientSocket1.on("PROPOSE_RELAXED_MATCH", (payload) => {
          // Simulate the candidate leaving the queue before we accept
          clientSocket2.disconnect();

          setTimeout(() => {
            clientSocket1.emit("ACCEPT_RELAXED_MATCH", payload);
          }, 50); // wait briefly to ensure disconnect is processed
       });

       clientSocket1.on("RELAXED_MATCH_UNAVAILABLE", (payload) => {
          try {
            expect(payload.reason).toBeDefined();
            done();
          } catch(e) { done(e); }
       });
    });
  });
});

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
        socket.data.topic = query.topic;
        socket.data.difficulty = query.difficulty;
  
        next();
      } catch (error) {
        return next(new Error("Authentication error: Invalid or expired token")); 
      }
    });

    io.on("connection", async (socket) => {
      await queueService.addUserToMatchPool(socket.data.userId, socket.id, socket.data.topic as string, socket.data.difficulty as string);
      
      // Delay slightly to ensure both clients insert into pool or can resolve accurately if joining simultaneously
      await matchingService.findMatch(io, socket.data.userId, socket.data.topic as string, socket.data.difficulty as string);

      socket.on("disconnect", () => {
        queueService.removeUserFromMatchPool(socket.data.userId);
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
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
    if (redisContainer) {
      await redisContainer.stop();
    }
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
    
    // Mock the external service calls via nock
    nock(process.env.QUESTION_SERVICE_URL || 'http://localhost:3003')
      .get('/questions/random')
      .query({ topic, difficulty })
      .reply(200, { id: "q1", title: "Two Sum" });

    nock(process.env.COLLAB_SERVICE_URL || 'http://localhost:3001')
      .post('/rooms')
      .reply(201, { id: "room-abc" });

    // Client 1 Connection
    clientSocket1 = Client(`http://localhost:${port}`, {
      auth: { token: createTestToken(1) },
      query: { topic, difficulty }
    });

    clientSocket1.on("connect", () => {
       // After client 1 connects, connect client 2
       clientSocket2 = Client(`http://localhost:${port}`, {
         auth: { token: createTestToken(2) },
         query: { topic, difficulty }
       });

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
});

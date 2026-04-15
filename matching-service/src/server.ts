import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { connectRedis, pubClient, subClient } from './config/redis';
import { connectAuthRedis } from './config/authRedis';
import { isUserBanned, isUserDeleted } from './middleware/authMiddleware';
import { startBanSubscriber } from './banSubscriber';
import app from './app';
import { matchingService } from './services/matching.service';
import { queueService } from './services/queue.service';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3002
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function startServer() {
  // Connect to Redis Data Client (matching-redis for queue operations)
  await connectRedis();

  // Connect to auth-redis for ban blacklist checks
  await connectAuthRedis();

  // Create HTTP server wrapping the Express app
  const httpServer = http.createServer(app);

  // Initialize Socket.io with CORS allowing the PeerPrep frontend
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    adapter: createAdapter(pubClient, subClient)
  });

  // SocketIO Middleware
  io.use(async (socket, next) => {
    try {
      const query = socket.handshake.query;
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (!token) {
        return next(new Error("Authentication error: Missing token"));
      }

      // Verify the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

      // Check the ban blacklist before allowing the socket connection
      const deleted = await isUserDeleted(String(decoded.userId));
      if (deleted) {
        return next(new Error("USER_DELETED"));
      }

      const banned = await isUserBanned(String(decoded.userId));
      if (banned) {
        return next(new Error("USER_BANNED"));
      }

      let topics: string[] = [];
      let difficulties: string[] = [];

      if (typeof query.topic === 'string') {
        topics = query.topic.split(',').map((t: string) => t.trim());
      } else if (Array.isArray(query.topic)) {
        topics = query.topic as string[];
      }

      if (typeof query.difficulty === 'string') {
        difficulties = query.difficulty.split(',').map((d: string) => d.trim());
      } else if (Array.isArray(query.difficulty)) {
        difficulties = query.difficulty as string[];
      }

      if (!topics.length || !difficulties.length) {
        return next(new Error("Connection error: Missing topic or difficulty"));
      }

      // Parse filterUnattempted flag
      const filterUnattempted = query.filterUnattempted === 'true';

      // Assign to socket.data
      socket.data.userId = String(decoded.userId);
      socket.data.topic = topics;
      socket.data.difficulty = difficulties;
      socket.data.filterUnattempted = filterUnattempted;

      next();

    } catch (error) {
      // JWT verification error
      console.error("Socket authentication failed:", error);
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  // Handle SocketIO Connection
  io.on('connection', async (socket) => {
    console.log(`🔌 New client connected: ${socket.id} (User: ${socket.data.userId}, Filter unattempted: ${socket.data.filterUnattempted})`);

    // Add user to queue
    await queueService.addUserToMatchPool(
      socket.data.userId, 
      socket.id, 
      socket.data.topic, 
      socket.data.difficulty,
      socket.data.filterUnattempted
    );
    await matchingService.findMatch(io, socket.data.userId, socket.data.topic, socket.data.difficulty);

    const failedExpandedCandidates = new Set<string>();
    let relaxationTimer: NodeJS.Timeout | null = null;
    let relaxationInterval: NodeJS.Timeout | null = null;

    const cleanupTimers = () => {
      if (relaxationTimer) clearTimeout(relaxationTimer);
      if (relaxationInterval) clearInterval(relaxationInterval);
    };

    // Conditional Relaxation feature: Start 60s timer if user hasn't selected all difficulties
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
        relaxationInterval = setInterval(tryExpand, 5000);
      }, 60 * 1000);
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

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      queueService.removeUserFromMatchPool(socket.data.userId);
      cleanupTimers();
    });
  });

  // Subscribe to ban events — disconnects matching sockets for banned users in real time
  await startBanSubscriber(io);

  // Start app server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Matching Service is running on http://localhost:${PORT}`);
  });
}

// Start Server (Entry Point)
startServer().catch((err) => {
  console.error('Failed to start matching server:', err);
  process.exit(1);
});
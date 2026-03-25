import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectRedis } from './config/redis';
import app from './app';
import { matchingService } from './services/matching.service';
import { queueService } from './services/queue.service';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3002
const frontendOrigins = (
  process.env.FRONTEND_URLS ||
  'http://localhost:3000,http://peerprep-frontend:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

async function startServer() {
  // Create HTTP server wrapping the Express app
  const httpServer = http.createServer(app);

  // Initialize Socket.io with CORS allowing the PeerPrep frontend
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: frontendOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Connect to Redis Data Client
  await connectRedis();

  // SocketIO Middleware
  io.use((socket, next) => {
    try {
      const query = socket.handshake.query;
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (!token) {
        return next(new Error("Authentication error: Missing token"));
      }

      // Verify the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

      // Verify all required query fields are present
      if (!query.topic || !query.difficulty) {
        return next(new Error("Connection error: Missing topic or difficulty"));
      }

      // Assign to socket.data
      socket.data.userId = String(decoded.userId);
      socket.data.topic = query.topic;
      socket.data.difficulty = query.difficulty;

      next();
  
    } catch (error) {
      // JWT verification error
      console.error("Socket authentication failed:", error);
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  // Handle SocketIO Connections
  io.on('connection', async (socket) => {
    console.log(`🔌 New client connected: ${socket.id} (User: ${socket.data.userId})`);

    // Add user to queue
    await queueService.addUserToMatchPool(socket.data.userId, socket.id, socket.data.topic, socket.data.difficulty);
    await matchingService.findMatch(io, socket.data.userId, socket.data.topic, socket.data.difficulty);

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // TO-DO: Handle logic to remove this user from the Redis queue
      // if they disconnect before a match is found.
    });
  });

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
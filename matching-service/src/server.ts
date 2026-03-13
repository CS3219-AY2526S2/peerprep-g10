import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectRedis } from './config/redis';
import app from './app';
import { matchingService } from './services/matching.service';
import { queueService } from './services/queue.service';

const PORT = process.env.PORT || 3002
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function startServer() {
  // Create HTTP server wrapping the Express app
  const httpServer = http.createServer(app);

  // Initialize Socket.io with CORS allowing the PeerPrep frontend
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Connect to Redis Data Client
  await connectRedis();

  // SocketIO Middleware
  io.use((socket, next) => {
    const query = socket.handshake.query;

    // Extract and assign to socket.data
    socket.data.userId = query.userId;
    socket.data.topic = query.topic;
    socket.data.difficulty = query.difficulty;

    next();
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
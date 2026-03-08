import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';

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

  // Handle SocketIO Connections
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id} (User: ${socket.data.userId})`);

    // TO-DO

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
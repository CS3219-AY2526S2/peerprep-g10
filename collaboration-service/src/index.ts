import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app";
import { registerRealtime } from "./realtime";
import { connectAuthRedis } from "./config/authRedis";
import { isUserBanned, isUserDeleted, verifyToken } from "./middleware/authMiddleware";
import { startBanSubscriber } from "./banSubscriber";

dotenv.config();

const port = process.env.PORT || 3001;
const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*", credentials: true },
});

// Socket.IO middleware — verifies JWT and checks ban status on every new connection
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: Missing token"));
  }

  try {
    const decoded = verifyToken(token);

    if (await isUserDeleted(String(decoded.userId))) {
      return next(new Error("USER_DELETED"));
    }

    const banned = await isUserBanned(String(decoded.userId));
    if (banned) {
      return next(new Error("USER_BANNED"));
    }

    // Store userId on socket.data so handlers and the ban subscriber can use it
    socket.data.userId = String(decoded.userId);
    next();
  } catch {
    next(new Error("Authentication error: Invalid or expired token"));
  }
});

registerRealtime(io);

async function startServer() {
  // Connect to auth-redis for ban checks and subscribe to ban events
  await connectAuthRedis();
  await startBanSubscriber(io);

  server.listen(Number(port), "0.0.0.0", () => {
    console.log(`[server]: Collaboration Service is running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Collaboration Service:", err);
  process.exit(1);
});

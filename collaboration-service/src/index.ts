import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app";
import { registerRealtime } from "./realtime";

dotenv.config();

const port = process.env.PORT || 3001;
const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*", credentials: true },
});

registerRealtime(io);

server.listen(Number(port), "0.0.0.0", () => {
  console.log(`[server]: Collaboration Service is running on port ${port}`);
});

import {Server as SocketIOServer, Socket} from "socket.io";
import {pool} from "./db";

type PresenceUser = {
  userId: string;
  displayName: string;
  socketId: string;
};

const roomUsers = new Map<string, Map<string, PresenceUser>>();

function isAuthorizedSocket(socket: Socket, roomId: string, userId?: string) {
  if (!socket.data.authorized) {
    return false;
  }
  if (socket.data.roomId !== roomId) {
    return false;
  }
  if (userId !== undefined && socket.data.userId !== userId) {
    return false;
  }

  return true;
}

function emitPresence(io: SocketIOServer, roomId: string) {
  const usersMap = roomUsers.get(roomId) ?? new Map();
  const users = Array.from(usersMap.values()).map((u) => ({
    userId: u.userId,
    displayName: u.displayName ?? u.userId,
  }));

  io.to(roomId).emit("presence:update", {roomId, users});
}

export function registerRealtime(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    socket.on(
      "room:join",
      async (payload: {roomId: string; userId: string; displayName: string}) => {
        try {
          const { roomId, userId, displayName } = payload;

          if (!roomId || !userId) {
            socket.emit("room:error", {message: "Invalid room join payload"});
            return;
          }

          const result = await pool.query(
            `SELECT id, user1_id, user2_id
            FROM rooms
            WHERE id = $1`,
            [roomId]
          );

          if (result.rows.length === 0) {
            socket.emit("room:error", {message: "Room does not exist"});
            return;
          }

          const room = result.rows[0];
          const allowedUsers = [room.user1_id, room.user2_id];

          if (!allowedUsers.includes(userId)) {
            socket.emit("room:error", {message: "You are not authorized for this room"});
            return;
          }

          if (!roomUsers.has(roomId)) {
            roomUsers.set(roomId, new Map());
          }

          const usersMap = roomUsers.get(roomId)!;
          const alreadyPresent = usersMap.has(userId);

          if (!alreadyPresent && usersMap.size >= 2) {
            socket.emit("room:error", {message: "Room is full"});
            return;
          }

          socket.join(roomId);

          usersMap.set(userId, {
            userId,
            displayName,
            socketId: socket.id,
          });

          socket.data.roomId = roomId;
          socket.data.userId = userId;
          socket.data.authorized = true;

          console.log(`User ${userId} joined room ${roomId}`);
          emitPresence(io, roomId);
        } catch (err) {
          console.error("room:join failed:", err);
          socket.emit("room:error", {message: "Failed to join room"});
        }
      }
    );

    socket.on(
      "chat:send",
      async (payload: {roomId: string; userId: string; message: string}) => {
        try {
          const {roomId, userId, message } = payload;

          if (!roomId || !userId || typeof message !== "string") {
            socket.emit("chat:error", {message: "Invalid chat payload"});
            return;
          }

          if (!isAuthorizedSocket(socket, roomId, userId)) {
            socket.emit("chat:error", { message: "Not authorized for this room" });
            return;
          }

          const trimmed = message.trim();
          if (!trimmed) {
            return;
          }

          const roomCheck = await pool.query(`SELECT id FROM rooms WHERE id = $1`, [roomId]);
          if (roomCheck.rows.length === 0) {
            socket.emit("chat:error", {message: "Room does not exist"});
            return;
          }

          const result = await pool.query(
            `INSERT INTO chat_messages (room_id, user_id, message)
             VALUES ($1, $2, $3)
             RETURNING id, created_at`,
            [roomId, userId, trimmed]
          );

          io.to(roomId).emit("chat:new", {
            id: result.rows[0].id,
            roomId,
            userId,
            message: trimmed,
            createdAt: result.rows[0].created_at,
          });
        } catch (err) {
          console.error("chat:send failed:", err);
          socket.emit("chat:error", {message: "Failed to send message"});
        }
      }
    );

    socket.on("editor:replace", async (payload: {roomId: string; code: string}) => {
      try {
        const { roomId, code } = payload;

        if (!roomId || typeof code !== "string") {
          return;
        }

        if (!isAuthorizedSocket(socket, roomId)) {
          socket.emit("editor:error", { message: "Not authorized for this room" });
          return;
        }

        await pool.query(
          `UPDATE rooms
           SET current_code = $2
           WHERE id = $1`,
          [roomId, code]
        );

        socket.to(roomId).emit("editor:replace", {code});
      } catch (err) {
        console.error("editor:replace failed:", err);
        socket.emit("editor:error", {message: "Failed to update editor state"});
      }
    });

    socket.on("room:leave", (payload: {roomId: string; userId: string}) => {
      const { roomId, userId } = payload;

      if (!roomId || !userId) {
        return;
      }

      socket.leave(roomId);

      const usersMap = roomUsers.get(roomId);
      if (usersMap) {
        usersMap.delete(userId);
        if (usersMap.size === 0) {
          roomUsers.delete(roomId);
        }
      }

      socket.data.authorized = false;
      socket.data.roomId = undefined;
      socket.data.userId = undefined;

      console.log(`User ${userId} left room ${roomId}`);
      emitPresence(io, roomId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const roomId: string | undefined = socket.data.roomId;
      const userId: string | undefined = socket.data.userId;

      if (!roomId || !userId) {
        return;
      }

      const usersMap = roomUsers.get(roomId);
      if (usersMap) {
        const existing = usersMap.get(userId);

        if (existing?.socketId === socket.id) {
          usersMap.delete(userId);

          if (usersMap.size === 0) {
            roomUsers.delete(roomId);
          }

          emitPresence(io, roomId);
        }
      }
    });
  });
}
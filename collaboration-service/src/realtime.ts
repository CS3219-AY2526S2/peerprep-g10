import {Server as SocketIOServer, Socket} from "socket.io";
import {pool} from "./db";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness.js";

type RoomYState = {
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
};

const roomYStates = new Map<string, RoomYState>();
const roomSaveTimers = new Map<string, NodeJS.Timeout>();

function schedulePersistRoom(roomId: string, doc: Y.Doc) {
  const existing = roomSaveTimers.get(roomId);
  if (existing) {
    clearTimeout(existing);
  }

  const timer = setTimeout(async () => {
    try {
      const currentCode = doc.getText("codemirror").toString();

      await pool.query(
        `UPDATE rooms
         SET current_code = $2
         WHERE id = $1`,
        [roomId, currentCode]
      );
    } catch (err) {
      console.error("Failed to persist room Yjs state:", err);
    } finally {
      roomSaveTimers.delete(roomId);
    }
  }, 500);

  roomSaveTimers.set(roomId, timer);
}

async function getOrCreateRoomYState(roomId: string): Promise<RoomYState> {
  
  let state = roomYStates.get(roomId);
  if (state) {
    return state;
  }

  const doc = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(doc);

  const result = await pool.query(
    `SELECT current_code
     FROM rooms
     WHERE id = $1`,
    [roomId]
  );

  const currentCode = result.rows[0]?.current_code ?? "";

  if (currentCode) {
    doc.getText("codemirror").insert(0, currentCode);
  }

  doc.on("update", () => {
    schedulePersistRoom(roomId, doc);
  });

  state = { doc, awareness };
  roomYStates.set(roomId, state);

  return state;
}

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

function removeAwarenessForSocket(roomId: string, socketId: string) {
  const state = roomYStates.get(roomId);
  if (!state) return;

  const awareness = state.awareness;
  const clientIdsToRemove: number[] = [];

  awareness.getStates().forEach((_value, clientId) => {
    const meta = awareness.meta.get(clientId) as { socketId?: string } | undefined;
    if (meta?.socketId === socketId) {
      clientIdsToRemove.push(clientId);
    }
  });

  if (clientIdsToRemove.length > 0) {
    awarenessProtocol.removeAwarenessStates(awareness, clientIdsToRemove, socketId);
  }
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
          socket.emit("room:joined", { roomId, userId });
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

    // socket.on("editor:replace", async (payload: {roomId: string; code: string}) => {
    //   try {
    //     const { roomId, code } = payload;

    //     if (!roomId || typeof code !== "string") {
    //       return;
    //     }

    //     if (!isAuthorizedSocket(socket, roomId)) {
    //       socket.emit("editor:error", { message: "Not authorized for this room" });
    //       return;
    //     }

    //     await pool.query(
    //       `UPDATE rooms
    //        SET current_code = $2
    //        WHERE id = $1`,
    //       [roomId, code]
    //     );

    //     socket.to(roomId).emit("editor:replace", {code});
    //   } catch (err) {
    //     console.error("editor:replace failed:", err);
    //     socket.emit("editor:error", {message: "Failed to update editor state"});
    //   }
    // });

    socket.on("yjs:sync-step1", async (payload: { roomId: string; stateVector: number[] }) => {
      try {
        const { roomId, stateVector } = payload;

        if (!roomId || !Array.isArray(stateVector)) {
          socket.emit("editor:error", { message: "Invalid yjs sync-step1 payload" });
          return;
        }

        if (!isAuthorizedSocket(socket, roomId)) {
          console.log("Rejected yjs:sync-step1 because socket not authorized", {
            socketId: socket.id,
            roomId,
            socketRoomId: socket.data.roomId,
            socketUserId: socket.data.userId,
            authorized: socket.data.authorized,
          });
          socket.emit("editor:error", { message: "Not authorized for this room" });
          return;
        }

        const { doc } = await getOrCreateRoomYState(roomId);

        const update = Y.encodeStateAsUpdate(doc, Uint8Array.from(stateVector));

        socket.emit("yjs:sync-step2", {
          roomId,
          update: Array.from(update),
        });
      } catch (err) {
        console.error("yjs:sync-step1 failed:", err);
        socket.emit("editor:error", { message: "Failed to sync Yjs state" });
      }
    });

    socket.on("yjs:update", async (payload: { roomId: string; update: number[] }) => {
      try {
        const { roomId, update } = payload;

        if (!roomId || !Array.isArray(update)) {
          socket.emit("editor:error", { message: "Invalid yjs update payload" });
          return;
        }

        if (!isAuthorizedSocket(socket, roomId)) {
          socket.emit("editor:error", { message: "Not authorized for this room" });
          return;
        }

        const { doc } = await getOrCreateRoomYState(roomId);
        const updateBytes = Uint8Array.from(update);

        Y.applyUpdate(doc, updateBytes, socket.id);

        socket.to(roomId).emit("yjs:update", {
          roomId,
          update,
        });
      } catch (err) {
        console.error("yjs:update failed:", err);
        socket.emit("editor:error", { message: "Failed to apply Yjs update" });
      }
    });

    socket.on("yjs:awareness", async (payload: { roomId: string; update: number[] }) => {
      try {
        const { roomId, update } = payload;

        if (!roomId || !Array.isArray(update)) {
          socket.emit("editor:error", { message: "Invalid awareness payload" });
          return;
        }

        if (!isAuthorizedSocket(socket, roomId)) {
          socket.emit("editor:error", { message: "Not authorized for this room" });
          return;
        }

        const { awareness } = await getOrCreateRoomYState(roomId);
        const updateBytes = Uint8Array.from(update);

        awarenessProtocol.applyAwarenessUpdate(awareness, updateBytes, socket.id);

        socket.to(roomId).emit("yjs:awareness", {
          roomId,
          update,
        });
      } catch (err) {
        console.error("yjs:awareness failed:", err);
        socket.emit("editor:error", { message: "Failed to apply awareness update" });
      }
    });

    socket.on(
      "voice:offer",
      (payload: { roomId: string; offer: RTCSessionDescriptionInit }) => {
        try {
          const { roomId, offer } = payload;

          if (!roomId || !offer) {
            socket.emit("voice:error", { message: "Invalid voice offer payload" });
            return;
          }

          if (!isAuthorizedSocket(socket, roomId)) {
            socket.emit("voice:error", { message: "Not authorized for this room" });
            return;
          }

          socket.to(roomId).emit("voice:offer", { offer });
        } catch (err) {
          console.error("voice:offer failed:", err);
          socket.emit("voice:error", { message: "Failed to relay voice offer" });
        }
      }
    );

    socket.on(
      "voice:answer",
      (payload: { roomId: string; answer: RTCSessionDescriptionInit }) => {
        try {
          const { roomId, answer } = payload;

          if (!roomId || !answer) {
            socket.emit("voice:error", { message: "Invalid voice answer payload" });
            return;
          }

          if (!isAuthorizedSocket(socket, roomId)) {
            socket.emit("voice:error", { message: "Not authorized for this room" });
            return;
          }

          socket.to(roomId).emit("voice:answer", { answer });
        } catch (err) {
          console.error("voice:answer failed:", err);
          socket.emit("voice:error", { message: "Failed to relay voice answer" });
        }
      }
    );

    socket.on(
      "voice:ice-candidate",
      (payload: { roomId: string; candidate: RTCIceCandidateInit }) => {
        try {
          const { roomId, candidate } = payload;

          if (!roomId || !candidate) {
            socket.emit("voice:error", { message: "Invalid ICE candidate payload" });
            return;
          }

          if (!isAuthorizedSocket(socket, roomId)) {
            socket.emit("voice:error", { message: "Not authorized for this room" });
            return;
          }

          socket.to(roomId).emit("voice:ice-candidate", { candidate });
        } catch (err) {
          console.error("voice:ice-candidate failed:", err);
          socket.emit("voice:error", { message: "Failed to relay ICE candidate" });
        }
      }
    );

    socket.on(
      "voice:hangup",
      (payload: { roomId: string }) => {
        try {
          const { roomId } = payload;

          if (!roomId) {
            socket.emit("voice:error", { message: "Invalid hangup payload" });
            return;
          }

          if (!isAuthorizedSocket(socket, roomId)) {
            socket.emit("voice:error", { message: "Not authorized for this room" });
            return;
          }

          socket.to(roomId).emit("voice:hangup");
        } catch (err) {
          console.error("voice:hangup failed:", err);
          socket.emit("voice:error", { message: "Failed to relay hangup" });
        }
      }
    );

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
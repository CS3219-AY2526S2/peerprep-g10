import { Server as SocketIOServer, Socket } from "socket.io";
import { pool } from "./db";

type PresenceUser = {
	userId: string;
	displayName: string;
	socketId: string;
};

const roomUsers = new Map<string, Map<string, PresenceUser>>();

function emitPresence(io: SocketIOServer, roomId: string) {
	const usersMap = roomUsers.get(roomId) ?? new Map();
	const users = Array.from(usersMap.values()).map(u => ({
		userId: u.userId,
		displayName: u.displayName ?? u.userId,
	}));
	io.to(roomId).emit("presence:update", { roomId, users });
}

export function registerRealtime(io: SocketIOServer) {
	io.on("connection", (socket: Socket) => {
		// join a room
		socket.on("room:join", (payload: { roomId: string; userId: string; displayName: string }) => {
			const { roomId, userId, displayName } = payload;

			socket.join(roomId);

			if (!roomUsers.has(roomId)) {
				roomUsers.set(roomId, new Map());
			}
				
			roomUsers.get(roomId)!.set(userId, { userId, displayName, socketId: socket.id });

			// keep track of socket for cleanup
			socket.data.roomId = roomId;
			socket.data.userId = userId;

			console.log(`User ${userId} joined room ${roomId}`);
			emitPresence(io, roomId);
		});

		//send message
		socket.on("chat:send", async (payload: { roomId: string; userId: string; message: string }) => {
			try {
					const { roomId, userId, message } = payload;

					if (!roomId || !userId || typeof message !== "string") {
						socket.emit("chat:error", { message: "Invalid chat payload" });
						return;
					}

					const trimmed = (message ?? "").trim();
					if (!trimmed) {
						console.log("not trimmed");
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
				socket.emit("chat:error", { message: "Failed to send message" });
			}
		});
		// update editor with full text
		socket.on("editor:replace", (payload: { roomId: string; code: string }) => {
			const { roomId, code } = payload;

			console.log("editor:replace received", {
				roomId,
				codeLength: typeof code === "string" ? code.length : "invalid",
				from: socket.id,
			});

			if (!roomId || typeof code !== "string") {
				return;
			}

			socket.to(roomId).emit("editor:replace", { code });
			console.log("editor:replace relayed to room", roomId);
		});

		// leave room explicitly
		socket.on("room:leave", (payload: { roomId: string; userId: string }) => {
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
			console.log(`User ${userId} left room ${roomId}`);
			emitPresence(io, roomId);
		});

		// leave room on disconnect
		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
			const roomId: string | undefined = socket.data.roomId;
			const userId: string | undefined = socket.data.userId;
			if (!roomId || !userId) {
				return;
			} 
				
			const usersMap = roomUsers.get(roomId);
			if (usersMap) {
				// for the case where user disconnect voluntarily, current socket id is the one to be deleted
				//for case where user disconnect and reconnect, socket id will not be same as the previous one
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
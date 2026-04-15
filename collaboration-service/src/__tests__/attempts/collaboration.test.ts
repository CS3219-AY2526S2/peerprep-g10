// AI Assistance Disclosure:
// Tool: ChatGPT date: 2026‑04‑14
// Scope: Generated the initial test code for test cases and scenarios designed.
// Author review: Edited and debugged as initial code was full of bugs

import http from "http";
import { AddressInfo } from "net";
import { Server as IOServer } from "socket.io";
import { io as ClientIO, Socket as ClientSocket } from "socket.io-client";

import { registerRealtime } from "../../realtime";
import { pool } from "../../db";
import { isUserBanned } from "../../middleware/authMiddleware";

jest.mock("../../db", () => ({
  pool: { query: jest.fn() },
}));

jest.mock("../../middleware/authMiddleware", () => ({
  isUserBanned: jest.fn(),
}));

const queryMock = pool.query as jest.Mock;
const bannedMock = isUserBanned as jest.Mock;
const fetchMock = jest.fn();

(global as any).fetch = fetchMock;

describe("collaboration realtime integration", () => {
  let httpServer: http.Server;
  let io: IOServer;
  let port: number;
  const clients: ClientSocket[] = [];

  const ROOM_ID = "room-123";
  const USER_1 = "u1";
  const USER_2 = "u2";
  const USER_3 = "u3";

  beforeAll((done) => {
    httpServer = http.createServer();

    io = new IOServer(httpServer, {
      cors: { origin: "*" },
    });

    io.use(async (socket, next) => {
      const userId = socket.handshake.auth?.userId;
      if (!userId) return next(new Error("Unauthorized"));

      const banned = await bannedMock(userId);
      if (banned) return next(new Error("User is banned"));

      socket.data.userId = userId;
      socket.data.user = { id: userId };
      socket.data.authenticatedUser = { id: userId };

      next();
    });

    registerRealtime(io);

    httpServer.listen(0, () => {
      port = (httpServer.address() as AddressInfo).port;
      done();
    });
  });

  afterAll((done) => {
    io.close();
    httpServer.close(done);
  });

  beforeEach(() => {
    queryMock.mockReset();
    bannedMock.mockReset();
    fetchMock.mockReset();

    process.env.USER_SERVICE_URL = "http://user-service:3004";
    process.env.SERVICE_SECRET_KEY = "test-service-secret";

		fetchMock.mockImplementation(async (_url: string, init?: RequestInit) => {
			let ids: string[] = [];

			try {
				const rawBody =
					typeof init?.body === "string"
						? init.body
						: Buffer.isBuffer(init?.body)
							? init?.body.toString("utf8")
							: "";

				const parsed = rawBody ? JSON.parse(rawBody) : {};

				if (Array.isArray(parsed.userIds)) {
					ids = parsed.userIds;
				} else if (Array.isArray(parsed.ids)) {
					ids = parsed.ids;
				} else if (typeof parsed.userId === "string") {
					ids = [parsed.userId];
				}
			} catch {
				ids = [];
			}

			const profileMap: Record<string, any> = {
				[USER_1]: { id: USER_1, username: "u1_name", profile_icon: "u1.png" },
				[USER_2]: { id: USER_2, username: "u2_name", profile_icon: "u2.png" },
				[USER_3]: { id: USER_3, username: "u3_name", profile_icon: "u3.png" },
			};

			return {
				ok: true,
				json: async () => ids.map((id) => profileMap[id]).filter(Boolean),
				text: async () => "",
			};
		});

    bannedMock.mockResolvedValue(false);
  });

  afterEach(async () => {
    await Promise.all(
      clients.splice(0).map(
        (client) =>
          new Promise<void>((resolve) => {
            if (!client.connected) {
              client.removeAllListeners();
              resolve();
              return;
            }

            client.once("disconnect", () => {
              client.removeAllListeners();
              resolve();
            });

            client.disconnect();
          }),
      ),
    );

    io.sockets.sockets.forEach((socket) => socket.disconnect(true));
  });

  function createClient(userId: string): ClientSocket {
    const client = ClientIO(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
      reconnection: false,
      auth: { userId },
    });
    clients.push(client);
    return client;
  }

  function waitForEvent<T = any>(
    socket: ClientSocket,
    event: string,
    timeout = 3000,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out waiting for ${event}`));
      }, timeout);

      const handler = (data: T) => {
        cleanup();
        resolve(data);
      };

      const cleanup = () => {
        clearTimeout(timer);
        socket.off(event, handler);
      };

      socket.once(event, handler);
    });
  }

  function waitForPresenceWithUsers(
    socket: ClientSocket,
    expectedUserIds: string[],
    timeout = 3000,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const expected = [...expectedUserIds].sort();

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Timed out waiting for presence:update"));
      }, timeout);

      const handler = (payload: any) => {
        const users = (payload?.users ?? [])
          .map((u: any) => u.userId)
          .sort();

        if (JSON.stringify(users) === JSON.stringify(expected)) {
          cleanup();
          resolve(payload);
        }
      };

      const cleanup = () => {
        clearTimeout(timer);
        socket.off("presence:update", handler);
      };

      socket.on("presence:update", handler);
    });
  }

  function waitForNoEvent(
    socket: ClientSocket,
    event: string,
    duration = 700,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const handler = () => {
        cleanup();
        reject(new Error(`Unexpected event received: ${event}`));
      };

      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, duration);

      const cleanup = () => {
        clearTimeout(timer);
        socket.off(event, handler);
      };

      socket.on(event, handler);
    });
  }

  function mockJoinQueries(currentCode = "") {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: ROOM_ID, user1_id: USER_1, user2_id: USER_2 }],
    });
    queryMock.mockResolvedValueOnce({
      rows: [{ current_code: currentCode }],
    });
  }

  it("allows a matched user to join and emits room:joined", async () => {
    mockJoinQueries('print("hello")');

    const client = createClient(USER_1);
    await waitForEvent(client, "connect");

    client.emit("room:join", { roomId: ROOM_ID, userId: USER_1 });
    const joined = await waitForEvent<any>(client, "room:joined");

    expect(joined.roomId).toBe(ROOM_ID);
    expect(queryMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("emits presence:update to both matched users", async () => {
    mockJoinQueries();
    mockJoinQueries();

    const client1 = createClient(USER_1);
    const client2 = createClient(USER_2);

    await Promise.all([
      waitForEvent(client1, "connect"),
      waitForEvent(client2, "connect"),
    ]);

    client1.emit("room:join", { roomId: ROOM_ID, userId: USER_1 });
    await waitForEvent(client1, "room:joined");

    const presence1Promise = waitForPresenceWithUsers(client1, [USER_1, USER_2]);
    const presence2Promise = waitForPresenceWithUsers(client2, [USER_1, USER_2]);

    client2.emit("room:join", { roomId: ROOM_ID, userId: USER_2 });
    await waitForEvent(client2, "room:joined");

    const [presence1, presence2] = await Promise.all([
      presence1Promise,
      presence2Promise,
    ]);

    const users1 = presence1.users.map((u: any) => u.userId).sort();
    const users2 = presence2.users.map((u: any) => u.userId).sort();

    expect(users1).toEqual([USER_1, USER_2]);
    expect(users2).toEqual([USER_1, USER_2]);

    expect(presence1.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: USER_1,
          displayName: "u1_name",
          profileIcon: "u1.png",
        }),
        expect.objectContaining({
          userId: USER_2,
          displayName: "u2_name",
          profileIcon: "u2.png",
        }),
      ]),
    );
  });

  it("rejects a user who is not one of the matched users", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: ROOM_ID, user1_id: USER_1, user2_id: USER_2 }],
    });

    const client = createClient(USER_3);
    await waitForEvent(client, "connect");

    client.emit("room:join", { roomId: ROOM_ID, userId: USER_3 });
    const errorPayload = await waitForEvent<any>(client, "room:error");

    expect(errorPayload.message).toMatch(/not authorized/i);
    await waitForNoEvent(client, "room:joined");
  });

	it("relays chat:new to the other matched user", async () => {
		mockJoinQueries();
		mockJoinQueries();

		// extra DB response for chat:send
		queryMock.mockResolvedValueOnce({
			rows: [
				{
					id: "chat-msg-1",
					room_id: ROOM_ID,
					user_id: USER_1,
					message: "hello",
					created_at: new Date().toISOString(),
				},
			],
		});

		const client1 = createClient(USER_1);
		const client2 = createClient(USER_2);

		await Promise.all([
			waitForEvent(client1, "connect"),
			waitForEvent(client2, "connect"),
		]);

		client1.emit("room:join", { roomId: ROOM_ID, userId: USER_1 });
		await waitForEvent(client1, "room:joined");

		client2.emit("room:join", { roomId: ROOM_ID, userId: USER_2 });
		await waitForEvent(client2, "room:joined");

		const chatPromise = waitForEvent<any>(client2, "chat:new");

		client1.emit("chat:send", {
			roomId: ROOM_ID,
			userId: USER_1,
			message: "hello",
		});

		const payload = await chatPromise;
		expect(payload.message).toBe("hello");
	});

  it("rejects yjs sync for unauthorised sockets", async () => {
    const client = createClient(USER_3);
    await waitForEvent(client, "connect");

    client.emit("yjs:sync-step1", {
      roomId: ROOM_ID,
      update: Buffer.from([1, 2, 3]),
    });

    const errorPayload = await waitForEvent<any>(client, "editor:error");
    expect(errorPayload.message).toBeDefined();
  });

  it("allows a user to rejoin after reconnect", async () => {
    mockJoinQueries();

    let client = createClient(USER_1);
    await waitForEvent(client, "connect");

    client.emit("room:join", { roomId: ROOM_ID, userId: USER_1 });
    await waitForEvent(client, "room:joined");

    await new Promise<void>((resolve) => {
      client.once("disconnect", () => resolve());
      client.disconnect();
    });

    mockJoinQueries();

    client = createClient(USER_1);
    await waitForEvent(client, "connect");

    client.emit("room:join", { roomId: ROOM_ID, userId: USER_1 });
    const rejoined = await waitForEvent<any>(client, "room:joined");

    expect(rejoined.roomId).toBe(ROOM_ID);
  });
});
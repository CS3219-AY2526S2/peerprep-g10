import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';

const BAN_CHANNEL = 'user:banned';
const AUTH_REDIS_URL = process.env.AUTH_REDIS_URL || 'redis://localhost:6380';

// Creates a dedicated Redis subscriber connection and listens for ban events.
// When a user is banned, all their open Socket.IO connections are force-disconnected.
export async function startBanSubscriber(io: SocketIOServer): Promise<void> {
  const subscriber = createClient({ url: AUTH_REDIS_URL });

  subscriber.on('error', (err) => {
    console.error('❌ [BanSubscriber] Redis error:', err);
  });

  subscriber.on('connect', () => {
    console.log('[BanSubscriber] Connecting to auth-redis...');
  });

  subscriber.on('ready', () => {
    console.log('✅ [BanSubscriber] Ready and subscribed to ban channel.');
  });

  await subscriber.connect();

  await subscriber.subscribe(BAN_CHANNEL, async (message) => {
    try {
      const { action, userId } = JSON.parse(message);

      // Only act on ban events — unban events don't require disconnection
      if (action !== 'ban') return;

      // Find all sockets belonging to the banned user and disconnect them
      const sockets = await io.fetchSockets();
      for (const socket of sockets) {
        if (socket.data.userId === String(userId)) {
          socket.emit('force-logout', { reason: 'USER_BANNED' });
          socket.disconnect(true);
        }
      }

      console.log(`[BanSubscriber] Disconnected all sockets for banned user: ${userId}`);
    } catch (err) {
      console.error('[BanSubscriber] Failed to process ban event:', err);
    }
  });
}

import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_REDIS_URL = process.env.AUTH_REDIS_URL || 'redis://localhost:6380';

// Client for blacklist read/write operations (SADD, SREM, SISMEMBER on banned_users set)
export const blacklistClient = createClient({ url: AUTH_REDIS_URL });

// Dedicated client for publishing ban/unban events to the user:banned Pub/Sub channel
export const pubClient = blacklistClient.duplicate();

// Event listeners for blacklist client
blacklistClient.on('error', (err) => {
  console.error('❌ [AuthRedis Blacklist Client] Error:', err);
});

blacklistClient.on('connect', () => {
  console.log('[AuthRedis Blacklist Client] Connecting to auth-redis...');
});

blacklistClient.on('ready', () => {
  console.log('✅ [AuthRedis Blacklist Client] Ready and fully connected.');
});

blacklistClient.on('end', () => {
  console.log('[AuthRedis Blacklist Client] Disconnected from auth-redis.');
});

blacklistClient.on('reconnecting', () => {
  console.log('[AuthRedis Blacklist Client] Attempting to reconnect...');
});

// Event listeners for pub client
pubClient.on('error', (err) => {
  console.error('❌ [AuthRedis Pub Client] Error:', err);
});

pubClient.on('ready', () => {
  console.log('✅ [AuthRedis Pub Client] Ready and fully connected.');
});

// Connects both the blacklist client and the pub client to auth-redis
export const connectAuthRedis = async (): Promise<void> => {
  try {
    if (!blacklistClient.isOpen) {
      await blacklistClient.connect();
    }
    if (!pubClient.isOpen) {
      await pubClient.connect();
    }
  } catch (error) {
    console.error('❌ [AuthRedis] Failed to connect:', error);
    process.exit(1);
  }
};
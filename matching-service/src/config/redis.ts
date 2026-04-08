import { createClient } from 'redis';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize the primary Redis client.
const redisClient = createClient({
  url: REDIS_URL,
});

// Pub/Sub clients for Socket.IO Redis Adapter
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

// Event Listeners for Monitoring
redisClient.on('error', (err) => {
  console.error('❌ [Redis Data Client] Error:', err);
});

redisClient.on('connect', () => {
  console.log('[Redis Data Client] Connecting to Redis...');
});

redisClient.on('ready', () => {
  console.log('✅ [Redis Data Client] Ready and fully connected.');
});

redisClient.on('end', () => {
  console.log('[Redis Data Client] Disconnected from Redis.');
});

redisClient.on('reconnecting', () => {
  console.log('[Redis Data Client] Attempting to reconnect...');
});

// Connects the Redis data client. 
export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    if (!pubClient.isOpen) {
      await pubClient.connect();
    }
    if (!subClient.isOpen) {
      await subClient.connect();
    }
  } catch (error) {
    console.error('❌ [Redis Data/Pub/Sub Client] Failed to connect:', error);
    process.exit(1); // Service should restart if cannot connect to redis
  }
};

export { redisClient, pubClient, subClient };

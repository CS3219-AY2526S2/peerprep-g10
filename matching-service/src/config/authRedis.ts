import { createClient } from 'redis';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const AUTH_REDIS_URL = process.env.AUTH_REDIS_URL || 'redis://localhost:6380';

// Dedicated client for ban blacklist checks — separate from matching-redis
export const banCheckClient = createClient({ url: AUTH_REDIS_URL });

banCheckClient.on('error', (err) => {
  console.error('❌ [AuthRedis] Error:', err);
});

banCheckClient.on('connect', () => {
  console.log('[AuthRedis] Connecting to auth-redis...');
});

banCheckClient.on('ready', () => {
  console.log('✅ [AuthRedis] Ready and fully connected.');
});

banCheckClient.on('end', () => {
  console.log('[AuthRedis] Disconnected from auth-redis.');
});

banCheckClient.on('reconnecting', () => {
  console.log('[AuthRedis] Attempting to reconnect...');
});

// Connects the ban check client to auth-redis
export const connectAuthRedis = async (): Promise<void> => {
  try {
    if (!banCheckClient.isOpen) {
      await banCheckClient.connect();
    }
  } catch (error) {
    console.error('❌ [AuthRedis] Failed to connect:', error);
    process.exit(1);
  }
};

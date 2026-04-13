import { blacklistClient, pubClient } from '../config/authRedis';

const BANNED_USERS_KEY = 'banned_users';
const DELETED_USERS_KEY = 'deleted_users';
const BAN_CHANNEL = 'user:banned';
const DELETE_CHANNEL = 'user:deleted';

export const BanService = {
  // Returns true if the given userId is in the Redis banned_users set
  async isBanned(userId: string): Promise<boolean> {
    const result = await blacklistClient.sIsMember(BANNED_USERS_KEY, String(userId));
    return Boolean(result);
  },

  async isDeleted(userId: string): Promise<boolean> {
    const result = await blacklistClient.sIsMember(DELETED_USERS_KEY, String(userId));
    return Boolean(result);
  },

  // Adds userId to the banned_users set and publishes a ban event to all services
  async banUser(userId: string): Promise<void> {
    await blacklistClient.sAdd(BANNED_USERS_KEY, String(userId));
    await pubClient.publish(BAN_CHANNEL, JSON.stringify({ action: 'ban', userId: String(userId) }));
  },

  // Removes userId from the banned_users set and publishes an unban event
  async unbanUser(userId: string): Promise<void> {
    await blacklistClient.sRem(BANNED_USERS_KEY, String(userId));
    await pubClient.publish(BAN_CHANNEL, JSON.stringify({ action: 'unban', userId: String(userId) }));
  },

  async markDeleted(userId: string): Promise<void> {
    await blacklistClient.sAdd(DELETED_USERS_KEY, String(userId));
    await pubClient.publish(DELETE_CHANNEL, JSON.stringify({ action: 'delete', userId: String(userId) }));
  },
};
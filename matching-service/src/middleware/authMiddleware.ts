import { banCheckClient } from '../config/authRedis';

const BANNED_USERS_KEY = 'banned_users';

// Checks if a userId is in the Redis banned_users set
export const isUserBanned = async (userId: string): Promise<boolean> => {
  const result = await banCheckClient.sIsMember(BANNED_USERS_KEY, String(userId));
  return Boolean(result);
};
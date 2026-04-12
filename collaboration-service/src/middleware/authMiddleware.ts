import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { banCheckClient } from '../config/authRedis';

const BANNED_USERS_KEY = 'banned_users';

// Checks if a userId is in the Redis banned_users set
export const isUserBanned = async (userId: string): Promise<boolean> => {
  const result = await banCheckClient.sIsMember(BANNED_USERS_KEY, String(userId));
  return Boolean(result);
};

// Verifies a JWT string and returns the decoded payload, or throws on failure
export const verifyToken = (token: string): { userId: number; access_role: string } => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; access_role: string };
};

// Requires a valid JWT and checks the ban blacklist.
// Returns 401 if missing, 403 if invalid or banned.
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const banned = await isUserBanned(String(decoded.userId));
    if (banned) {
      res.status(403).json({ message: 'Your account has been banned', code: 'USER_BANNED' });
      return;
    }
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};
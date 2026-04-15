import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { banCheckClient } from '../config/authRedis';

const BANNED_USERS_KEY = 'banned_users';

// Checks if a userId is in the Redis banned_users set
export const isUserBanned = async (userId: string): Promise<boolean> => {
  const result = await banCheckClient.sIsMember(BANNED_USERS_KEY, String(userId));
  return Boolean(result);
};

// Requests with no JWT are allowed through (for service-to-service calls).
// When a JWT is present, verifies it and checks the Redis ban blacklist.
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  // No token — allow through (service-to-service or public access)
  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // Check the ban blacklist before allowing the request
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

// Requires a valid JWT token used on admin-only routes where authentication is mandatory.
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // Check the ban blacklist before allowing the request
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

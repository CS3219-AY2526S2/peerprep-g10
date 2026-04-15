import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BanService } from '../services/banService';
import { UserDB } from '../model/userModel';

// Verifies the JWT from the Authorization header and attaches the decoded user to the request
// Also checks the Redis banned_users set — returns 403 with code USER_BANNED if the user is banned
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = String((decoded as any).userId);

    // If the account no longer exists, treat the token as forbidden for a deleted account.
    const user = await UserDB.getUserById(userId);
    if (!user) {
      if (await BanService.isDeleted(userId)) {
        res.status(403).json({ message: 'Your account has been deleted', code: 'USER_DELETED' });
        return;
      }

      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    // Check if the user is in the Redis ban blacklist before allowing the request
    const banned = await BanService.isBanned(userId);
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

// Verifies service-to-service requests using a shared static secret
export const authenticateServiceToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token !== process.env.SERVICE_SECRET_KEY) {
    res.status(403).json({ message: 'Forbidden: invalid service key' });
    return;
  }

  next();
};

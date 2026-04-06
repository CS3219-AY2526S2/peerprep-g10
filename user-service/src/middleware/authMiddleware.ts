import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Verifies the JWT from the Authorization header and attaches the decoded user to the request
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
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
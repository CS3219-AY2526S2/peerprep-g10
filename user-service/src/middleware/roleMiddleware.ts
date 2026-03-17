import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // This data was attached by authenticateToken

    if (!user || !allowedRoles.includes(user.access_role)) {
      return res.status(403).json({ 
        message: `Access Denied: You do not have the required permissions (${allowedRoles.join(', ')})` 
      });
    }
    next();
  };
};
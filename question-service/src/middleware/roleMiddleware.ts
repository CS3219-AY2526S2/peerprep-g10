import { Request, Response, NextFunction } from 'express';

// Returns middleware that restricts access to users with one of the specified roles
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.access_role)) {
      res.status(403).json({
        message: `Access Denied: You do not have the required permissions (${allowedRoles.join(', ')})`,
      });
      return;
    }

    next();
  };
};

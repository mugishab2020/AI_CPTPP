import { Request, Response, NextFunction } from 'express';

type UserRole = 'ADMIN' | 'MANAGER' | 'CLIENT' | 'TEAM_MEMBER';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
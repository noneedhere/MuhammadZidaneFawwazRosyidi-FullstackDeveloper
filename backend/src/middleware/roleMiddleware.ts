import { Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'You do not have permission to access this resource', 'FORBIDDEN', 403);
      return;
    }

    next();
  };
};

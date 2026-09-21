import { Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types';

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password, role, companyName } = req.body;
    const result = await authService.register({ fullName, email, password, role, companyName });
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    sendSuccess(res, { user }, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

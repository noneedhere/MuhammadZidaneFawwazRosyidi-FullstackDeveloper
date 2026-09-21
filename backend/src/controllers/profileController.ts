import { Response, NextFunction } from 'express';
import * as profileService from '../services/profileService';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getProfile(req.user!.userId);
    sendSuccess(res, { user: profile }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.updateProfile(req.user!.userId, req.user!.role, req.body);
    sendSuccess(res, { user: profile }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

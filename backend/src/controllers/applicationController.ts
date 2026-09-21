import { Response, NextFunction } from 'express';
import * as applicationService from '../services/applicationService';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types';

export const applyToJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const application = await applicationService.applyToJob(req.user!.userId, req.body.jobId);
    sendSuccess(res, { application }, 'Application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getUserApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await applicationService.getUserApplications(req.user!.userId, page, Math.min(limit, 50));
    sendSuccess(res, result, 'Applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getApplicationDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.getApplicationDetail(req.params.id, req.user!.userId);
    sendSuccess(res, result, 'Application retrieved successfully');
  } catch (error) {
    next(error);
  }
};

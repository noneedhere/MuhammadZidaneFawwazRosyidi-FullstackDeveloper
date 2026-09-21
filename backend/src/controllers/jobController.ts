import { Response, NextFunction } from 'express';
import * as jobService from '../services/jobService';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types';

export const getOpenJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const result = await jobService.getOpenJobs(page, Math.min(limit, 50), search);
    sendSuccess(res, result, 'Jobs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getJobDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.getJobDetail(req.params.id, req.user?.userId);
    sendSuccess(res, result, 'Job retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.createJob(req.user!.userId, req.body);
    sendSuccess(res, { job }, 'Job created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await jobService.getCompanyJobs(req.user!.userId, page, Math.min(limit, 50));
    sendSuccess(res, result, 'Jobs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.user!.userId, req.body);
    sendSuccess(res, { job }, 'Job updated successfully');
  } catch (error) {
    next(error);
  }
};

export const closeJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.closeJob(req.params.id, req.user!.userId);
    sendSuccess(res, { job }, 'Job closed successfully');
  } catch (error) {
    next(error);
  }
};

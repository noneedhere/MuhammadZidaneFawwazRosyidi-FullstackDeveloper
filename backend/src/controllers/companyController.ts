import { Response, NextFunction } from 'express';
import * as companyService from '../services/companyService';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types';

export const getJobApplicants = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await companyService.getJobApplicants(
      req.params.jobId,
      req.user!.userId,
      page,
      Math.min(limit, 50)
    );
    sendSuccess(res, result, 'Applicants retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getApplicationDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await companyService.getCompanyApplicationDetail(
      req.params.applicationId,
      req.user!.userId
    );
    sendSuccess(res, result, 'Application retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const application = await companyService.updateApplicationStatus(
      req.params.applicationId,
      req.user!.userId,
      req.body.status,
      req.user!.userId
    );
    sendSuccess(res, { application }, 'Application status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await companyService.getDashboardStats(req.user!.userId);
    sendSuccess(res, stats, 'Dashboard data retrieved successfully');
  } catch (error) {
    next(error);
  }
};

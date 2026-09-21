import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import * as companyController from '../controllers/companyController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createJobSchema } from '../validators/jobValidators';
import { updateStatusSchema } from '../validators/applicationValidators';

const router = Router();

// All company routes require auth + COMPANY role
router.use(authMiddleware, roleMiddleware(['COMPANY']));

// Dashboard
router.get('/dashboard', companyController.getDashboard);

// Job management
router.post('/jobs', validate(createJobSchema), jobController.createJob);
router.get('/jobs', jobController.getCompanyJobs);
router.put('/jobs/:id', jobController.updateJob);
router.patch('/jobs/:id/close', jobController.closeJob);

// Applicant management
router.get('/jobs/:jobId/applicants', companyController.getJobApplicants);
router.get('/applications/:applicationId', companyController.getApplicationDetail);
router.patch('/applications/:applicationId/status', validate(updateStatusSchema), companyController.updateApplicationStatus);

export default router;

import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

// Job Seeker routes
router.get('/', authMiddleware, roleMiddleware(['JOB_SEEKER']), jobController.getOpenJobs);
router.get('/:id', authMiddleware, roleMiddleware(['JOB_SEEKER']), jobController.getJobDetail);

export default router;

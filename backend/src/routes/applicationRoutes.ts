import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { applyJobSchema } from '../validators/applicationValidators';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['JOB_SEEKER']), validate(applyJobSchema), applicationController.applyToJob);
router.get('/', authMiddleware, roleMiddleware(['JOB_SEEKER']), applicationController.getUserApplications);
router.get('/:id', authMiddleware, roleMiddleware(['JOB_SEEKER']), applicationController.getApplicationDetail);

export default router;

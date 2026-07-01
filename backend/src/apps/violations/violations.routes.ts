import { Router } from 'express';
import * as ViolationsController from './violations.controller';
import { validate } from '../../middlewares/validationMiddleware';
import { authenticate } from '../../middlewares/authMiddleware';
import { createViolationSchema, updateViolationStatusSchema } from './dtos/violation.dto';

const router = Router();

router.use(authenticate);

router.post('/', validate(createViolationSchema), ViolationsController.createViolation);
router.get('/', ViolationsController.getViolations);
router.get('/verification-queue', ViolationsController.getVerificationQueue);
router.get('/:id', ViolationsController.getViolationById);
router.put('/:id/status', validate(updateViolationStatusSchema), ViolationsController.updateStatus);

// AI Stub
router.post('/analyze-image', ViolationsController.analyzeImage);

export default router;

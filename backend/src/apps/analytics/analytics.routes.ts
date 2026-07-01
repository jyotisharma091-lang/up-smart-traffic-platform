import { Router } from 'express';
import * as AnalyticsController from './analytics.controller';
import { authenticate } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);

// Admins and Officers can see analytics (Officers only see their own via service logic)
router.use(authorizeRoles('STATE_ADMIN', 'DISTRICT_ADMIN', 'TRAFFIC_OFFICER'));

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/heatmap', AnalyticsController.getHeatmap);
router.get('/officer-activity', AnalyticsController.getOfficerActivity);

export default router;

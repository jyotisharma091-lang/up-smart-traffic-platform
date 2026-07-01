import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { db } from './src/config/db';
import { ViolationService } from './src/apps/violations/violations.service';
import { AnalyticsService } from './src/apps/analytics/analytics.service';

async function test() {
  try {
    const role = 'DISTRICT_ADMIN';
    const userId = 'test-id';
    const district = 'Kanpur nagar';

    const analytics = await AnalyticsService.getDashboardMetrics(role, userId, district);
    console.log('Analytics metrics:', analytics);

    const violations = await ViolationService.getViolations(role, userId, district);
    console.log('Total Violations:', violations.length);
    const verificationQueue = violations.filter(v => v.status === 'VERIFICATION_QUEUE');
    console.log('VERIFICATION_QUEUE Violations:', verificationQueue.length);

  } catch (err) {
    console.error(err);
  }
}
test();

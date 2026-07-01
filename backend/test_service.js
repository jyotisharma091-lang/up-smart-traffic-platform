require('dotenv').config();
const { db } = require('./src/config/db');
const { ViolationService } = require('./src/apps/violations/violations.service');
const { AnalyticsService } = require('./src/apps/analytics/analytics.service');

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

import { db } from '../../config/db';
import { violations, users, vehicles } from '../../config/schema';
import { eq, and, sql, isNotNull, gte } from 'drizzle-orm';

export class AnalyticsService {
  
  static async getDashboardMetrics(role: string, userId: string, district?: string) {
    // Determine the base condition for isolation
    const isolationCondition = role === 'DISTRICT_ADMIN' && district 
      ? eq(violations.district, district)
      : role === 'TRAFFIC_OFFICER' 
        ? eq(violations.officerId, userId)
        : undefined;
      
    const userDistrictCondition = role === 'DISTRICT_ADMIN' && district 
      ? eq(users.district, district)
      : undefined;

    // 1. Today's Violations
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaysViolationsQuery = db.select({ count: sql<number>`count(*)` })
      .from(violations)
      .where(and(
        gte(violations.createdAt, startOfToday),
        isolationCondition
      ));

    // 2. Pending Reviews (VERIFICATION_QUEUE)
    const pendingReviewsQuery = db.select({ count: sql<number>`count(*)` })
      .from(violations)
      .where(and(
        eq(violations.status, 'VERIFICATION_QUEUE'),
        isolationCondition
      ));

    // 3. Active Officers
    const activeOfficersQuery = db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(
        eq(users.role, 'TRAFFIC_OFFICER'),
        eq(users.status, 'ACTIVE'),
        userDistrictCondition
      ));

    // 4. Challans Issued (APPROVED or CHALLAN_ISSUED)
    const approvedCasesQuery = db.select({ count: sql<number>`count(*)` })
      .from(violations)
      .where(and(
        sql`${violations.status} IN ('APPROVED', 'CHALLAN_ISSUED')`,
        isolationCondition
      ));

    // Execute queries concurrently
    const [todaysRes, pendingRes, officersRes, approvedRes] = await Promise.all([
      todaysViolationsQuery,
      pendingReviewsQuery,
      activeOfficersQuery,
      approvedCasesQuery
    ]);

    return {
      todaysViolations: Number(todaysRes[0].count),
      pendingReviews: Number(pendingRes[0].count),
      activeOfficers: Number(officersRes[0].count),
      approvedCases: Number(approvedRes[0].count),
    };
  }

  static async getHeatmapData(role: string, district?: string) {
    const districtCondition = role === 'DISTRICT_ADMIN' && district 
      ? eq(violations.district, district)
      : undefined;

    const heatmapQuery = db.select({
      id: violations.id,
      latitude: violations.latitude,
      longitude: violations.longitude,
      violationType: violations.violationType,
      timestamp: violations.timestamp,
    }).from(violations)
      .where(and(
        isNotNull(violations.latitude),
        isNotNull(violations.longitude),
        districtCondition
      ));

    const results = await heatmapQuery;

    // Convert to GeoJSON FeatureCollection format often used by Leaflet/Mapbox
    const features = results.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(row.longitude), Number(row.latitude)] // GeoJSON is [lng, lat]
      },
      properties: {
        id: row.id,
        violationType: row.violationType,
        timestamp: row.timestamp,
      }
    }));

    return {
      type: 'FeatureCollection',
      features
    };
  }

  static async getOfficerActivity(district?: string) {
    const districtCondition = district ? eq(users.district, district) : undefined;

    const officerStats = await db.select({
      id: users.id,
      fullName: users.fullName,
      status: users.status,
      violationCount: sql<number>`count(${violations.id})`
    })
    .from(users)
    .leftJoin(violations, eq(users.id, violations.officerId))
    .where(and(eq(users.role, 'TRAFFIC_OFFICER'), districtCondition))
    .groupBy(users.id)
    .orderBy(sql`count(${violations.id}) DESC`)
    .limit(5);

    return officerStats.map(o => ({
      id: o.id,
      name: o.fullName || 'Unknown Officer',
      isOnline: o.status === 'ACTIVE',
      violations: Number(o.violationCount)
    }));
  }
}

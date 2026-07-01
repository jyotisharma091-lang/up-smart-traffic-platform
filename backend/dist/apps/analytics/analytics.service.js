"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
class AnalyticsService {
    static async getDashboardMetrics(role, district) {
        // Determine the base condition for district isolation
        const districtCondition = role === 'DISTRICT_ADMIN' && district
            ? (0, drizzle_orm_1.eq)(schema_1.violations.district, district)
            : undefined;
        const userDistrictCondition = role === 'DISTRICT_ADMIN' && district
            ? (0, drizzle_orm_1.eq)(schema_1.users.district, district)
            : undefined;
        // 1. Today's Violations
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaysViolationsQuery = db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.violations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.violations.createdAt, startOfToday), districtCondition));
        // 2. Pending Reviews (VERIFICATION_QUEUE)
        const pendingReviewsQuery = db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.violations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.violations.status, 'VERIFICATION_QUEUE'), districtCondition));
        // 3. Active Officers
        const activeOfficersQuery = db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.role, 'TRAFFIC_OFFICER'), (0, drizzle_orm_1.eq)(schema_1.users.status, 'ACTIVE'), userDistrictCondition));
        // Execute queries concurrently
        const [todaysRes, pendingRes, officersRes] = await Promise.all([
            todaysViolationsQuery,
            pendingReviewsQuery,
            activeOfficersQuery
        ]);
        return {
            todaysViolations: Number(todaysRes[0].count),
            pendingReviews: Number(pendingRes[0].count),
            activeOfficers: Number(officersRes[0].count),
        };
    }
    static async getHeatmapData(role, district) {
        const districtCondition = role === 'DISTRICT_ADMIN' && district
            ? (0, drizzle_orm_1.eq)(schema_1.violations.district, district)
            : undefined;
        const heatmapQuery = db_1.db.select({
            id: schema_1.violations.id,
            latitude: schema_1.violations.latitude,
            longitude: schema_1.violations.longitude,
            violationType: schema_1.violations.violationType,
            timestamp: schema_1.violations.timestamp,
        }).from(schema_1.violations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNotNull)(schema_1.violations.latitude), (0, drizzle_orm_1.isNotNull)(schema_1.violations.longitude), districtCondition));
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
}
exports.AnalyticsService = AnalyticsService;

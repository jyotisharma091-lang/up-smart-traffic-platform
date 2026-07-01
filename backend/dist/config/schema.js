"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogs = exports.violations = exports.vehicles = exports.users = exports.violationStatusEnum = exports.statusEnum = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Enums
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['STATE_ADMIN', 'DISTRICT_ADMIN', 'TRAFFIC_OFFICER']);
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['ACTIVE', 'DEACTIVATED', 'RETIRED']);
exports.violationStatusEnum = (0, pg_core_1.pgEnum)('violation_status', [
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'WARNING_ISSUED',
    'VERIFICATION_QUEUE',
    'RECOMMENDED',
    'CLOSED'
]);
// Users Table
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    role: (0, exports.roleEnum)('role').notNull(),
    status: (0, exports.statusEnum)('status').default('ACTIVE'),
    fullName: (0, pg_core_1.varchar)('full_name', { length: 255 }).notNull(),
    username: (0, pg_core_1.varchar)('username', { length: 100 }).unique().notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique(), // Primarily for State Admin
    mobileNumber: (0, pg_core_1.varchar)('mobile_number', { length: 15 }).unique().notNull(),
    pnoNumber: (0, pg_core_1.varchar)('pno_number', { length: 50 }).unique(), // Not all admins might have it, but required for officers
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    rank: (0, pg_core_1.varchar)('rank', { length: 100 }),
    designation: (0, pg_core_1.varchar)('designation', { length: 100 }),
    policeStation: (0, pg_core_1.varchar)('police_station', { length: 255 }),
    district: (0, pg_core_1.varchar)('district', { length: 100 }), // Indexed later in Drizzle or via SQL
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Vehicles Table
exports.vehicles = (0, pg_core_1.pgTable)('vehicles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    vehicleNumber: (0, pg_core_1.varchar)('vehicle_number', { length: 20 }).unique().notNull(),
    ownerName: (0, pg_core_1.varchar)('owner_name', { length: 255 }),
    vehicleType: (0, pg_core_1.varchar)('vehicle_type', { length: 50 }),
    warningCount: (0, pg_core_1.integer)('warning_count').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// Violations Table
exports.violations = (0, pg_core_1.pgTable)('violations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    caseNumber: (0, pg_core_1.varchar)('case_number', { length: 50 }).unique().notNull(),
    vehicleId: (0, pg_core_1.uuid)('vehicle_id').references(() => exports.vehicles.id).notNull(),
    officerId: (0, pg_core_1.uuid)('officer_id').references(() => exports.users.id).notNull(),
    district: (0, pg_core_1.varchar)('district', { length: 100 }).notNull(),
    violationType: (0, pg_core_1.varchar)('violation_type', { length: 100 }).notNull(),
    status: (0, exports.violationStatusEnum)('status').default('DRAFT').notNull(),
    latitude: (0, pg_core_1.decimal)('latitude'),
    longitude: (0, pg_core_1.decimal)('longitude'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').notNull(),
    aiConfidenceScore: (0, pg_core_1.decimal)('ai_confidence_score'),
    aiSummary: (0, pg_core_1.text)('ai_summary'),
    evidenceUrl: (0, pg_core_1.varchar)('evidence_url', { length: 1000 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// Audit Logs Table
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.varchar)('action', { length: 255 }).notNull(),
    entity: (0, pg_core_1.varchar)('entity', { length: 100 }).notNull(),
    entityId: (0, pg_core_1.uuid)('entity_id'),
    details: (0, pg_core_1.jsonb)('details'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});

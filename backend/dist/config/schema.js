"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogs = exports.violations = exports.vehicles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Users Table
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    role: (0, pg_core_1.text)('role').notNull(),
    status: (0, pg_core_1.text)('status').default('ACTIVE'),
    isFirstLogin: (0, pg_core_1.boolean)('is_first_login').default(true).notNull(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    username: (0, pg_core_1.text)('username').unique().notNull(),
    email: (0, pg_core_1.text)('email').unique(),
    mobileNumber: (0, pg_core_1.text)('mobile_number').unique().notNull(),
    pnoNumber: (0, pg_core_1.text)('pno_number').unique(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    rank: (0, pg_core_1.text)('rank'),
    designation: (0, pg_core_1.text)('designation'),
    policeStation: (0, pg_core_1.text)('police_station'),
    district: (0, pg_core_1.text)('district'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
// Vehicles Table
exports.vehicles = (0, pg_core_1.pgTable)('vehicles', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    vehicleNumber: (0, pg_core_1.text)('vehicle_number').unique().notNull(),
    ownerName: (0, pg_core_1.text)('owner_name'),
    vehicleType: (0, pg_core_1.text)('vehicle_type'),
    warningCount: (0, pg_core_1.integer)('warning_count').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
// Violations Table
exports.violations = (0, pg_core_1.pgTable)('violations', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    caseNumber: (0, pg_core_1.text)('case_number').unique().notNull(),
    vehicleId: (0, pg_core_1.text)('vehicle_id').references(() => exports.vehicles.id).notNull(),
    officerId: (0, pg_core_1.text)('officer_id').references(() => exports.users.id).notNull(),
    district: (0, pg_core_1.text)('district').notNull(),
    violationType: (0, pg_core_1.text)('violation_type').notNull(),
    status: (0, pg_core_1.text)('status').default('DRAFT').notNull(),
    latitude: (0, pg_core_1.doublePrecision)('latitude'),
    longitude: (0, pg_core_1.doublePrecision)('longitude'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').notNull(),
    aiConfidenceScore: (0, pg_core_1.doublePrecision)('ai_confidence_score'),
    aiSummary: (0, pg_core_1.text)('ai_summary'),
    evidenceUrl: (0, pg_core_1.text)('evidence_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
});
// Audit Logs Table
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    userId: (0, pg_core_1.text)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.text)('action').notNull(),
    entity: (0, pg_core_1.text)('entity').notNull(),
    entityId: (0, pg_core_1.text)('entity_id'),
    details: (0, pg_core_1.jsonb)('details'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});

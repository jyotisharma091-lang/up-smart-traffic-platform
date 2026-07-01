import { pgTable, text, integer, doublePrecision, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  role: text('role').notNull(),
  status: text('status').default('ACTIVE'),
  isFirstLogin: boolean('is_first_login').default(true).notNull(),
  fullName: text('full_name').notNull(),
  username: text('username').unique().notNull(),
  email: text('email').unique(),
  mobileNumber: text('mobile_number').unique().notNull(),
  pnoNumber: text('pno_number').unique(),
  passwordHash: text('password_hash').notNull(),
  rank: text('rank'),
  designation: text('designation'),
  policeStation: text('police_station'),
  district: text('district'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Vehicles Table
export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  vehicleNumber: text('vehicle_number').unique().notNull(),
  ownerName: text('owner_name'),
  vehicleType: text('vehicle_type'),
  warningCount: integer('warning_count').default(0).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Violations Table
export const violations = pgTable('violations', {
  id: text('id').primaryKey(),
  caseNumber: text('case_number').unique().notNull(),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  officerId: text('officer_id').references(() => users.id).notNull(),
  district: text('district').notNull(),
  violationType: text('violation_type').notNull(),
  status: text('status').default('DRAFT').notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  timestamp: timestamp('timestamp').notNull(),
  aiConfidenceScore: doublePrecision('ai_confidence_score'),
  aiSummary: text('ai_summary'),
  evidenceUrl: text('evidence_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

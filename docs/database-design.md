# Database Design

## 1. Overview
The database is hosted on Supabase (PostgreSQL) and accessed via Drizzle ORM from the backend. The schema enforces data integrity, strict constraints, and district isolation.

## 2. Core Entities

### 2.1 Users Table
- `id` (UUID, Primary Key)
- `role` (Enum: STATE_ADMIN, DISTRICT_ADMIN, TRAFFIC_OFFICER)
- `status` (Enum: ACTIVE, DEACTIVATED, RETIRED)
- `full_name` (Varchar)
- `username` (Varchar, Unique)
- `email` (Varchar, Unique for State Admin)
- `mobile_number` (Varchar, Unique)
- `pno_number` (Varchar, Unique)
- `password_hash` (Varchar)
- `rank` (Varchar)
- `designation` (Varchar)
- `police_station` (Varchar)
- `district` (Varchar, Indexed for Isolation)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 2.2 Vehicles Table
- `id` (UUID, Primary Key)
- `vehicle_number` (Varchar, Unique, Indexed)
- `owner_name` (Varchar)
- `vehicle_type` (Varchar)
- `warning_count` (Int, Default 0)
- `created_at` (Timestamp)

### 2.3 Violations Table
- `id` (UUID, Primary Key)
- `case_number` (Varchar, Unique)
- `vehicle_id` (UUID, Foreign Key)
- `officer_id` (UUID, Foreign Key)
- `district` (Varchar, Indexed)
- `violation_type` (Varchar)
- `status` (Enum: DRAFT, SUBMITTED, UNDER_REVIEW, WARNING_ISSUED, VERIFICATION_QUEUE, RECOMMENDED, CLOSED)
- `latitude` (Decimal)
- `longitude` (Decimal)
- `timestamp` (Timestamp)
- `ai_confidence_score` (Decimal)
- `ai_summary` (Text)
- `evidence_url` (Varchar)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 2.4 Audit Logs
- `id` (UUID)
- `user_id` (UUID)
- `action` (Varchar)
- `entity` (Varchar)
- `entity_id` (UUID)
- `details` (JSONB)
- `created_at` (Timestamp)

## 3. Row Level Security (RLS) & Isolation
- **Traffic Officer:** `SELECT`, `INSERT`, `UPDATE` on Violations where `officer_id = auth.uid()`.
- **District Admin:** `SELECT`, `UPDATE` on Users and Violations where `district = user_jwt.district`.
- **State Admin:** `SELECT` on all records globally.

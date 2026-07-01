# UP Smart Traffic Enforcement & Management Platform

**Database Schema Document**
Version 1.0 | Uttar Pradesh Police | Internal

---

## Table of Contents

1. [Overview](#1-overview)
2. [How to Read This Document](#2-how-to-read-this-document)
3. [Entity Relationship Summary](#3-entity-relationship-summary)
4. [Tables](#4-tables)
   - [districts](#41-districts)
   - [police_stations](#42-police_stations)
   - [users](#43-users)
   - [vehicles](#44-vehicles)
   - [violations](#45-violations)
   - [warnings](#46-warnings)
   - [notifications](#47-notifications)
   - [activity_logs](#48-activity_logs)
   - [reports](#49-reports)
   - [hotspots](#410-hotspots)
   - [ai_analysis_results](#411-ai_analysis_results)
   - [embeddings](#412-embeddings)
5. [Relationships at a Glance](#5-relationships-at-a-glance)
6. [Indexes at a Glance](#6-indexes-at-a-glance)
7. [Naming Conventions](#7-naming-conventions)
8. [Demo vs Production Isolation](#8-demo-vs-production-isolation)

---

## 1. Overview

This document defines the complete relational database schema for the UP Smart Traffic Enforcement & Management Platform. The database runs on **Supabase PostgreSQL** and is managed with **Drizzle ORM**.

Every table follows the same basic rules:
- `id` — a unique auto-incrementing number that identifies each row
- `created_at` — when the row was created (recorded automatically)
- `updated_at` — when the row was last changed (recorded automatically)
- `is_demo` — a flag (`true` / `false`) that separates demo data from real data in every table

> **Beginner Tip — What is a Schema?**
> A schema is the blueprint of your database. It defines what tables exist, what columns each table has, what kind of data goes in each column, and how tables are connected to each other. Think of it like defining the structure of a spreadsheet before you fill it in.

---

## 2. How to Read This Document

Each table section contains:

| Section | What it tells you |
|---|---|
| **Purpose** | What this table stores and why it exists |
| **Columns** | Every column name, data type, and what it holds |
| **Constraints** | Rules the database enforces automatically (e.g., "must be unique", "cannot be empty") |
| **Relationships** | How this table links to other tables via foreign keys |
| **Indexes** | Which columns are optimized for fast searching |

### Data Type Quick Reference

| Type | Meaning | Example |
|---|---|---|
| `SERIAL` | Auto-incrementing integer — the database assigns the next number automatically | `1`, `2`, `3` |
| `INTEGER` | A whole number | `42` |
| `TEXT` | A string of any length | `"UP32AB1234"` |
| `VARCHAR(n)` | A string with a maximum of `n` characters | `VARCHAR(20)` allows up to 20 characters |
| `BOOLEAN` | True or false | `true` / `false` |
| `DECIMAL(p, s)` | A precise number with `p` total digits and `s` decimal places | `DECIMAL(5,2)` → `99.87` |
| `TIMESTAMPTZ` | A date and time, including the timezone | `2025-06-03 10:30:00+05:30` |
| `JSONB` | Structured JSON data stored efficiently for querying | `{"key": "value"}` |
| `vector(1536)` | A list of 1536 numbers representing an AI embedding | Used by pgvector for hotspot detection |

### Constraint Quick Reference

| Constraint | Meaning |
|---|---|
| `PRIMARY KEY` | Uniquely identifies each row in the table. No two rows can have the same value. Cannot be NULL. |
| `NOT NULL` | This column must always have a value — it cannot be left empty. |
| `UNIQUE` | No two rows in this table can have the same value in this column. |
| `DEFAULT value` | If no value is provided when inserting a row, use this default automatically. |
| `REFERENCES table(column)` | A foreign key — this column must match a value that exists in another table. Ensures referential integrity. |
| `CHECK (condition)` | The database rejects any row that does not satisfy this condition. |

---

## 3. Entity Relationship Summary

```
districts
    └── police_stations (many stations belong to one district)
            └── users (many officers posted to one station)

users (officers/admins)
    ├── violations (officer captures many violations)
    ├── warnings (officer issues warnings)
    ├── notifications (user receives notifications)
    ├── activity_logs (every action by a user is logged)
    └── reports (admin generates reports)

vehicles
    ├── violations (one vehicle appears in many violations)
    └── warnings (one vehicle accumulates warnings)

violations
    ├── ai_analysis_results (one AI result per violation)
    ├── warnings (a warning is linked to a specific violation)
    └── embeddings (GPS location of violation stored as vector)

hotspots
    └── embeddings (hotspot is derived from nearby embeddings)
```

---

## 4. Tables

---

### 4.1 `districts`

**Purpose:** Stores the 75 administrative districts of Uttar Pradesh. Every user and police station belongs to a district.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key — unique ID for each district |
| `name` | `VARCHAR(100)` | No | — | Official name of the district (e.g., "Lucknow", "Agra") |
| `code` | `VARCHAR(10)` | No | — | Short code for the district (e.g., "LKO", "AGR") |
| `division` | `VARCHAR(100)` | Yes | NULL | Revenue division this district belongs to (e.g., "Lucknow Division") |
| `is_demo` | `BOOLEAN` | No | `false` | Marks whether this row belongs to the demo dataset |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp when this record was created |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp of the last update (auto-updated by a trigger) |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Each district has a unique ID |
| `NOT NULL` | `name`, `code` | District name and code are mandatory |
| `UNIQUE` | `code` | No two districts can share the same code |
| `CHECK` | `name` | Name must not be an empty string: `CHECK (name <> '')` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| One district has many stations | 1 → Many | `police_stations` | `police_stations.district_id` |
| One district has many users | 1 → Many | `users` | `users.district_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_districts_code` | `code` | Fast lookup by district code |
| `idx_districts_name` | `name` | Fast lookup by district name |

---

### 4.2 `police_stations`

**Purpose:** Stores all police stations in the state. Officers are posted to a specific station. Every station belongs to a district.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `district_id` | `INTEGER` | No | — | Foreign key — which district this station belongs to |
| `name` | `VARCHAR(150)` | No | — | Full name of the police station |
| `station_code` | `VARCHAR(20)` | No | — | Short unique code for the station |
| `address` | `TEXT` | Yes | NULL | Physical address of the station |
| `phone_number` | `VARCHAR(15)` | Yes | NULL | Contact number of the station |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Last update timestamp |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique station ID |
| `NOT NULL` | `district_id`, `name`, `station_code` | These fields are always required |
| `UNIQUE` | `station_code` | No two stations share the same code |
| `REFERENCES` | `district_id` | Must match an existing `districts.id` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Belongs to one district | Many → 1 | `districts` | `district_id` |
| Has many users posted here | 1 → Many | `users` | `users.police_station_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_stations_district_id` | `district_id` | Fast lookup of all stations in a district |
| `idx_stations_station_code` | `station_code` | Fast lookup by station code |

---

### 4.3 `users`

**Purpose:** The central user table. Stores all officers, district admins, and state admins. Authentication credentials and profile information live here.

> **Key Uniqueness Rules (from product.md):**
> - `pno_number` must be unique — it is the official Police Number that identifies each officer
> - `username` must be unique — used as the login handle
> - `mobile_number` must be unique — used for notifications

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `pno_number` | `VARCHAR(20)` | No | — | **Police Number** — official government identifier. Must be unique across the entire system |
| `username` | `VARCHAR(50)` | No | — | Login handle chosen by/assigned to the officer. Must be unique |
| `password_hash` | `TEXT` | No | — | bcrypt-hashed password. The plain-text password is NEVER stored |
| `full_name` | `VARCHAR(150)` | No | — | Officer's legal full name |
| `mobile_number` | `VARCHAR(15)` | No | — | Mobile number for notifications. Must be unique |
| `email` | `VARCHAR(150)` | Yes | NULL | Optional email address |
| `role` | `VARCHAR(20)` | No | — | One of: `traffic_officer`, `district_admin`, `state_admin` |
| `designation` | `VARCHAR(100)` | Yes | NULL | Job title, e.g. "Sub-Inspector", "ASI", "Inspector" |
| `rank` | `VARCHAR(100)` | Yes | NULL | Rank as per UP Police hierarchy |
| `status` | `VARCHAR(30)` | No | `'pending_verification'` | Account lifecycle state (see CHECK constraint below) |
| `district_id` | `INTEGER` | Yes | NULL | Which district this user is assigned to (NULL for state admins) |
| `police_station_id` | `INTEGER` | Yes | NULL | Which station this officer is posted to (NULL for admins) |
| `profile_photo_url` | `TEXT` | Yes | NULL | URL to the officer's profile photo in Supabase Storage |
| `last_login_at` | `TIMESTAMPTZ` | Yes | NULL | Timestamp of the most recent successful login |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Account creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Last update timestamp |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique user ID |
| `UNIQUE` | `pno_number` | Each officer has one PNO number — no duplicates allowed |
| `UNIQUE` | `username` | Each login handle is unique |
| `UNIQUE` | `mobile_number` | Each mobile number registered once |
| `NOT NULL` | `pno_number`, `username`, `password_hash`, `full_name`, `mobile_number`, `role`, `status` | These fields are always required |
| `CHECK` | `role` | Must be one of the valid roles: `CHECK (role IN ('traffic_officer', 'district_admin', 'state_admin'))` |
| `CHECK` | `status` | Must be a valid lifecycle state: `CHECK (status IN ('pending_verification', 'active', 'deactivated', 'suspended', 'transferred', 'retired', 'rejected'))` |
| `REFERENCES` | `district_id` | Must match an existing `districts.id` (if provided) |
| `REFERENCES` | `police_station_id` | Must match an existing `police_stations.id` (if provided) |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Belongs to a district | Many → 1 | `districts` | `district_id` |
| Posted to a station | Many → 1 | `police_stations` | `police_station_id` |
| Submits violations | 1 → Many | `violations` | `violations.officer_id` |
| Issues warnings | 1 → Many | `warnings` | `warnings.issued_by_user_id` |
| Receives notifications | 1 → Many | `notifications` | `notifications.user_id` |
| Actions logged | 1 → Many | `activity_logs` | `activity_logs.user_id` |
| Generates reports | 1 → Many | `reports` | `reports.generated_by_user_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_users_pno_number` | `pno_number` | Fast lookup by Police Number (unique, frequently searched) |
| `idx_users_username` | `username` | Fast login lookup by username |
| `idx_users_mobile_number` | `mobile_number` | Fast lookup by mobile number for notifications |
| `idx_users_district_id` | `district_id` | Fetch all users in a district quickly |
| `idx_users_police_station_id` | `police_station_id` | Fetch all officers at a station quickly |
| `idx_users_role` | `role` | Filter users by role (e.g., list all officers) |
| `idx_users_status` | `status` | Filter by account status (e.g., find all pending accounts) |

---

### 4.4 `vehicles`

**Purpose:** Stores registered vehicle information. Each vehicle is identified by its registration number. Warning counts are tracked per vehicle.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `registration_number` | `VARCHAR(20)` | No | — | Vehicle registration plate (e.g., "UP32AB1234"). Must be unique |
| `vehicle_type` | `VARCHAR(50)` | Yes | NULL | Type of vehicle: `two_wheeler`, `four_wheeler`, `auto`, `truck`, `bus`, etc. |
| `owner_name` | `VARCHAR(150)` | Yes | NULL | Name of the registered owner (from RC data, if available) |
| `owner_mobile` | `VARCHAR(15)` | Yes | NULL | Owner's contact number |
| `make` | `VARCHAR(100)` | Yes | NULL | Manufacturer/brand (e.g., "Honda", "Maruti") |
| `model` | `VARCHAR(100)` | Yes | NULL | Model name (e.g., "Activa", "Swift") |
| `color` | `VARCHAR(50)` | Yes | NULL | Vehicle color |
| `warning_count` | `INTEGER` | No | `0` | Total number of warnings accumulated by this vehicle |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp when this vehicle was first registered in the system |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Last update timestamp |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique vehicle ID |
| `UNIQUE` | `registration_number` | Each registration plate is unique in the system |
| `NOT NULL` | `registration_number` | A vehicle must always have a registration number |
| `CHECK` | `warning_count` | Warning count cannot be negative: `CHECK (warning_count >= 0)` |
| `CHECK` | `vehicle_type` | Must be a known type if provided: `CHECK (vehicle_type IN ('two_wheeler', 'four_wheeler', 'auto', 'truck', 'bus', 'other'))` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Appears in violations | 1 → Many | `violations` | `violations.vehicle_id` |
| Accumulates warnings | 1 → Many | `warnings` | `warnings.vehicle_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_vehicles_registration_number` | `registration_number` | Primary search key — officers search by plate number |
| `idx_vehicles_warning_count` | `warning_count` | Quickly find vehicles approaching or at the 3-warning threshold |
| `idx_vehicles_owner_mobile` | `owner_mobile` | Look up vehicles by owner phone number |

---

### 4.5 `violations`

**Purpose:** The core operational table. Each row represents one traffic violation captured by an officer in the field. A violation goes through several status stages — from initial capture to final admin decision.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `officer_id` | `INTEGER` | No | — | Foreign key — the officer who captured this violation |
| `vehicle_id` | `INTEGER` | Yes | NULL | Foreign key — the vehicle involved (may be NULL if plate not yet identified) |
| `district_id` | `INTEGER` | No | — | Foreign key — the district where this violation occurred |
| `police_station_id` | `INTEGER` | No | — | Foreign key — the station the officer belongs to |
| `image_url` | `TEXT` | No | — | Supabase Storage URL for the violation photo |
| `image_bucket` | `VARCHAR(50)` | No | — | Storage bucket name: `violations-production` or `violations-demo` |
| `latitude` | `DECIMAL(9,6)` | Yes | NULL | GPS latitude at the time of capture (e.g., `26.846694`) |
| `longitude` | `DECIMAL(9,6)` | Yes | NULL | GPS longitude at the time of capture (e.g., `80.946166`) |
| `location_description` | `TEXT` | Yes | NULL | Human-readable location note entered by the officer |
| `violation_type` | `VARCHAR(100)` | Yes | NULL | Officer-entered category, overridden or confirmed by AI |
| `officer_notes` | `TEXT` | Yes | NULL | Free-text notes written by the officer during capture |
| `captured_at` | `TIMESTAMPTZ` | No | `NOW()` | Date and time when the violation was captured in the field |
| `status` | `VARCHAR(30)` | No | `'pending_ai_review'` | Current stage of the violation lifecycle |
| `admin_decision` | `VARCHAR(30)` | Yes | NULL | Final decision by District Admin: `recommend_challan`, `rejected`, `closed` |
| `admin_notes` | `TEXT` | Yes | NULL | Notes entered by the District Admin when making their decision |
| `reviewed_by_user_id` | `INTEGER` | Yes | NULL | Foreign key — the admin who reviewed this violation |
| `reviewed_at` | `TIMESTAMPTZ` | Yes | NULL | When the admin made their decision |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Last update timestamp |

#### Violation Status Lifecycle

```
pending_ai_review
       │
       ▼
  ai_reviewed
       │
       ▼
  warning_issued   ◄──── (repeats for 2nd warning)
       │
       ▼ (on 3rd warning)
 verification_queue
       │
       ├──► challan_recommended
       ├──► rejected
       └──► closed
```

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique violation ID |
| `NOT NULL` | `officer_id`, `district_id`, `police_station_id`, `image_url`, `image_bucket`, `captured_at`, `status` | These are always required |
| `REFERENCES` | `officer_id` | Must match an existing `users.id` |
| `REFERENCES` | `vehicle_id` | Must match an existing `vehicles.id` (if provided) |
| `REFERENCES` | `district_id` | Must match an existing `districts.id` |
| `REFERENCES` | `police_station_id` | Must match an existing `police_stations.id` |
| `REFERENCES` | `reviewed_by_user_id` | Must match an existing `users.id` (if provided) |
| `CHECK` | `status` | Must be a valid stage: `CHECK (status IN ('pending_ai_review', 'ai_reviewed', 'warning_issued', 'verification_queue', 'challan_recommended', 'rejected', 'closed'))` |
| `CHECK` | `admin_decision` | Must be valid if provided: `CHECK (admin_decision IN ('recommend_challan', 'rejected', 'closed'))` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Captured by an officer | Many → 1 | `users` | `officer_id` |
| Involves a vehicle | Many → 1 | `vehicles` | `vehicle_id` |
| In a district | Many → 1 | `districts` | `district_id` |
| At a station | Many → 1 | `police_stations` | `police_station_id` |
| Reviewed by an admin | Many → 1 | `users` | `reviewed_by_user_id` |
| Has one AI analysis | 1 → 1 | `ai_analysis_results` | `ai_analysis_results.violation_id` |
| Generates warnings | 1 → Many | `warnings` | `warnings.violation_id` |
| Has one embedding | 1 → 1 | `embeddings` | `embeddings.violation_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_violations_officer_id` | `officer_id` | Fetch all violations by a specific officer (My Cases view) |
| `idx_violations_vehicle_id` | `vehicle_id` | Fetch all violations for a specific vehicle |
| `idx_violations_district_id` | `district_id` | District Admin views violations in their district |
| `idx_violations_status` | `status` | Filter by status (e.g., all in `verification_queue`) |
| `idx_violations_captured_at` | `captured_at` | Sort and filter violations by date |
| `idx_violations_is_demo` | `is_demo` | Separate demo from production data |

---

### 4.6 `warnings`

**Purpose:** Each warning issued against a vehicle is recorded as a separate row. This gives a full, auditable history of how a vehicle progressed from 1st to 3rd warning.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `vehicle_id` | `INTEGER` | No | — | Foreign key — the vehicle this warning is against |
| `violation_id` | `INTEGER` | No | — | Foreign key — the specific violation that triggered this warning |
| `issued_by_user_id` | `INTEGER` | No | — | Foreign key — the officer who triggered the warning (via violation submission) |
| `warning_number` | `INTEGER` | No | — | Which warning this is for this vehicle: `1`, `2`, or `3` |
| `notes` | `TEXT` | Yes | NULL | Optional notes attached to the warning |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `issued_at` | `TIMESTAMPTZ` | No | `NOW()` | When this warning was issued |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record creation timestamp |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique warning ID |
| `NOT NULL` | `vehicle_id`, `violation_id`, `issued_by_user_id`, `warning_number` | Always required |
| `CHECK` | `warning_number` | Only values 1, 2, or 3 are valid: `CHECK (warning_number IN (1, 2, 3))` |
| `REFERENCES` | `vehicle_id` | Must match an existing `vehicles.id` |
| `REFERENCES` | `violation_id` | Must match an existing `violations.id` |
| `REFERENCES` | `issued_by_user_id` | Must match an existing `users.id` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Issued against a vehicle | Many → 1 | `vehicles` | `vehicle_id` |
| Triggered by a violation | Many → 1 | `violations` | `violation_id` |
| Issued by an officer | Many → 1 | `users` | `issued_by_user_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_warnings_vehicle_id` | `vehicle_id` | Fast lookup of all warnings for a vehicle |
| `idx_warnings_violation_id` | `violation_id` | Find the warning tied to a specific violation |
| `idx_warnings_warning_number` | `warning_number` | Filter by warning stage |

---

### 4.7 `notifications`

**Purpose:** Stores in-app notifications delivered to users. Notifications are generated when violations are updated, warnings are issued, or admins take decisions.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `user_id` | `INTEGER` | No | — | Foreign key — the user who receives this notification |
| `violation_id` | `INTEGER` | Yes | NULL | Foreign key — the violation this notification relates to (if applicable) |
| `type` | `VARCHAR(50)` | No | — | Category of notification (see CHECK constraint below) |
| `title` | `VARCHAR(200)` | No | — | Short heading shown in the notification panel |
| `message` | `TEXT` | No | — | Full notification message body |
| `is_read` | `BOOLEAN` | No | `false` | Whether the user has read/dismissed this notification |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | When this notification was created |
| `read_at` | `TIMESTAMPTZ` | Yes | NULL | When the user marked it as read |

#### Notification Types

| Type Value | Triggered When |
|---|---|
| `warning_issued` | A warning is issued against a vehicle the officer reported |
| `case_updated` | The status of a violation/case changes |
| `admin_decision` | A District Admin makes a decision on a case |
| `account_status_changed` | The officer's account status is changed by an admin |
| `system_alert` | General system-level message from State Admin |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique notification ID |
| `NOT NULL` | `user_id`, `type`, `title`, `message` | Always required |
| `REFERENCES` | `user_id` | Must match an existing `users.id` |
| `REFERENCES` | `violation_id` | Must match an existing `violations.id` (if provided) |
| `CHECK` | `type` | Must be a valid type: `CHECK (type IN ('warning_issued', 'case_updated', 'admin_decision', 'account_status_changed', 'system_alert'))` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Delivered to a user | Many → 1 | `users` | `user_id` |
| Relates to a violation | Many → 1 | `violations` | `violation_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_notifications_user_id` | `user_id` | Fetch all notifications for a specific user |
| `idx_notifications_is_read` | `is_read` | Quickly find unread notifications |
| `idx_notifications_created_at` | `created_at` | Sort notifications by time |

---

### 4.8 `activity_logs`

**Purpose:** The audit trail. Every significant action performed by any user — submitting a violation, making an admin decision, changing a user's status — is recorded here with a timestamp and actor identity. This table is append-only; rows are never updated or deleted.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `user_id` | `INTEGER` | No | — | Foreign key — the user who performed the action |
| `action` | `VARCHAR(100)` | No | — | Machine-readable action name (e.g., `violation_submitted`, `warning_issued`, `admin_decision_made`) |
| `action_description` | `TEXT` | No | — | Human-readable description of what happened |
| `entity_type` | `VARCHAR(50)` | Yes | NULL | What kind of entity was acted on (e.g., `violation`, `user`, `vehicle`) |
| `entity_id` | `INTEGER` | Yes | NULL | The ID of the entity that was acted on |
| `metadata` | `JSONB` | Yes | NULL | Any additional context for this action stored as JSON (e.g., old and new status values) |
| `ip_address` | `VARCHAR(45)` | Yes | NULL | IP address of the request (supports IPv6) |
| `user_agent` | `TEXT` | Yes | NULL | Browser/client information |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | When this log entry was recorded |

> **Note:** This table has NO `updated_at` column. Audit logs are immutable — they are written once and never changed. This protects the integrity of the audit trail.

#### Common Action Values

| Action | When It Is Logged |
|---|---|
| `user_login` | Successful login |
| `user_logout` | User logs out |
| `violation_submitted` | Officer submits a new violation |
| `ai_analysis_completed` | AI finishes analyzing a violation image |
| `warning_issued` | A warning is recorded against a vehicle |
| `case_moved_to_queue` | Violation status moves to verification queue |
| `admin_decision_made` | District Admin makes a case decision |
| `user_status_changed` | Admin changes a user's account status |
| `report_generated` | A report is created |
| `system_mode_changed` | State Admin switches Demo ↔ Production mode |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique log entry ID |
| `NOT NULL` | `user_id`, `action`, `action_description` | Always required |
| `REFERENCES` | `user_id` | Must match an existing `users.id` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Performed by a user | Many → 1 | `users` | `user_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_activity_logs_user_id` | `user_id` | Fetch all actions by a specific user |
| `idx_activity_logs_action` | `action` | Filter logs by action type |
| `idx_activity_logs_entity_type_id` | `entity_type`, `entity_id` | Find all logs for a specific entity (e.g., all logs about violation #42) |
| `idx_activity_logs_created_at` | `created_at` | Sort and filter logs by time |
| `idx_activity_logs_is_demo` | `is_demo` | Separate demo from production audit logs |

---

### 4.9 `reports`

**Purpose:** Stores generated analytics reports. State and District Admins can generate reports (daily summaries, hotspot reports, officer activity). The generated report file is stored in Supabase Storage, and a reference is saved here.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `generated_by_user_id` | `INTEGER` | No | — | Foreign key — the admin who generated this report |
| `district_id` | `INTEGER` | Yes | NULL | Which district this report covers (NULL for statewide reports) |
| `report_type` | `VARCHAR(50)` | No | — | Category of the report (see CHECK constraint below) |
| `title` | `VARCHAR(200)` | No | — | Human-readable title of the report |
| `date_from` | `TIMESTAMPTZ` | No | — | Start of the reporting period |
| `date_to` | `TIMESTAMPTZ` | No | — | End of the reporting period |
| `file_url` | `TEXT` | Yes | NULL | Supabase Storage URL for the exported file (PDF/CSV) |
| `summary_data` | `JSONB` | Yes | NULL | Key summary statistics stored as JSON for quick display without re-reading the file |
| `status` | `VARCHAR(20)` | No | `'generating'` | Report generation status: `generating`, `completed`, `failed` |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | When the report generation was requested |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Last update timestamp |

#### Report Types

| Type Value | Description |
|---|---|
| `daily_summary` | Overview of violations and warnings for a given day |
| `hotspot_analysis` | Map and statistics of high-violation zones |
| `officer_activity` | Per-officer violation and submission counts |
| `vehicle_history` | Full history for a specific vehicle |
| `district_overview` | Aggregated metrics across all stations in a district |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique report ID |
| `NOT NULL` | `generated_by_user_id`, `report_type`, `title`, `date_from`, `date_to`, `status` | Always required |
| `REFERENCES` | `generated_by_user_id` | Must match an existing `users.id` |
| `REFERENCES` | `district_id` | Must match an existing `districts.id` (if provided) |
| `CHECK` | `report_type` | Must be a valid type: `CHECK (report_type IN ('daily_summary', 'hotspot_analysis', 'officer_activity', 'vehicle_history', 'district_overview'))` |
| `CHECK` | `status` | Must be valid: `CHECK (status IN ('generating', 'completed', 'failed'))` |
| `CHECK` | `date_range` | End date must not be before start date: `CHECK (date_to >= date_from)` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Generated by an admin | Many → 1 | `users` | `generated_by_user_id` |
| Covers a district | Many → 1 | `districts` | `district_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_reports_generated_by_user_id` | `generated_by_user_id` | Fetch all reports created by a specific admin |
| `idx_reports_district_id` | `district_id` | Fetch all reports for a district |
| `idx_reports_report_type` | `report_type` | Filter by report category |
| `idx_reports_created_at` | `created_at` | Sort reports by creation date |

---

### 4.10 `hotspots`

**Purpose:** Stores identified high-violation zones. Hotspots are computed by the analytics service by clustering nearby violation embeddings (vector similarity). Each hotspot represents a geographic area where multiple violations have occurred.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `district_id` | `INTEGER` | No | — | Foreign key — the district this hotspot is in |
| `name` | `VARCHAR(200)` | Yes | NULL | Optional human-readable label for this hotspot location |
| `center_latitude` | `DECIMAL(9,6)` | No | — | Latitude of the center point of the hotspot cluster |
| `center_longitude` | `DECIMAL(9,6)` | No | — | Longitude of the center point of the hotspot cluster |
| `radius_meters` | `INTEGER` | No | — | Approximate radius of the hotspot zone in meters |
| `violation_count` | `INTEGER` | No | `0` | Total number of violations in this hotspot |
| `dominant_violation_type` | `VARCHAR(100)` | Yes | NULL | The most frequently occurring violation type in this zone |
| `severity` | `VARCHAR(10)` | No | `'medium'` | Severity classification: `low`, `medium`, `high`, `critical` |
| `first_detected_at` | `TIMESTAMPTZ` | No | `NOW()` | When this hotspot was first identified |
| `last_updated_at` | `TIMESTAMPTZ` | No | `NOW()` | When this hotspot was last recalculated |
| `is_active` | `BOOLEAN` | No | `true` | Whether this hotspot is still considered active |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record creation timestamp |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique hotspot ID |
| `NOT NULL` | `district_id`, `center_latitude`, `center_longitude`, `radius_meters`, `violation_count` | Always required |
| `REFERENCES` | `district_id` | Must match an existing `districts.id` |
| `CHECK` | `severity` | Must be a valid level: `CHECK (severity IN ('low', 'medium', 'high', 'critical'))` |
| `CHECK` | `violation_count` | Cannot be negative: `CHECK (violation_count >= 0)` |
| `CHECK` | `radius_meters` | Must be positive: `CHECK (radius_meters > 0)` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Located in a district | Many → 1 | `districts` | `district_id` |
| Derived from embeddings | 1 → Many | `embeddings` | `embeddings.hotspot_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_hotspots_district_id` | `district_id` | Fetch all hotspots in a district |
| `idx_hotspots_severity` | `severity` | Filter by severity level |
| `idx_hotspots_is_active` | `is_active` | Quickly fetch only active hotspots |
| `idx_hotspots_center_lat_lng` | `center_latitude`, `center_longitude` | Geographic bounding box queries for map display |

---

### 4.11 `ai_analysis_results`

**Purpose:** Stores the raw and processed output of the AI model for each violation image. Every violation gets one AI analysis record. This table preserves full auditability of AI decisions.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `violation_id` | `INTEGER` | No | — | Foreign key — the violation this analysis belongs to. One-to-one relationship |
| `plate_number_detected` | `VARCHAR(20)` | Yes | NULL | Vehicle registration number extracted by OCR from the image |
| `detected_violations` | `JSONB` | Yes | NULL | List of violation types detected by AI, e.g. `["no_helmet", "triple_riding"]` |
| `confidence_scores` | `JSONB` | Yes | NULL | Confidence score per detection, e.g. `{"no_helmet": 0.94, "triple_riding": 0.87}` |
| `helmet_detected` | `BOOLEAN` | Yes | NULL | Specific flag: was a helmet detected (`true`) or not (`false`)? NULL if not applicable |
| `seatbelt_detected` | `BOOLEAN` | Yes | NULL | Specific flag: was a seatbelt visible? |
| `person_count` | `INTEGER` | Yes | NULL | Number of persons detected on the vehicle |
| `mobile_usage_detected` | `BOOLEAN` | Yes | NULL | Was mobile phone usage detected while driving? |
| `wrong_parking_detected` | `BOOLEAN` | Yes | NULL | Was the vehicle parked in a prohibited zone? |
| `raw_model_response` | `JSONB` | Yes | NULL | The complete unmodified response from the AI model, stored for auditability |
| `model_version` | `VARCHAR(50)` | Yes | NULL | Version of the AI model used for this analysis |
| `processing_time_ms` | `INTEGER` | Yes | NULL | How long the AI model took to respond, in milliseconds |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `analyzed_at` | `TIMESTAMPTZ` | No | `NOW()` | When the analysis was completed |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Record creation timestamp |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique analysis ID |
| `UNIQUE` | `violation_id` | Each violation has exactly one AI analysis result |
| `NOT NULL` | `violation_id` | Always required |
| `REFERENCES` | `violation_id` | Must match an existing `violations.id` |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Belongs to exactly one violation | 1 → 1 | `violations` | `violation_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_ai_analysis_violation_id` | `violation_id` | Fast join to get AI result for a violation |
| `idx_ai_analysis_plate_number` | `plate_number_detected` | Find all AI analyses that identified a specific plate |
| `idx_ai_analysis_analyzed_at` | `analyzed_at` | Sort by analysis time |

---

### 4.12 `embeddings`

**Purpose:** Stores vector embeddings generated from violation GPS coordinates. These are used by the pgvector extension in Supabase to perform similarity searches and cluster nearby violations into hotspots. This table enables the AI-powered hotspot detection feature.

> **Beginner Tip — What is a Vector Embedding?**
> A vector embedding is a list of numbers that represents something in mathematical space. Here, we convert GPS coordinates (latitude + longitude) into a 1536-dimensional vector. When two violations happen near each other on the map, their vectors will be "similar" (close together in mathematical space). Supabase pgvector can then find all violations that are geographically close by searching for similar vectors — this is how hotspots are detected.

#### Columns

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `SERIAL` | No | Auto | Primary key |
| `violation_id` | `INTEGER` | No | — | Foreign key — the violation this embedding was generated from |
| `hotspot_id` | `INTEGER` | Yes | NULL | Foreign key — the hotspot this embedding was assigned to after clustering (NULL until a hotspot is identified) |
| `latitude` | `DECIMAL(9,6)` | No | — | Latitude of the violation (copied here for quick reference alongside the vector) |
| `longitude` | `DECIMAL(9,6)` | No | — | Longitude of the violation |
| `embedding` | `vector(1536)` | No | — | The 1536-dimensional vector representation of this location, used for similarity search |
| `metadata` | `JSONB` | Yes | NULL | Optional context stored alongside the embedding (e.g., violation type, timestamp) |
| `is_demo` | `BOOLEAN` | No | `false` | Demo data flag |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | When this embedding was generated |

#### Constraints

| Constraint | Column(s) | Rule |
|---|---|---|
| `PRIMARY KEY` | `id` | Unique embedding ID |
| `UNIQUE` | `violation_id` | Each violation produces exactly one embedding |
| `NOT NULL` | `violation_id`, `latitude`, `longitude`, `embedding` | Always required |
| `REFERENCES` | `violation_id` | Must match an existing `violations.id` |
| `REFERENCES` | `hotspot_id` | Must match an existing `hotspots.id` (if assigned) |

#### Relationships

| Relation | Direction | Table | Column |
|---|---|---|---|
| Generated from a violation | 1 → 1 | `violations` | `violation_id` |
| Assigned to a hotspot | Many → 1 | `hotspots` | `hotspot_id` |

#### Indexes

| Index Name | Column | Reason |
|---|---|---|
| `idx_embeddings_violation_id` | `violation_id` | Fast lookup of embedding for a violation |
| `idx_embeddings_hotspot_id` | `hotspot_id` | Find all embeddings assigned to a hotspot |
| `idx_embeddings_embedding_hnsw` | `embedding` (HNSW) | **Vector similarity index** — enables fast approximate nearest-neighbor search for hotspot clustering. Created using `CREATE INDEX ... USING hnsw (embedding vector_cosine_ops)` |

---

## 5. Relationships at a Glance

This table summarizes all foreign key relationships in the schema.

| Child Table | Child Column | → | Parent Table | Parent Column | On Delete |
|---|---|---|---|---|---|
| `police_stations` | `district_id` | → | `districts` | `id` | RESTRICT |
| `users` | `district_id` | → | `districts` | `id` | SET NULL |
| `users` | `police_station_id` | → | `police_stations` | `id` | SET NULL |
| `violations` | `officer_id` | → | `users` | `id` | RESTRICT |
| `violations` | `vehicle_id` | → | `vehicles` | `id` | SET NULL |
| `violations` | `district_id` | → | `districts` | `id` | RESTRICT |
| `violations` | `police_station_id` | → | `police_stations` | `id` | RESTRICT |
| `violations` | `reviewed_by_user_id` | → | `users` | `id` | SET NULL |
| `warnings` | `vehicle_id` | → | `vehicles` | `id` | RESTRICT |
| `warnings` | `violation_id` | → | `violations` | `id` | RESTRICT |
| `warnings` | `issued_by_user_id` | → | `users` | `id` | RESTRICT |
| `notifications` | `user_id` | → | `users` | `id` | CASCADE |
| `notifications` | `violation_id` | → | `violations` | `id` | SET NULL |
| `activity_logs` | `user_id` | → | `users` | `id` | RESTRICT |
| `reports` | `generated_by_user_id` | → | `users` | `id` | RESTRICT |
| `reports` | `district_id` | → | `districts` | `id` | SET NULL |
| `hotspots` | `district_id` | → | `districts` | `id` | RESTRICT |
| `ai_analysis_results` | `violation_id` | → | `violations` | `id` | CASCADE |
| `embeddings` | `violation_id` | → | `violations` | `id` | CASCADE |
| `embeddings` | `hotspot_id` | → | `hotspots` | `id` | SET NULL |

> **Beginner Tip — What does On Delete mean?**
> - `RESTRICT` — You cannot delete the parent row if child rows reference it. For example, you cannot delete a `district` if any officer is assigned to it.
> - `CASCADE` — If the parent is deleted, all child rows are automatically deleted too. For example, deleting a violation will also delete its AI analysis result.
> - `SET NULL` — If the parent is deleted, the foreign key column in the child row is set to NULL. For example, if a vehicle record is deleted, the `vehicle_id` on existing violations is set to NULL rather than blocking the deletion.

---

## 6. Indexes at a Glance

A complete summary of all indexes across all tables.

| Table | Index Name | Column(s) | Type | Purpose |
|---|---|---|---|---|
| `districts` | `idx_districts_code` | `code` | B-Tree | Lookup by district code |
| `districts` | `idx_districts_name` | `name` | B-Tree | Lookup by district name |
| `police_stations` | `idx_stations_district_id` | `district_id` | B-Tree | All stations in a district |
| `police_stations` | `idx_stations_station_code` | `station_code` | B-Tree | Lookup by station code |
| `users` | `idx_users_pno_number` | `pno_number` | B-Tree (Unique) | Officer lookup by PNO |
| `users` | `idx_users_username` | `username` | B-Tree (Unique) | Login lookup |
| `users` | `idx_users_mobile_number` | `mobile_number` | B-Tree (Unique) | Notification lookup |
| `users` | `idx_users_district_id` | `district_id` | B-Tree | All users in a district |
| `users` | `idx_users_police_station_id` | `police_station_id` | B-Tree | All officers at a station |
| `users` | `idx_users_role` | `role` | B-Tree | Filter by role |
| `users` | `idx_users_status` | `status` | B-Tree | Filter by account status |
| `vehicles` | `idx_vehicles_registration_number` | `registration_number` | B-Tree (Unique) | Vehicle search by plate |
| `vehicles` | `idx_vehicles_warning_count` | `warning_count` | B-Tree | Find high-warning vehicles |
| `vehicles` | `idx_vehicles_owner_mobile` | `owner_mobile` | B-Tree | Lookup by owner phone |
| `violations` | `idx_violations_officer_id` | `officer_id` | B-Tree | My Cases view |
| `violations` | `idx_violations_vehicle_id` | `vehicle_id` | B-Tree | Violations per vehicle |
| `violations` | `idx_violations_district_id` | `district_id` | B-Tree | District Admin view |
| `violations` | `idx_violations_status` | `status` | B-Tree | Filter by status |
| `violations` | `idx_violations_captured_at` | `captured_at` | B-Tree | Sort by date |
| `violations` | `idx_violations_is_demo` | `is_demo` | B-Tree | Demo isolation |
| `warnings` | `idx_warnings_vehicle_id` | `vehicle_id` | B-Tree | Warnings per vehicle |
| `warnings` | `idx_warnings_violation_id` | `violation_id` | B-Tree | Warning for a violation |
| `warnings` | `idx_warnings_warning_number` | `warning_number` | B-Tree | Filter by stage |
| `notifications` | `idx_notifications_user_id` | `user_id` | B-Tree | User's notifications |
| `notifications` | `idx_notifications_is_read` | `is_read` | B-Tree | Unread notifications |
| `notifications` | `idx_notifications_created_at` | `created_at` | B-Tree | Sort by time |
| `activity_logs` | `idx_activity_logs_user_id` | `user_id` | B-Tree | Logs per user |
| `activity_logs` | `idx_activity_logs_action` | `action` | B-Tree | Filter by action |
| `activity_logs` | `idx_activity_logs_entity_type_id` | `entity_type`, `entity_id` | B-Tree (Composite) | Logs per entity |
| `activity_logs` | `idx_activity_logs_created_at` | `created_at` | B-Tree | Sort by time |
| `activity_logs` | `idx_activity_logs_is_demo` | `is_demo` | B-Tree | Demo isolation |
| `reports` | `idx_reports_generated_by_user_id` | `generated_by_user_id` | B-Tree | Reports by admin |
| `reports` | `idx_reports_district_id` | `district_id` | B-Tree | Reports per district |
| `reports` | `idx_reports_report_type` | `report_type` | B-Tree | Filter by type |
| `reports` | `idx_reports_created_at` | `created_at` | B-Tree | Sort by date |
| `hotspots` | `idx_hotspots_district_id` | `district_id` | B-Tree | Hotspots per district |
| `hotspots` | `idx_hotspots_severity` | `severity` | B-Tree | Filter by severity |
| `hotspots` | `idx_hotspots_is_active` | `is_active` | B-Tree | Active hotspots only |
| `hotspots` | `idx_hotspots_center_lat_lng` | `center_latitude`, `center_longitude` | B-Tree (Composite) | Map bounding box |
| `ai_analysis_results` | `idx_ai_analysis_violation_id` | `violation_id` | B-Tree (Unique) | AI result for violation |
| `ai_analysis_results` | `idx_ai_analysis_plate_number` | `plate_number_detected` | B-Tree | Find by plate |
| `ai_analysis_results` | `idx_ai_analysis_analyzed_at` | `analyzed_at` | B-Tree | Sort by time |
| `embeddings` | `idx_embeddings_violation_id` | `violation_id` | B-Tree (Unique) | Embedding for violation |
| `embeddings` | `idx_embeddings_hotspot_id` | `hotspot_id` | B-Tree | Embeddings in hotspot |
| `embeddings` | `idx_embeddings_embedding_hnsw` | `embedding` | **HNSW Vector** | Nearest-neighbor search |

---

## 7. Naming Conventions

All names in this schema follow consistent rules to make the codebase easy to read and maintain.

| Convention | Rule | Example |
|---|---|---|
| **Table names** | Lowercase, plural, snake_case | `police_stations`, `activity_logs` |
| **Column names** | Lowercase, snake_case | `district_id`, `created_at` |
| **Primary keys** | Always named `id` | `id SERIAL PRIMARY KEY` |
| **Foreign keys** | `<referenced_table_singular>_id` | `district_id`, `officer_id` |
| **Timestamp columns** | `_at` suffix | `created_at`, `captured_at`, `reviewed_at` |
| **Boolean flags** | `is_` prefix | `is_demo`, `is_read`, `is_active` |
| **Status columns** | `status` with CHECK constraint | `status VARCHAR(30)` |
| **Index names** | `idx_<table>_<column>` | `idx_users_username` |
| **JSONB columns** | Plural or descriptive noun | `detected_violations`, `confidence_scores`, `metadata` |

---

## 8. Demo vs Production Isolation

Every table has an `is_demo BOOLEAN NOT NULL DEFAULT false` column. This is how demo and production data coexist in the same database without affecting each other.

| Scenario | `is_demo` value |
|---|---|
| Real enforcement data | `false` |
| Demo/training data loaded by `demoSeed.ts` | `true` |

**How it works in practice:**

- All queries in the DAL layer receive a `isDemo: boolean` parameter from the service layer
- Every query adds a `WHERE is_demo = $isDemo` clause (handled automatically by Drizzle ORM)
- The `modeGuard.ts` middleware determines the current mode and passes it down to every request context
- The State Admin can toggle the mode via `PATCH /api/config/mode`, which updates a system config record
- Demo violations, demo vehicles, demo users, and demo logs are all tagged with `is_demo = true` and are never mixed into production queries

> **Important:** Demo data can be freely modified, reset, or wiped by running `demoSeed.ts` again. Production data (`is_demo = false`) is protected by the `modeGuard.ts` middleware which blocks write operations when the system is in Demo Mode.

---

## Appendix — Quick Reference: Allowed Enum Values

| Table | Column | Allowed Values |
|---|---|---|
| `users` | `role` | `traffic_officer`, `district_admin`, `state_admin` |
| `users` | `status` | `pending_verification`, `active`, `deactivated`, `suspended`, `transferred`, `retired`, `rejected` |
| `vehicles` | `vehicle_type` | `two_wheeler`, `four_wheeler`, `auto`, `truck`, `bus`, `other` |
| `violations` | `status` | `pending_ai_review`, `ai_reviewed`, `warning_issued`, `verification_queue`, `challan_recommended`, `rejected`, `closed` |
| `violations` | `admin_decision` | `recommend_challan`, `rejected`, `closed` |
| `warnings` | `warning_number` | `1`, `2`, `3` |
| `notifications` | `type` | `warning_issued`, `case_updated`, `admin_decision`, `account_status_changed`, `system_alert` |
| `reports` | `report_type` | `daily_summary`, `hotspot_analysis`, `officer_activity`, `vehicle_history`, `district_overview` |
| `reports` | `status` | `generating`, `completed`, `failed` |
| `hotspots` | `severity` | `low`, `medium`, `high`, `critical` |

---

*Document prepared for internal development use.*
*Aligned with product.md Version 1.0 and architecture.md Version 1.0.*
*All enforcement decisions remain the authority of designated human officers.*

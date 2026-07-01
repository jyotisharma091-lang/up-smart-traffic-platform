# UP Smart Traffic Enforcement & Management Platform

**Product Requirements Document**
Version 1.1 | Uttar Pradesh Police | Confidential

---

## Overview

The **UP Smart Traffic Enforcement & Management Platform** is an AI-powered solution designed for Uttar Pradesh Police to modernize traffic monitoring, violation detection, and enforcement workflows across the state. The platform enables traffic officers in the field, district administrators managing case queues, and state administrators overseeing operations — all within a unified, role-based system.

---

## Objectives

- Automate traffic violation detection using AI/ML on field-captured images.
- Standardize and digitize the warning-to-challan enforcement workflow.
- Ensure strict data isolation so users only see data relevant to their jurisdiction.
- Support a deployment-ready architecture using Supabase (PostgreSQL).

---

## Roles & Access Flow

The platform operates on a strict hierarchical flow. 

### 1. State Admin
- **Scope**: Entire Uttar Pradesh (All Districts & Commissionerates).
- **Dashboard**: Aggregated reports and analytics for the entire state.
- **Responsibilities**:
  - Manages District Admin users (Create, Update, Delete).
  - Creates the initial password for District Admins.

### 2. District Admin
- **Scope**: Single District only.
- **Onboarding**: Upon their very first login using the password provided by the State Admin, they receive an alert: **"Please change your password"**. They must change their password to proceed.
- **Dashboard**: Reports and analytics restricted to the police stations within their assigned district.
- **Responsibilities**:
  - Manages Traffic Officer users (Create, Update, Delete, Deactivate).
  - Monitors the daily work and submissions of Traffic Officers.
  - **Enforcement Action**: Reviews violations captured by Traffic Officers (which have been analyzed by AI). If valid, sends a warning message to the public.
  - **Challan Issuance**: If the same public member (vehicle) commits 3 violations, the District Admin issues a formal Challan.

### 3. Traffic Officer
- **Scope**: Personal data and submissions only.
- **Onboarding**: Upon first login using the password provided by the District Admin, they must change their password to proceed.
- **Dashboard**: Shows only their own submitted cases, capture history, and violation statuses.
- **Responsibilities**:
  - Captures photos of public members not following traffic rules.
  - Uploads the photo. AI automatically analyzes the image.
  - If AI detects a violation, the details are sent directly to the District Admin for review.

---

## Enforcement Workflow Details

1. **Capture**: Traffic Officer takes a photo.
2. **AI Analysis**: System analyzes the image for number plate, helmet, triple riding, etc.
3. **District Review**: If a violation is flagged, it enters the District Admin's queue.
4. **Warning System**:
   - 1st Offense: District Admin reviews and sends a Warning Message.
   - 2nd Offense: District Admin reviews and sends a 2nd Warning Message.
   - 3rd Offense: District Admin issues a final Challan at the district level.

---

## Authentication & Security

- Login via **Username + Password**.
- **Forced Password Change** logic on first login for District and Traffic users.
- Sessions managed with **JWT** tokens stored in **HttpOnly Cookies**.
- All API endpoints are strictly role-protected. Data is strictly scoped by the `district` and `userId` fields in the database.

---

## Database Architecture (PostgreSQL / Supabase)

All entries are stored directly in Supabase to ensure the application is deployment-ready. Testing or dummy data generated during the development phase will be cleared from Supabase before final deployment.

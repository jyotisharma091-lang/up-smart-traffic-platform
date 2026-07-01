# UP Smart Traffic Platform

A comprehensive, full-stack, state-wide traffic enforcement and analytics platform designed for the Uttar Pradesh Police. This platform streamlines violation capture, administrative verification, and state-level analytics.

## Features

- **Role-Based Access Control:** Secure, isolated dashboards for Traffic Officers, District Admins, and State Admins.
- **AI Violation Mocking:** Capture vehicle images, automatically parse number plates, and flag repeat offenders using simulated AI algorithms.
- **Verification Queue:** District Admins can review flagged offenses and issue challans.
- **State Analytics:** Real-time heatmaps, offense trends, and statistical reporting at a state-wide level.
- **User Management:** Dynamic tools for State Admins to manage active personnel.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts (TypeScript)
- **Backend:** Node.js, Express.js (TypeScript)
- **Database:** SQLite with Drizzle ORM
- **Authentication:** JWT & bcrypt

## Quick Start Guide

### 1. Launching the App
Simply double-click the **`start.bat`** file located in the root directory. This will automatically boot up both the Backend and Frontend servers in separate command windows.
- The UI will be available at: `http://localhost:5173`
- The API will be available at: `http://localhost:5000`

### 2. Demo Credentials
You can log in to the platform using any of the following mock accounts (Password can be anything, e.g., `123`):

- **Traffic Officer:** `csharma`
- **District Admin:** `asingh_dist`
- **State Admin:** `rkumar_state`

### 3. Installation (If Moved to a New PC)
If you move this project to another computer, simply double-click the **`install.bat`** file to install all necessary dependencies for both the frontend and backend automatically.

## Project Structure
- `/frontend`: React SPA with Tailwind and Vite
- `/backend`: Express API server
- `/backend/src/config/schema.ts`: Drizzle Database Schema
- `/docs`: Product Architecture and PRD documentation

---
*Built as a Minimum Viable Product (MVP) concept.*

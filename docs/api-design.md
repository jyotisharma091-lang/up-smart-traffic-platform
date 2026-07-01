# API Design

## 1. RESTful Principles
- **Base URL:** `/api/v1`
- **Format:** JSON payloads, Zod validation.
- **Auth:** Bearer Token (JWT) in headers + HttpOnly Cookies for sensitive operations.

## 2. API Endpoints Overview

### 2.1 Authentication (`/auth`)
- `POST /auth/login` - Validates credentials, returns JWT.
- `POST /auth/verify-otp` - State Admin email verification.
- `POST /auth/change-password` - Updates user password.
- `POST /auth/logout` - Clears HttpOnly cookie.

### 2.2 Users Management (`/users`)
- `GET /users` - Fetch users (filtered by district for District Admin).
- `POST /users` - Create Traffic Officer (District Admin only).
- `PUT /users/:id` - Update user details/status.
- `PUT /users/:id/reset-password` - Reset officer password.

### 2.3 Vehicles (`/vehicles`)
- `GET /vehicles/:vehicle_number` - Search vehicle details & history.
- `POST /vehicles` - Manual entry of a new vehicle.

### 2.4 Violations (`/violations`)
- `POST /violations` - Create draft/submit violation.
- `GET /violations` - List cases (Role-based filtering applies).
- `GET /violations/:id` - Get case details.
- `PUT /violations/:id/status` - Update case status (e.g., recommend, close).
- `POST /violations/analyze-image` - Triggers AI OpenAI Vision.

### 2.5 Analytics & GIS (`/analytics`)
- `GET /analytics/dashboard` - Top-level metrics.
- `GET /analytics/heatmap` - GeoJSON data for Leaflet maps.

## 3. Middlewares
- **AuthMiddleware:** Validates JWT and populates `req.user`.
- **RoleMiddleware:** Restricts endpoints to specific roles.
- **DistrictMiddleware:** Injects `district` constraint to ensure strict isolation.
- **ValidationMiddleware:** Runs Zod schema against `req.body`.

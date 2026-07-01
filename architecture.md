# UP Smart Traffic Enforcement & Management Platform

**Architecture Document**
Version 1.0 | Uttar Pradesh Police | Internal

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Folder Structure](#2-folder-structure)
   - [Frontend](#21-frontend-folder-structure)
   - [Backend](#22-backend-folder-structure)
3. [Authentication Flow](#3-authentication-flow)
4. [Violation Flow](#4-violation-flow)
5. [AI Flow](#5-ai-flow)
6. [Search Flow](#6-search-flow)
7. [Demo Mode Flow](#7-demo-mode-flow)
8. [Deployment Flow](#8-deployment-flow)

---

## 1. Technology Stack

### Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React + TypeScript | Component-based UI with type safety |
| Build Tool | Vite | Fast development server and production bundler |
| Styling | Tailwind CSS | Utility-first responsive styling |
| UI Components | Shadcn UI | Accessible, pre-built component library |
| Animations | Framer Motion | Micro-animations, transitions, and gesture support |
| HTTP Client | Axios | API communication with interceptors |
| Routing | React Router v6 | Client-side navigation and protected routes |
| State Management | React Context | Auth state, mode state, and notification state |
| Maps | Leaflet | Interactive hotspot and violation location maps |
| PWA | Vite PWA Plugin | Offline capability and mobile install support |

### Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js + ExpressJS | HTTP server and REST API |
| Language | TypeScript | Type safety across all layers |
| Pattern | MVC + Service + DAL | Clean separation of concerns |
| Validation | Zod | DTO schema validation on all incoming requests |
| ORM | Drizzle ORM | Type-safe database queries |
| Auth | JWT + HttpOnly Cookies | Stateless, secure session management |

### Database & Storage

| Service | Purpose |
|---|---|
| Supabase PostgreSQL | Primary relational database |
| Supabase Storage | Image uploads (violation photos) |
| Supabase Vector | AI embedding storage for hotspot detection |

### Deployment

| Service | Hosts |
|---|---|
| GitHub Pages | React frontend (static build) |
| Render | ExpressJS backend (Node.js web service) |
| Supabase | PostgreSQL, Storage, and Vector database |

---

## 2. Folder Structure

### 2.1 Frontend Folder Structure

```
frontend/
├── public/                         # Static assets served as-is
│   ├── icons/                      # PWA icons (192x192, 512x512)
│   ├── manifest.json               # PWA manifest file
│   └── favicon.ico
│
├── src/
│   ├── assets/                     # Images, logos, and static media
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Shadcn UI base components (Button, Input, Badge, etc.)
│   │   ├── layout/                 # Page-level layout wrappers
│   │   │   ├── AppShell.tsx        # Main layout: sidebar + topbar + content
│   │   │   ├── Sidebar.tsx         # Role-aware navigation sidebar
│   │   │   └── Topbar.tsx          # Header with user info and notifications
│   │   ├── shared/                 # Common components used across features
│   │   │   ├── ProtectedRoute.tsx  # Route guard checking auth and role
│   │   │   ├── RoleGuard.tsx       # Inline role-based conditional rendering
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── DemoModeBanner.tsx  # Persistent banner when in demo mode
│   │   │   └── PageHeader.tsx
│   │   └── map/
│   │       ├── HotspotMap.tsx      # Leaflet map with violation clusters
│   │       └── ViolationMarker.tsx
│   │
│   ├── pages/                      # One file per route/screen
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── officer/                # Traffic Officer screens
│   │   │   ├── OfficerDashboard.tsx
│   │   │   ├── CaptureViolation.tsx
│   │   │   ├── MyCases.tsx
│   │   │   └── VehicleSearch.tsx
│   │   ├── district/               # District Admin screens
│   │   │   ├── DistrictDashboard.tsx
│   │   │   ├── VerificationQueue.tsx
│   │   │   ├── CaseDetail.tsx
│   │   │   └── OfficerManagement.tsx
│   │   ├── state/                  # State Admin screens
│   │   │   ├── StateDashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── SystemConfig.tsx
│   │   │   └── Analytics.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.tsx         # User identity, role, and login state
│   │   ├── ModeContext.tsx         # Demo vs Production mode toggle
│   │   └── NotificationContext.tsx # Real-time notification state
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts              # Shortcut to AuthContext
│   │   ├── useMode.ts              # Shortcut to ModeContext
│   │   ├── useViolations.ts        # Fetch and mutate violation data
│   │   ├── useVehicleSearch.ts     # Vehicle lookup hook
│   │   └── useNotifications.ts     # Notification polling/subscription
│   │
│   ├── api/                        # Axios API layer
│   │   ├── axiosClient.ts          # Base Axios instance with interceptors
│   │   ├── authApi.ts              # Login, logout, refresh token
│   │   ├── violationApi.ts         # Submit, list, update violations
│   │   ├── vehicleApi.ts           # Vehicle search endpoints
│   │   ├── caseApi.ts              # Verification queue, admin decisions
│   │   ├── userApi.ts              # User management, profile
│   │   └── analyticsApi.ts         # Dashboard stats, hotspot data
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── violation.types.ts
│   │   ├── user.types.ts
│   │   ├── vehicle.types.ts
│   │   └── analytics.types.ts
│   │
│   ├── utils/                      # Pure utility functions
│   │   ├── formatDate.ts
│   │   ├── formatRole.ts
│   │   ├── gpsCapture.ts           # Browser Geolocation API wrapper
│   │   └── constants.ts            # App-wide constants (roles, statuses)
│   │
│   ├── router/
│   │   └── AppRouter.tsx           # All routes, role guards, and redirects
│   │
│   ├── App.tsx                     # Root component with context providers
│   ├── main.tsx                    # Vite entry point
│   └── index.css                   # Global Tailwind imports and CSS variables
│
├── index.html                      # Vite HTML shell
├── vite.config.ts                  # Vite + PWA plugin configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

---

### 2.2 Backend Folder Structure

```
backend/
├── src/
│   ├── config/                     # Environment and app configuration
│   │   ├── env.ts                  # Typed env variable loader (using dotenv)
│   │   ├── db.ts                   # Drizzle ORM + Supabase connection
│   │   └── supabaseStorage.ts      # Supabase Storage client setup
│   │
│   ├── db/                         # Database schema and migrations
│   │   ├── schema/                 # Drizzle table definitions
│   │   │   ├── users.schema.ts
│   │   │   ├── violations.schema.ts
│   │   │   ├── vehicles.schema.ts
│   │   │   ├── warnings.schema.ts
│   │   │   ├── cases.schema.ts
│   │   │   └── auditLogs.schema.ts
│   │   ├── migrations/             # Auto-generated Drizzle migration files
│   │   └── seed/
│   │       ├── demoSeed.ts         # Synthetic demo data seeder
│   │       └── runSeed.ts          # Seed runner script
│   │
│   ├── modules/                    # Feature modules (MVC organized per domain)
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts  # Route handlers: login, logout, refresh
│   │   │   ├── auth.service.ts     # Business logic: verify credentials, issue JWT
│   │   │   ├── auth.dal.ts         # Data access: find user by username
│   │   │   ├── auth.routes.ts      # Express router for /api/auth
│   │   │   └── auth.dto.ts         # Zod schemas: LoginDto
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts    # CRUD, status transitions, role checks
│   │   │   ├── users.dal.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.dto.ts        # Zod schemas: CreateUserDto, UpdateStatusDto
│   │   │
│   │   ├── violations/
│   │   │   ├── violations.controller.ts
│   │   │   ├── violations.service.ts  # Submit, list, trigger AI, update status
│   │   │   ├── violations.dal.ts
│   │   │   ├── violations.routes.ts
│   │   │   └── violations.dto.ts      # Zod schemas: CreateViolationDto
│   │   │
│   │   ├── vehicles/
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── vehicles.service.ts    # Search by registration, warning count
│   │   │   ├── vehicles.dal.ts
│   │   │   ├── vehicles.routes.ts
│   │   │   └── vehicles.dto.ts
│   │   │
│   │   ├── cases/
│   │   │   ├── cases.controller.ts
│   │   │   ├── cases.service.ts    # Verification queue, admin decisions
│   │   │   ├── cases.dal.ts
│   │   │   ├── cases.routes.ts
│   │   │   └── cases.dto.ts        # Zod schemas: CaseDecisionDto
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts       # Calls external AI model, parses results
│   │   │   ├── ai.routes.ts
│   │   │   └── ai.dto.ts
│   │   │
│   │   └── analytics/
│   │       ├── analytics.controller.ts
│   │       ├── analytics.service.ts   # Aggregations, hotspot computation
│   │       ├── analytics.dal.ts
│   │       └── analytics.routes.ts
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── authenticate.ts         # JWT cookie verification middleware
│   │   ├── authorize.ts            # Role-based access middleware
│   │   ├── validate.ts             # Zod DTO validation middleware
│   │   ├── errorHandler.ts         # Global error handler
│   │   ├── auditLogger.ts          # Logs every mutation with user + timestamp
│   │   └── modeGuard.ts            # Blocks write operations in demo mode
│   │
│   ├── utils/                      # Pure utility functions
│   │   ├── hashPassword.ts         # bcrypt helpers
│   │   ├── jwtUtils.ts             # Sign and verify JWT tokens
│   │   ├── uploadImage.ts          # Supabase Storage upload helper
│   │   └── apiResponse.ts          # Standardized API response shape
│   │
│   └── app.ts                      # Express app setup, route mounting
│   └── server.ts                   # HTTP server entry point
│
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Template for required env variables
├── drizzle.config.ts               # Drizzle ORM configuration
├── tsconfig.json
└── package.json
```

---

## 3. Authentication Flow

This flow covers how a user logs in, how their session is maintained, and how the system enforces role-based access on every request.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

 STEP 1 — Login Request
 ──────────────────────
  User enters Username + Password on LoginPage.tsx
       │
       ▼
  authApi.ts → POST /api/auth/login
       │
       ▼
  auth.dto.ts (Zod) validates the request body shape
       │
       ▼
  auth.service.ts
    ├── Queries auth.dal.ts → finds user by username in DB
    ├── Verifies hashed password with bcrypt
    ├── Checks user status === "Active" (rejects Pending, Deactivated, etc.)
    └── Signs a short-lived JWT containing { userId, role, district }


 STEP 2 — Token Delivery
 ────────────────────────
  Backend sets the JWT in an HttpOnly Cookie (not accessible via JavaScript)
  Response body contains: { role, fullName, district } — no token in body
       │
       ▼
  AuthContext.tsx receives the user profile and stores it in React state
  React Router redirects the user to their role-specific dashboard


 STEP 3 — Authenticated Requests
 ─────────────────────────────────
  Every Axios request automatically sends the cookie (withCredentials: true)
       │
       ▼
  authenticate.ts middleware runs on every protected route:
    ├── Reads JWT from cookie
    ├── Verifies signature and expiry
    └── Attaches { userId, role } to req.user

  authorize.ts middleware runs on role-restricted routes:
    └── Checks req.user.role against the allowed roles for that route


 STEP 4 — Token Refresh
 ───────────────────────
  Axios response interceptor in axiosClient.ts detects 401 Unauthorized
       │
       ▼
  Calls POST /api/auth/refresh
    ├── If refresh token is valid → issues a new access token cookie
    └── If refresh token is expired → clears cookies, redirects to /login


 STEP 5 — Logout
 ─────────────────
  User clicks Logout → authApi.ts calls POST /api/auth/logout
  Backend clears both cookies (access + refresh)
  AuthContext resets state → React Router redirects to /login


 PROTECTED ROUTE BEHAVIOR (Frontend)
 ─────────────────────────────────────
  ProtectedRoute.tsx wraps every route in AppRouter.tsx
    ├── If AuthContext has no user → redirect to /login
    └── If user role doesn't match route → redirect to /unauthorized
```

---

## 4. Violation Flow

This flow covers the complete lifecycle of a traffic violation — from field capture by a Traffic Officer to the final enforcement decision by a District Admin.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            VIOLATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

 STEP 1 — Capture (Traffic Officer — Field)
 ───────────────────────────────────────────
  Officer opens CaptureViolation.tsx on their mobile device
    ├── Takes photo via camera or selects from gallery
    ├── GPS coordinates captured automatically via gpsCapture.ts
    └── Officer fills in the structured violation form:
          • Vehicle registration number
          • Violation type (or leaves it for AI to detect)
          • Location description
          • Date and time (auto-filled)


 STEP 2 — Image Upload
 ──────────────────────
  violationApi.ts sends a multipart/form-data POST to /api/violations
    ├── validate.ts middleware checks the DTO against CreateViolationDto (Zod)
    ├── uploadImage.ts uploads the image to Supabase Storage
    └── violations.dal.ts saves the violation record to PostgreSQL with:
          • imageUrl (from Supabase Storage)
          • gpsCoordinates, officerId, vehicleId, timestamp
          • status = "Pending AI Review"


 STEP 3 — AI Analysis (automatic, see AI Flow section)
 ──────────────────────────────────────────────────────
  ai.service.ts processes the image and returns detection results
    └── violation record is updated with:
          • detectedViolations[] — list of AI-identified violations
          • confidence scores
          • status = "AI Reviewed"


 STEP 4 — Warning Issuance
 ──────────────────────────
  violations.service.ts checks the vehicle's warning count in DB
    ├── 1st offense → record 1st Warning, notify officer
    ├── 2nd offense → record 2nd Warning, alert officer
    └── 3rd offense → record 3rd Warning → status = "Verification Queue"
                      case is now visible to District Admin


 STEP 5 — Verification Queue (District Admin)
 ─────────────────────────────────────────────
  District Admin opens VerificationQueue.tsx
    ├── Sees all cases with status = "Verification Queue" in their district
    └── Opens CaseDetail.tsx to review:
          • Original photo
          • AI detection output
          • Officer's notes
          • Full warning history for this vehicle


 STEP 6 — Admin Decision
 ─────────────────────────
  District Admin submits a decision via caseApi.ts → PATCH /api/cases/:id
  cases.service.ts processes the decision:
    ├── Recommend Challan → status = "Challan Recommended"
    │     └── auditLogger.ts logs action with admin identity + timestamp
    ├── Reject Case → status = "Rejected", warning count reset or adjusted
    └── Close Case → status = "Closed", no further action


 STEP 7 — Officer Notification
 ──────────────────────────────
  NotificationContext.tsx on the officer's frontend receives the update
    └── Notification appears in their Notifications panel and dashboard
```

---

## 5. AI Flow

This flow describes how AI analysis is triggered, processed, and stored after a violation image is submitted.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                               AI FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

 IMPORTANT: AI detection runs server-side only.
 The frontend never calls an AI model directly.
 AI results are advisory — no enforcement action is automated.


 STEP 1 — Trigger
 ─────────────────
  After a violation image is saved (see Violation Flow Step 2),
  violations.service.ts calls ai.service.ts with:
    • imageUrl (Supabase Storage URL)
    • vehicleRegistration (if officer provided it)


 STEP 2 — Detection Tasks
 ─────────────────────────
  ai.service.ts sends the image to the configured AI/ML model endpoint.
  The following detections are requested in a single call where possible:

    ┌─────────────────────────────────────────────────────────────┐
    │  Detection           │  What the AI looks for               │
    ├─────────────────────────────────────────────────────────────┤
    │  Number Plate OCR    │  Extract registration text from image │
    │  Helmet Detection    │  Rider head — helmet present/absent   │
    │  Seatbelt Detection  │  Driver torso — belt visible/absent   │
    │  Triple Riding       │  Count of persons on two-wheeler      │
    │  Wrong Parking       │  Vehicle position vs. road markings   │
    │  Mobile Usage        │  Hand holding device while driving    │
    └─────────────────────────────────────────────────────────────┘


 STEP 3 — Response Parsing
 ──────────────────────────
  ai.service.ts parses the AI model's response and normalizes it into:
    {
      plateNumber:         string | null,
      detectedViolations:  string[],       // e.g. ["no_helmet", "triple_riding"]
      confidenceScores:    Record<string, number>,
      rawModelResponse:    object          // stored for auditability
    }


 STEP 4 — Hotspot Embedding
 ────────────────────────────
  If GPS coordinates are available:
    └── ai.service.ts creates a vector embedding for the location
        and stores it in Supabase Vector for hotspot clustering


 STEP 5 — DB Update
 ────────────────────
  violations.dal.ts updates the violation record with all AI results
  violations.service.ts proceeds to the Warning Issuance step


 STEP 6 — Hotspot Detection (Analytics)
 ───────────────────────────────────────
  analytics.service.ts periodically queries Supabase Vector:
    └── Clusters nearby violation embeddings to identify hotspot zones
    └── Hotspot data is surfaced on HotspotMap.tsx for District and State Admins
```

---

## 6. Search Flow

This flow covers how a Traffic Officer searches for a vehicle by registration number in the field.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             SEARCH FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

 STEP 1 — Officer Input
 ───────────────────────
  Officer opens VehicleSearch.tsx
    └── Types or scans a vehicle registration number


 STEP 2 — API Request
 ──────────────────────
  useVehicleSearch.ts hook calls vehicleApi.ts
    └── GET /api/vehicles/search?registration=UP32AB1234
          • authenticate.ts verifies the JWT cookie
          • authorize.ts confirms the user has at least Officer role


 STEP 3 — Backend Processing
 ────────────────────────────
  vehicles.controller.ts receives the request
    ├── validate.ts checks the query param against VehicleSearchDto (Zod)
    └── vehicles.service.ts calls vehicles.dal.ts:
          • Searches vehicles table by registration number
          • Fetches associated warnings and violation history
          • Returns vehicle details + warning count + case status


 STEP 4 — Response Rendering
 ─────────────────────────────
  VehicleSearch.tsx displays:
    ├── Vehicle details (registration, type, owner — if available)
    ├── Total warning count (1st / 2nd / 3rd)
    ├── Active case status (if any)
    └── Recent violation history (dates, types, officer)


 DEMO MODE BEHAVIOR
 ───────────────────
  If ModeContext is Demo:
    └── vehicles.service.ts returns synthetic vehicle data from the demo seed
        No real vehicle records are queried or modified
```

---

## 7. Demo Mode Flow

This flow explains how the platform switches between Demo and Production modes, and how each part of the system respects that boundary.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEMO MODE FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

 PURPOSE
 ────────
  Demo Mode provides a fully functional, pre-loaded environment for:
    • Officer training and onboarding
    • Stakeholder demonstrations
    • Safe testing without affecting live data

  Demo and Production data are fully isolated — different dataset,
  same codebase, same API, same roles.


 STEP 1 — Mode Configuration (State Admin)
 ──────────────────────────────────────────
  State Admin navigates to SystemConfig.tsx
    └── Toggles the system mode between Demo and Production
    └── PATCH /api/config/mode → updates the mode flag in the database
        (Only State Admin role can change this setting)


 STEP 2 — Backend Mode Enforcement
 ───────────────────────────────────
  modeGuard.ts middleware is applied to all write routes (POST, PATCH, DELETE)
    ├── Reads the current mode from the database or cache
    ├── In Demo Mode:
    │     └── Redirects writes to the demo dataset (isolated tables/rows)
    │         or returns synthetic responses without persisting to production
    └── In Production Mode:
          └── All writes go to the live dataset normally


 STEP 3 — Demo Seed Data
 ─────────────────────────
  demoSeed.ts populates the demo dataset with:
    ├── Pre-created Officers, District Admins, and State Admin accounts
    ├── Synthetic vehicles with varied warning counts (1st, 2nd, 3rd)
    ├── Sample violation images (stored in a demo Supabase Storage bucket)
    ├── Pre-computed AI detection results
    ├── Cases in each status (Pending, Verification Queue, Closed, etc.)
    └── Hotspot data for map demonstrations


 STEP 4 — Frontend Mode Awareness
 ──────────────────────────────────
  ModeContext.tsx fetches the current mode from /api/config/mode on app load
    ├── Stores mode ("demo" | "production") in React context
    └── DemoModeBanner.tsx renders a persistent top banner in Demo Mode:
          "⚠ Demo Mode — No real data is being used or affected"


 STEP 5 — Mode-Specific Behavior Summary
 ─────────────────────────────────────────
  ┌─────────────────────────────────┬────────────────────┬─────────────────────┐
  │  Feature                        │  Demo Mode         │  Production Mode    │
  ├─────────────────────────────────┼────────────────────┼─────────────────────┤
  │  Login                          │  Demo credentials  │  Real officer creds │
  │  Violation submission           │  Saved to demo DB  │  Saved to live DB   │
  │  AI detection                   │  Pre-computed stub │  Live model call    │
  │  Vehicle search                 │  Synthetic data    │  Real vehicle data  │
  │  Warning & case progression     │  Demo dataset only │  Live enforcement   │
  │  Audit trail                    │  Demo logs only    │  Full legal audit   │
  │  Challan recommendations        │  Non-binding       │  Enforcement action │
  └─────────────────────────────────┴────────────────────┴─────────────────────┘
```

---

## 8. Deployment Flow

This flow explains how the application is built, deployed, and served across GitHub Pages (frontend), Render (backend), and Supabase (database).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEPLOYMENT FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

 ARCHITECTURE OVERVIEW
 ──────────────────────

  ┌──────────────┐      HTTPS        ┌──────────────────┐
  │ GitHub Pages │ ◄────────────── │  Browser / PWA   │
  │  (Frontend)  │                  └──────────────────┘
  └──────┬───────┘
         │  REST API calls (HTTPS)
         ▼
  ┌──────────────┐
  │    Render    │      ┌──────────────────────────────────┐
  │  (Backend)   │ ◄──► │         Supabase                │
  │  ExpressJS   │      │  ├── PostgreSQL (primary DB)    │
  └──────────────┘      │  ├── Storage (images)           │
                        │  └── Vector (hotspot embeddings)│
                        └──────────────────────────────────┘


 FRONTEND DEPLOYMENT (GitHub Pages)
 ────────────────────────────────────
  1. Developer pushes code to the main branch on GitHub
  2. GitHub Actions workflow triggers automatically:
       a. Install dependencies:    npm install
       b. Type-check:              npx tsc --noEmit
       c. Build production bundle: npm run build
            └── Vite outputs to /dist with hashed filenames
  3. GitHub Actions deploys /dist to the gh-pages branch
  4. GitHub Pages serves the static files at:
       https://<org>.github.io/<repo-name>/
  5. vite.config.ts sets `base` to the correct repository sub-path
  6. React Router uses hash-based routing (#) to work with GitHub Pages
       (GitHub Pages does not support server-side URL rewriting)

  PWA Behavior:
    └── vite-plugin-pwa generates service worker and manifest
    └── Officers can "Add to Home Screen" for an app-like experience
    └── Service worker caches the app shell for offline access


 BACKEND DEPLOYMENT (Render)
 ────────────────────────────
  1. Developer pushes code to the main branch on GitHub
  2. Render detects the push via GitHub integration (auto-deploy)
  3. Render runs the build command:
       npm install && npx tsc
  4. Render starts the server with:
       node dist/server.js
  5. Environment variables are configured in the Render dashboard:
       DATABASE_URL, SUPABASE_URL, SUPABASE_KEY,
       JWT_SECRET, REFRESH_TOKEN_SECRET, AI_MODEL_URL,
       FRONTEND_ORIGIN (for CORS), NODE_ENV

  CORS Configuration:
    └── Backend allows requests only from the GitHub Pages origin
    └── Credentials: true (required for cookie-based auth)

  Cookie Configuration:
    └── sameSite: "none"   (cross-site: GH Pages → Render)
    └── secure: true       (HTTPS only)
    └── httpOnly: true      (not accessible via JavaScript)


 DATABASE SETUP (Supabase)
 ──────────────────────────
  1. Create a Supabase project (free tier sufficient for v1.0)
  2. Run Drizzle migrations to create all tables:
       npx drizzle-kit push
  3. Configure Supabase Storage:
       └── Create two buckets: "violations-production" and "violations-demo"
       └── Set bucket policies: backend service role only (no public access)
  4. Enable pgvector extension in Supabase for hotspot embeddings:
       └── Dashboard → Database → Extensions → enable "vector"
  5. Connection string is added to Render's environment variables


 ENVIRONMENT FILES
 ──────────────────
  Backend .env.example (committed to repo as documentation):

    # Server
    PORT=3000
    NODE_ENV=production

    # Database
    DATABASE_URL=postgresql://...

    # Supabase
    SUPABASE_URL=https://xxx.supabase.co
    SUPABASE_SERVICE_KEY=eyJ...

    # Auth
    JWT_SECRET=your-secret-here
    JWT_EXPIRES_IN=15m
    REFRESH_TOKEN_SECRET=your-refresh-secret-here
    REFRESH_TOKEN_EXPIRES_IN=7d

    # AI Model
    AI_MODEL_URL=https://your-ai-model-endpoint.com

    # CORS
    FRONTEND_ORIGIN=https://<org>.github.io


 DEPLOYMENT CHECKLIST (First Deploy)
 ──────────────────────────────────────
  □  Supabase project created and DATABASE_URL copied
  □  pgvector extension enabled in Supabase
  □  Storage buckets created (production + demo)
  □  Drizzle migrations run: npx drizzle-kit push
  □  Demo seed data loaded: npx ts-node src/db/seed/runSeed.ts
  □  Render service created, environment variables set
  □  Backend deployed and health check passing: GET /api/health
  □  Frontend vite.config.ts base path set to GitHub repo name
  □  GitHub Actions workflow file created (.github/workflows/deploy.yml)
  □  GitHub Pages enabled on the gh-pages branch
  □  CORS tested: frontend can reach backend with cookies
  □  Login tested for all three roles in both Demo and Production
```

---

## Appendix — Key Design Principles

| Principle | Implementation |
|---|---|
| **Beginner Friendly** | One file per route, one module per feature, named exports everywhere, verbose comments in complex files |
| **Clean Folder Structure** | Feature-first organization (modules/ on backend, pages/ on frontend), no deeply nested paths |
| **Easy Maintenance** | DTOs validate every input at the boundary, service layer owns all business logic, DAL owns all DB queries — no logic leaks |
| **Detailed Documentation** | Every module has a header comment explaining its purpose, every env variable has a description in .env.example, this architecture.md serves as the living reference |
| **Secure by Design** | JWT in HttpOnly cookies, Zod validation on all inputs, role middleware on all routes, audit log on all mutations |
| **Human Oversight** | No automated enforcement — AI detects, humans decide. Enforced at the service layer, not just the UI |

---

*Architecture prepared for internal development use.*
*Aligned with product.md Version 1.0.*

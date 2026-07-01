# Project Folder Structure

## 1. Root Structure
```text
root/
├── frontend/        # React SPA
├── backend/         # Express API
└── docs/            # Project Documentation
```

## 2. Frontend Structure
```text
frontend/src/
├── apis/            # Axios instances and interceptors
├── components/      # Reusable UI components (Shadcn, generic)
├── constants/       # App constants, API routes, Roles
├── context/         # React Context (Auth, Theme)
├── hooks/           # Custom React hooks
├── layouts/         # Layout wrappers (AuthLayout, DashboardLayout)
├── pages/           # Page components grouped by role (state, district, officer)
├── router/          # React Router definitions and route guards
├── services/        # Service abstractions for API calls
├── types/           # TypeScript interfaces and types
└── utils/           # Helper functions
```

## 3. Backend Structure
```text
backend/src/
├── apps/
│   ├── auth/        # Authentication module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   └── routes/
│   ├── users/       # User management module
│   ├── vehicles/    # Vehicle registry module
│   ├── violations/  # Traffic cases module
│   ├── analytics/   # Dashboards and heatmaps
│   ├── reports/     # PDF/Excel export generation
│   └── notifications/ # In-app notification system
├── config/          # DB connection, Env validation
├── middlewares/     # Auth, Role, Error, Validation middlewares
└── utils/           # Helper functions, logger
```
*Note: No `index.ts` barrel exports are used in module directories to maintain explicit imports and avoid circular dependencies.*

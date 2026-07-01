# Security & Compliance

## 1. Authentication & Authorization
- **JWT (JSON Web Tokens):** Short-lived access tokens.
- **HttpOnly Cookies:** Protection against XSS attacks for token storage.
- **Password Hashing:** Argon2 or bcrypt used for secure credential storage.
- **Role-Based Access Control (RBAC):** Strict routing and API middleware based on User Role.

## 2. District Isolation architecture
- **Backend Middleware:** Enforces data access by implicitly wrapping queries with the `district` value found in the validated JWT.
- **Row Level Security (RLS):** Supabase database policies ensure that even if an API flaw exists, the DB engine rejects unauthorized row access based on the user context.

## 3. Data Protection
- **Input Validation:** Zod schemas applied to all incoming API requests to prevent SQL Injection and NoSQL injections.
- **CORS Configuration:** Restricted strictly to allowed frontend domains.
- **Rate Limiting:** Protects `/auth` endpoints from brute-force attacks.

## 4. Audit Logging
- **Activity Tracking:** Every sensitive action (Login, Password Reset, Status Change, Verification Queue actions) is logged in the `audit_logs` table.
- Contains Timestamp, User ID, Action Type, Entity ID, and JSON context.

## 5. Network Security
- All communications enforced over HTTPS/TLS.
- Security Headers (Helmet.js) implemented on the Express server.

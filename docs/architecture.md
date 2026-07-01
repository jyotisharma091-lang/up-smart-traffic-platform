# System Architecture

## 1. High-Level Overview
ATIP is built on a modern, decoupled client-server architecture using TypeScript across the entire stack.

- **Frontend:** React SPA built with Vite.
- **Backend:** Node.js/Express RESTful API.
- **Database:** Supabase (PostgreSQL).
- **AI Services:** OpenAI Vision API for image analysis.
- **Deployment:** Frontend on GitHub, Backend on Render, DB on Supabase.

## 2. Frontend Architecture
- **Framework:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS, Shadcn UI, Framer Motion.
- **State Management:** React Context API (No Redux/Zustand).
- **Routing:** React Router (Role-based protected routes).
- **Data Fetching:** Axios instance with interceptors for JWT handling.
- **Mapping:** Leaflet Maps for GIS and Heatmaps.

## 3. Backend Architecture
- **Framework:** ExpressJS + TypeScript.
- **Architecture Pattern:** MVC (Model-View-Controller) layered with Service & DAL (Data Access Layer).
- **Validation:** Zod for request payloads and DTOs.
- **ORM:** Drizzle ORM connecting to PostgreSQL.
- **Authentication:** JWT, HttpOnly Cookies.
- **Module Structure:** Domain-driven structure (auth, users, vehicles, violations, analytics). No barrel files (`index.ts`).

## 4. Database Architecture
- **Provider:** Supabase PostgreSQL.
- **Storage:** Supabase Storage for violation evidence photos.
- **Vector DB:** Supabase Vector for potential similarity search in the future.
- **Isolation:** Row Level Security (RLS) policies for district isolation.

## 5. AI Module Integration
- **Service:** OpenAI Vision via Backend API.
- **Workflow:** Frontend uploads image to Backend/Supabase -> Backend triggers OpenAI Vision -> AI returns JSON payload (Type, Vehicle Number, Confidence) -> Backend forwards to Frontend for Officer Review.

## 6. District Isolation Architecture
Isolation is the core tenant of the platform:
- **Database Level:** Data models contain `district_id`. Supabase RLS ensures queries automatically filter by the user's district (unless State Admin).
- **API Level:** Backend middleware injects `district` from JWT into DB queries.
- **UI Level:** Context API and Route Guards prevent unauthorized views.

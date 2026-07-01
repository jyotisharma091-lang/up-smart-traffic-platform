# Deployment Strategy

## 1. Environment Setup
The platform uses `.env` files for managing environment-specific variables (Dev, Staging, Prod).
- `NODE_ENV`
- `DATABASE_URL` (Supabase)
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`

## 2. Frontend Deployment (GitHub)
- **Host:** GitHub Pages or GitHub-integrated platforms (Vercel/Netlify) if configured as such, though GitHub Pages is suitable for the compiled Vite output.
- **Workflow:** Push to `main` branch triggers GitHub Actions to build the Vite project and deploy the static assets.

## 3. Backend Deployment (Render)
- **Host:** Render (Web Service).
- **Runtime:** Node.js.
- **Build Command:** `npm run build` (compiles TypeScript).
- **Start Command:** `npm run start` (runs compiled `server.js`).
- **Scale:** Containerized environment supporting horizontal scaling as traffic increases.

## 4. Database & Storage (Supabase)
- **PostgreSQL:** Fully managed, highly available database.
- **Storage:** S3-compatible buckets for violation evidence images.
- **Migration:** Drizzle ORM handles schema migrations locally, applied to Supabase via CI/CD.

## 5. CI/CD Workflow
- Standardized GitHub Actions pipeline.
- Linting and Type Checking on PR creation.
- Automated deployments to Render and static hosts upon merge to `main`.

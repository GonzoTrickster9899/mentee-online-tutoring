# Vercel Deployment Guide — Mentee Online Tutoring

## Recommended topology

Deploy three Vercel projects from the same Git repository. This matches the existing repository boundaries and makes each application independently deployable.

| Vercel project | Root directory | Framework | Build command | Output directory |
|---|---|---|---|---|
| Public website | `frontend` | Vite | `npm run build` | `dist` |
| Admin + tutor dashboard | `admin` | Vite | `npm run build` | `dist` |
| Backend API | `backend` | Express / Node.js | Use Vercel Express framework detection; verify build settings | Not applicable |

Use your preferred project names and custom domains. Suggested domains are `www.example.com`, `admin.example.com`, and `api.example.com`; these are examples, not existing deployments.

## Before importing to Vercel

1. Rotate all credentials that appeared in the original ZIP. Never deploy with the old `.env` values.
2. Remove `.env` files from Git tracking and add ignore rules. Keep only `.env.example` files with empty or placeholder values.
3. Remove generated `node_modules/`, `.vite/`, `dist/`, and local cache folders from Git tracking. Keep `package-lock.json` files.
4. Fix the application security and payment findings in the prompts before production launch.
5. Confirm the Express backend is ready for Vercel: database connection readiness must be handled before database operations; errors must be returned safely.
6. Confirm Stripe test-mode webhooks and payment lifecycle are implemented and tested before enabling live payments.

The previous ZIP included `.env` files containing credentials and generated dependency/cache folders. Do not commit those again.

## Step 1 — Push the cleaned repository to GitHub

- Commit the cleaned source to a Git repository.
- Confirm `frontend/`, `admin/`, and `backend/` are at the repository root.
- Check that `git status` does not show real `.env` files, `node_modules`, `.vite`, or generated output.
- Check Git history as well as the current working tree. Deleting a secret from the latest commit does not remove it from previous history; rotate first and consider history cleanup if credentials were committed.

## Step 2 — Deploy the backend API first

1. Open the Vercel Dashboard and choose **Add New → Project**.
2. Import the same Git repository.
3. In project configuration, set **Root Directory** to `backend`.
4. Use the Express framework detection if Vercel recognizes the Express app. The current code has `backend/server.js` importing Express and uses an `app.listen` pattern; Vercel's current Express documentation supports an Express entrypoint with either a default app export or a port listener.
5. Remove or rename the existing `backend/vercel.json` custom `builds/routes` configuration if relying on current Express framework detection. Do not keep both a legacy custom routing configuration and automatic framework routing unless there is a specific, tested reason.
6. Add backend environment variables (see below) for Preview and Production as appropriate.
7. Deploy.
8. Test the root health route and a safe read-only API route. Do not use live payment or production data for initial smoke tests.

### Backend environment variables

Add these in **Project Settings → Environment Variables** for the backend project only. Use newly rotated credentials.

| Variable | Purpose | Handling |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | Secret |
| `CLDN_NAME` | Cloudinary cloud name | Server-only config |
| `CLDN_API_KEY` | Cloudinary API key | Server-only; restrict access |
| `CLDN_API_SECRET` | Cloudinary API secret | Secret |
| `JWT_SECRET` | JWT signing secret | Secret; generate a long random value |
| `ADMIN_EMAIL` | Initial/configured admin identity | Server-only config |
| `ADMIN_PASS` | Admin credential if current auth design still requires it | Secret; replace with a managed/hashed admin account design where feasible |
| `STRIPE_SECRET_KEY` | Stripe server API key | Secret; start with test key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Secret; add after creating webhook endpoint |
| `CURRENCY` | Session billing currency | Config; e.g. `usd` only if that is the intended business currency |
| `ALLOWED_ORIGINS` | Comma-separated exact frontend and admin origins | Config; no wildcard in production |
| `FRONTEND_URL` | Canonical public frontend URL for server-generated checkout return URLs | Config |
| `ADMIN_URL` | Canonical dashboard origin, if used by API | Config |
| `NODE_ENV` | Runtime environment | Set to `production` for production deployment |

Only configure variables the updated backend actually reads. When adding new variables, update the backend validation/startup checks and the environment template. Do not add secrets to `frontend` or `admin` projects.

### Backend code/config checks

- The current `backend/server.js` calls `connectDB()` without awaiting it. Before launch, refactor database initialization so DB operations cannot run before a successful connection. Use a cached connection promise/connection strategy appropriate for Vercel's serverless runtime.
- Current `connectDB()` catches and logs failure without rethrowing. Fail startup/request initialization safely if the database is unavailable.
- Configure CORS using `ALLOWED_ORIGINS` and allow local origins only in development.
- Avoid using arbitrary `Origin` headers to construct payment redirects; use a validated configured `FRONTEND_URL`.
- Confirm the Express app entrypoint is detected under the configured root directory.
- Ensure request body parsing order supports Stripe webhook signature verification using the raw body.

## Step 3 — Deploy the public frontend

1. Add another Vercel project using the same Git repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `VITE_BACKEND_URL` as the backend deployment origin, for example `https://your-api-domain.vercel.app` (no `/api` suffix; the existing frontend code appends `/api/...`).
7. Deploy.
8. Test the homepage, tutor list, login/register, direct navigation to nested routes, and refresh of nested routes.

Use the provided `deployment/vercel-config/frontend/vercel.json` file as `frontend/vercel.json`. It rewrites SPA paths to `/index.html` so React Router deep links can load.

## Step 4 — Deploy the admin/tutor dashboard

1. Add a third Vercel project using the same Git repository.
2. Set **Root Directory** to `admin`.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `VITE_BACKEND_URL` with the same backend deployment origin.
7. Deploy.
8. Test the admin login, tutor login, dashboard routes, session pages, and direct refresh of nested routes.

Use `deployment/vercel-config/admin/vercel.json` as `admin/vercel.json`.

## Step 5 — Configure final domains and CORS

After Vercel has assigned stable domains or you have added custom domains:

- Put the exact public website origin and dashboard origin in backend `ALLOWED_ORIGINS` (comma-separated, no wildcard).
- Set `FRONTEND_URL` to the canonical public site origin.
- Set `ADMIN_URL` if the backend uses it.
- Redeploy the backend after changing its environment variables.
- Test browser requests from both frontend origins and verify an unrelated origin is rejected.

Do not put trailing paths such as `/api` into the frontend `VITE_BACKEND_URL`; it is the backend origin.

## Step 6 — Configure Stripe webhook

1. Keep Stripe in test mode during initial setup.
2. Create a webhook endpoint pointing to the implemented backend webhook route (the exact route must be confirmed from code; do not guess it).
3. Subscribe only to the payment events the backend actually handles, such as Checkout Session completion and asynchronous payment success/failure where relevant to the chosen payment method.
4. Copy the signing secret into backend `STRIPE_WEBHOOK_SECRET` in Vercel.
5. Redeploy the backend after saving the new environment variable.
6. Use Stripe test tools/CLI to verify valid signatures, failed signatures, repeated events, and delayed/out-of-order events.
7. Confirm the database payment state changes only after a valid signed event and that the frontend retrieves the state from the API.
8. Switch to live Stripe keys and configure the live webhook only after test-mode acceptance criteria pass.

## Step 7 — Environment-variable changes and redeployment

Vercel environment-variable changes apply to new deployments, not already-built deployments. After changing variables, trigger a new deployment for the affected project and verify the deployed runtime uses the new values.

Use separate Preview and Production values. Keep Preview connected to test databases and Stripe test mode; do not reuse production credentials in Preview.

## Step 8 — Smoke test and rollback

Use `PRODUCTION_READINESS_CHECKLIST.md` for the go/no-go decision. If a new release causes failures, use Vercel's deployment history/rollback options and preserve logs for diagnosis. A rollback does not reverse database migrations or Stripe events; plan those separately.

## Optional CLI workflow

The Dashboard flow above is preferred for this project. If using Vercel CLI, link each app directory to its corresponding Vercel project and deploy from the correct directory/project context. Do not run one unconfigured CLI deployment from the repository root and assume it deploys all three apps.

## Official Vercel references

- Express on Vercel: https://vercel.com/docs/frameworks/backend/express
- Vite on Vercel and SPA rewrites: https://vercel.com/docs/frameworks/frontend/vite
- Vercel monorepos: https://vercel.com/docs/monorepos
- Vercel environment variables: https://vercel.com/docs/environment-variables

# Prompt 07 — Vercel-First Deployment Setup

Prepare the existing three-part Mentee Online Tutoring repository for deployment on **Vercel**. Do not deploy to another host. Do not claim a deployment exists unless you have access to the user's Vercel project and have verified it.

## Intended hosting topology

Create three separate Vercel projects connected to the same Git repository:

| Vercel project | Root directory | Framework | Build command | Output |
|---|---|---|---|---|
| mentee-web (name is illustrative) | `frontend` | Vite | `npm run build` | `dist` |
| mentee-admin (name is illustrative) | `admin` | Vite | `npm run build` | `dist` |
| mentee-api (name is illustrative) | `backend` | Express / Node.js | Framework detection; verify package scripts | API function |

The names above are examples only. Use the user's actual Vercel project naming preference if supplied.

## Frontend requirements
- Add the Vercel Vite SPA rewrite to `/index.html` in both `frontend/vercel.json` and `admin/vercel.json`.
- Set `VITE_BACKEND_URL` in each frontend Vercel project to the backend deployment origin, without a trailing `/api` because source callers append `/api/...` paths.
- Ensure `VITE_*` values contain no private credentials.
- Verify deep links and refresh behavior for every React Router route.

## Backend requirements
- Use the current Vercel Express support and ensure the Express entrypoint is recognized from the `backend` project root.
- Review the existing custom `backend/vercel.json`; remove its legacy `builds/routes` settings if framework detection is used. Do not combine conflicting routing strategies.
- Confirm the Express app initializes correctly under serverless execution, and MongoDB connection readiness is handled before a route performs a database operation.
- Set backend-only secrets in the backend Vercel project's environment settings.
- Configure CORS to allow exactly the deployed public and dashboard origins, plus local dev origins only in development.
- Ensure Stripe webhook endpoint is reachable at a stable backend URL and webhook signing secret is configured.

## Environment variables
Use `deployment/env-templates/` as the key list. Configure variables in Vercel Project Settings for Preview and Production separately as appropriate. Never commit actual values. Rotate every credential exposed in the original ZIP. Redeploy after changing environment variables because new values apply to new deployments.

## Deployment sequence
1. Clean repository: remove `.env` files, generated folders, and stale deployment artifacts; commit placeholder templates only.
2. Push to GitHub and ensure the repository default branch is selected.
3. Import the repository as a Vercel project with root `backend`; configure backend secrets; deploy and verify `/` health endpoint and API behavior.
4. Import the same repository again with root `frontend`; set `VITE_BACKEND_URL` to the backend production origin; deploy.
5. Import the same repository again with root `admin`; set the same `VITE_BACKEND_URL`; deploy.
6. Configure CORS origins using the final frontend/admin domains and redeploy the backend.
7. Configure Stripe production keys and webhook endpoint only after test mode is validated.
8. Run the production-readiness checklist and role-based smoke tests.

## Deliverables
- Vercel config files for both Vite SPAs.
- Backend Vercel compatibility changes only if code changes are necessary.
- `docs/deployment/VERCEL_DEPLOYMENT.md` with project settings, environment-variable matrix, domains, webhook, and rollback guidance.
- A post-deployment smoke test report.

## Guardrails
- Do not put `STRIPE_SECRET_KEY`, `JWT_SECRET`, MongoDB credentials, Cloudinary secret, or admin password in frontend environment variables.
- Do not expose a live `.env` in commit output.
- Do not use the old populated env files.
- Do not invent project IDs, domains, or deployment URLs.
- Do not mark production as ready while critical payment/auth/booking issues remain open.

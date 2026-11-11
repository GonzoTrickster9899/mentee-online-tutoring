# Production Readiness Checklist

Do not enable public production use until all Critical items are complete and verified.

## Secrets and repository

- [ ] Rotate MongoDB credentials exposed in the source ZIP.
- [ ] Rotate Cloudinary API key/secret exposed in the source ZIP.
- [ ] Rotate Stripe secret key exposed in the source ZIP; use test/live keys in the correct environments.
- [ ] Generate a new JWT signing secret.
- [ ] Change the exposed administrator credential and verify the admin authentication design.
- [ ] Remove real `.env` files from Git tracking and use placeholder-only `.env.example` files.
- [ ] Check repository history for previously committed secrets; rotate first and clean history if appropriate.
- [ ] Remove `node_modules/`, `.vite/`, `dist/`, and local caches from Git tracking; keep lockfiles.
- [ ] Confirm no secret is referenced by a `VITE_*` variable or bundled into frontend assets.

## Authentication and authorization

- [ ] JWT tokens have finite expiration and invalid/expired tokens return `401`.
- [ ] Role-specific middleware returns `403` for unauthorized role access.
- [ ] Students can access only their own profile and sessions.
- [ ] Students can pay/cancel only their own eligible sessions.
- [ ] Tutors can view/update only sessions and profile information they own.
- [ ] Admin operations are protected server-side.
- [ ] Password hashes are never included in API responses.
- [ ] Login/register endpoints have sensible rate limits.
- [ ] Server-side validation and mass-assignment protection are implemented.

## Booking and payment correctness

- [ ] Concurrent requests cannot reserve the same tutor/date/time slot.
- [ ] Slot cancellation/release is idempotent.
- [ ] Paid-session cancellation/refund policy is defined and enforced.
- [ ] Stripe Checkout amounts/currency are loaded from trusted server data.
- [ ] Stripe webhook signature verification uses the raw request body.
- [ ] Stripe events are processed idempotently.
- [ ] Browser redirects/query parameters cannot mark a session paid.
- [ ] Earnings/revenue use verified payment state and correct completion policy.
- [ ] Stripe test-mode success, failure, duplicate, and delayed-event cases pass.

## Backend and infrastructure

- [ ] MongoDB connection is ready before database-dependent requests execute.
- [ ] Database connection failures are surfaced as controlled service failures.
- [ ] Vercel backend entrypoint is detected and API health route works.
- [ ] Production CORS allowlist contains only deployed frontend/admin origins.
- [ ] File uploads enforce file size/type and use safe storage.
- [ ] Errors are logged without secrets, personal data, or stack traces being sent to clients.
- [ ] Request size limits, security headers, and basic abuse protection are in place.

## Vercel projects

- [ ] Public app project root directory is `frontend`.
- [ ] Admin/tutor app project root directory is `admin`.
- [ ] Backend project root directory is `backend`.
- [ ] Both Vite apps have SPA rewrites to `/index.html`.
- [ ] Each frontend has correct `VITE_BACKEND_URL` for Preview and Production.
- [ ] Backend private environment variables are set in backend project only.
- [ ] Environment changes have been followed by new deployments.
- [ ] Custom domains and HTTPS are configured if applicable.
- [ ] Stripe live webhook points to the production API route.

## QA and operational checks

- [ ] Frontend lint and production builds pass.
- [ ] Backend automated tests replace the placeholder test script and pass.
- [ ] Student registration/login/profile flow passes.
- [ ] Tutor discovery and booking flow passes.
- [ ] Stripe payment test flow passes using webhook-confirmed payment status.
- [ ] Tutor dashboard and tutor actions pass.
- [ ] Admin tutor creation/availability/session management passes.
- [ ] Nested React Router routes load on direct URL and browser refresh.
- [ ] Mobile and desktop responsive checks pass.
- [ ] Logs and monitoring are available; alerting/ownership is assigned.
- [ ] Backup and recovery process for MongoDB is understood.
- [ ] Rollback procedure is documented, including database migration considerations.

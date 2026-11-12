---
name: mentee-online-tutoring
description: Project-specific guidance for auditing, securing, extending, testing, and deploying the existing Mentee Online Tutoring React/Vite, Express, and MongoDB application on Vercel.
---

# Mentee Online Tutoring — Project Skill

## Purpose

Use this skill when working on the existing Mentee Online Tutoring codebase. The goal is to safely improve the current platform while preserving its working behavior and Vercel deployment target.

## Project map

- `frontend/`: public student-facing React + Vite application.
- `admin/`: administrator and tutor dashboard built with React + Vite.
- `backend/`: Express REST API using MongoDB/Mongoose.
- Public and dashboard clients call the backend using `VITE_BACKEND_URL`.
- API route groups are `/api/user`, `/api/tutor`, and `/api/admin`.
- Current integrations include JWT/bcrypt, Cloudinary, and Stripe Checkout.

Read `../../PROJECT_CONTEXT.md` (relative to this skill folder's package root) for the verified architecture, stack, routes, models, capabilities, and known risks. When this skill is copied into another repository, keep the context file accessible or update the reference.

## Non-negotiable rules

1. **Inspect before editing.** Read the actual files, package manifests, lockfiles, route consumers, and configuration. Do not rely only on this summary.
2. **Preserve the architecture.** Keep React + Vite, Express, MongoDB/Mongoose, and the three app directories unless there is a concrete reason to propose a change. Do not rewrite the system or upgrade major packages unnecessarily.
3. **Treat old credentials as compromised.** The reviewed ZIP contained populated environment files. Never reuse, print, commit, or document those values. Require rotation of MongoDB, Cloudinary, Stripe, JWT, and admin credentials.
4. **Do not leak secrets to the browser.** `VITE_*` values are public build-time values. Keep database credentials, Stripe secret/webhook keys, JWT secrets, Cloudinary API secret, and admin password on the backend only.
5. **Secure by default.** Enforce authentication, role authorization, and resource ownership on every protected operation. Validate all inputs server-side. Use explicit CORS origins and safe error handling.
6. **Payment status is server-authoritative.** Never mark a session paid from a return URL, query parameter, or unverified client request. Use Stripe signature-verified webhooks and idempotent event processing.
7. **Booking is concurrency-sensitive.** A read-then-write availability check is not enough. Use atomic slot reservation or a transaction/data model that prevents two simultaneous bookings for the same tutor/time.
8. **Use accurate financial states.** Earnings and revenue must follow verified payment status and the defined completion/refund policy.
9. **Keep changes testable.** Add or update tests for each security, booking, payment, and role behavior changed.
10. **Be honest about verification.** Never claim lint, tests, builds, integrations, or deployment succeeded unless actually executed and checked.

## Working procedure

For every task:

1. Restate scope and acceptance criteria.
2. Inspect the relevant source and frontend callers.
3. Identify security, data-integrity, and backwards-compatibility risks.
4. Implement a focused change.
5. Add/update unit, integration, or end-to-end tests.
6. Run relevant lint/build/test commands.
7. Inspect the final diff for secret leakage, missing authorization, and regressions.
8. Report files changed, checks run and their actual results, migration/configuration steps, and unresolved risks.

## Domain-specific requirements

### Authentication and authorization

- Use finite JWT expiration and consistent claims.
- Return proper 401/403 statuses.
- Students may access only their own session data and actions.
- Tutors may access only sessions assigned to them.
- Administrator-only operations must remain server-protected.
- Whitelist editable model fields; do not accept mass assignment.
- Never return password hashes.

### Booking and cancellation

- Validate tutor availability, date/time, and slot existence on the server.
- Make the reservation operation atomic against concurrent requests.
- Make cancellation idempotent and release a slot exactly once.
- Define how paid bookings are handled before allowing cancellation; do not imply refunds happen if no refund workflow exists.
- Preserve historical session snapshot behavior when changing models.

### Stripe

- Create Checkout Sessions from server-stored amount and currency.
- Store Stripe identifiers and payment lifecycle state.
- Verify webhook signatures using the raw request body.
- Process webhook events idempotently; handle repeated and out-of-order delivery.
- Treat redirects as UX only; fetch payment state from the server.
- Never expose server-side Stripe keys to Vite.

### MongoDB and serverless execution

- Handle connection readiness and failures explicitly.
- Reuse/cache a MongoDB connection across warm invocations where applicable.
- Do not rely on in-memory process state for durable booking/payment state.
- Use transaction semantics only after confirming the MongoDB deployment supports them; otherwise use a suitable atomic document operation/data model.

### Frontend

- Keep existing React Router navigation and UI conventions.
- Provide loading, empty, validation, success, and error states.
- Ensure mobile responsiveness and accessible form controls.
- Use `VITE_BACKEND_URL` as the backend origin; current callers append `/api/...` paths.
- Do not put secrets in public Vite environment variables.

## Vercel deployment standard

Deploy the repository as three Vercel projects connected to the same Git repository:

| Project | Root directory | Runtime/build |
|---|---|---|
| Public frontend | `frontend` | Vite, `npm run build`, output `dist` |
| Admin/tutor dashboard | `admin` | Vite, `npm run build`, output `dist` |
| Backend API | `backend` | Express / Node.js via Vercel's Express support |

For both Vite projects, configure SPA fallback to `/index.html`. Use separate Vercel environment-variable settings for each project and each deployment environment. The frontend apps need only `VITE_BACKEND_URL`; the API project receives private service credentials and its allowed-origin/redirect configuration.

The old backend custom `vercel.json` should be reviewed and normally removed when using current Express framework detection; do not mix custom legacy `builds/routes` and framework routing without a tested reason. Verify the API entrypoint and database readiness before release.

## Ready-to-use project commands

Use the scripts that actually exist in each `package.json`:

- `frontend`: `npm run lint`, `npm run build`
- `admin`: `npm run lint`, `npm run build`
- `backend`: `npm start`; its current test script is a placeholder and must be replaced as part of QA work.

Do not assume a backend test suite exists before inspecting it.

## Completion report format

At the end of work, provide:

- Summary of implemented changes.
- Exact files added/modified.
- Security and data-migration implications.
- Commands executed and actual results.
- Manual Vercel/environment steps still required.
- Known limitations and recommended next phase.

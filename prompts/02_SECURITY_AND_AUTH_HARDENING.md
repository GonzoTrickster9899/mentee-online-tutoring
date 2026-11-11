# Prompt 02 — Security, Authentication, and Authorization Hardening

Harden the existing Mentee Online Tutoring application without changing its overall React/Vite + Express + MongoDB architecture.

## Critical work

### Secrets and repository hygiene
- Remove tracked real `.env` files and add safe placeholder-only `.env.example` files.
- Add root and app-level ignore rules for `.env`, `.env.*`, `.vercel/`, `node_modules/`, `.vite/`, `dist/`, logs, and local uploads; allow `.env.example`.
- Do not echo, log, or reproduce any existing secret.
- Document credential rotation for MongoDB, Cloudinary, Stripe, JWT, and admin login.

### Authentication
- Review user, tutor, and administrator login/token creation and middleware.
- Set explicit finite JWT expiration, issuer/audience where appropriate, and consistent token claims.
- Normalize token header names and frontend usage so they match exactly.
- Return proper `401` for missing/invalid tokens and `403` for authenticated users without permission.
- Hash passwords with bcrypt and ensure password hashes are never returned from API responses.
- Review admin authentication design; avoid insecure comparisons or secrets embedded in client code.
- Add request throttling to login/register and other abuse-prone endpoints.

### Authorization
- Enforce ownership checks for every student session read, pay, cancel, or update.
- Enforce tutor ownership before a tutor can view, complete, or cancel a session.
- Ensure only administrator routes can create tutor accounts or change global tutor availability.
- Validate database IDs and return `404` where a resource does not exist.
- Prevent mass assignment: explicitly whitelist updateable fields.

### API and infrastructure
- Replace unrestricted `cors()` with an allowlist for the public website and dashboard origins, with local development origins only in development.
- Add security headers and appropriate request body/file limits.
- Validate uploaded MIME type, extension, size, and image content; do not trust filename or client-supplied content type alone.
- Avoid returning raw stack traces, database errors, or secrets to clients.
- Add centralized error handling and structured server-side logging with sensitive values redacted.
- Make MongoDB connection failures fail closed; do not serve API requests before database initialization is ready.

## Deliverables
- Implement the fixes in small logical changes.
- Add/update tests for auth, ownership, forbidden role access, validation, and error responses.
- Create `docs/security/SECURITY_HARDENING.md` with threat assumptions, changes, environment variables, credential rotation steps, and remaining risks.
- Update environment templates without real values.

## Acceptance criteria
- Expired, invalid, or absent tokens cannot access protected routes.
- A student cannot access another student's session/payment/cancellation.
- A tutor cannot manage another tutor's session.
- Public users cannot access admin/tutor-only operations.
- CORS rejects unknown origins in production.
- No secrets are present in the tracked diff, logs, or client bundle.
- Database unavailability produces a controlled service error, not false success.
- Lint and relevant tests pass.

Do not modify payment-success semantics in isolation; implement payment correctness with Prompt 03 so the payment lifecycle remains coherent.

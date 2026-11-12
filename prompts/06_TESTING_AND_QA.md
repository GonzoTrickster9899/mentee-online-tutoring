# Prompt 06 — Automated Testing, Regression, and Release QA

Build a practical test strategy for the existing Mentee Online Tutoring codebase. The backend currently has a placeholder test script; inspect the repository before choosing or installing a framework.

## Test coverage priorities

### Backend unit/integration tests
- Student registration, validation, duplicate email handling, login, token expiry.
- Tutor/admin authentication and role restrictions.
- Student resource ownership for session listing, payment, and cancellation.
- Tutor ownership for session list, completion, and cancellation.
- Admin-only tutor management and global session operations.
- Booking slot availability, invalid dates, duplicate requests, and concurrent reservation behavior.
- Cancellation and slot release idempotency.
- Stripe Checkout creation with server-derived amount/currency.
- Stripe webhook invalid signature, successful payment, duplicate event, failure/expiration, and out-of-order delivery.
- Cloudinary upload validation and failure handling (mock external services in automated tests).
- Centralized error handling and CORS behavior.

### Frontend tests
- Route rendering and protected route behavior.
- Student register/login and profile flows.
- Tutor directory filtering and booking interactions.
- Student session status/payment states.
- Admin tutor/session actions.
- Tutor dashboard/session actions.
- Loading, empty, validation, and API error states.

### End-to-end scenarios
1. Student registers, logs in, browses a tutor, and books an available slot.
2. Student pays through Stripe test mode; payment state changes only after webhook processing.
3. Student cannot pay/cancel another student's session.
4. Tutor sees only assigned sessions and can complete eligible sessions.
5. Admin adds a tutor and changes availability.
6. Two users attempting the same slot cannot both reserve it.
7. Cancelled or expired payment flows leave consistent session/slot state.

## Tooling guidance
- Select test tools compatible with the repository and installed versions. Prefer minimal dependencies.
- Use a disposable test database or isolated test database; never run destructive tests against production.
- Mock Stripe and Cloudinary for unit tests; use Stripe test mode/webhook fixtures for integration checks where feasible.
- Keep secrets out of test snapshots and logs.
- Add usable `test`, `test:watch`, and CI scripts where appropriate.

## Deliverables
- Test plan and test data strategy.
- Tests for critical acceptance criteria.
- CI workflow suitable for the repository if the user requests GitHub Actions.
- A QA report with command, result, and any skipped test reason.

Do not claim a test passed unless you actually executed it and observed the result.

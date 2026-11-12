# Booking and Stripe Operations

## Consistency strategy

The `sessions` collection is the source of truth for a reservation. New sessions receive a canonical `activeSlotKey` (`YYYY-MM-DD|HH:mm`) and the schema has a partial unique index on `{ tutId, activeSlotKey }` where `cancelled` is false. MongoDB enforces this index in a single document write, so two concurrent requests cannot create two active sessions for the same tutor and slot.

The existing `tutor.slots_booked` object is retained only for backwards compatibility. Booking and cancellation update it, but `GET /api/tutor/list` rebuilds its returned `slots_booked` value from active sessions. This avoids depending on a cross-document transaction and remains safe on MongoDB deployments that do not support transactions.

Cancellation is idempotent for the same authorized actor. Only unpaid, failed, or expired sessions can be cancelled. Paid, legacy-unverified, completed, and payment-in-progress sessions return `409`; refunds are explicitly not implemented.

## API contract changes

| Endpoint | Change |
|---|---|
| `POST /api/user/book-session` | Validates date, 30-minute time window, one-hour lead time, tutor availability, and authoritative unique reservation. Returns `201` plus the created session. Duplicate active slot returns `409`. |
| `POST /api/user/cancel-session` | Returns idempotent success for an already-cancelled owned session. Blocks paid/payment-in-progress/completed sessions with `409`. |
| `POST /api/tutor/cancel-session`, `POST /api/admin/cancel-session` | Same cancellation policy with tutor/admin-specific resource authorization. |
| `POST /api/user/payment-stripe` | Uses the persisted amount/currency, creates a Stripe Checkout Session with server-configured redirects, and records Checkout state/ID. |
| `GET /api/user/verify-stripe` | Removed. Browser redirects never update payment state. |
| `POST /api/user/stripe-webhook` | New Stripe-only endpoint. It receives the raw payload before JSON parsing, verifies the Stripe signature, and processes event IDs idempotently. |
| Session responses | Include `paymentStatus`; UI should treat only `paid` as confirmed. |

Payment states are `unpaid`, `checkout_creating`, `checkout_created`, `paid`, `failed`, `expired`, `cancelled`, and `legacy_paid_unverified`. Tutor earnings and admin revenue include only sessions that are both `paid` and completed.

## Migration procedure

1. Rotate any credentials previously present in source archives. Do not copy old `.env` files.
2. Back up the database.
3. Run a dry run from `backend`:

   ```powershell
   npm.cmd run migrate:booking-payment
   ```

4. If duplicate active slots are reported, resolve each conflict manually before continuing. The script deliberately does not cancel bookings for you.
5. Run the backfill only after the report is clean:

   ```powershell
   npm.cmd run migrate:booking-payment -- --apply
   ```

6. Confirm the partial unique index is present before enabling booking traffic. Do not deploy application instances that can accept new bookings before this index has been created successfully.
7. Sessions whose old `payment` boolean is true are deliberately labelled `legacy_paid_unverified`. Reconcile these against Stripe before setting `paymentStatus` to `paid`; they do not count toward earnings/revenue in the meantime.

## Stripe setup and local testing

Backend-only variables are `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL`, `CURRENCY`, and `BOOKING_TIME_ZONE`. `FRONTEND_URL` must be the exact public frontend origin. The Vite app receives only `VITE_BACKEND_URL` and optionally the non-secret `VITE_BOOKING_TIME_ZONE`; configure the same timezone value in both projects.

1. Create a Stripe webhook pointing to `https://<api-origin>/api/user/stripe-webhook`.
2. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`.
3. In local development, forward events with Stripe CLI:

   ```powershell
   stripe listen --forward-to localhost:4000/api/user/stripe-webhook
   ```

4. Put the signing secret printed by the CLI in the backend environment only, then restart the API.
5. Test a successful Checkout, an invalid signature, an expired Checkout, an async failure, duplicate event delivery, and a failure event delivered after a success event.

The current implementation acknowledges duplicate/stale signed events without regressing a verified `paid` state. It does not create refunds, payouts, or Stripe customers.

## Manual QA flows

1. Book one valid future slot as a student; issue simultaneous requests for the same tutor/date/time and confirm exactly one gets `201` while the other gets `409`.
2. Return from Stripe Checkout and confirm the session remains pending until a signed Stripe webhook arrives.
3. Replay the same signed event and confirm no duplicate state transition occurs.
4. Try a tutor/student/admin cancellation for an unpaid session and then repeat it; confirm the second authorized request is idempotent.
5. Try to cancel a paid or payment-in-progress session; confirm it returns `409` and does not imply a refund.
6. Complete a paid session as its tutor, then confirm tutor earnings and admin revenue include it once.

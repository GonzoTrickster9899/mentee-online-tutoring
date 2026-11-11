# Prompt 03 — Reliable Booking, Cancellation, and Stripe Payments

Improve booking and payment correctness in the existing Express + MongoDB application. Maintain compatibility with existing student/tutor/admin screens or update all affected clients in the same change.

## Booking integrity
- Review current tutor slot storage and all create/cancel paths.
- Prevent two simultaneous requests from reserving the same tutor/date/time.
- Use an atomic conditional update, unique booking/slot record, or transaction-based design appropriate to the existing schema and MongoDB deployment. Explain the chosen consistency strategy.
- Validate that the tutor exists, is available, the date/time is valid and bookable, and the requested slot is not in the past or already reserved.
- Create the session and reserve the slot consistently. If a multi-document transaction is selected, verify MongoDB Atlas deployment supports it; otherwise choose a safe atomic data model.
- Make cancellation idempotent and release a slot exactly once.
- Keep student, tutor, and admin cancellation permissions distinct.
- Do not allow cancellation to silently bypass an already-paid refund policy. Until refunds are implemented, define and enforce a clear payment/cancellation rule.

## Stripe payment integrity
- Keep Stripe secret keys server-side only.
- Create Checkout Sessions using the authoritative session amount and currency read from MongoDB, not client-supplied values.
- Validate session existence, ownership, cancellation/completion state, and payment state before creating Checkout.
- Persist Stripe Checkout Session ID and relevant payment identifiers/statuses in the database.
- Implement a Stripe webhook endpoint using the raw request body and Stripe signature verification. Ensure webhook middleware order does not consume/transform the raw payload before signature verification.
- Verify event types and payment state with Stripe's signed event data; do not mark a booking paid from a query parameter, browser redirect, or unverified API call.
- Make webhook event processing idempotent using Stripe event IDs or a robust payment state transition.
- Handle success, failure, expiration, duplicate delivery, and out-of-order events safely.
- Keep a success redirect as a user-experience confirmation only; the UI should fetch authoritative payment status from the backend.
- Add a controlled migration/backward-compatibility approach for existing `payment` boolean values.

## Financial correctness
- Define the currency and minor-unit conversion correctly. Do not assume all currencies use two decimal places.
- Ensure tutor earnings and admin revenue only include verified, successful payments according to the agreed business rule.
- Prevent a session from being counted twice.
- Do not implement refunds or payouts unless the task explicitly includes them; clearly label any unsupported states.

## Deliverables
- Updated booking/payment implementation.
- Mongoose schema changes and migration/backfill strategy if needed.
- Stripe webhook setup guide, including local test instructions using Stripe CLI if available.
- Tests for duplicate slot races, ownership, unpaid/paid/cancelled paths, invalid signatures, duplicate webhook events, and out-of-order events.
- API contract updates for affected frontend calls.

## Acceptance criteria
- At most one active reservation can occupy a tutor/date/time slot.
- A client redirect cannot mark a payment as paid.
- Invalid webhook signatures are rejected.
- Replaying the same Stripe event does not duplicate side effects.
- Only the owning student can pay for their session.
- Dashboard earnings/revenue require verified payment state.
- Existing booking/session pages continue to work and show authoritative server state.

import assert from "node:assert/strict";
import test from "node:test";
import {
  BookingConflictError,
  BookingPermissionError,
  BookingStateError,
  cancelBooking,
  reserveBooking,
} from "../services/bookingService.js";
import { StripeWebhookSignatureError, parseStripeWebhook } from "../services/paymentService.js";
import {
  applyStripePaymentEvent,
  isVerifiedPaid,
  paymentStatusForSession,
  toMinorUnits,
  validateBookingSlot,
} from "../utils/bookingPayment.js";

const futureDate = "2/11/2027";

const createModels = () => {
  const sessions = new Map();
  const activeSlots = new Set();
  const tutor = {
    _id: "tutor-1",
    name: "Tutor",
    available: true,
    fees: 25,
    subject: "Math",
    slots_booked: {},
  };
  const user = { _id: "student-1", name: "Student" };

  return {
    tutorModel: {
      findById: async (id) => (id === tutor._id ? tutor : null),
      updateOne: async () => ({ acknowledged: true }),
    },
    userModel: {
      findById: async (id) => (id === user._id ? user : null),
    },
    sessionModel: {
      create: async (session) => {
        const key = `${session.tutId}:${session.activeSlotKey}`;
        if (activeSlots.has(key)) {
          const error = new Error("duplicate key");
          error.code = 11000;
          throw error;
        }
        activeSlots.add(key);
        const stored = { ...session, _id: `session-${sessions.size + 1}` };
        sessions.set(stored._id, stored);
        return stored;
      },
      findById: async (id) => sessions.get(id) ?? null,
      findOneAndUpdate: async (filter, update) => {
        const session = sessions.get(filter._id);
        if (!session || session.cancelled || session.isCompleted) return null;
        if (filter.paymentStatus?.$in && !filter.paymentStatus.$in.includes(session.paymentStatus)) {
          return null;
        }
        Object.assign(session, update.$set);
        return session;
      },
    },
  };
};

test("validates the server booking window and rejects past slots", () => {
  const valid = validateBookingSlot({
    slotDate: "2/11/2027",
    slotTime: "10:30 AM",
    now: new Date("2027-11-01T09:00:00Z"),
    timeZone: "UTC",
  });
  assert.equal(valid.activeSlotKey, "2027-11-02|10:30");

  assert.throws(
    () => validateBookingSlot({
      slotDate: "1/11/2027",
      slotTime: "09:30 AM",
      now: new Date("2027-11-01T09:00:00Z"),
      timeZone: "UTC",
    }),
  );
  assert.throws(() => validateBookingSlot({ slotDate: "2/11/2027", slotTime: "09:00 AM" }));
});

test("uses ISO currency minor units rather than assuming cents", () => {
  assert.equal(toMinorUnits(12.34, "usd"), 1234);
  assert.equal(toMinorUnits(1200, "jpy"), 1200);
  assert.throws(() => toMinorUnits(12.345, "usd"));
});

test("allows only one active reservation for a tutor slot under concurrent requests", async () => {
  const models = createModels();
  const request = {
    models,
    userId: "student-1",
    tutId: "tutor-1",
    slotDate: futureDate,
    slotTime: "10:00 AM",
    currency: "usd",
    now: new Date("2027-11-01T09:00:00Z"),
    timeZone: "UTC",
  };
  const results = await Promise.allSettled([reserveBooking(request), reserveBooking(request)]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.ok(results.some((result) => result.reason instanceof BookingConflictError));
});

test("enforces ownership and makes unpaid cancellation idempotent", async () => {
  const models = createModels();
  const booking = await reserveBooking({
    models,
    userId: "student-1",
    tutId: "tutor-1",
    slotDate: futureDate,
    slotTime: "10:00 AM",
    currency: "usd",
    now: new Date("2027-11-01T09:00:00Z"),
    timeZone: "UTC",
  });

  await assert.rejects(
    cancelBooking({ models, sessionId: booking._id, actor: { role: "student", id: "other-student" } }),
    BookingPermissionError,
  );

  const first = await cancelBooking({ models, sessionId: booking._id, actor: { role: "student", id: "student-1" } });
  const retry = await cancelBooking({ models, sessionId: booking._id, actor: { role: "student", id: "student-1" } });
  assert.equal(first.idempotent, false);
  assert.equal(retry.idempotent, true);
});

test("rejects cancellation for paid or checkout-in-progress sessions until refunds exist", async () => {
  const models = createModels();
  const booking = await reserveBooking({
    models,
    userId: "student-1",
    tutId: "tutor-1",
    slotDate: futureDate,
    slotTime: "10:00 AM",
    currency: "usd",
    now: new Date("2027-11-01T09:00:00Z"),
    timeZone: "UTC",
  });
  booking.paymentStatus = "paid";
  booking.payment = true;

  await assert.rejects(
    cancelBooking({ models, sessionId: booking._id, actor: { role: "student", id: "student-1" } }),
    BookingStateError,
  );
});

test("only successful signed payment events can advance payment and stale events cannot reverse it", () => {
  const unpaid = { payment: false, paymentStatus: "unpaid", processedStripeEventIds: [] };
  const paid = applyStripePaymentEvent(unpaid, {
    id: "evt_success",
    type: "checkout.session.completed",
    paymentStatus: "paid",
  });
  assert.equal(paid.paymentStatus, "paid");
  assert.equal(isVerifiedPaid(paid), true);

  const staleFailure = applyStripePaymentEvent(paid, {
    id: "evt_failure",
    type: "checkout.session.async_payment_failed",
    paymentStatus: "unpaid",
  });
  assert.equal(staleFailure.paymentStatus, "paid");

  const duplicate = applyStripePaymentEvent(paid, {
    id: "evt_success",
    type: "checkout.session.completed",
    paymentStatus: "paid",
  });
  assert.equal(duplicate.changed, false);
  assert.equal(paymentStatusForSession({ payment: true }), "legacy_paid_unverified");
});

test("rejects an invalid Stripe webhook signature before event processing", () => {
  const stripeClient = {
    webhooks: {
      constructEvent: () => {
        throw new Error("signature mismatch");
      },
    },
  };
  assert.throws(
    () => parseStripeWebhook({ rawBody: Buffer.from("{}"), signature: "invalid", secret: "test_secret", stripeClient }),
    StripeWebhookSignatureError,
  );
});

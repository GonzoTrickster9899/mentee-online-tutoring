import {
  BookingValidationError,
  canCancelSession,
  normalizeCurrency,
  paymentStatusForSession,
  toMinorUnits,
  validateBookingSlot,
} from "../utils/bookingPayment.js";

export class BookingConflictError extends Error {}
export class BookingPermissionError extends Error {}
export class BookingNotFoundError extends Error {}
export class BookingStateError extends Error {}

const snapshot = (document) => {
  const value = document?.toObject ? document.toObject() : { ...document };
  delete value.password;
  return value;
};

const slotPath = (slotDate) => `slots_booked.${slotDate}`;

export const reserveBooking = async ({
  models: { tutorModel, userModel, sessionModel },
  userId,
  tutId,
  slotDate,
  slotTime,
  currency,
  now,
  timeZone,
}) => {
  const slot = validateBookingSlot({ slotDate, slotTime, now, timeZone });
  // Backward compatibility: older sessions have no `activeSlotKey`. The query protects their
  // occupied slots until the documented backfill is complete; new concurrent reservations are
  // then protected by the unique index below.
  if (typeof sessionModel.exists === "function") {
    const legacyOrActiveSession = await sessionModel.exists({
      tutId: String(tutId),
      slotDate: slot.slotDate,
      slotTime: slot.slotTime,
      cancelled: false,
    });
    if (legacyOrActiveSession) throw new BookingConflictError("Slot is no longer available");
  }
  const [tutor, user] = await Promise.all([tutorModel.findById(tutId), userModel.findById(userId)]);
  if (!tutor) throw new BookingNotFoundError("Tutor not found");
  if (!user) throw new BookingPermissionError("Student account not found");
  if (!tutor.available) throw new BookingStateError("Tutor is not available");

  const amount = Number(tutor.fees);
  const normalizedCurrency = normalizeCurrency(currency);
  const amountMinor = toMinorUnits(amount, normalizedCurrency);
  let session;
  try {
    session = await sessionModel.create({
      userId: String(userId),
      tutId: String(tutId),
      slotDate: slot.slotDate,
      slotTime: slot.slotTime,
      activeSlotKey: slot.activeSlotKey,
      userData: snapshot(user),
      tutData: snapshot(tutor),
      amount,
      amountMinor,
      currency: normalizedCurrency,
      date: Date.now(),
      payment: false,
      paymentStatus: "unpaid",
    });
  } catch (error) {
    if (error?.code === 11000) throw new BookingConflictError("Slot is no longer available");
    throw error;
  }

  // `session.activeSlotKey` plus its unique partial index is authoritative. This cache preserves
  // the legacy tutor-list contract and is rebuilt from active sessions on every public list read.
  await tutorModel.updateOne({ _id: tutId }, { $addToSet: { [slotPath(slot.slotDate)]: slot.slotTime } });
  return session;
};

const actorCanCancel = (session, actor) => actor.role === "admin"
  || (actor.role === "student" && String(session.userId) === String(actor.id))
  || (actor.role === "tutor" && String(session.tutId) === String(actor.id));

export const cancelBooking = async ({
  models: { tutorModel, sessionModel },
  sessionId,
  actor,
}) => {
  const session = await sessionModel.findById(sessionId);
  if (!session) throw new BookingNotFoundError("Session not found");
  if (!actorCanCancel(session, actor)) throw new BookingPermissionError("You cannot cancel this session");
  if (session.cancelled) return { session, idempotent: true };
  if (!canCancelSession(session)) {
    throw new BookingStateError("Paid, completed, or payment-in-progress sessions cannot be cancelled until refunds are supported");
  }

  const paymentStatus = paymentStatusForSession(session);
  const updated = await sessionModel.findOneAndUpdate(
    {
      _id: sessionId,
      cancelled: false,
      isCompleted: false,
      paymentStatus,
    },
    {
      $set: {
        cancelled: true,
        paymentStatus: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: actor.role,
      },
    },
    { new: true },
  );

  if (!updated) {
    const latest = await sessionModel.findById(sessionId);
    if (latest?.cancelled && actorCanCancel(latest, actor)) return { session: latest, idempotent: true };
    throw new BookingStateError("Session state changed; please refresh and try again");
  }

  await tutorModel.updateOne({ _id: updated.tutId }, { $pull: { [slotPath(updated.slotDate)]: updated.slotTime } });
  return { session: updated, idempotent: false };
};

export { BookingValidationError };

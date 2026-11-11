const BOOKING_START_HOUR = 10;
const BOOKING_END_HOUR = 21;
const DEFAULT_LEAD_MINUTES = 60;

export class BookingValidationError extends Error {}

const zonedDateParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
  return values;
};

const asCalendarMinutes = ({ year, month, day, hour, minute }) => Math.floor(Date.UTC(year, month - 1, day, hour, minute) / 60000);

export const normalizeCurrency = (value) => {
  const currency = String(value || "").trim().toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) {
    throw new BookingValidationError("A three-letter currency code is required");
  }
  try {
    new Intl.NumberFormat("en", { style: "currency", currency });
  } catch {
    throw new BookingValidationError("Unsupported currency");
  }
  return currency;
};

export const currencyMinorUnit = (currency) => new Intl.NumberFormat("en", {
  style: "currency",
  currency: normalizeCurrency(currency),
}).resolvedOptions().maximumFractionDigits;

export const toMinorUnits = (amount, currency) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new BookingValidationError("Session amount must be a positive number");
  }
  const factor = 10 ** currencyMinorUnit(currency);
  const minorAmount = Math.round(numericAmount * factor);
  if (!Number.isSafeInteger(minorAmount) || Math.abs(numericAmount - minorAmount / factor) > 1e-8) {
    throw new BookingValidationError("Session amount has unsupported precision for the selected currency");
  }
  return minorAmount;
};

export const validateBookingSlot = ({
  slotDate,
  slotTime,
  now = new Date(),
  timeZone = process.env.BOOKING_TIME_ZONE || "UTC",
  minimumLeadMinutes = DEFAULT_LEAD_MINUTES,
}) => {
  const dateMatch = /^([1-9]|[12]\d|3[01])\/([1-9]|1[0-2])\/(\d{4})$/.exec(String(slotDate || "").trim());
  const timeMatch = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/.exec(String(slotTime || "").trim());
  if (!dateMatch || !timeMatch) {
    throw new BookingValidationError("Invalid session date or time");
  }

  const [, dayText, monthText, yearText] = dateMatch;
  const [, hourText, minuteText, meridiem] = timeMatch;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const minute = Number(minuteText);
  const hour12 = Number(hourText);
  const hour = (hour12 % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0);

  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (calendarDate.getUTCFullYear() !== year || calendarDate.getUTCMonth() !== month - 1 || calendarDate.getUTCDate() !== day) {
    throw new BookingValidationError("Invalid calendar date");
  }
  if (hour < BOOKING_START_HOUR || hour >= BOOKING_END_HOUR || ![0, 30].includes(minute)) {
    throw new BookingValidationError("Requested time is outside the bookable session window");
  }

  let current;
  try {
    current = zonedDateParts(now, timeZone);
  } catch {
    throw new BookingValidationError("Booking time zone is invalid");
  }
  const requestedMinutes = asCalendarMinutes({ year, month, day, hour, minute });
  const currentMinutes = asCalendarMinutes(current);
  if (requestedMinutes < currentMinutes + minimumLeadMinutes) {
    throw new BookingValidationError("Requested time must be at least one hour in the future");
  }

  return {
    slotDate: `${day}/${month}/${year}`,
    slotTime: `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${meridiem.toUpperCase()}`,
    activeSlotKey: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}|${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
};

export const paymentStatusForSession = (session) => session.paymentStatus ?? (session.payment ? "legacy_paid_unverified" : "unpaid");

export const isVerifiedPaid = (session) => paymentStatusForSession(session) === "paid";

export const canCancelSession = (session) => !session.cancelled
  && !session.isCompleted
  && ["unpaid", "failed", "expired"].includes(paymentStatusForSession(session));

export const applyStripePaymentEvent = (session, event) => {
  const processed = new Set(session.processedStripeEventIds || []);
  if (processed.has(event.id)) return { ...session, changed: false };

  processed.add(event.id);
  const next = { ...session, processedStripeEventIds: [...processed], changed: true };
  const currentStatus = paymentStatusForSession(session);
  const success = (event.type === "checkout.session.completed" && event.paymentStatus === "paid")
    || event.type === "checkout.session.async_payment_succeeded";

  if (success && !session.cancelled) {
    next.payment = true;
    next.paymentStatus = "paid";
    return next;
  }
  if (currentStatus === "paid" || session.cancelled) return next;

  if (event.type === "checkout.session.async_payment_failed") {
    next.payment = false;
    next.paymentStatus = "failed";
  } else if (event.type === "checkout.session.expired") {
    next.payment = false;
    next.paymentStatus = "expired";
  }
  return next;
};

export const slotsBookedFromSessions = (sessions) => sessions.reduce((slots, session) => {
  if (session.cancelled || !session.slotDate || !session.slotTime) return slots;
  slots[session.slotDate] ??= [];
  if (!slots[session.slotDate].includes(session.slotTime)) slots[session.slotDate].push(session.slotTime);
  return slots;
}, {});

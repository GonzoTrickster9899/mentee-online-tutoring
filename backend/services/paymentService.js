import Stripe from "stripe";
import { applyStripePaymentEvent, paymentStatusForSession } from "../utils/bookingPayment.js";

export class PaymentConfigurationError extends Error {}
export class StripeWebhookSignatureError extends Error {}

export const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new PaymentConfigurationError("Stripe is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export const parseStripeWebhook = ({ rawBody, signature, secret, stripeClient }) => {
  if (!signature || !secret) throw new StripeWebhookSignatureError("Missing Stripe signature configuration");
  try {
    return stripeClient.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    throw new StripeWebhookSignatureError("Invalid Stripe webhook signature");
  }
};

const eventDetails = (event) => {
  const checkout = event.data?.object;
  return {
    id: event.id,
    type: event.type,
    sessionId: checkout?.metadata?.sessionId,
    checkoutSessionId: checkout?.id,
    paymentIntentId: typeof checkout?.payment_intent === "string" ? checkout.payment_intent : undefined,
    paymentStatus: checkout?.payment_status,
  };
};

export const processStripeEvent = async ({ event, sessionModel }) => {
  const details = eventDetails(event);
  if (!details.id || !details.sessionId || !details.checkoutSessionId) return { ignored: true };
  const session = await sessionModel.findById(details.sessionId);
  if (!session) return { ignored: true };
  if (session.stripeCheckoutSessionId && session.stripeCheckoutSessionId !== details.checkoutSessionId) return { ignored: true };

  const next = applyStripePaymentEvent(session, details);
  if (!next.changed) return { duplicate: true };

  const isFailure = ["checkout.session.async_payment_failed", "checkout.session.expired"].includes(details.type);
  const filter = {
    _id: session._id,
    processedStripeEventIds: { $ne: details.id },
    ...(isFailure ? { paymentStatus: { $ne: "paid" } } : {}),
  };
  const update = {
    $addToSet: { processedStripeEventIds: details.id },
    $set: {
      stripeCheckoutSessionId: details.checkoutSessionId,
      ...(details.paymentIntentId ? { stripePaymentIntentId: details.paymentIntentId } : {}),
      payment: next.payment,
      paymentStatus: next.paymentStatus ?? paymentStatusForSession(session),
    },
  };
  const updated = await sessionModel.findOneAndUpdate(filter, update, { new: true });
  if (updated) return { updated: true, session: updated };

  // A stale failure after a successful payment must be acknowledged, not allowed to regress state.
  await sessionModel.updateOne({ _id: session._id }, { $addToSet: { processedStripeEventIds: details.id } });
  return { duplicate: true };
};

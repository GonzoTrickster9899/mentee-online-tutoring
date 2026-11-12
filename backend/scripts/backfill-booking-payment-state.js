import "dotenv/config";
import mongoose from "mongoose";
import sessionModel from "../models/sessionModel.js";

const apply = process.argv.includes("--apply");

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is required to run the migration");
}

const legacySlotKey = (session) => `${session.slotDate}|${session.slotTime}`;

try {
  await mongoose.connect(process.env.MONGO_URI);
  const sessions = await sessionModel.find({}).lean();
  const activeSlots = new Map();

  for (const session of sessions) {
    if (session.cancelled || !session.slotDate || !session.slotTime) continue;
    const key = `${session.tutId}:${legacySlotKey(session)}`;
    activeSlots.set(key, [...(activeSlots.get(key) || []), session._id]);
  }

  const duplicates = [...activeSlots.entries()].filter(([, ids]) => ids.length > 1);
  if (duplicates.length) {
    console.error(`Found ${duplicates.length} duplicate active slots. Resolve these manually before creating the unique index.`);
    process.exitCode = 1;
  } else {
    const operations = sessions.map((session) => {
      const set = {};
      if (!session.paymentStatus) set.paymentStatus = session.payment ? "legacy_paid_unverified" : "unpaid";
      if (!session.currency && process.env.CURRENCY) set.currency = String(process.env.CURRENCY).toLowerCase();
      if (!session.cancelled && !session.activeSlotKey && session.slotDate && session.slotTime) {
        set.activeSlotKey = legacySlotKey(session);
      }
      return Object.keys(set).length ? { updateOne:{ filter:{_id:session._id}, update:{$set:set} } } : null;
    }).filter(Boolean);

    console.log(`${apply ? "Applying" : "Dry run:"} ${operations.length} session state updates.`);
    if (apply && operations.length) await sessionModel.bulkWrite(operations, {ordered:false});
  }
} finally {
  await mongoose.disconnect();
}

import { EmailOtp } from "@/server/models/emailOtp";

export async function findOtp(email, purpose) {
  return EmailOtp.findOne({ email, purpose }).lean();
}

// Replaces any previous code for this email+purpose (attempts reset, verification cleared).
export async function saveNewCode({ email, purpose, codeHash, expiresAt, now, windowStart, sendsInWindow }) {
  return EmailOtp.findOneAndUpdate(
    { email, purpose },
    {
      $set: {
        codeHash,
        expiresAt,
        attempts: 0,
        lastSentAt: now,
        windowStart,
        sendsInWindow,
        verifiedAt: null,
        consumedAt: null,
        expireAt: new Date(now.getTime() + 60 * 60 * 1000),
      },
    },
    { upsert: true, new: true }
  ).lean();
}

// Atomically counts one guess. Returns null if the code is expired, used, verified, or out of attempts.
export async function registerAttempt({ email, purpose, now, maxAttempts }) {
  return EmailOtp.findOneAndUpdate(
    { email, purpose, verifiedAt: null, consumedAt: null, expiresAt: { $gt: now }, attempts: { $lt: maxAttempts } },
    { $inc: { attempts: 1 } },
    { new: true }
  ).lean();
}

export async function markVerified({ email, purpose, now, keepMs }) {
  return EmailOtp.updateOne(
    { email, purpose },
    { $set: { verifiedAt: now, expireAt: new Date(now.getTime() + keepMs + 5 * 60 * 1000) } }
  );
}

export async function findFreshVerification({ email, purpose, since }) {
  return EmailOtp.findOne({ email, purpose, consumedAt: null, verifiedAt: { $gte: since } }).lean();
}

export async function consumeVerification({ email, purpose, now }) {
  return EmailOtp.updateOne(
    { email, purpose, consumedAt: null, verifiedAt: { $ne: null } },
    { $set: { consumedAt: now } }
  );
}

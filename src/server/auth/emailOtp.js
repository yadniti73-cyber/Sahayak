import crypto from "node:crypto";
import { appConfig } from "@/server/config";
import { connectMongo } from "@/server/db/mongo";
import { sendOtpEmail } from "@/server/integrations/email/gmail";
import {
  consumeVerification, findFreshVerification, findOtp, markVerified, registerAttempt, saveNewCode,
} from "@/server/repositories/emailOtps";

export const OTP_TTL_MS = 10 * 60 * 1000;          // code valid for 10 minutes
export const RESEND_COOLDOWN_MS = 60 * 1000;       // 60 s between sends
export const MAX_ATTEMPTS = 5;                     // wrong guesses per code
export const MAX_SENDS_PER_HOUR = 5;               // per email + purpose
export const VERIFIED_VALID_MS = 15 * 60 * 1000;   // verified email can be used to register for 15 min
const IP_MAX_PER_HOUR = 20;

export class OtpError extends Error {
  constructor(message, status = 400, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// ── Best-effort per-IP limiter (in-memory: per server instance, resets on restart) ──
const ipHits = new Map();
export function checkIpLimit(ip) {
  const now = Date.now();
  const key = ip || "unknown";
  const hits = (ipHits.get(key) || []).filter((t) => now - t < 60 * 60 * 1000);
  if (hits.length >= IP_MAX_PER_HOUR) throw new OtpError("Too many requests. Please try again later.", 429);
  hits.push(now);
  ipHits.set(key, hits);
  if (ipHits.size > 5000) for (const [k, v] of ipHits) if (!v.some((t) => now - t < 3600000)) ipHits.delete(k);
}

function hashCode(email, purpose, code) {
  return crypto.createHmac("sha256", appConfig.jwtSecret).update(`${email}:${purpose}:${code}`).digest("hex");
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a), "utf8");
  const y = Buffer.from(String(b), "utf8");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email) && email.length <= 254;
}

export async function sendEmailOtp({ email, purpose, name }) {
  await connectMongo();
  const now = new Date();
  const existing = await findOtp(email, purpose);

  if (existing) {
    const sinceLast = now - new Date(existing.lastSentAt);
    if (sinceLast < RESEND_COOLDOWN_MS) {
      const retryAfter = Math.ceil((RESEND_COOLDOWN_MS - sinceLast) / 1000);
      throw new OtpError(`Please wait ${retryAfter}s before requesting another code.`, 429, { retryAfter });
    }
  }

  let windowStart = now;
  let sendsInWindow = 1;
  if (existing && now - new Date(existing.windowStart) < 60 * 60 * 1000) {
    if (existing.sendsInWindow >= MAX_SENDS_PER_HOUR) {
      throw new OtpError("Too many codes requested for this email. Please try again in an hour.", 429);
    }
    windowStart = new Date(existing.windowStart);
    sendsInWindow = existing.sendsInWindow + 1;
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  await saveNewCode({
    email,
    purpose,
    codeHash: hashCode(email, purpose, code),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
    now,
    windowStart,
    sendsInWindow,
  });

  try {
    await sendOtpEmail({ recipient: email, recipientName: name, code, minutes: OTP_TTL_MS / 60000 });
  } catch (error) {
    if (appConfig.env === "development") {
      // Local dev without SMTP configured: print the code so you can still test the flow.
      console.warn(`[otp:dev] email send failed (${error.message}). Code for ${email}: ${code}`);
    } else {
      console.error("[otp] email send failed:", error.message);
      throw new OtpError("We couldn't send the email right now. Please try again shortly.", 503);
    }
  }
  return { retryAfter: RESEND_COOLDOWN_MS / 1000, expiresInMinutes: OTP_TTL_MS / 60000 };
}

export async function verifyEmailOtp({ email, purpose, code }) {
  await connectMongo();
  const now = new Date();
  const record = await registerAttempt({ email, purpose, now, maxAttempts: MAX_ATTEMPTS });
  if (!record) {
    throw new OtpError("This code has expired or is no longer valid. Please request a new one.", 400);
  }
  if (!safeEqual(record.codeHash, hashCode(email, purpose, code))) {
    const left = Math.max(0, MAX_ATTEMPTS - record.attempts);
    throw new OtpError(
      left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many wrong attempts. Please request a new code.",
      400
    );
  }
  await markVerified({ email, purpose, now, keepMs: VERIFIED_VALID_MS });
  return true;
}

export async function hasVerifiedEmail(email, purpose) {
  await connectMongo();
  const since = new Date(Date.now() - VERIFIED_VALID_MS);
  return Boolean(await findFreshVerification({ email, purpose, since }));
}

export async function consumeVerifiedEmail(email, purpose) {
  await connectMongo();
  return consumeVerification({ email, purpose, now: new Date() });
}

// Razorpay helper for the ISOLATED payment test feature.
// No SDK dependency: uses Razorpay's REST API directly + Node crypto.
// Nothing outside /api/payments-test and /dev/pay-test imports this file.
import crypto from "node:crypto";

// Fixed test amount: Rs 1 = 100 paise. The amount is NEVER read from the client.
// To change it later, edit this one constant (or make it a per-product value).
export const TEST_AMOUNT_PAISE = 100;
export const TEST_CURRENCY = "INR";

const API = "https://api.razorpay.com/v1";

export function isPaymentTestEnabled() {
  return process.env.PAYMENT_TEST_ENABLED === "true";
}

function keys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys are not configured.");
  return { keyId, keySecret };
}

function authHeader() {
  const { keyId, keySecret } = keys();
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export function getPublicKeyId() {
  return keys().keyId;
}

export async function createRazorpayOrder({ receipt, notes }) {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader() },
    body: JSON.stringify({
      amount: TEST_AMOUNT_PAISE,
      currency: TEST_CURRENCY,
      receipt: String(receipt).slice(0, 40),
      notes,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.description || `Razorpay order failed (${res.status}).`);
  return data;
}

export async function fetchRazorpayPayment(paymentId) {
  const res = await fetch(`${API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

function safeEqualHex(a, b) {
  const x = Buffer.from(String(a || ""), "utf8");
  const y = Buffer.from(String(b || ""), "utf8");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// Checkout callback signature: HMAC_SHA256(order_id|payment_id, key_secret)
export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  const { keySecret } = keys();
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

// Webhook signature: HMAC_SHA256(raw_body, webhook_secret)
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_TEST_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

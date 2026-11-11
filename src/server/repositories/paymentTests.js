import { PaymentTest } from "@/server/models/paymentTest";

export async function createPaymentTest(payload) {
  return new PaymentTest(payload).save();
}

export async function findPaymentTestByOrder(orderId) {
  return PaymentTest.findOne({ orderId }).lean();
}

// Only moves CREATED -> PAID, so repeated verify/webhook calls are idempotent.
export async function markPaid(orderId, { paymentId, method }) {
  return PaymentTest.findOneAndUpdate(
    { orderId, status: { $ne: "PAID" } },
    { $set: { status: "PAID", paymentId, method: method || null, paidAt: new Date() } },
    { new: true }
  ).lean();
}

export async function markFailed(orderId, { paymentId }) {
  return PaymentTest.findOneAndUpdate(
    { orderId, status: "CREATED" },
    { $set: { status: "FAILED", paymentId: paymentId || null } },
    { new: true }
  ).lean();
}

export async function listPaymentTestsForUser(userId, limit = 10) {
  return PaymentTest.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
}

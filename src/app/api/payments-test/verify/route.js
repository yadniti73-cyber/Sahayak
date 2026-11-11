import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { connectMongo } from "@/server/db/mongo";
import { fetchRazorpayPayment, isPaymentTestEnabled, verifyCheckoutSignature } from "@/server/integrations/razorpayTest";
import { findPaymentTestByOrder, markPaid } from "@/server/repositories/paymentTests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (message, status) => NextResponse.json({ success: false, message }, { status });

export async function POST(request) {
  if (!isPaymentTestEnabled()) return fail("Not found.", 404);

  let user;
  try {
    user = await requireAuth();
  } catch {
    return fail("Unauthorized", 401);
  }
  if (user.role !== "ADMIN") return fail("Forbidden", 403); // admin-only for now

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON.", 400);
  }
  const orderId = String(body?.razorpay_order_id || "");
  const paymentId = String(body?.razorpay_payment_id || "");
  const signature = String(body?.razorpay_signature || "");
  if (!orderId || !paymentId || !signature) return fail("Missing payment fields.", 422);

  try {
    await connectMongo();

    // The order must exist AND belong to this user.
    const record = await findPaymentTestByOrder(orderId);
    if (!record || String(record.userId) !== user.id) return fail("Order not found.", 404);

    if (!verifyCheckoutSignature({ orderId, paymentId, signature })) {
      return fail("Payment signature verification failed.", 400);
    }

    // Best-effort cross-check with Razorpay (method + amount). Signature already proves authenticity.
    const payment = await fetchRazorpayPayment(paymentId);
    if (payment && (payment.order_id !== orderId || payment.amount !== record.amount)) {
      return fail("Payment does not match the order.", 400);
    }

    await markPaid(orderId, { paymentId, method: payment?.method });
    return NextResponse.json({
      success: true,
      message: "Payment verified.",
      data: { orderId, paymentId, method: payment?.method || null, amount: record.amount },
    });
  } catch (error) {
    console.error("[payments-test] verify failed:", error);
    return fail("Unable to verify the payment.", 500);
  }
}

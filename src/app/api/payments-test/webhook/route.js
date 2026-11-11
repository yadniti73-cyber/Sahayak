import { NextResponse } from "next/server";
import { connectMongo } from "@/server/db/mongo";
import { isPaymentTestEnabled, verifyWebhookSignature } from "@/server/integrations/razorpayTest";
import { markFailed, markPaid } from "@/server/repositories/paymentTests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Razorpay -> server. No cookie auth: authenticity comes from the HMAC signature on the RAW body.
// Dashboard URL: https://<your-domain>/api/payments-test/webhook   events: payment.captured, payment.failed
export async function POST(request) {
  if (!isPaymentTestEnabled()) return NextResponse.json({ ok: false }, { status: 404 });

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw);
    const payment = event?.payload?.payment?.entity;
    if (payment?.order_id) {
      await connectMongo();
      if (event.event === "payment.captured") {
        await markPaid(payment.order_id, { paymentId: payment.id, method: payment.method });
      } else if (event.event === "payment.failed") {
        await markFailed(payment.order_id, { paymentId: payment.id });
      }
    }
  } catch (error) {
    console.error("[payments-test] webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 }); // Razorpay will retry
  }
  return NextResponse.json({ ok: true });
}

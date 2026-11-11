import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { connectMongo } from "@/server/db/mongo";
import {
  createRazorpayOrder, getPublicKeyId, isPaymentTestEnabled, TEST_AMOUNT_PAISE, TEST_CURRENCY,
} from "@/server/integrations/razorpayTest";
import { createPaymentTest } from "@/server/repositories/paymentTests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (message, status) => NextResponse.json({ success: false, message }, { status });

export async function POST() {
  if (!isPaymentTestEnabled()) return fail("Not found.", 404);

  let user;
  try {
    user = await requireAuth();
  } catch {
    return fail("Unauthorized", 401);
  }
  // ADMIN-ONLY for now. To open to all signed-in users, delete this check (see docs/GuideShala-payment-test.md).
  if (user.role !== "ADMIN") return fail("Forbidden", 403);

  try {
    await connectMongo();
    const order = await createRazorpayOrder({
      receipt: `pt_${Date.now()}`,
      notes: { userId: user.id, purpose: "payment-test" },
    });
    await createPaymentTest({
      userId: user.id,
      orderId: order.id,
      amount: TEST_AMOUNT_PAISE,
      currency: TEST_CURRENCY,
    });
    return NextResponse.json({
      success: true,
      message: "Order created.",
      data: {
        keyId: getPublicKeyId(),
        orderId: order.id,
        amount: TEST_AMOUNT_PAISE,
        currency: TEST_CURRENCY,
        prefill: { name: `${user.firstName} ${user.lastName}`.trim(), email: user.email },
      },
    });
  } catch (error) {
    console.error("[payments-test] create-order failed:", error);
    return fail("Unable to create the test order.", 500);
  }
}

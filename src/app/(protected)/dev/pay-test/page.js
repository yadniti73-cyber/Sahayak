import { notFound } from "next/navigation";
import { requirePageAccess } from "@/server/auth/route-guards";
import { isPaymentTestEnabled } from "@/server/integrations/razorpayTest";
import PayTestClient from "./PayTestClient";

export const dynamic = "force-dynamic";

// Isolated test page. Hidden (404) unless PAYMENT_TEST_ENABLED=true; ADMIN-only for now.
// To open to all signed-in users, call requirePageAccess() with no roles (see docs/GuideShala-payment-test.md).
export default async function PayTestPage() {
  if (!isPaymentTestEnabled()) notFound();
  await requirePageAccess(["ADMIN"]);
  return <PayTestClient />;
}

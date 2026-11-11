import { NextResponse } from "next/server";
import { checkIpLimit, isValidEmail, normalizeEmail, OtpError, verifyEmailOtp } from "@/server/auth/emailOtp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body, status = 200) => NextResponse.json(body, { status });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Invalid JSON." }, 400);
  }

  const email = normalizeEmail(body?.email);
  const purpose = String(body?.purpose || "REGISTER");
  const code = String(body?.code || "").trim();
  if (!isValidEmail(email) || purpose !== "REGISTER" || !/^\d{6}$/.test(code)) {
    return json({ success: false, message: "Enter the 6-digit code." }, 422);
  }

  try {
    checkIpLimit(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim());
    await verifyEmailOtp({ email, purpose, code });
    return json({ success: true, message: "Email verified." });
  } catch (error) {
    if (error instanceof OtpError) return json({ success: false, message: error.message }, error.status);
    console.error("[otp/verify] unexpected error:", error);
    return json({ success: false, message: "Unable to verify the code right now." }, 500);
  }
}

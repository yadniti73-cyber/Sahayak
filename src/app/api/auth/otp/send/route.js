import { NextResponse } from "next/server";
import { checkIpLimit, isValidEmail, normalizeEmail, OtpError, sendEmailOtp } from "@/server/auth/emailOtp";
import { connectMongo } from "@/server/db/mongo";
import { findUserByEmail } from "@/server/repositories/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_PURPOSES = ["REGISTER"];
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
  if (!isValidEmail(email)) return json({ success: false, message: "Please enter a valid email address." }, 422);
  if (!ALLOWED_PURPOSES.includes(purpose)) return json({ success: false, message: "Invalid request." }, 422);

  try {
    checkIpLimit(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim());

    if (purpose === "REGISTER") {
      await connectMongo();
      if (await findUserByEmail(email)) {
        return json({ success: false, message: "An account with this email already exists. Please sign in." }, 409);
      }
    }

    const name = typeof body?.firstName === "string" ? body.firstName.trim().slice(0, 60) : "";
    const data = await sendEmailOtp({ email, purpose, name });
    return json({ success: true, message: "Verification code sent.", data });
  } catch (error) {
    if (error instanceof OtpError) {
      return json({ success: false, message: error.message, data: error.extra }, error.status);
    }
    console.error("[otp/send] unexpected error:", error);
    return json({ success: false, message: "Unable to send the code right now." }, 500);
  }
}

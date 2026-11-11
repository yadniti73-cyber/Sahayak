import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/server/service";
import { setAuthCookie } from "@/server/auth/cookies";
import { consumeVerifiedEmail, hasVerifiedEmail, normalizeEmail } from "@/server/auth/emailOtp";
import { markUserEmailVerified } from "@/server/repositories/users";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function POST(request) {
  try {
    const payload = await request.json();
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for") || "";

    // Registration requires a freshly verified email (see /api/auth/otp/send + /verify).
    const email = normalizeEmail(payload?.email);
    if (!email || !(await hasVerifiedEmail(email, "REGISTER"))) {
      return NextResponse.json(
        errorResponse("Please verify your email with the code we sent before creating your account."),
        { status: 403 }
      );
    }

    const result = await registerUser(payload, { userAgent, ipAddress });

    // Best-effort bookkeeping: never fail a successful registration because of these.
    await Promise.allSettled([consumeVerifiedEmail(email, "REGISTER"), markUserEmailVerified(email)]);

    const response = NextResponse.json(successResponse({ user: result.user }, "Registration succeeded."));
    return setAuthCookie(response, result.token);
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to register."), { status: 400 });
  }
}

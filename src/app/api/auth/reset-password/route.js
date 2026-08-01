import { NextResponse } from "next/server";
import { resetPassword } from "@/features/auth/server/service";
import { setAuthCookie } from "@/server/auth/cookies";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await resetPassword(payload);
    const response = NextResponse.json(successResponse({ user: result.user }, "Password has been reset."));
    return setAuthCookie(response, result.token);
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to reset password."), { status: 400 });
  }
}

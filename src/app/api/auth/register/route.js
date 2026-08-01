import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/server/service";
import { setAuthCookie } from "@/server/auth/cookies";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function POST(request) {
  try {
    const payload = await request.json();
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for") || "";

    const result = await registerUser(payload, { userAgent, ipAddress });
    const response = NextResponse.json(successResponse({ user: result.user }, "Registration succeeded."));
    return setAuthCookie(response, result.token);
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to register."), { status: 400 });
  }
}

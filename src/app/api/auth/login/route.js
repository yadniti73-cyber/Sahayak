import { NextResponse } from "next/server";
import { loginUser } from "@/features/auth/server/service";
import { setAuthCookie } from "@/server/auth/cookies";
import { errorResponse, successResponse } from "@/server/utils/api-response";
import { ROLE_HOME_ROUTES } from "@/lib/routes";

export async function POST(request) {
  try {
    const payload = await request.json();
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for") || "";

    const result = await loginUser(payload, { userAgent, ipAddress });
    const redirectTo = ROLE_HOME_ROUTES[result.user.role] || "/dashboard/home";
    const response = NextResponse.json(successResponse({ user: result.user, redirectTo }, "Login succeeded."));
    return setAuthCookie(response, result.token);
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to login."), { status: 400 });
  }
}

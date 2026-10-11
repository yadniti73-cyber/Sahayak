import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/server/auth/cookies";
import { revokeSession } from "@/server/auth/session";
import { verifyJwt } from "@/server/auth/jwt";
import { appConfig } from "@/server/config";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(appConfig.authCookieName)?.value;

    if (token) {
      const payload = verifyJwt(token);
      if (payload?.sessionId) {
        await revokeSession(payload.sessionId, "logout");
      }
    }

    const response = NextResponse.json(successResponse({}, "Logged out successfully."));
    return clearAuthCookie(response);
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to logout."), { status: 500 });
  }
}

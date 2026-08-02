import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginWithGoogleCode } from "@/features/auth/server/service";
import { setAuthCookie, clearAuthCookie } from "@/server/auth/cookies";
import { appConfig } from "@/server/config";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const loginUrl = new URL("/login", request.url);

  if (errorParam) {
    loginUrl.searchParams.set("error", "google_auth_denied");
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = cookies();
  const expectedState = cookieStore.get(appConfig.googleOAuthStateCookieName)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    loginUrl.searchParams.set("error", "google_auth_invalid_state");
    const response = NextResponse.redirect(loginUrl);
    return clearAuthCookie(response);
  }

  try {
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for") || "";

    const result = await loginWithGoogleCode(code, { userAgent, ipAddress });

    const dashboardUrl = new URL("/dashboard/home", request.url);
    const response = NextResponse.redirect(dashboardUrl);

    response.cookies.set({
      name: appConfig.googleOAuthStateCookieName,
      value: "",
      httpOnly: true,
      secure: appConfig.cookieSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return setAuthCookie(response, result.token);
  } catch (error) {
    loginUrl.searchParams.set("error", "google_auth_failed");
    return NextResponse.redirect(loginUrl);
  }
}
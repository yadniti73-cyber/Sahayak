import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginWithGoogleCode } from "@/features/auth/server/service";
import { setAuthCookie } from "@/server/auth/cookies";
import { appConfig } from "@/server/config";
import { getPublicOrigin, resolveGoogleRedirectUri } from "@/server/auth/google";
import { ROLE_HOME_ROUTES } from "@/lib/routes";
import { safeNextPath } from "@/lib/safe-redirect";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  // Build redirects from the public origin, not request.url (which is internal behind a proxy).
  const origin = getPublicOrigin(request);
  const loginUrl = new URL("/login", origin);

  if (errorParam) {
    loginUrl.searchParams.set("error", "google_auth_denied");
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(appConfig.googleOAuthStateCookieName)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    loginUrl.searchParams.set("error", "google_auth_invalid_state");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for") || "";

    const result = await loginWithGoogleCode(code, {
      userAgent,
      ipAddress,
      redirectUri: resolveGoogleRedirectUri(request),
    });

    const next = safeNextPath(cookieStore.get("GuideShala_post_login")?.value);
    const dashboardUrl = new URL(next || ROLE_HOME_ROUTES[result.user.role] || "/dashboard/home", origin);
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

    response.cookies.set({ name: "GuideShala_post_login", value: "", path: "/", maxAge: 0 });

    return setAuthCookie(response, result.token);
  } catch (error) {
    console.error("Google sign-in failed:", error);
    loginUrl.searchParams.set("error", "google_auth_failed");
    loginUrl.searchParams.set("reason", error?.googleReason || "server_error");
    return NextResponse.redirect(loginUrl);
  }
}

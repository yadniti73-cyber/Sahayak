import { NextResponse } from "next/server";
import crypto from "crypto";
import { loginWithGoogleIdToken } from "@/features/auth/server/service";
import { setAuthCookie } from "@/server/auth/cookies";
import { appConfig } from "@/server/config";

// GET /api/auth/google — redirects the browser to Google's consent screen.
export async function GET(request) {
  const clientId = appConfig.google.clientId;
  const redirectUri = appConfig.google.redirectUri || new URL("/api/auth/google/callback", request.url).toString();

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: "Google OAuth is not configured. Set GOOGLE_CLIENT_ID." },
      { status: 500 }
    );
  }

  if (!redirectUri) {
    return NextResponse.json(
      { success: false, message: "Google OAuth redirect URI is not configured." },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(24).toString("hex");
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl.toString());

  response.cookies.set({
    name: appConfig.googleOAuthStateCookieName,
    value: state,
    httpOnly: true,
    secure: appConfig.cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress = request.headers.get("x-forwarded-for") || "";

    const result = await loginWithGoogleIdToken(payload.idToken, { userAgent, ipAddress });
    const response = NextResponse.json({ success: true, data: { user: result.user }, message: "Google login succeeded." });
    return setAuthCookie(response, result.token);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || "Unable to login with Google." }, { status: 400 });
  }
}
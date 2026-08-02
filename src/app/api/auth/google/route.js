import { NextResponse } from "next/server";
import crypto from "crypto";
import { appConfig } from "@/server/config";

// GET /api/auth/google — redirects the browser to Google's consent screen.
export async function GET() {
  const state = crypto.randomBytes(24).toString("hex");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", appConfig.google.clientId);
  authUrl.searchParams.set("redirect_uri", appConfig.google.redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl.toString());

  response.cookies.set({
    name: appConfig.googleOAuthStateCookieName,
    value: state,
    httpOnly: true,
    secure: appConfig.env === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, 
  });

  return response;
}
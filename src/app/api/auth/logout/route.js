import { NextResponse } from "next/server";
import { appConfig } from "@/server/config";
import { verifySessionToken, revokeSession } from "@/server/auth/session";
import { connectMongo } from "@/server/db/mongo";

function expiredCookie(response) {
  response.cookies.set({
    name: appConfig.authCookieName,
    value: "",
    httpOnly: true,
    secure: appConfig.cookieSecure,
    sameSite: "lax",
    path: appConfig.authCookiePath,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

async function revokeCurrentSession(request) {
  try {
    const token = request.cookies.get(appConfig.authCookieName)?.value;
    if (!token) return;
    await connectMongo();
    const verified = await verifySessionToken(token);
    if (verified?.payload?.sessionId) {
      await revokeSession(verified.payload.sessionId, "logout");
    }
  } catch (error) {
    // Even if revoking fails, the cookie below is still cleared.
    console.error("logout: could not revoke session", error);
  }
}

export async function POST(request) {
  await revokeCurrentSession(request);
  return expiredCookie(NextResponse.json({ success: true, message: "Signed out.", data: {}, meta: {} }));
}

// Lets a plain link to /api/auth/logout work too.
export async function GET(request) {
  await revokeCurrentSession(request);
  return expiredCookie(NextResponse.redirect(new URL("/login", request.url)));
}

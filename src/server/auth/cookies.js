import { NextResponse } from "next/server";
import { appConfig } from "@/server/config";

export function setAuthCookie(response, token) {
  const res = response instanceof NextResponse ? response : NextResponse.next();

  res.cookies.set({
    name: appConfig.authCookieName,
    value: token,
    httpOnly: true,
    secure: appConfig.cookieSecure,
    sameSite: "lax",
    path: appConfig.authCookiePath,
    maxAge: appConfig.authCookieMaxAge,
  });

  return res;
}

export function clearAuthCookie(response) {
  const res = response instanceof NextResponse ? response : NextResponse.next();

  res.cookies.set({
    name: appConfig.authCookieName,
    value: "",
    httpOnly: true,
    secure: appConfig.cookieSecure,
    sameSite: "lax",
    path: appConfig.authCookiePath,
    maxAge: 0,
  });

  return res;
}

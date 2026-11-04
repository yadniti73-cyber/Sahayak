import { appConfig } from "@/server/config";

export const GOOGLE_CALLBACK_PATH = "/api/auth/google/callback";

// Public origin of the app. Behind a proxy (Render, Vercel, nginx) request.url holds the
// internal host, so prefer the forwarded headers.
export function getPublicOrigin(request) {
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const url = new URL(request.url);
  const host = (forwardedHost || url.host).split(",")[0].trim();
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = (forwardedProto || (isLocal ? "http" : url.protocol.replace(":", ""))).split(",")[0].trim();
  return `${proto}://${host}`;
}

// The same value must be used for the consent redirect and the token exchange,
// otherwise Google answers redirect_uri_mismatch. GOOGLE_REDIRECT_URI wins when set.
export function resolveGoogleRedirectUri(request) {
  return appConfig.google.redirectUri || `${getPublicOrigin(request)}${GOOGLE_CALLBACK_PATH}`;
}

const isDev = process.env.NODE_ENV === "development";
export const PRODUCTION_REDIRECT_URIS = [
  "https://guideshala.com/api/auth/google/callback",
  "https://guideshala.in/api/auth/google/callback",
  "https://sahayak-india.onrender.com/api/auth/google/callback",
];
const googleRedirectUri = isDev ? "http://localhost:3000/api/auth/google/callback" : "";
const cookieSecure = !isDev;
const isProductionBuild = process.env.NODE_ENV === "production" || cookieSecure;
const DEFAULT_JWT_SECRET = "change-this-secret";

export const appConfig = {
  env: cookieSecure ? "production" : "development",
  cookieSecure, // cookies.js and guards.js read this; it was missing before
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GuideShala",
  // Read lazily so `next build` works, but refuse to run production with the default secret.
  get jwtSecret() {
    const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    if (isProductionBuild && secret === DEFAULT_JWT_SECRET) {
      throw new Error("JWT_SECRET must be set in production.");
    }
    return secret;
  },
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",
  authCookieName: process.env.AUTH_COOKIE_NAME || "GuideShala_session",
  authCookiePath: "/",
  authCookieMaxAge: 60 * 60 * 24 * 30, // 30 days
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: googleRedirectUri,
  },
  googleOAuthStateCookieName: "GuideShala_google_oauth_state",
};
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";
const cookieSecure = googleRedirectUri.startsWith("https://");

export const appConfig = {
  env: cookieSecure ? "production" : "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GuideShala",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  authCookieName: process.env.AUTH_COOKIE_NAME || "GuideShala_session",
  authCookiePath: "/",
  authCookieMaxAge: 60 * 60 * 24 * 7, // 7 days
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: googleRedirectUri,
  },
  googleOAuthStateCookieName: "GuideShala_google_oauth_state",
};
export const appConfig = {
  env: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sahayak",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  authCookieName: process.env.AUTH_COOKIE_NAME || "sahayak_session",
  authCookiePath: "/",
  authCookieMaxAge: 60 * 60 * 24 * 7, // 7 days
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
};

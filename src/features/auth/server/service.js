import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { createUser, findUserByEmail, findUserById, updateUser } from "@/server/repositories/users";
import { createSession, revokeSession, revokeSessionsForUser } from "@/server/auth/session";
import { createPasswordResetToken, findPasswordResetTokenByHash, markPasswordResetTokenUsed } from "@/server/repositories/passwordResetTokens";
import { appConfig } from "@/server/config";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["SEEKER", "MENTOR"]).default("SEEKER"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function registerUser(payload, { userAgent = "unknown", ipAddress = "" } = {}) {
  const parsed = registerSchema.parse(payload);
  await connectMongo();

  const existing = await findUserByEmail(parsed.email);
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);
  const user = await createUser({
    email: parsed.email,
    passwordHash,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    role: parsed.role,
  });

  const { token, session } = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
    sessionId: session._id.toString(),
  };
}

export async function loginUser(payload, { userAgent = "unknown", ipAddress = "" } = {}) {
  const parsed = loginSchema.parse(payload);
  await connectMongo();

  const user = await findUserByEmail(parsed.email);
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active.");
  }

  const passwordMatches = user.passwordHash ? await bcrypt.compare(parsed.password, user.passwordHash) : false;
  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  const { token, session } = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
    sessionId: session._id.toString(),
  };
}

export async function logoutUser(sessionId) {
  await connectMongo();
  await revokeSession(sessionId);
}

// --- Replaces the old ID-token-based loginWithGoogle ---
export async function loginWithGoogleCode(code, { userAgent = "unknown", ipAddress = "" } = {}) {
  const parsed = z.string().min(1).parse(code);
  await connectMongo();

  const googlePayload = await exchangeCodeForGoogleProfile(parsed);
  const email = googlePayload.email.toLowerCase();
  let user = await findUserByEmail(email);

  if (!user) {
    const firstName = googlePayload.given_name || googlePayload.name?.split(" ")[0] || "";
    const lastName = googlePayload.family_name || googlePayload.name?.split(" ").slice(1).join(" ") || "";
    const pictureUrl = googlePayload.picture || "";

    user = await createUser({
      email,
      passwordHash: "",
      provider: "google",
      providerId: googlePayload.sub,
      pictureUrl,
      firstName,
      lastName,
      role: "SEEKER",
    });
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active.");
  }

  const { token, session } = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
    sessionId: session._id.toString(),
  };
}

export async function loginWithGoogleIdToken(idToken, { userAgent = "unknown", ipAddress = "" } = {}) {
  const parsed = z.string().min(1).parse(idToken);
  await connectMongo();

  const googlePayload = await verifyGoogleIdToken(parsed);
  const email = googlePayload.email.toLowerCase();
  let user = await findUserByEmail(email);

  if (!user) {
    const firstName = googlePayload.given_name || googlePayload.name?.split(" ")[0] || "";
    const lastName = googlePayload.family_name || googlePayload.name?.split(" ").slice(1).join(" ") || "";
    const pictureUrl = googlePayload.picture || "";

    user = await createUser({
      email,
      passwordHash: "",
      provider: "google",
      providerId: googlePayload.sub,
      pictureUrl,
      firstName,
      lastName,
      role: "SEEKER",
    });
  }

  if (user.provider === "local") {
    throw new Error("This account is registered with email and password. Please sign in using your password.");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active.");
  }

  const { token, session } = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
    sessionId: session._id.toString(),
  };
}

// Exchanges the authorization code for tokens, then verifies + returns the ID token payload.
async function exchangeCodeForGoogleProfile(code) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: appConfig.google.clientId,
      client_secret: appConfig.google.clientSecret,
      redirect_uri: appConfig.google.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Unable to exchange Google authorization code.");
  }

  const tokenData = await tokenResponse.json();
  const idToken = tokenData.id_token;
  if (!idToken) {
    throw new Error("Google did not return an ID token.");
  }

  return verifyGoogleIdToken(idToken);
}

async function verifyGoogleIdToken(idToken) {
  const validationUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const response = await fetch(validationUrl);

  if (!response.ok) {
    throw new Error("Unable to verify Google login token.");
  }

  const payload = await response.json();
  if (!payload || payload.aud !== appConfig.google.clientId) {
    throw new Error("Google login token is invalid.");
  }

  if (!payload.email_verified) {
    throw new Error("Google login requires a verified email address.");
  }

  return payload;
}

export async function requestPasswordReset(payload) {
  const parsed = forgotPasswordSchema.parse(payload);
  await connectMongo();

  const user = await findUserByEmail(parsed.email);
  if (!user) {
    return { success: true, message: "If that email exists, a reset link has been generated." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await createPasswordResetToken({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    success: true,
    message: "If that email exists, a reset link has been generated.",
    resetToken: token,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function resetPassword(payload, { userAgent = "unknown", ipAddress = "" } = {}) {
  const parsed = resetPasswordSchema.parse(payload);
  await connectMongo();

  const tokenHash = crypto.createHash("sha256").update(parsed.token).digest("hex");
  const tokenDoc = await findPasswordResetTokenByHash(tokenHash);
  if (!tokenDoc) {
    throw new Error("The password reset token is invalid or has expired.");
  }

  const user = await findUserById(tokenDoc.userId);
  if (!user) {
    throw new Error("Unable to reset password.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);
  await updateUser(user._id.toString(), { passwordHash });
  await markPasswordResetTokenUsed(tokenDoc._id);
  await revokeSessionsForUser(user._id, "password_reset");

  const { token, session } = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
    sessionId: session._id.toString(),
  };
}
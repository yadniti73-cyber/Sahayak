import { cookies } from "next/headers";
import { verifyJwt } from "@/server/auth/jwt";
import { findAuthSessionById } from "@/server/repositories/authSessions";
import { findUserById } from "@/server/repositories/users";
import { connectMongo } from "@/server/db/mongo";
import { appConfig } from "@/server/config";

export async function getCurrentUser() {
  await connectMongo();
  const cookieStore = await cookies();
  const token = cookieStore.get(appConfig.authCookieName)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyJwt(token);
  if (!payload?.sub || !payload?.sessionId) {
    return null;
  }

  const session = await findAuthSessionById(payload.sessionId);
  if (!session || session.revokedAt || (session.expiresAt && new Date(session.expiresAt) < new Date())) {
    return null;
  }

  const user = await findUserById(payload.sub);
  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}

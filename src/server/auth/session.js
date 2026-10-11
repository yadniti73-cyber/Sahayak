import { createAuthSession, findAuthSessionById, revokeAuthSession, revokeSessionsForUser as revokeSessionsForUserRepo } from "@/server/repositories/authSessions";
import { findUserById } from "@/server/repositories/users";
import { signJwt, verifyJwt } from "@/server/auth/jwt";
import { appConfig } from "@/server/config";

export async function createSession({ userId, userAgent, ipAddress, role = "SEEKER" }) {
  const expiresAt = new Date(Date.now() + appConfig.authCookieMaxAge * 1000);
  const session = await createAuthSession({ userId, userAgent, ipAddress, expiresAt });

  const user = await findUserById(userId.toString());
  const token = signJwt({
    sub: userId.toString(),
    sessionId: session._id.toString(),
    role,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  return { token, session };
}

export async function verifySessionToken(token) {
  const payload = verifyJwt(token);
  if (!payload?.sessionId) {
    return null;
  }

  const session = await findAuthSessionById(payload.sessionId);
  if (!session || session.revokedAt || (session.expiresAt && new Date(session.expiresAt) < new Date())) {
    return null;
  }

  return { payload, session };
}

export async function revokeSession(sessionId, reason = "logout") {
  return revokeAuthSession(sessionId, reason);
}

export async function revokeSessionsForUser(userId, reason = "password_reset") {
  return revokeSessionsForUserRepo(userId, reason);
}

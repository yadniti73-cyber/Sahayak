import { AuthSession } from "@/server/models/authSession";

export async function createAuthSession({ userId, userAgent, ipAddress, expiresAt }) {
  const session = new AuthSession({ userId, userAgent, ipAddress, expiresAt });
  return session.save();
}

export async function findAuthSessionById(sessionId) {
  return AuthSession.findById(sessionId).lean();
}

export async function revokeAuthSession(sessionId, reason = "logout") {
  return AuthSession.findByIdAndUpdate(sessionId, { revokedAt: new Date(), revokedReason: reason }, { new: true }).lean();
}

export async function revokeSessionsForUser(userId, reason = "password_reset") {
  return AuthSession.updateMany({ userId, revokedAt: null }, { revokedAt: new Date(), revokedReason: reason });
}

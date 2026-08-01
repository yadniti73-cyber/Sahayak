import { PasswordResetToken } from "@/server/models/passwordResetToken";

export async function createPasswordResetToken(data) {
  const token = new PasswordResetToken(data);
  return token.save();
}

export async function findPasswordResetTokenByHash(tokenHash) {
  return PasswordResetToken.findOne({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } }).lean();
}

export async function markPasswordResetTokenUsed(id) {
  return PasswordResetToken.findByIdAndUpdate(id, { usedAt: new Date() }, { new: true }).lean();
}

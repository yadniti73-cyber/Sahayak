import crypto from "crypto";
import { appConfig } from "@/server/config";

// Key: DOCUMENT_ENCRYPTION_KEY (any string) if set, otherwise derived from JWT_SECRET.
// Set DOCUMENT_ENCRYPTION_KEY explicitly in production and never rotate it without re-encrypting.
function key() {
  const secret = process.env.DOCUMENT_ENCRYPTION_KEY || appConfig.jwtSecret;
  return crypto.createHash("sha256").update(`guideshala-docs:${secret}`).digest();
}

export function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv, authTag: cipher.getAuthTag(), data };
}

export function decryptBuffer({ iv, authTag, data }) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

// Check real file type from magic bytes instead of trusting the browser's MIME.
export function sniffMime(buf) {
  if (buf.length > 4 && buf.slice(0, 4).toString() === "%PDF") return "application/pdf";
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  return null;
}

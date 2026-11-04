// Only allow same-site relative paths as post-login destinations (blocks open redirects like //evil.com).
export function safeNextPath(value, fallback = null) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

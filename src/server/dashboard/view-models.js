// Pure helpers: turn raw DB documents into small, serialisable view objects
// for the dashboards. No database access in this file.

export const DEFAULT_TZ = "Asia/Kolkata";

const STATUS_LABELS = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  RESCHEDULE_REQUESTED: "Reschedule requested",
  NO_SHOW: "No show",
  CLOSED: "Closed",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status || "Unknown";
}

function safeTz(tz) {
  try {
    new Intl.DateTimeFormat("en-IN", { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TZ;
  }
}

function ymd(date, tz) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** "Today" / "Tomorrow" / "Mon, 12 Oct" plus "6:00 PM", in the given timezone. */
export function formatWhen(value, tz = DEFAULT_TZ) {
  const zone = safeTz(tz || DEFAULT_TZ);
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return { date: "Date not set", time: "" };

  const day = ymd(start, zone);
  const today = ymd(new Date(), zone);
  const tomorrow = ymd(new Date(Date.now() + 24 * 60 * 60 * 1000), zone);

  const date =
    day === today
      ? "Today"
      : day === tomorrow
        ? "Tomorrow"
        : new Intl.DateTimeFormat("en-IN", { timeZone: zone, weekday: "short", day: "numeric", month: "short" }).format(start);

  const time = new Intl.DateTimeFormat("en-IN", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true })
    .format(start)
    .toUpperCase();

  return { date, time };
}

export function formatDate(value, tz = DEFAULT_TZ) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { timeZone: safeTz(tz), day: "numeric", month: "short", year: "numeric" }).format(d);
}

/** Start (UTC instant) of the current calendar day in `tz`. */
export function startOfDay(tz = DEFAULT_TZ, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTz(tz),
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value || 0);
  const elapsed = ((get("hour") % 24) * 60 + get("minute")) * 60 + get("second");
  return new Date(now.getTime() - elapsed * 1000);
}

export function formatNumber(n) {
  return new Intl.NumberFormat("en-IN").format(Number(n) || 0);
}

export function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
}

export function initialsOf(name = "") {
  let parts = String(name).trim().split(/\s+/).filter(Boolean);
  const withoutTitles = parts.filter((w) => !/^(dr|prof|mr|mrs|ms)\.?$/i.test(w));
  if (withoutTitles.length > 0) parts = withoutTitles;
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function toMentorCardView(profile) {
  const reviews = profile.reviewsCount || 0;
  return {
    id: String(profile._id),
    slug: profile.slug,
    name: profile.name,
    initials: initialsOf(profile.name),
    headline: profile.headline || "",
    city: profile.city || "",
    mode: profile.mode,
    availability: profile.availability || "",
    verified: Boolean(profile.verified),
    rating: reviews > 0 ? Number(profile.rating || 0).toFixed(1) : "New",
    reviews,
    experience: profile.experience || "",
    price: profile.price || "",
  };
}

/**
 * perspective: "seeker" (show mentor name), "mentor" (show seeker name),
 *              "admin"  (show both).
 * names: { mentorsByProfileId: Map, seekersById: Map }
 */
export function toBookingView(booking, perspective, names) {
  const mentorName = names.mentorsByProfileId.get(String(booking.mentorProfileId)) || "Mentor";
  const seekerName = names.seekersById.get(String(booking.seekerId)) || "Seeker";

  const tz =
    perspective === "mentor"
      ? booking.mentorTimezone
      : perspective === "seeker"
        ? booking.seekerTimezoneAtBooking
        : DEFAULT_TZ;
  const { date, time } = formatWhen(booking.startAtUtc, tz || DEFAULT_TZ);

  const counterpart =
    perspective === "seeker" ? mentorName : perspective === "mentor" ? `Seeker: ${seekerName}` : `${mentorName} with ${seekerName}`;

  return {
    id: String(booking._id),
    topic: booking.notes?.trim() || "Guidance session",
    mentor: counterpart,
    date,
    time,
    status: booking.status,
  };
}

/** Which parts of a mentor profile are filled in, and the resulting percentage. */
export function mentorProfileStrength(profile) {
  const checks = [
    ["Professional headline added", Boolean(profile?.headline?.trim())],
    ["About / bio written", Boolean(profile?.bio?.trim())],
    ["Category selected", Boolean(profile?.category?.trim())],
    ["City added", Boolean(profile?.city?.trim())],
    ["Experience listed", Boolean(profile?.experience?.trim())],
    ["Price set", Boolean(profile?.price?.trim())],
    ["Languages added", (profile?.languages?.length || 0) > 0],
    ["Specializations added", (profile?.specializations?.length || 0) > 0],
    ["Availability described", Boolean(profile?.availability?.trim())],
    ["Identity verified by GuideShala", Boolean(profile?.verified)],
  ];
  const done = checks.filter(([, ok]) => ok).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    items: checks.map(([label, ok]) => ({ label, done: ok })),
  };
}

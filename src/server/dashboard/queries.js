// Database queries that power the seeker, mentor and admin dashboards.
// Everything returned from here is plain, serialisable data (no ObjectIds / Dates
// leak into components), and there is no hardcoded sample data anywhere.
import mongoose from "mongoose";
import { connectMongo } from "@/server/db/mongo";
import { Booking } from "@/server/models/booking";
import { Category } from "@/server/models/category";
import { ensureDefaultCategories } from "@/server/repositories/categories";
import { Favorite } from "@/server/models/favorite";
import { MentorApplication } from "@/server/models/mentorApplication";
import { MentorProfile } from "@/server/models/mentorProfile";
import { Notification } from "@/server/models/notification";
import { User } from "@/server/models/user";
import {
  DEFAULT_TZ,
  formatDate,
  formatNumber,
  fullName,
  mentorProfileStrength,
  startOfDay,
  statusLabel,
  toBookingView,
  toMentorCardView,
} from "@/server/dashboard/view-models";

const UPCOMING_STATUSES = ["REQUESTED", "CONFIRMED", "RESCHEDULE_REQUESTED"];
const DAY = 24 * 60 * 60 * 1000;

const titleCase = (v) => v.charAt(0) + v.slice(1).toLowerCase();
const oid = (id) => new mongoose.Types.ObjectId(String(id));

async function statusCounts(match) {
  const rows = await Booking.aggregate([{ $match: match }, { $group: { _id: "$status", n: { $sum: 1 } } }]);
  return rows.reduce((acc, r) => ({ ...acc, [r._id]: r.n }), {});
}

/** Looks up the mentor / seeker names needed to label a list of bookings. */
async function toBookingViews(bookings, perspective) {
  if (bookings.length === 0) return [];

  const profileIds = [...new Set(bookings.map((b) => String(b.mentorProfileId)))];
  const seekerIds = [...new Set(bookings.map((b) => String(b.seekerId)))];

  const [profiles, seekers] = await Promise.all([
    perspective === "mentor" ? [] : MentorProfile.find({ _id: { $in: profileIds } }, { name: 1 }).lean(),
    perspective === "seeker" ? [] : User.find({ _id: { $in: seekerIds } }, { firstName: 1, lastName: 1, email: 1 }).lean(),
  ]);

  const names = {
    mentorsByProfileId: new Map(profiles.map((p) => [String(p._id), p.name])),
    seekersById: new Map(seekers.map((u) => [String(u._id), fullName(u) || u.email])),
  };

  return bookings.map((b) => toBookingView(b, perspective, names));
}

/* ------------------------------------------------------------------ seeker */

export async function getSeekerOverview(userId) {
  await connectMongo();
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * DAY);

  const [upcomingThisWeek, completed, savedMentors, unread, upcoming, notifications] = await Promise.all([
    Booking.countDocuments({
      seekerId: userId,
      status: { $in: ["REQUESTED", "CONFIRMED"] },
      startAtUtc: { $gte: now, $lte: weekAhead },
    }),
    Booking.countDocuments({ seekerId: userId, status: "COMPLETED" }),
    Favorite.countDocuments({ seekerId: userId }),
    Notification.countDocuments({ userId, read: false }),
    Booking.find({ seekerId: userId, status: { $in: UPCOMING_STATUSES }, startAtUtc: { $gte: now } })
      .sort({ startAtUtc: 1 })
      .limit(3)
      .lean(),
    Notification.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    stats: { upcomingThisWeek, completed, savedMentors, unread },
    upcoming: await toBookingViews(upcoming, "seeker"),
    activity: notifications.map((n) => ({
      id: String(n._id),
      title: n.title,
      message: n.message || "",
      read: Boolean(n.read),
    })),
  };
}

export async function getBookingViewsForUser(userId, role, { limit = 50 } = {}) {
  await connectMongo();
  const isMentor = role === "MENTOR";
  const bookings = await Booking.find(isMentor ? { mentorId: userId } : { seekerId: userId })
    .sort({ startAtUtc: -1 })
    .limit(limit)
    .lean();
  return toBookingViews(bookings, isMentor ? "mentor" : "seeker");
}

export async function getFavoriteMentorViews(seekerId, { limit = 50 } = {}) {
  await connectMongo();
  const favorites = await Favorite.find({ seekerId }).sort({ createdAt: -1 }).limit(limit).lean();
  if (favorites.length === 0) return [];

  const profiles = await MentorProfile.find({
    userId: { $in: favorites.map((f) => f.mentorId) },
    active: true,
    verified: true,
  }).lean();
  const byUserId = new Map(profiles.map((p) => [String(p.userId), p]));

  // Keep "most recently saved first" ordering; skip mentors whose profile is gone.
  return favorites.map((f) => byUserId.get(String(f.mentorId))).filter(Boolean).map(toMentorCardView);
}

/* ------------------------------------------------------------------ mentor */

export async function getMentorProfileForUser(userId) {
  await connectMongo();
  return MentorProfile.findOne({ userId }).lean();
}

export async function getMentorOverview(userId) {
  await connectMongo();
  const now = new Date();
  const dayStart = startOfDay(DEFAULT_TZ, now);
  const dayEnd = new Date(dayStart.getTime() + DAY);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [profile, today, pending, monthCounts, pendingList] = await Promise.all([
    MentorProfile.findOne({ userId }).lean(),
    Booking.find({ mentorId: userId, status: "CONFIRMED", startAtUtc: { $gte: dayStart, $lt: dayEnd } }, { mode: 1 }).lean(),
    Booking.countDocuments({ mentorId: userId, status: "REQUESTED" }),
    statusCounts({ mentorId: oid(userId), startAtUtc: { $gte: monthStart, $lt: nextMonth } }),
    Booking.find({ mentorId: userId, status: "REQUESTED" }).sort({ startAtUtc: 1 }).limit(3).lean(),
  ]);

  const modes = today.reduce((acc, b) => ({ ...acc, [b.mode]: (acc[b.mode] || 0) + 1 }), {});
  const modeText = [
    modes.VIDEO && `${modes.VIDEO} video`,
    modes.PHONE && `${modes.PHONE} phone`,
    modes.IN_PERSON && `${modes.IN_PERSON} in-person`,
  ]
    .filter(Boolean)
    .join(", ");

  const finished = (monthCounts.COMPLETED || 0) + (monthCounts.NO_SHOW || 0) + (monthCounts.CANCELLED || 0);
  const completion = finished > 0 ? Math.round(((monthCounts.COMPLETED || 0) / finished) * 100) : null;

  const reviews = profile?.reviewsCount || 0;

  return {
    hasProfile: Boolean(profile),
    stats: {
      todayCount: today.length,
      todayDetail: modeText || "Nothing scheduled",
      pending,
      rating: reviews > 0 ? Number(profile.rating || 0).toFixed(1) : "-",
      ratingDetail: `${formatNumber(reviews)} public ${reviews === 1 ? "review" : "reviews"}`,
      completion: completion === null ? "-" : `${completion}%`,
      completionDetail: completion === null ? "No finished sessions this month" : "Sessions this month",
    },
    strength: mentorProfileStrength(profile),
    pendingRequests: await toBookingViews(pendingList, "mentor"),
  };
}

export async function getMentorAnalytics(userId) {
  await connectMongo();
  const [profile, counts] = await Promise.all([
    MentorProfile.findOne({ userId }).lean(),
    statusCounts({ mentorId: oid(userId) }),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const finished = (counts.COMPLETED || 0) + (counts.NO_SHOW || 0) + (counts.CANCELLED || 0);
  const reviews = profile?.reviewsCount || 0;

  return {
    totals: {
      total,
      completed: counts.COMPLETED || 0,
      pending: counts.REQUESTED || 0,
      rating: reviews > 0 ? Number(profile.rating || 0).toFixed(1) : "-",
      reviews,
      completion: finished > 0 ? `${Math.round(((counts.COMPLETED || 0) / finished) * 100)}%` : "-",
    },
    breakdown: Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([status, n]) => [statusLabel(status), formatNumber(n), `${Math.round((n / total) * 100)}%`]),
  };
}

export async function getMentorUpcomingBookings(userId, { limit = 30 } = {}) {
  await connectMongo();
  const bookings = await Booking.find({ mentorId: userId, status: { $in: UPCOMING_STATUSES }, startAtUtc: { $gte: new Date() } })
    .sort({ startAtUtc: 1 })
    .limit(limit)
    .lean();
  return toBookingViews(bookings, "mentor");
}

/* ------------------------------------------------------------------- admin */

export async function getAdminOverview() {
  await connectMongo();
  const now = new Date();
  const todayStart = startOfDay(DEFAULT_TZ, now);
  const weekStart = new Date(now.getTime() - 7 * DAY);

  const [users, signupsToday, signupsWeek, verifiedMentors, pendingMentors, upcomingConfirmed, totalBookings, counts] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ createdAt: { $gte: weekStart } }),
      MentorProfile.countDocuments({ active: true, verified: true }),
      MentorApplication.countDocuments({ status: "SUBMITTED" }),
      Booking.countDocuments({ status: "CONFIRMED", startAtUtc: { $gte: now } }),
      Booking.countDocuments({}),
      statusCounts({}),
    ]);

  return {
    stats: {
      users: formatNumber(users),
      signupsToday,
      verifiedMentors: formatNumber(verifiedMentors),
      pendingMentors,
      upcomingConfirmed: formatNumber(upcomingConfirmed),
      totalBookings: formatNumber(totalBookings),
      pendingRequests: formatNumber(counts.REQUESTED || 0),
    },
    rows: [
      ["Verification queue", `${formatNumber(pendingMentors)} mentors`, pendingMentors > 0 ? "Needs review" : "All clear"],
      ["Signups today", `${formatNumber(signupsToday)} users`, `${formatNumber(signupsWeek)} in the last 7 days`],
      ["Pending booking requests", `${formatNumber(counts.REQUESTED || 0)} bookings`, (counts.REQUESTED || 0) > 0 ? "Awaiting mentors" : "All clear"],
      ["Completed sessions", `${formatNumber(counts.COMPLETED || 0)} sessions`, `${formatNumber(counts.CANCELLED || 0)} cancelled`],
    ],
  };
}

export async function getAdminUsers({ limit = 100 } = {}) {
  await connectMongo();
  const [total, users] = await Promise.all([User.countDocuments({}), User.find({}).sort({ createdAt: -1 }).limit(limit).lean()]);
  return {
    total,
    rows: users.map((u) => [
      fullName(u) || "(no name)",
      u.email,
      titleCase(u.role || "SEEKER"),
      titleCase(u.status || "ACTIVE"),
      formatDate(u.createdAt),
    ]),
  };
}

export async function getAdminMentors({ limit = 100 } = {}) {
  await connectMongo();
  const profiles = await MentorProfile.find({}).sort({ verified: 1, createdAt: -1 }).limit(limit).lean();
  return profiles.map((p) => ({
    id: String(p._id),
    name: p.name,
    headline: p.headline || "",
    category: p.category,
    city: p.city || "",
    verified: Boolean(p.verified),
    active: Boolean(p.active),
  }));
}

export async function getAdminBookings({ limit = 50 } = {}) {
  await connectMongo();
  const bookings = await Booking.find({}).sort({ startAtUtc: -1 }).limit(limit).lean();
  return toBookingViews(bookings, "admin");
}

export async function getAdminCategories() {
  await connectMongo();
  await ensureDefaultCategories();
  const [categories, mentorCounts] = await Promise.all([
    Category.find({ active: true }).sort({ name: 1 }).lean(),
    MentorProfile.aggregate([{ $match: { active: true, verified: true } }, { $group: { _id: { $toLower: "$category" }, n: { $sum: 1 } } }]),
  ]);
  const counts = new Map(mentorCounts.map((c) => [c._id, c.n]));
  return categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    description: c.description,
    // Live count, so it never drifts from the stored `mentorCount` field.
    mentorCount: counts.get(c.name.toLowerCase()) ?? 0,
  }));
}

import { MentorProfile } from "@/server/models/mentorProfile";

export async function findPublishedMentors({ category, search, limit = 20, offset = 0 } = {}) {
  const query = { active: true, verified: true };

  if (category) {
    const sanitized = category.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.category = new RegExp(`^${sanitized}$`, "i");
  }

  if (search) {
    const searchTerm = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    query.$or = [
      { name: searchTerm },
      { headline: searchTerm },
      { bio: searchTerm },
      { category: searchTerm },
    ];
  }

  return MentorProfile.find(query)
    .sort({ verified: -1, rating: -1, reviewsCount: -1, name: 1 })
    .skip(offset)
    .limit(limit)
    .lean();
}

export async function findMentorBySlug(slug) {
  return MentorProfile.findOne({
    slug: String(slug || "").toLowerCase().trim(),
    active: true,
    verified: true,
  }).lean();
}

export async function findMentorById(id) {
  return MentorProfile.findById(id).lean();
}

export async function findMentorByUserId(userId) {
  return MentorProfile.findOne({ userId }).lean();
}

export async function slugExists(slug) {
  const normalizedSlug = String(slug || "").toLowerCase().trim();
  return Boolean(await MentorProfile.exists({ slug: normalizedSlug }));
}

export async function findMentorsForAdmin({ status } = {}) {
  const query = {};

  if (status === "APPROVED") {
    query.$or = [
      { verificationStatus: "APPROVED" },
      { verificationStatus: { $exists: false }, verified: true },
      { verificationStatus: "NOT_SUBMITTED", verified: true },
    ];
  } else if (status === "NOT_SUBMITTED") {
    query.$and = [
      {
        $or: [
          { verificationStatus: { $exists: false } },
          { verificationStatus: "NOT_SUBMITTED" },
        ],
      },
      { verified: { $ne: true } },
    ];
  } else if (status) {
    query.verificationStatus = status;
  }

  return MentorProfile.find(query)
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean();
}

export async function updateMentorProfileById(id, updates) {
  return MentorProfile.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();
}

export async function createMentorProfile(data) {
  const profile = new MentorProfile(data);
  return profile.save();
}

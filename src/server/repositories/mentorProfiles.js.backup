import { MentorProfile } from "@/server/models/mentorProfile";

export async function findPublishedMentors({ category, search, limit = 20, offset = 0 } = {}) {
  // Only admin-verified mentors are ever visible to seekers.
  const query = { active: true, verified: true };

  if (category) {
    const sanitized = category.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.category = new RegExp(`^${sanitized}$`, "i");
  }

  if (search) {
    const searchTerm = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
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
  return MentorProfile.findOne({ slug: slug.toLowerCase().trim(), active: true, verified: true }).lean();
}

export async function findMentorById(id) {
  return MentorProfile.findById(id).lean();
}

export async function createMentorProfile(data) {
  const profile = new MentorProfile(data);
  return profile.save();
}

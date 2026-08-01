import { connectMongo } from "@/server/db/mongo";
import { findAllCategories } from "@/server/repositories/categories";
import { findPublishedMentors, findMentorBySlug } from "@/server/repositories/mentorProfiles";

export async function getCategories() {
  await connectMongo();
  return findAllCategories();
}

export async function getMentors({ category, search, limit, offset } = {}) {
  await connectMongo();
  return findPublishedMentors({ category, search, limit, offset });
}

export async function getMentorBySlug(slug) {
  await connectMongo();
  return findMentorBySlug(slug);
}

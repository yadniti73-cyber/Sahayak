import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { findUserById } from "@/server/repositories/users";
import { addFavorite, removeFavorite, findFavoritesForSeeker, findFavorite } from "@/server/repositories/favorites";

const favoritePayload = z.object({
  mentorId: z.string().min(1),
});

export async function addMentorToFavorites(seekerId, payload) {
  const parsed = favoritePayload.parse(payload);
  await connectMongo();

  const mentor = await findUserById(parsed.mentorId);
  if (!mentor || mentor.role !== "MENTOR") {
    throw new Error("Mentor not found.");
  }

  const existing = await findFavorite(seekerId, parsed.mentorId);
  if (existing) {
    return existing;
  }

  return addFavorite({ seekerId, mentorId: parsed.mentorId });
}

export async function removeMentorFromFavorites(seekerId, mentorId) {
  await connectMongo();
  return removeFavorite(seekerId, mentorId);
}

export async function getFavoriteMentors(seekerId, { limit = 20, offset = 0 } = {}) {
  await connectMongo();
  return findFavoritesForSeeker(seekerId, { limit, offset });
}

import { Favorite } from "@/server/models/favorite";

export async function addFavorite(data) {
  const favorite = new Favorite(data);
  return favorite.save();
}

export async function removeFavorite(seekerId, mentorId) {
  return Favorite.findOneAndDelete({ seekerId, mentorId }).lean();
}

export async function findFavoritesForSeeker(seekerId, { limit = 20, offset = 0 } = {}) {
  return Favorite.find({ seekerId }).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();
}

export async function findFavorite(seekerId, mentorId) {
  return Favorite.findOne({ seekerId, mentorId }).lean();
}

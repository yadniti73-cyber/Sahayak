import { Review } from "@/server/models/review";

export async function createReview(data) {
  const review = new Review(data);
  return review.save();
}

export async function findReviewByBooking(bookingId) {
  return Review.findOne({ bookingId }).lean();
}

export async function findReviewsForMentor(mentorId, { limit = 20, offset = 0 } = {}) {
  return Review.find({ mentorId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();
}

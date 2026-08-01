import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { findBookingById } from "@/server/repositories/bookings";
import { createReview, findReviewByBooking, findReviewsForMentor } from "@/server/repositories/reviews";

const reviewPayload = z.object({
  bookingId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function submitReview(seekerId, payload) {
  const parsed = reviewPayload.parse(payload);
  await connectMongo();

  const booking = await findBookingById(parsed.bookingId);
  if (!booking) {
    throw new Error("Booking not found.");
  }
  if (booking.seekerId.toString() !== seekerId) {
    throw new Error("You can only review your own bookings.");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("Reviews can only be submitted after a completed booking.");
  }

  const existingReview = await findReviewByBooking(parsed.bookingId);
  if (existingReview) {
    throw new Error("A review has already been submitted for this booking.");
  }

  const review = await createReview({
    bookingId: parsed.bookingId,
    mentorId: booking.mentorId,
    seekerId,
    rating: parsed.rating,
    comment: parsed.comment || "",
  });

  return review;
}

export async function getMentorReviews(mentorId, { limit = 20, offset = 0 } = {}) {
  await connectMongo();
  return findReviewsForMentor(mentorId, { limit, offset });
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { submitReview, getMentorReviews } from "@/features/reviews/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const mentorId = url.searchParams.get("mentorId");
    const limit = Number(url.searchParams.get("limit") || 20);
    const offset = Number(url.searchParams.get("offset") || 0);

    if (!mentorId) {
      return NextResponse.json(errorResponse("mentorId is required."), { status: 400 });
    }

    const reviews = await getMentorReviews(mentorId, { limit, offset });
    return NextResponse.json(successResponse({ reviews }, "Reviews loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load reviews."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const review = await submitReview(user.id, payload);
    return NextResponse.json(successResponse({ review }, "Review submitted."), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to submit review."), { status: 400 });
  }
}

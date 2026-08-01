import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { removeMentorFromFavorites } from "@/features/favorites/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function DELETE({ params }) {
  try {
    const user = await requireAuth();
    const removed = await removeMentorFromFavorites(user.id, params.mentorId);
    if (!removed) {
      return NextResponse.json(errorResponse("Favorite not found."), { status: 404 });
    }
    return NextResponse.json(successResponse({ favorite: removed }, "Favorite removed."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to remove favorite."), { status: 400 });
  }
}

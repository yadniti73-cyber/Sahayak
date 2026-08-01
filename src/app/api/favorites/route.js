import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { addMentorToFavorites, getFavoriteMentors } from "@/features/favorites/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || 20);
    const offset = Number(url.searchParams.get("offset") || 0);
    const favorites = await getFavoriteMentors(user.id, { limit, offset });
    return NextResponse.json(successResponse({ favorites }, "Favorites loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load favorites."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const favorite = await addMentorToFavorites(user.id, payload);
    return NextResponse.json(successResponse({ favorite }, "Mentor added to favorites."), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to add favorite."), { status: 400 });
  }
}

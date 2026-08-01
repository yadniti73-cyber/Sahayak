import { NextResponse } from "next/server";
import { getMentors } from "@/features/catalog/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || undefined;
    const search = url.searchParams.get("search") || undefined;
    const limit = Number(url.searchParams.get("limit") || 20);
    const offset = Number(url.searchParams.get("offset") || 0);

    const mentors = await getMentors({ category, search, limit, offset });
    return NextResponse.json(successResponse({ mentors }, "Mentors loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load mentors."), { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getMentorBySlug } from "@/features/catalog/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET(request, { params }) {
  try {
    const mentor = await getMentorBySlug(params.slug);
    if (!mentor) {
      return NextResponse.json(errorResponse("Mentor not found."), { status: 404 });
    }
    return NextResponse.json(successResponse({ mentor }, "Mentor loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load mentor."), { status: 500 });
  }
}

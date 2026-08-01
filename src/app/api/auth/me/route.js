import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/guards";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthenticated."), { status: 401 });
    }
    return NextResponse.json(successResponse({ user }, "Current user loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load current user."), { status: 500 });
  }
}

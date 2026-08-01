import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { getUserProfile, updateUserProfile } from "@/features/user-account/server/service";
import { errorResponse, successResponse } from "@/server/utils/api-response";

export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await getUserProfile(user.id);
    return NextResponse.json(successResponse({ profile }, "Profile loaded."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to load profile."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request) {
  try {
    const user = await requireAuth();
    const payload = await request.json();
    const profile = await updateUserProfile(user.id, payload);
    return NextResponse.json(successResponse({ profile }, "Profile updated."));
  } catch (error) {
    return NextResponse.json(errorResponse(error.message || "Unable to update profile."), { status: error.message === "Unauthorized" ? 401 : 400 });
  }
}

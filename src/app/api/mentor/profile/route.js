import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { getMentorApplication, saveApplicationDraft } from "@/features/mentor-profiles/server/service";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function GET() {
  try {
    const user = await requireRole("MENTOR");
    return NextResponse.json(successResponse(await getMentorApplication(user)));
  } catch (error) {
    return handleRouteError(error, "Unable to load your profile.");
  }
}

// Saves the application as a draft. Seekers never see drafts.
export async function PUT(request) {
  try {
    const user = await requireRole("MENTOR");
    const payload = await request.json();
    return NextResponse.json(successResponse(await saveApplicationDraft(user, payload), "Draft saved."));
  } catch (error) {
    return handleRouteError(error, "Unable to save your profile.");
  }
}

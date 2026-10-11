import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { listMentorApplications } from "@/features/admin/server/mentorVerificationService";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function GET(request) {
  try {
    await requireRole("ADMIN");
    const status = new URL(request.url).searchParams.get("status") || undefined;
    return NextResponse.json(successResponse({ mentors: await listMentorApplications({ status }) }));
  } catch (error) {
    return handleRouteError(error, "Unable to load mentors.");
  }
}

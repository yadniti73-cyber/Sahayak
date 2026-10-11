import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { getMentorApplicationForAdmin } from "@/features/admin/server/mentorVerificationService";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function GET(_request, { params }) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    return NextResponse.json(successResponse(await getMentorApplicationForAdmin(id)));
  } catch (error) {
    return handleRouteError(error, "Unable to load the application.");
  }
}

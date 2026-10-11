import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { submitApplication } from "@/features/mentor-profiles/server/service";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function POST(request) {
  try {
    const user = await requireRole("MENTOR");
    const payload = await request.json().catch(() => null);
    return NextResponse.json(successResponse(await submitApplication(user, payload), "Submitted for review."));
  } catch (error) {
    return handleRouteError(error, "Unable to submit your application.");
  }
}

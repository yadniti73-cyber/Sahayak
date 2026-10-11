import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { submitMentorApplication } from "@/features/mentor-verification/server/service";
import { verificationErrorResponse } from "@/server/utils/route-errors";
import { revalidateMentorPages } from "@/server/utils/revalidate-mentors";
import { successResponse } from "@/server/utils/api-response";

export async function POST() {
  try {
    const user = await requireRole("MENTOR");
    const application = await submitMentorApplication(user.id);
    revalidateMentorPages();
    return NextResponse.json(successResponse({ application }, "Submitted for review."), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

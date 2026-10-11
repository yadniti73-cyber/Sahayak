import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { reviewMentorApplication } from "@/features/mentor-verification/server/service";
import { verificationErrorResponse } from "@/server/utils/route-errors";
import { revalidateMentorPages } from "@/server/utils/revalidate-mentors";
import { successResponse } from "@/server/utils/api-response";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const admin = await requireRole("ADMIN");
    const payload = await request.json().catch(() => ({}));
    const application = await reviewMentorApplication(admin, id, payload);
    revalidateMentorPages();
    return NextResponse.json(successResponse({ application }, "Review saved."), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { getMentorApplication, saveMentorApplication } from "@/features/mentor-verification/server/service";
import { verificationErrorResponse } from "@/server/utils/route-errors";
import { revalidateMentorPages } from "@/server/utils/revalidate-mentors";
import { successResponse } from "@/server/utils/api-response";

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  try {
    const user = await requireRole("MENTOR");
    const application = await getMentorApplication(user.id);
    return NextResponse.json(successResponse({ application }, "Application loaded."), noStore);
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

export async function PUT(request) {
  try {
    const user = await requireRole("MENTOR");
    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object") throw new Error("Invalid request body.");
    const application = await saveMentorApplication(user.id, payload);
    revalidateMentorPages();
    return NextResponse.json(successResponse({ application }, "Draft saved."), noStore);
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

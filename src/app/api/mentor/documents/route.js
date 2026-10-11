import { NextResponse } from "next/server";
import { requireRole } from "@/server/auth/guards";
import { addMentorDocument, MentorVerificationError } from "@/features/mentor-verification/server/service";
import { verificationErrorResponse } from "@/server/utils/route-errors";
import { revalidateMentorPages } from "@/server/utils/revalidate-mentors";
import { successResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const user = await requireRole("MENTOR");
    const form = await request.formData().catch(() => null);
    if (!form) throw new MentorVerificationError("Upload could not be read.");

    const result = await addMentorDocument(user.id, {
      type: String(form.get("type") || ""),
      label: String(form.get("label") || ""),
      file: form.get("file"),
    });
    if (result.unlisted) revalidateMentorPages();
    return NextResponse.json(successResponse(result, "Document uploaded."), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

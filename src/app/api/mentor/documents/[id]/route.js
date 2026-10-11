import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/server/auth/guards";
import { getDocumentForViewer, removeMentorDocument } from "@/features/mentor-verification/server/service";
import { verificationErrorResponse } from "@/server/utils/route-errors";
import { revalidateMentorPages } from "@/server/utils/revalidate-mentors";
import { successResponse } from "@/server/utils/api-response";

export const runtime = "nodejs";

// Private: only the mentor who uploaded it, or an admin, can open a document.
export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const viewer = await requireAuth();
    const doc = await getDocumentForViewer(viewer, id);

    const ext = doc.mimeType === "application/pdf" ? "pdf" : doc.mimeType === "image/png" ? "png" : "jpg";
    return new NextResponse(doc.data, {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(doc.data.length),
        "Content-Disposition": `inline; filename="${doc.type.toLowerCase()}-${doc._id}.${ext}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const user = await requireRole("MENTOR");
    const result = await removeMentorDocument(user.id, id);
    if (result.unlisted) revalidateMentorPages();
    return NextResponse.json(successResponse(result, "Document removed."), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return verificationErrorResponse(error);
  }
}

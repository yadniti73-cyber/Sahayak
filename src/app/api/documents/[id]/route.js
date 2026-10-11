import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/guards";
import { getDocumentForDownload } from "@/features/mentor-profiles/server/service";
import { handleRouteError } from "@/server/utils/route-helpers";

export const runtime = "nodejs";

// Owner (the mentor) or an admin. Everyone else gets a 404.
export async function GET(_request, { params }) {
  try {
    const viewer = await requireAuth();
    const { id } = await params;
    const { buffer, mimeType, name } = await getDocumentForDownload(viewer, id);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(name)}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return handleRouteError(error, "Unable to open the document.");
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/server/auth/guards";
import { decideOnApplication } from "@/features/admin/server/mentorVerificationService";
import { successResponse } from "@/server/utils/api-response";
import { handleRouteError } from "@/server/utils/route-helpers";

export async function POST(request, { params }) {
  try {
    const admin = await requireRole("ADMIN");
    const { id } = await params;
    const payload = await request.json();
    const result = await decideOnApplication(admin, id, payload);
    // Make approval / removal show up on the public portal right away.
    revalidatePath("/mentors");
    revalidatePath("/mentors/[slug]", "page");
    revalidatePath("/categories");
    return NextResponse.json(successResponse(result, "Decision saved."));
  } catch (error) {
    return handleRouteError(error, "Unable to save the decision.");
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/server/auth/guards";
import { createNewCategory } from "@/features/catalog/server/service";
import { handleRouteError } from "@/server/utils/route-helpers";
import { successResponse } from "@/server/utils/api-response";

export async function POST(request) {
  try {
    await requireRole("ADMIN");
    const payload = await request.json().catch(() => ({}));
    const category = await createNewCategory(payload);
    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    return NextResponse.json(successResponse({ category }, "Category created."), { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Unable to create category.");
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/server/auth/guards";
import { removeCategory, updateExistingCategory } from "@/features/catalog/server/service";
import { handleRouteError } from "@/server/utils/route-helpers";
import { successResponse } from "@/server/utils/api-response";

export async function PATCH(request, { params }) {
  try {
    await requireRole("ADMIN");
    const { slug } = await params;
    const payload = await request.json().catch(() => ({}));
    const category = await updateExistingCategory(slug, payload);
    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    revalidatePath("/category/[slug]", "page");
    revalidatePath(`/category/${slug}`);
    revalidatePath(`/category/${category.slug}`);
    return NextResponse.json(successResponse({ category }, "Category updated."));
  } catch (error) {
    return handleRouteError(error, "Unable to update category.");
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireRole("ADMIN");
    const { slug } = await params;
    const category = await removeCategory(slug);
    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    revalidatePath("/category/[slug]", "page");
    revalidatePath(`/category/${slug}`);
    return NextResponse.json(successResponse({ category }, "Category deleted."));
  } catch (error) {
    return handleRouteError(error, "Unable to delete category.");
  }
}

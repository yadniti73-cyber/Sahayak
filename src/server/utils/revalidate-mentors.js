import { revalidatePath } from "next/cache";
import { categories } from "@/lib/frontend-data";

/** Refresh the cached public pages after verification changes who is visible. */
export function revalidateMentorPages() {
  try {
    revalidatePath("/mentors");
    revalidatePath("/mentors/[slug]", "page");
    for (const category of categories) revalidatePath(`/category/${category.slug}`);
    revalidatePath("/admin/mentors");
  } catch (error) {
    console.error("[mentor-verification] revalidate failed", error);
  }
}

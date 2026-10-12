import { revalidatePath } from "next/cache";

/** Refresh the cached public pages after verification changes who is visible. */
export function revalidateMentorPages() {
  try {
    revalidatePath("/mentors");
    revalidatePath("/mentors/[slug]", "page");
    revalidatePath("/category/[slug]", "page");
    revalidatePath("/admin/mentors");
  } catch (error) {
    console.error("[mentor-verification] revalidate failed", error);
  }
}

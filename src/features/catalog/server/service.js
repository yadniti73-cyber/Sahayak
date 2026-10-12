import { connectMongo } from "@/server/db/mongo";
import {
  createCategory,
  findAllCategories,
  findCategoryByNameOrSlug,
  findCategoryBySlug,
} from "@/server/repositories/categories";
import { CATEGORY_ICON_NAMES, slugifyCategory } from "@/lib/category-presets";
import { findPublishedMentors, findMentorBySlug } from "@/server/repositories/mentorProfiles";

export async function getCategories() {
  await connectMongo();
  return findAllCategories();
}

export async function getCategoryBySlug(slug) {
  await connectMongo();
  return findCategoryBySlug(slug);
}

function categoryError(message, status, errors = []) {
  return Object.assign(new Error(message), { status, errors });
}

/** Admin: add a new category. Throws errors with a `status` that handleRouteError understands. */
export async function createNewCategory(input = {}) {
  const name = String(input.name || "").trim().replace(/\s+/g, " ");
  const description = String(input.description || "").trim();
  const icon = CATEGORY_ICON_NAMES.includes(input.icon) ? input.icon : "BookOpen";
  const slug = slugifyCategory(name);

  if (name.length < 2 || name.length > 60 || !slug) throw categoryError("Category name must be 2 to 60 characters.", 400);
  if (description.length > 200) throw categoryError("Description must be 200 characters or fewer.", 400);

  await connectMongo();
  if (await findCategoryByNameOrSlug(name, slug)) throw categoryError("A category with this name already exists.", 409);

  try {
    const created = await createCategory({ name, slug, description, icon });
    return { name: created.name, slug: created.slug, icon: created.icon, description: created.description };
  } catch (error) {
    if (error?.code === 11000) throw categoryError("A category with this name already exists.", 409);
    throw error;
  }
}

export async function getMentors({ category, search, limit, offset } = {}) {
  await connectMongo();
  return findPublishedMentors({ category, search, limit, offset });
}

export async function getMentorBySlug(slug) {
  await connectMongo();
  return findMentorBySlug(slug);
}

import mongoose from "mongoose";
import { connectMongo } from "@/server/db/mongo";
import { Category } from "@/server/models/category";
import {
  createCategory,
  findAllCategories,
  findCategoryByNameOrSlug,
  findCategoryBySlug,
  findCategoryBySlugForAdmin,
  categoryHasReferences,
  renameCategoryReferences,
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


/** Admin: update a category and migrate any text-based category references. */
export async function updateExistingCategory(currentSlug, input = {}) {
  const oldSlug = String(currentSlug || "").toLowerCase().trim();
  const name = String(input.name || "").trim().replace(/\s+/g, " ");
  const description = String(input.description || "").trim();
  const icon = CATEGORY_ICON_NAMES.includes(input.icon) ? input.icon : "BookOpen";
  const slug = slugifyCategory(name);

  if (!oldSlug) throw categoryError("Invalid category.", 400);
  if (name.length < 2 || name.length > 60 || !slug) throw categoryError("Category name must be 2 to 60 characters.", 400);
  if (description.length > 200) throw categoryError("Description must be 200 characters or fewer.", 400);

  await connectMongo();
  const existing = await findCategoryBySlugForAdmin(oldSlug);
  if (!existing) throw categoryError("Category not found.", 404);

  const duplicate = await findCategoryByNameOrSlug(name, slug);
  if (duplicate && String(duplicate._id) !== String(existing._id)) {
    throw categoryError("A category with this name already exists.", 409);
  }

  const session = await mongoose.startSession();
  let updated;
  try {
    await session.withTransaction(async () => {
      updated = await Category.findOneAndUpdate(
        { _id: existing._id, active: true },
        { $set: { name, slug, description, icon, updatedAt: new Date() } },
        { new: true, runValidators: true, session }
      ).lean();
      if (!updated) throw categoryError("Category not found.", 404);
      if (existing.name !== name) {
        await renameCategoryReferences(existing.name, name, session);
      }
    });
  } catch (error) {
    if (error?.code === 11000) throw categoryError("A category with this name already exists.", 409);
    throw error;
  } finally {
    await session.endSession();
  }

  return { name: updated.name, slug: updated.slug, icon: updated.icon, description: updated.description };
}

/** Admin: soft-delete only categories that are not referenced by mentor data. */
export async function removeCategory(slugValue) {
  const slug = String(slugValue || "").toLowerCase().trim();
  if (!slug) throw categoryError("Invalid category.", 400);
  await connectMongo();
  const category = await findCategoryBySlugForAdmin(slug);
  if (!category) throw categoryError("Category not found.", 404);

  if (await categoryHasReferences(category.name)) {
    throw categoryError("This category is assigned to a mentor profile or application. Reassign those records before deleting it.", 409);
  }

  await Category.updateOne({ _id: category._id, active: true }, { $set: { active: false, updatedAt: new Date() } });
  return { slug, name: category.name };
}

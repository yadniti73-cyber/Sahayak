import { Category } from "@/server/models/category";
import { MentorProfile } from "@/server/models/mentorProfile";
import { MentorVerification } from "@/server/models/mentorVerification";
import { CATEGORY_PRESETS } from "@/lib/category-presets";

let defaultsEnsured = false;

/**
 * Inserts any of the 20 preset categories that are missing. Existing records
 * (including ones an admin edited) are left untouched. Runs once per server process.
 */
export async function ensureDefaultCategories() {
  if (defaultsEnsured) return;
  await Category.bulkWrite(
    CATEGORY_PRESETS.map((preset) => ({
      updateOne: {
        filter: { slug: preset.slug },
        update: { $setOnInsert: { ...preset, active: true, mentorCount: 0 } },
        upsert: true,
      },
    })),
    { ordered: false }
  );
  defaultsEnsured = true;
}

export async function findAllCategories() {
  await ensureDefaultCategories();
  return Category.find({ active: true }).sort({ name: 1 }).lean();
}

export async function findCategoryBySlug(slug) {
  await ensureDefaultCategories();
  return Category.findOne({ slug: String(slug).toLowerCase().trim(), active: true }).lean();
}

export async function findCategoryByNameOrSlug(name, slug) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Category.findOne({ $or: [{ slug }, { name: new RegExp(`^${escaped}$`, "i") }] }).lean();
}

export async function createCategory(data) {
  const category = new Category(data);
  return category.save();
}


export async function findCategoryBySlugForAdmin(slug) {
  return Category.findOne({ slug: String(slug || "").toLowerCase().trim(), active: true }).lean();
}

export async function categoryHasReferences(name) {
  const escaped = String(name || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const exactName = new RegExp(`^${escaped}$`, "i");
  const [profile, verification] = await Promise.all([
    MentorProfile.exists({ category: exactName }),
    MentorVerification.exists({ "profile.category": exactName }),
  ]);
  return Boolean(profile || verification);
}

export async function renameCategoryReferences(oldName, newName, session) {
  const escaped = String(oldName || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const exactName = new RegExp(`^${escaped}$`, "i");
  await Promise.all([
    MentorProfile.updateMany({ category: exactName }, { $set: { category: newName } }, { session }),
    MentorVerification.updateMany({ "profile.category": exactName }, { $set: { "profile.category": newName } }, { session }),
  ]);
}

import { Category } from "@/server/models/category";

export async function findAllCategories() {
  return Category.find({ active: true }).sort({ name: 1 }).lean();
}

export async function findCategoryBySlug(slug) {
  return Category.findOne({ slug: slug.toLowerCase().trim(), active: true }).lean();
}

export async function createCategory(data) {
  const category = new Category(data);
  return category.save();
}

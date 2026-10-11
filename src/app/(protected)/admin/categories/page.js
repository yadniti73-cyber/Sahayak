import { DashboardShell, ButtonLink, EmptyState, SectionHeading } from "@/components";
import { CategoryGrid } from "@/components/page-sections";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getAdminCategories } from "@/server/dashboard/queries";

export default async function AdminCategoriesPage() {
  await requirePageAccess(["ADMIN"]);
  const categories = await getAdminCategories();

  return (
    <DashboardShell role="admin" title="Categories">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Taxonomy"
            title="Manage mentorship categories"
            description="Categories power discovery, profile classification, filters, and SEO-friendly pages."
          />
          <ButtonLink href="/admin/categories">Add category</ButtonLink>
        </div>
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Categories stored in the database will be listed here." />
        ) : (
          <CategoryGrid items={categories} />
        )}
      </div>
    </DashboardShell>
  );
}

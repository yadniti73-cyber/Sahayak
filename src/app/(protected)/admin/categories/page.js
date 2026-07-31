import { DashboardShell, ButtonLink, SectionHeading } from "@/components";
import { CategoryGrid } from "@/components/page-sections";

export default function AdminCategoriesPage() {
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
        <CategoryGrid />
      </div>
    </DashboardShell>
  );
}

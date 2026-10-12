import { notFound } from "next/navigation";
import { PublicShell, ButtonLink, EmptyState, SectionHeading } from "@/components";
import { MentorGrid } from "@/components/page-sections";
import { getCategoryBySlug, getMentors } from "@/features/catalog/server/service";

// Re-check the database regularly; approvals also revalidate this page immediately.
export const revalidate = 60;

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Only verified mentors are returned.
  const visibleMentors = await getMentors({ category: category.name, limit: 24 });

  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container">
          <SectionHeading
            eyebrow="Category"
            title={`${category.name} mentors`}
            description={category.description}
          />
          <div className="mt-6">
            <ButtonLink href="/mentors" variant="secondary">Explore all mentors</ButtonLink>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="app-container">
          {visibleMentors.length ? (
            <MentorGrid items={visibleMentors} />
          ) : (
            <EmptyState
              title="No verified mentors here yet"
              description="We are verifying new mentors every week. Browse all mentors or check back soon."
              action={<ButtonLink href="/mentors">Explore all mentors</ButtonLink>}
            />
          )}
        </div>
      </section>
    </PublicShell>
  );
}

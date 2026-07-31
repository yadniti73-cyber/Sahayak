import { notFound } from "next/navigation";
import { PublicShell, ButtonLink, SectionHeading } from "@/components";
import { MentorGrid } from "@/components/page-sections";
import { categories, mentors } from "@/lib/frontend-data";

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryMentors = mentors.filter((mentor) => mentor.category === category.name);
  const visibleMentors = categoryMentors.length ? categoryMentors : mentors.slice(0, 2);

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
          <MentorGrid items={visibleMentors} />
        </div>
      </section>
    </PublicShell>
  );
}

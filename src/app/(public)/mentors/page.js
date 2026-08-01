import { PublicShell, SectionHeading } from "@/components";
import { FilterStrip, MentorGrid } from "@/components/page-sections";
import { getMentors } from "@/features/catalog/server/service";

export default async function MentorsPage() {
  const mentors = await getMentors({ limit: 20 });

  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container">
          <SectionHeading
            eyebrow="Mentor discovery"
            title="Find someone who understands your journey"
            description="Search verified mentors by category, city, language, session mode, price, rating, and availability."
          />
          <div className="mt-8">
            <FilterStrip />
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="app-container">
          <MentorGrid items={mentors} />
        </div>
      </section>
    </PublicShell>
  );
}

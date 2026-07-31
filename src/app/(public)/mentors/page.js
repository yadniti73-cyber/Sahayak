import { PublicShell, SectionHeading } from "@/components";
import { FilterStrip, MentorGrid } from "@/components/page-sections";

export default function MentorsPage() {
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
          <MentorGrid />
        </div>
      </section>
    </PublicShell>
  );
}

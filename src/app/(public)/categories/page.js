import { PublicShell, SectionHeading } from "@/components";
import { CategoryGrid } from "@/components/page-sections";

export default function CategoriesPage() {
  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container">
          <SectionHeading
            eyebrow="Categories"
            title="Guidance across life domains"
            description="Browse mentorship categories designed for students, farmers, patients, parents, professionals, founders, and creators."
          />
        </div>
      </section>
      <section className="py-10">
        <div className="app-container">
          <CategoryGrid />
        </div>
      </section>
    </PublicShell>
  );
}

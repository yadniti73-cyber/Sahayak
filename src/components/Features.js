import { categories } from "@/lib/frontend-data";
import { CategoryImageCard } from "./CategoryImageCard";
import { SectionHeading } from "./app-primitives";
import { Reveal } from "./Reveal";

export function Features() {
  return (
    <section id="features" className="bg-gradient-to-b from-white via-blue-50/40 to-white py-14">
      <div className="app-container">
        <Reveal>
          <SectionHeading
            as="h2"
            eyebrow="Why GuideShala"
            title="Find experts who"
            highlight="have been there"
            description="Search engines provide answers. GuideShala helps people reach someone experienced enough to guide the next step."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category, i) => (
            <Reveal key={category.slug} delay={(i % 4) * 90}>
              <CategoryImageCard category={category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

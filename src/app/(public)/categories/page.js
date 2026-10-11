import { ListFilter, MousePointerClick, UserRoundCheck } from "lucide-react";
import { PublicShell, ButtonLink, Panel } from "@/components";
import { PageHero, Section, NumberDot } from "@/components/PageHero";
import { CategoryImageCard } from "@/components/CategoryImageCard";
import { Reveal } from "@/components/Reveal";
import { getCategories } from "@/features/catalog/server/service";

const picks = [
  [MousePointerClick, "Choose the area", "Start with the part of life the decision belongs to: work, health, farming, money, family or learning."],
  [ListFilter, "Narrow the list", "Inside a category, filter guides by city, language, session mode and price."],
  [UserRoundCheck, "Check the profile", "Look at verification, experience and ratings before you request a session."],
];

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <PublicShell>
      <PageHero
        eyebrow="Categories"
        title="Guidance across"
        highlight="life domains"
        description="Browse mentorship categories designed for students, farmers, patients, parents, professionals, founders, and creators."
      />

      <Section eyebrow="Browse" title="Pick the area you need" highlight="help with">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Reveal key={category.slug} delay={(i % 4) * 90}>
              <CategoryImageCard category={category} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="green" eyebrow="Not sure where to start" title="Three steps to the" highlight="right guide">
        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-gradient-to-r from-app-primary/30 to-green-500/30 md:block" aria-hidden="true" />
          {picks.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="relative text-center">
                <div className="flex justify-center"><NumberDot n={i + 1} /></div>
                <Icon size={22} className="mx-auto mt-4 text-app-primary" aria-hidden="true" />
                <h3 className="mt-2 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-app-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <Panel className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-green-50">
            <div>
              <h2 className="text-xl font-bold">Your area is not listed?</h2>
              <p className="mt-1 text-sm text-app-muted">Tell us what you need guidance on. New categories are added based on what people ask for.</p>
            </div>
            <ButtonLink href="/contact" variant="green">Suggest a category</ButtonLink>
          </Panel>
        </Reveal>
      </Section>
    </PublicShell>
  );
}

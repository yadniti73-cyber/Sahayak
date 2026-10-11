import Link from "next/link";
import { Clock, Languages, SearchX, ShieldCheck, Star, Wallet } from "lucide-react";
import { PublicShell, ButtonLink, Panel } from "@/components";
import { FilterStrip, MentorGrid } from "@/components/page-sections";
import { PageHero, Section } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getCategories, getMentors } from "@/features/catalog/server/service";

const tips = [
  [ShieldCheck, "Check verification", "The Verified badge means identity details were checked."],
  [Languages, "Match your language", "A guide who speaks your language saves time and confusion."],
  [Clock, "Look at availability", "Pick someone whose open slots fit your week."],
  [Star, "Read the ratings", "Ratings and review counts come from finished sessions."],
  [Wallet, "Know the price", "Each profile shows the price before you request."],
];

export default async function MentorsPage() {
  const [mentors, categories] = await Promise.all([getMentors({ limit: 20 }), getCategories()]);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Mentor discovery"
        title="Find someone who understands"
        highlight="your journey"
        description="Search verified mentors by category, city, language, session mode, price, rating, and availability."
      >
        <FilterStrip />
      </PageHero>

      <Section eyebrow="Guides" title={`${mentors.length} ${mentors.length === 1 ? "guide" : "guides"} ready to`} highlight="talk">
        {mentors.length ? (
          <Reveal>
            <MentorGrid items={mentors} />
          </Reveal>
        ) : (
          <Panel className="flex flex-col items-center gap-3 py-10 text-center">
            <SearchX size={32} className="text-app-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold">No guides listed yet</h2>
            <p className="max-w-md text-sm text-app-muted">We are adding guides every week. Tell us what you need and we will look for someone.</p>
            <ButtonLink href="/contact" variant="green">Tell us what you need</ButtonLink>
          </Panel>
        )}
      </Section>

      <Section tone="green" eyebrow="Choosing well" title="What to look at before you" highlight="request">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {tips.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 80}>
              <Panel className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-gradient-to-br from-blue-50 to-green-50 p-3 text-app-primary">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-app-muted">{text}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Browse by area" title="Start from a" highlight="category">
        <Reveal className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="inline-flex items-center rounded-full border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-700 hover:shadow-soft"
            >
              {item.name}
            </Link>
          ))}
        </Reveal>
      </Section>
    </PublicShell>
  );
}

import Link from "next/link";
import { Search, ShieldCheck, Users } from "lucide-react";
import { PublicShell } from "@/components";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { GetMatched } from "@/components/GetMatched";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, Hl } from "@/components/gs-ui";
import { getCategories } from "@/features/catalog/server/service";

// Quick links under the search box. Only shown when the category exists.
const QUICK = [
  ["Agriculture", "agriculture", "🌾"],
  ["Technology", "technology", "💻"],
  ["Career & Jobs", "career", "💼"],
  ["Law & Business", "legal", "⚖️"],
  ["Health & Wellness", "health", "🏥"],
  ["Education", "education", "🎓"],
];

export default async function CategoriesPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const initialQuery = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";

  const raw = await getCategories();
  // Plain objects only: these are handed to client components.
  const categories = raw.map((c) => ({
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description || "",
    mentorCount: Number(c.mentorCount) || 0,
  }));
  const totalMentors = categories.reduce((sum, c) => sum + c.mentorCount, 0);
  const quick = QUICK.filter(([, slug]) =>
    categories.some((c) => c.slug === slug),
  );

  return (
    <PublicShell>
      <section className="relative overflow-hidden py-14 lg:py-20">
        <HeroIconBackdrop />
        <div className="app-container relative text-center">
          <Reveal>
            <Eyebrow>Explore categories</Eyebrow>
            <h1 className="mx-auto mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight text-[#0b1736] sm:text-6xl lg:text-7xl">
              Guidance across <Hl>life domains</Hl>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-800 sm:text-xl">
              Browse mentorship categories designed for students, farmers,
              patients, parents, professionals, founders, and creators. Connect
              with verified experts.
            </p>
            <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-lg font-medium text-emerald-800">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={22} aria-hidden="true" /> Browse{" "}
                {categories.length} specialized sectors
              </span>
              {totalMentors > 0 ? (
                <>
                  <span
                    className="hidden h-6 w-px bg-slate-400 sm:block"
                    aria-hidden="true"
                  />
                  <span className="inline-flex items-center gap-2 text-slate-700">
                    <Users
                      size={22}
                      className="text-emerald-700"
                      aria-hidden="true"
                    />{" "}
                    {totalMentors.toLocaleString("en-IN")} verified{" "}
                    {totalMentors === 1 ? "mentor" : "mentors"}
                  </span>
                </>
              ) : null}
            </p>
          </Reveal>

          <Reveal delay={120} className="mx-auto mt-10 max-w-4xl">
            <form
              action="/categories"
              method="get"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 pl-5 shadow-[0_12px_40px_rgba(15,23,42,0.1)]"
            >
              <Search
                size={22}
                className="shrink-0 text-[#0b1736]"
                aria-hidden="true"
              />
              <input
                name="q"
                defaultValue={initialQuery}
                aria-label="Search categories"
                placeholder={`Search from ${categories.length} categories (e.g., 'Organic Farming', 'Civil Services', 'Legal Advice', 'Tax Filing')...`}
                className="w-full bg-transparent py-3 text-base text-[#0b1736] outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#0b1736] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#15275a]"
              >
                Explore
              </button>
            </form>
            {quick.length ? (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {quick.map(([label, slug, emoji]) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 text-base font-medium text-[#0b1736] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
                  >
                    <span aria-hidden="true">{emoji}</span> {label}
                  </Link>
                ))}
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="py-12">
        <div className="app-container">
          <CategoryExplorer
            categories={categories}
            initialQuery={initialQuery}
          />
        </div>
      </section>

      <section className="py-14">
        <div className="app-container">
          <GetMatched domainCount={categories.length} />
        </div>
      </section>
    </PublicShell>
  );
}

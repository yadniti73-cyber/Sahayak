import Link from "next/link";
import { Clock, Languages, SearchX, ShieldCheck, Star, Wallet } from "lucide-react";
import { PublicShell } from "@/components";
import { MentorFilters } from "@/components/MentorFilters";
import { MentorGrid } from "@/components/page-sections";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, GButton, GCard, Hl } from "@/components/gs-ui";
import { getCategories, getMentors } from "@/features/catalog/server/service";
import { MODE_OPTIONS, PRICE_OPTIONS, SORT_OPTIONS, filterAndSortMentors, languageOptions } from "@/lib/mentor-filters";
import { AVAILABILITY_OPTIONS_PANEL, applyExtraFilters } from "@/lib/mentor-extra-filters";

const tips = [
  [ShieldCheck, "Check verification", "Verify identity & credentials", "bg-blue-50 text-blue-700"],
  [Languages, "Language", "Speak comfortably without any barrier", "bg-teal-50 text-teal-700"],
  [Clock, "Look at availability", "Pick a time that fits your busy week", "bg-rose-50 text-rose-700"],
  [Star, "Ratings", "Genuine feedback from past sessions", "bg-amber-50 text-amber-600"],
  [Wallet, "Clear Price", "Upfront rates before any request", "bg-orange-50 text-orange-600"],
];

// Quick filters under the search box.
const quick = [
  ["🟢 Available Today", "?availability=today"],
  ["💸 Budget-Friendly (Under ₹500)", "?price=0-500"],
  ["🌾 Agriculture & Farming", "?category=agriculture"],
  ["💼 Career Transition", "?category=career"],
  ["⚖️ Startup & Legal", "?category=legal"],
];

// Re-check the database regularly; approvals also revalidate this page immediately.
export const revalidate = 60;

const one = (v) => (typeof v === "string" ? v : "");

export default async function MentorsPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = one(sp.q).trim().slice(0, 80);
  const categorySlug = one(sp.category);
  const filters = { language: one(sp.language), mode: one(sp.mode), price: one(sp.price), sort: one(sp.sort) };
  const availability = one(sp.availability) === "today" ? "today" : "";

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  const fetched = await getMentors({ category: category?.name, search: q || undefined, limit: 60 });
  const mentors = applyExtraFilters(filterAndSortMentors(fetched, filters), { availability });

  const fields = [
    { name: "category", label: "Category 📂", value: category ? category.slug : "", options: [["", "All Categories"], ...categories.map((c) => [c.slug, c.name])] },
    { name: "language", label: "Language 🌐", value: filters.language, options: languageOptions(fetched) },
    { name: "price", label: "Price (Budget) 💰", value: filters.price, options: PRICE_OPTIONS },
    { name: "availability", label: "Availability 🗓️", value: availability, options: AVAILABILITY_OPTIONS_PANEL },
    { name: "mode", label: "Session Mode 🖥️", value: filters.mode, options: MODE_OPTIONS },
    { name: "sort", label: "Sort ↕", value: filters.sort, options: SORT_OPTIONS },
  ];

  return (
    <PublicShell>
      <section className="relative overflow-hidden py-14 lg:py-20">
        <HeroIconBackdrop />
        <div className="app-container relative max-w-6xl text-center">
          <Reveal>
            <Eyebrow>Mentor discovery</Eyebrow>
            <h1 className="mx-auto mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight text-[#0b1736] sm:text-6xl lg:text-7xl">
              Find someone who understands <Hl>your journey</Hl>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
              Search verified mentors by field, language, pricing, mode, and real-time availability.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10 text-left">
            <MentorFilters basePath="/mentors" fields={fields} q={q} />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {quick.map(([label, href]) => (
                <Link
                  key={href}
                  href={`/mentors${href}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-[15px] font-medium text-[#0b1736] transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-soft"
                >
                  {label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12">
        <div className="app-container">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0b1736] sm:text-5xl">Expert Mentors Ready to Talk</h2>
            <p className="mt-3 text-lg text-slate-600">Showing top matched verified professionals available for 1-on-1 guidance.</p>
          </Reveal>
          <div className="mt-8">
            {mentors.length ? (
              <MentorGrid items={mentors} variant="row" />
            ) : (
              <GCard className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <SearchX size={36} className="text-blue-700" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-[#0b1736]">{fetched.length ? "No guides match these filters" : "No guides listed yet"}</h3>
                <p className="max-w-md text-[15px] text-slate-600">
                  {fetched.length ? "Try removing a filter. You can also tell us what you need and we will help." : "We are adding guides every week. Tell us what you need and we will look for someone."}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {fetched.length ? <GButton href="/mentors" variant="outline">Clear filters</GButton> : null}
                  <GButton href="/contact?topic=Support#contact-form" variant="green">Tell us what you need</GButton>
                </div>
              </GCard>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="app-container">
          <Reveal><h2 className="text-3xl font-extrabold tracking-tight text-[#0b1736] sm:text-4xl">What to look at before you request</h2></Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {tips.map(([Icon, title, text, tone], i) => (
              <Reveal key={title} delay={i * 80}>
                <GCard className="h-full p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon size={22} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-lg font-bold text-[#0b1736]">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-6 text-slate-600">{text}</p>
                </GCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="app-container">
          <Reveal><h2 className="text-3xl font-extrabold tracking-tight text-[#0b1736] sm:text-4xl">Start from a category</h2></Reveal>
          <Reveal className="mt-6 flex flex-wrap gap-3">
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-5 py-2.5 text-[15px] font-medium text-[#0b1736] transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-soft"
              >
                {item.name}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </PublicShell>
  );
}
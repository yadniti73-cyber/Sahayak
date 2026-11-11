import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicShell } from "@/components";
import { MentorFilters } from "@/components/MentorFilters";
import { MentorGrid } from "@/components/page-sections";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { Eyebrow, GButton, gsButtonClass } from "@/components/gs-ui";
import {
  getCategoryBySlug,
  getMentors,
} from "@/features/catalog/server/service";
import {
  PRICE_OPTIONS,
  SORT_OPTIONS,
  filterAndSortMentors,
  languageOptions,
} from "@/lib/mentor-filters";
import {
  AVAILABILITY_OPTIONS_BAR,
  EXPERIENCE_OPTIONS,
  applyExtraFilters,
  subcategoryOptions,
} from "@/lib/mentor-extra-filters";

// Re-check the database regularly; approvals also revalidate this page immediately.
export const revalidate = 60;

const one = (v) => (typeof v === "string" ? v : "");

function EmptyIllustration() {
  return (
    <svg
      viewBox="0 0 220 170"
      width="220"
      height="170"
      role="img"
      aria-label="Search illustration"
      className="mx-auto"
    >
      <circle
        cx="104"
        cy="88"
        r="46"
        fill="#e8f1fb"
        stroke="#475569"
        strokeWidth="5"
      />
      <circle
        cx="104"
        cy="88"
        r="32"
        fill="#fff"
        stroke="#94a3b8"
        strokeWidth="3"
      />
      <path d="M92 100l8-24 24-8-8 24z" fill="#ef4444" opacity="0.85" />
      <path d="M100 76l24-8-8 24z" fill="#475569" />
      <path
        d="M70 124L36 158"
        stroke="#64748b"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M70 124L36 158"
        stroke="#94a3b8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="160"
        cy="34"
        r="17"
        fill="#fcd34d"
        stroke="#475569"
        strokeWidth="3.5"
      />
      <rect
        x="153"
        y="48"
        width="14"
        height="10"
        rx="2"
        fill="#94a3b8"
        stroke="#475569"
        strokeWidth="3"
      />
      <path
        d="M160 26v8M156 30h8"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M160 10V3M182 18l5-5M190 36h7M138 18l-5-5M130 36h-7"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="166"
        cy="116"
        r="22"
        fill="#e2e8f0"
        stroke="#475569"
        strokeWidth="4"
      />
      <circle
        cx="166"
        cy="116"
        r="9"
        fill="#fff"
        stroke="#475569"
        strokeWidth="3.5"
      />
      <g stroke="#475569" strokeWidth="6" strokeLinecap="round">
        <path d="M166 87v7M166 138v7M137 116h7M188 116h7M146 96l5 5M181 131l5 5M186 96l-5 5M151 131l-5 5" />
      </g>
      <circle
        cx="136"
        cy="152"
        r="9"
        fill="#e2e8f0"
        stroke="#475569"
        strokeWidth="3.5"
      />
      <circle
        cx="136"
        cy="152"
        r="3.5"
        fill="#fff"
        stroke="#475569"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default async function CategoryDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = (await searchParams) || {};
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Only verified mentors are returned.
  const all = await getMentors({ category: category.name, limit: 60 });
  const filters = {
    language: one(sp.language),
    price: one(sp.price),
    sort: one(sp.sort),
  };
  const extra = {
    sub: one(sp.sub),
    experience: one(sp.experience),
    availability: one(sp.availability) === "today" ? "today" : "",
  };
  const visibleMentors = applyExtraFilters(
    filterAndSortMentors(all, filters),
    extra,
  );
  const label = String(category.name || "").toLowerCase();

  const sortOptions = SORT_OPTIONS.map(([value, text]) => [
    value,
    value === "" ? "Sort by: Featured" : text,
  ]);

  const fields = [
    {
      name: "sub",
      label: "Sub-category",
      value: extra.sub,
      options: subcategoryOptions(all),
    },
    {
      name: "price",
      label: "Price",
      value: filters.price,
      options: PRICE_OPTIONS,
    },
    {
      name: "language",
      label: "Language",
      value: filters.language,
      options: languageOptions(all),
    },
    {
      name: "experience",
      label: "Experience",
      value: extra.experience,
      options: EXPERIENCE_OPTIONS,
    },
    {
      name: "availability",
      label: "Availability",
      value: extra.availability,
      options: AVAILABILITY_OPTIONS_BAR,
    },
    {
      name: "sort",
      label: "Sort by",
      value: filters.sort,
      options: sortOptions,
      align: "end",
    },
  ];

  return (
    <PublicShell>
      <section className="relative overflow-hidden pb-6 pt-14 lg:pt-20">
        <HeroIconBackdrop />
        <div className="app-container relative text-center">
          <Eyebrow>Category</Eyebrow>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-[#0b1736] sm:text-6xl">
            {category.name} mentors
          </h1>
          {category.description ? (
            <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-700">
              {category.description}
            </p>
          ) : null}
        </div>
      </section>

      {all.length ? (
        <section className="relative pb-16 pt-6">
          <div className="app-container relative">
            <MentorFilters
              basePath={`/category/${slug}`}
              fields={fields}
              variant="bar"
              showSearch={false}
            />
            <div className="mt-8">
              {visibleMentors.length ? (
                <MentorGrid items={visibleMentors} variant="tile" />
              ) : (
                <p className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">
                  No mentors match these filters.{" "}
                  <Link
                    href={`/category/${slug}`}
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    Clear filters
                  </Link>
                </p>
              )}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/mentors"
                className={gsButtonClass("outline", "px-8")}
              >
                Explore all mentors <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative pb-20 pt-6">
          <div className="app-container relative max-w-5xl">
            <div className="rounded-3xl bg-white/95 p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.1)] sm:p-10">
              <EmptyIllustration />
              <h2 className="mt-4 text-3xl font-extrabold text-[#0b1736] sm:text-4xl">
                No verified mentors here yet
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-slate-600">
                We are verifying new {label} experts every week. In the
                meantime, tell us what you need or apply to join our growing
                network.
              </p>

              <div className="mt-8 grid items-stretch gap-4 text-left md:grid-cols-[1fr_auto_1fr]">
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-2xl font-extrabold text-[#0b1736]">
                    👉 Looking for a guide?
                  </h3>
                  <p className="mt-2 flex-1 text-[17px] leading-7 text-slate-700">
                    {
                      "Tell us who you're looking for and we'll notify you when they're verified."
                    }
                  </p>
                  <GButton
                    href={`/contact?topic=Support&message=${encodeURIComponent(`I am looking for a ${category.name} mentor.`)}#contact-form`}
                    variant="green"
                    className="mt-5 w-full"
                  >
                    Request a Mentor
                  </GButton>
                </div>
                <div
                  className="flex items-center justify-center text-sm font-medium text-slate-500"
                  aria-hidden="true"
                >
                  <span className="hidden h-8 w-px bg-slate-300 md:block" />
                  <span className="px-3">OR</span>
                  <span className="hidden h-8 w-px bg-slate-300 md:block" />
                </div>
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-2xl font-extrabold text-[#0b1736]">
                    ✨ Are you an expert?
                  </h3>
                  <p className="mt-2 flex-1 text-[17px] leading-7 text-slate-700">
                    Be one of the first verified {category.name} Mentors in this
                    category.
                  </p>
                  <GButton
                    href="/register?role=mentor"
                    variant="outline"
                    className="mt-5 w-full"
                  >
                    Apply as a Mentor
                  </GButton>
                </div>
              </div>

              <p className="mt-8 text-base text-slate-700">
                Want to see other areas?{" "}
                <Link
                  href="/mentors"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Browse all other mentors{" "}
                  <ArrowRight size={14} className="inline" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}
    </PublicShell>
  );
}

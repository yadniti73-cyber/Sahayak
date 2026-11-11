import Link from "next/link";
import {
  ArrowRight, Briefcase, Code2, GraduationCap, HeartPulse, LineChart, Scale, Sprout, Users,
} from "lucide-react";
import { Reveal } from "./Reveal";

// Card content from the design. `pill` is the badge text; swap for live counts when available.
const tiles = [
  { slug: "career", name: "Career", pill: "120+ Verified Guides", Icon: Briefcase, tone: "blue" },
  { slug: "education", name: "Education", pill: "80+ Top Consultants", Icon: GraduationCap, tone: "plain" },
  { slug: "health", name: "Health & Wellness", pill: "90+ Specialists", Icon: HeartPulse, tone: "plain" },
  { slug: "agriculture", name: "Agriculture", pill: "40+ Agri-Experts", Icon: Sprout, tone: "green" },
  { slug: "business", name: "Business", pill: "150+ Consultants", Icon: LineChart, tone: "plain" },
  { slug: "legal", name: "Legal", pill: "60+ verified lawyers", Icon: Scale, tone: "gold" },
  { slug: "parenting", name: "Parenting", pill: "35+ Experts", Icon: Users, tone: "plain" },
  { slug: "technology", name: "Technology", pill: "200+ Developers", Icon: Code2, tone: "teal" },
];

const tones = {
  plain: { card: "bg-white", icon: "text-[#0b4a9a]", pill: "bg-[#054c9c]" },
  blue: { card: "bg-[linear-gradient(135deg,#d4e2ff,#c9dbfd)]", icon: "text-[#0b4a9a]", pill: "bg-[#054c9c]" },
  green: { card: "bg-[linear-gradient(135deg,#d4efd3,#c9eac8)]", icon: "text-[#0c6d2a]", pill: "bg-[#0c6d2a]" },
  gold: { card: "bg-[linear-gradient(135deg,#ead59d,#f7e8bf_55%,#f3d48e)]", icon: "text-[#977313]", pill: "bg-[#977313]" },
  teal: { card: "bg-[linear-gradient(135deg,#c2fbfb,#b3f3f6)]", icon: "text-[#07737d]", pill: "bg-[#07737d]" },
};

function Tile({ slug, name, pill, Icon, tone }) {
  const t = tones[tone];
  return (
    <Link
      href={`/category/${slug}`}
      className={`group flex flex-col items-center rounded-2xl border border-slate-300/70 px-5 py-9 text-center shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)] ${t.card}`}
    >
      <Icon size={58} strokeWidth={1.8} className={`${t.icon} transition group-hover:scale-110`} aria-hidden="true" />
      <h3 className="mt-6 text-[26px] font-medium leading-tight text-[#0b1736]">{name}</h3>
      <span className={`mt-5 inline-flex rounded-full px-6 py-2.5 text-xl font-medium text-white ${t.pill}`}>{pill}</span>
      <span className="mt-6 inline-flex items-center gap-2 text-xl text-[#0b1736]">
        Explore <ArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-gradient-to-b from-white via-[#f4f8ff] to-white py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <Reveal>
          <p className="text-base font-semibold uppercase tracking-wide text-[#0f7a3d]">Why GuideShala</p>
          <h2 className="mt-2 font-display text-4xl font-bold leading-tight text-[#0b1736] sm:text-5xl lg:text-[3.5rem]">
            Find experts who{" "}
            <span className="bg-gradient-to-r from-[#1366c4] to-[#16a34a] bg-clip-text text-transparent">have been there</span>
          </h2>
          <p className="mt-5 max-w-3xl text-xl leading-9 text-[#0b1736]">
            Search engines provide answers. GuideShala helps people reach someone experienced enough to guide the next step.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 4) * 90}>
              <Tile {...t} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Link
            href="/categories"
            className="group inline-flex min-h-[60px] items-center gap-3 rounded-xl bg-[#054c9c] px-9 text-2xl font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#043d7e]"
          >
            Explore All 40+ Categories <ArrowRight size={24} className="transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

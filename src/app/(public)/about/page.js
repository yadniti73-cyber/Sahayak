import Image from "next/image";
import {
  Baby,
  Building,
  Building2,
  BadgeCheck,
  Briefcase,
  Compass,
  Eye,
  FlaskConical,
  Flower2,
  Gavel,
  GraduationCap,
  Heart,
  HeartHandshake,
  Landmark,
  Lightbulb,
  Link2,
  MapPin,
  Palette,
  Presentation,
  Sparkles,
  Sprout,
  Stethoscope,
  Store,
  Target,
  Trophy,
  Users,
  Video,
  Wheat,
} from "lucide-react";
import { PublicShell, CheckItem, Panel } from "@/components";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, GButton, GCard, Hl } from "@/components/gs-ui";

// Fill these in to show a LinkedIn link on each founder card. Empty ones are hidden.
const LINKEDIN = {
  "Nitish Kumar": process.env.NEXT_PUBLIC_NITISH_LINKEDIN_URL || "",
  "Anand Vivek": process.env.NEXT_PUBLIC_ANAND_LINKEDIN_URL || "",
};

const clients = [
  [Wheat, "Farmers", "bg-green-500"],
  [GraduationCap, "Students", "bg-purple-500"],
  [Stethoscope, "Patients", "bg-red-500"],
  [Users, "Parents", "bg-amber-500"],
  [Briefcase, "Career switchers", "bg-orange-500"],
  [Palette, "Artists", "bg-amber-400"],
  [Flower2, "Devotees", "bg-sky-500"],
  [Sparkles, "Spiritual Seekers / Gurus", "bg-purple-500"],
  [Trophy, "Sportspersons", "bg-orange-500"],
  [Lightbulb, "Self-learned talents", "bg-yellow-400"],
  [Store, "Small-scale businesses", "bg-sky-500"],
  [Sparkles, "Forgotten talents", "bg-indigo-400"],
];

const experts = [
  [Stethoscope, "Doctors"],
  [Gavel, "Legal advisors"],
  [Compass, "Career counselors"],
  [Heart, "Relationship counselors"],
  [Baby, "Parenting coaches"],
  [FlaskConical, "Researchers & scientists"],
  [Users, "Community leaders"],
  [Flower2, "Spiritual gurus"],
];

const institutions = [
  [Building, "Government"],
  [Building2, "Private organisations"],
  [HeartHandshake, "NGOs & FPOs"],
  [Landmark, "Temples & community centres"],
];

const ways = [
  [
    Video,
    "1:1 video session",
    "Personalised consulting over secure video: strategic advice, problem-solving, and project review from anywhere.",
  ],
  [
    MapPin,
    "On-site visits",
    "Office visits, operational assessments, and direct team collaboration for changes you can see.",
  ],
  [
    Presentation,
    "Meetings & seminars",
    "Workshops, training seminars, and group sessions for skill development and industry insight.",
  ],
];

const team = [
  {
    name: "Nitish Kumar",
    role: "Co-Founder & CEO",
    credential: "MS(R), IIT Indore",
    photo: "/images/team/nitish-kumar.jpg",
    text: "Dedicated to leveraging technology and research to solve the accessibility gap in expert guidance.",
  },
  {
    name: "Anand Vivek",
    role: "Co-Founder & CTO",
    credential: "B.Tech, IIT Indore",
    photo: "/images/team/anand-vivek.jpg",
    text: "Building secure, seamless, and high-performance technology to connect people with life-changing insights.",
  },
];

function Tile({ Icon, label, children }) {
  return (
    <div className="flex h-full items-center gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-medium leading-5 text-[#0b1736]">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About GuideShala"
        title="Built around one simple belief:"
        highlight="people need people."
        description="GuideShala exists to make experienced guidance accessible for students, farmers, parents, patients, founders, artists, and anyone facing a meaningful decision."
        font="sans"
        aside={
          <Panel className="rounded-2xl shadow-soft">
            <h2 className="text-xl font-bold">Platform principles</h2>
            <div className="mt-5 grid gap-4">
              <CheckItem>
                Trust through verified identities and clear profiles.
              </CheckItem>
              <CheckItem>
                Simplicity through fewer clicks and calm layouts.
              </CheckItem>
              <CheckItem>
                Accessibility for mobile, low bandwidth, and senior users.
              </CheckItem>
              <CheckItem>
                Human-first experiences over transactional screens.
              </CheckItem>
            </div>
          </Panel>
        }
      />

      {/* Why we exist */}
      <section className="py-14">
        <div className="app-container max-w-6xl">
          <Reveal>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-[#0b1736] sm:text-5xl">
              One platform for the person and the <Hl tone="green">expert</Hl>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Reveal>
              <GCard className="h-full p-6">
                <span className="inline-flex items-center gap-2 text-xl font-bold text-[#0b1736]">
                  <Target size={22} aria-hidden="true" /> Mission
                </span>
                <p className="mt-3 text-[17px] leading-7 text-slate-700">
                  Build India&apos;s largest mentorship ecosystem where every
                  individual can find verified guidance within minutes.
                </p>
              </GCard>
            </Reveal>
            <Reveal delay={100}>
              <GCard className="h-full p-6">
                <span className="inline-flex items-center gap-2 text-xl font-bold text-[#0b1736]">
                  <Eye size={22} aria-hidden="true" /> Long-term vision
                </span>
                <p className="mt-3 text-[17px] leading-7 text-slate-700">
                  Become the default destination whenever someone says, &quot;I
                  need guidance&quot; or &quot;I want to help someone.&quot;
                </p>
              </GCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-14">
        <div className="app-container max-w-6xl">
          <Reveal>
            <Eyebrow>Who we serve</Eyebrow>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-[#0b1736] sm:text-5xl">
              Guidance for people who are <Hl>often overlooked</Hl>
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
              A farmer, a first-generation student, and a small shop owner all
              face real decisions. They deserve someone who has been there.{" "}
              <strong className="font-bold text-[#0b1736]">
                Guided by human needs. Built by IITians from IIT Indore.
              </strong>
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {clients.map(([Icon, label, bar], i) => (
              <Reveal key={label} delay={(i % 4) * 70}>
                <div className="flex h-full items-center gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                  <span className="flex shrink-0 flex-col items-center gap-1 text-slate-700">
                    <Icon size={22} aria-hidden="true" />
                    <span className={`h-0.5 w-4 rounded-full ${bar}`} />
                  </span>
                  <span className="text-[15px] font-medium text-[#0b1736]">
                    {label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <GButton href="/mentors" arrow>
              Find Your Perfect Guide Now
            </GButton>
            <GButton href="/register?role=mentor" variant="outline">
              Join As A Verified Expert
            </GButton>
          </div>
        </div>
      </section>

      {/* Who guides you */}
      <section className="py-14">
        <div className="app-container max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>Who guides you</Eyebrow>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-[#0b1736] sm:text-5xl">
              Experts from fields that{" "}
              <span className="font-medium">matter in daily life</span>
            </h2>
            <p className="mt-3 text-lg text-slate-700">
              Choose from verified individuals or trusted organisations built to
              solve your challenges.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#0b1736]">
                <Briefcase size={18} aria-hidden="true" /> Individual
                consultants
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {experts.map(([Icon, label], i) => (
                  <Reveal key={label} delay={(i % 3) * 80}>
                    <Tile Icon={Icon} label={label} />
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#0b1736]">
                <Building2 size={18} aria-hidden="true" /> Institutions &amp;
                partners
              </p>
              <div className="mt-3 grid gap-3">
                {institutions.map(([Icon, label], i) => (
                  <Reveal key={label} delay={i * 80}>
                    <Tile Icon={Icon} label={label} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 rounded-xl bg-slate-600 px-5 py-4 text-center text-base font-medium text-white">
            Built by IITians from IIT Indore to bridge the gap between people
            and verified guidance.
          </p>
        </div>
      </section>

      {/* Ways to connect */}
      <section className="py-14">
        <div className="app-container max-w-6xl">
          <Reveal>
            <Eyebrow>Ways to connect</Eyebrow>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-[#0b1736] sm:text-5xl">
              Digital and physical, whichever fits
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {ways.map(([Icon, title, text], i) => (
              <Reveal key={title} delay={i * 100}>
                <GCard className="h-full p-6 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-[#0b1736]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-6 text-slate-700">
                    {text}
                  </p>
                </GCard>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <GButton href="/mentors" arrow>
              Find Your Expert Now
            </GButton>
            <GButton href="/register?role=mentor" variant="outline">
              Join Our Diverse Community
            </GButton>
          </div>
        </div>
      </section>

      {/* Founding team */}
      <section className="py-14">
        <div className="app-container max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>The founding team</Eyebrow>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-[#0b1736] sm:text-5xl">
              Built by students and researchers from{" "}
              <Hl tone="navy">IIT Indore</Hl>
            </h2>
            <p className="mt-3 text-lg text-slate-700">
              The minds behind the vision to make verified guidance accessible
              to every Indian.
            </p>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 120}>
                <GCard className="flex h-full flex-col gap-5 p-5 sm:flex-row">
                  <div className="relative h-44 w-44 shrink-0 self-center overflow-hidden rounded-xl bg-slate-200 sm:self-start">
                    <Image
                      src={m.photo}
                      alt={m.name}
                      width={352}
                      height={352}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-2xl font-extrabold text-[#0b1736]">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold uppercase tracking-wide text-emerald-700">
                      {m.role}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[15px] text-slate-700">
                      <GraduationCap size={16} aria-hidden="true" />{" "}
                      {m.credential}
                    </p>
                    <p className="mt-2 flex-1 text-[15px] leading-6 text-slate-700">
                      {m.text}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <BadgeCheck
                        size={26}
                        className="text-emerald-600"
                        aria-label="Verified founder"
                      />
                      {LINKEDIN[m.name] ? (
                        <a
                          href={LINKEDIN[m.name]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
                        >
                          LinkedIn <Link2 size={15} aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </GCard>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <h2 className="text-3xl font-extrabold text-[#0b1736] sm:text-4xl">
              Ready to find the guidance you need?
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <GButton href="/categories" arrow>
                Explore Mentorship Categories
              </GButton>
              <GButton href="/register?role=mentor" variant="outline">
                Join as a Mentor / Partner
              </GButton>
            </div>
            <p className="mt-10 text-base text-slate-700">
              Backed by the entrepreneurial spirit of IIT Indore. Founded in
              2026.
            </p>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  );
}

import {
  Baby, Building, Building2, Briefcase, Compass, Eye, FlaskConical, Flower2, Gavel, GraduationCap, Heart,
  HeartHandshake, Landmark, Lightbulb, MapPin, Palette, Presentation, Sparkles, Sprout, Stethoscope, Store,
  Target, Trophy, Users, Video,
} from "lucide-react";
import { PublicShell, Avatar, CheckItem, Panel } from "@/components";
import { PageHero, Section, IconTile } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const clients = [
  [Sprout, "Farmers"], [GraduationCap, "Students"], [Stethoscope, "Patients"], [Baby, "Parents"],
  [Compass, "Career switchers"], [Briefcase, "Entrepreneurs"], [Palette, "Artists"], [Flower2, "Devotees"],
  [Trophy, "Sportspersons"], [Lightbulb, "Self-learned talents"], [Store, "Small-scale businesses"], [Sparkles, "Forgotten talents"],
];

const experts = [
  [Stethoscope, "Doctors"], [Gavel, "Legal advisors"], [Compass, "Career counselors"], [Heart, "Relationship counselors"],
  [Baby, "Parenting coaches"], [FlaskConical, "Researchers and scientists"], [Users, "Community leaders"], [Flower2, "Spiritual gurus"],
];

const institutions = [
  [Building, "Government"], [Building2, "Private organisations"], [HeartHandshake, "NGOs and FPOs"], [Landmark, "Temples and community centres"],
];

const ways = [
  [Video, "1:1 video session", "Personalised consulting over secure video: strategic advice, problem-solving and project review from anywhere."],
  [MapPin, "On-site visits", "Office visits, operational assessments and direct team collaboration for changes you can see."],
  [Presentation, "Meetings and seminars", "Workshops, training seminars and group sessions for skill development and industry insight."],
];

const team = [
  { name: "Nitish Kumar", initials: "NK", title: "CEO", credential: "MS(R), IIT Indore" },
  { name: "Anand Vivek", initials: "AV", title: "CTO", credential: "B.Tech, IIT Indore" },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About GuideShala"
        title="Built around one simple belief:"
        highlight="people need people."
        description="GuideShala exists to make experienced guidance accessible for students, farmers, parents, patients, founders, artists, and anyone facing a meaningful decision."
        aside={
          <Panel className="shadow-soft">
            <h2 className="text-xl font-bold">Platform principles</h2>
            <div className="mt-5 grid gap-4">
              <CheckItem>Trust through verified identities and clear profiles.</CheckItem>
              <CheckItem>Simplicity through fewer clicks and calm layouts.</CheckItem>
              <CheckItem>Accessibility for mobile, low bandwidth, and senior users.</CheckItem>
              <CheckItem>Human-first experiences over transactional screens.</CheckItem>
            </div>
          </Panel>
        }
      />

      <Section tone="blue" eyebrow="Why we exist" title="One platform for the person and the" highlight="expert">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <Panel className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-app-primary">
                <Target size={18} aria-hidden="true" /> Mission
              </span>
              <p className="mt-3 leading-7 text-app-muted">
                Build India&apos;s largest mentorship ecosystem where every individual can find verified guidance within minutes.
              </p>
            </Panel>
          </Reveal>
          <Reveal delay={120}>
            <Panel className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                <Eye size={18} aria-hidden="true" /> Long-term vision
              </span>
              <p className="mt-3 leading-7 text-app-muted">
                Become the default destination whenever someone says, &quot;I need guidance&quot; or &quot;I want to help someone.&quot;
              </p>
            </Panel>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Who we serve" title="Guidance for people who are" highlight="often overlooked" description="A farmer, a first-generation student and a small shop owner all face real decisions. They deserve someone who has been there.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {clients.map(([Icon, label], i) => (
            <Reveal key={label} delay={(i % 4) * 70}>
              <IconTile Icon={Icon} label={label} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="green" eyebrow="Who guides you" title="Experts from fields that" highlight="matter in daily life">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-app-primary">Consultants</p>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
              {experts.map(([Icon, label], i) => (
                <Reveal key={label} delay={(i % 3) * 80}>
                  <IconTile Icon={Icon} label={label} />
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Institutions</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {institutions.map(([Icon, label], i) => (
                <Reveal key={label} delay={i * 80}>
                  <IconTile Icon={Icon} label={label} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Ways to connect" title="Digital and physical," highlight="whichever fits">
        <div className="grid gap-4 md:grid-cols-3">
          {ways.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 110}>
              <Panel className="group h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-app-muted">{text}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="wash" eyebrow="The team" title="Built by students and researchers from" highlight="IIT Indore">
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 120}>
              <Panel className="flex items-center gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <Avatar initials={m.initials} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700">{m.title}</p>
                  <p className="font-semibold text-app-text">{m.name}</p>
                  <p className="text-sm text-app-muted">{m.credential}</p>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}

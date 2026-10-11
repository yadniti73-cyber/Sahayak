import { ChevronDown, GraduationCap, MessageSquare, ShieldCheck, CalendarCheck } from "lucide-react";
import { PublicShell, ButtonLink, Panel } from "@/components";
import { PageHero, Section } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const groups = [
  {
    id: "trust",
    title: "Browsing and trust",
    icon: ShieldCheck,
    items: [
      ["Can visitors browse mentors?", "Yes. Visitors can search mentors and view public profiles before signing in."],
      ["How are mentors trusted?", "Profiles show verification status, experience, languages, ratings, completed sessions, and availability."],
      ["What does the Verified badge mean?", "The guide's identity details were checked before the badge was added. Guides without the badge can still be listed, so read the profile before you request a session."],
      ["Which languages and cities are covered?", "Every profile lists a city and languages. The mentors page lets you filter by both."],
    ],
  },
  {
    id: "booking",
    title: "Booking and sessions",
    icon: CalendarCheck,
    items: [
      ["When is login required?", "Login is required for booking sessions, saving favorites, editing profiles, and submitting reviews."],
      ["How does booking work?", "You choose a date, time and session mode, and can add a short note. The guide then confirms or suggests another time."],
      ["Can sessions be online or offline?", "Yes. Guides offer video, phone or in-person sessions, and each profile shows which one."],
      ["What does a session cost?", "Each guide shows a price on their profile, so you know it before you send a request."],
    ],
  },
  {
    id: "guides",
    title: "For guides",
    icon: GraduationCap,
    items: [
      ["How do I become a guide?", "Register, fill in your profile, upload verification documents and set your weekly availability windows."],
      ["Can I see requests before accepting?", "Yes. Requests appear in your workspace, and you can confirm them or suggest a new time."],
    ],
  },
  {
    id: "support",
    title: "Feedback and support",
    icon: MessageSquare,
    items: [
      ["Where can I send feedback?", "Use the feedback form at the bottom of the home page, or write to us from the contact page."],
      ["Who answers my message?", "The GuideShala team replies with next steps. For partnerships, say which organisation you represent."],
    ],
  },
];

export default function FaqPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="FAQ"
        title="Answers before the"
        highlight="first conversation"
        description="Simple guidance on browsing, booking, trust, and account access."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Topics</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:grid">
              {groups.map(({ id, title, icon: Icon }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-green-500 hover:text-green-700 lg:flex lg:rounded-lg"
                  >
                    <Icon size={16} className="text-app-primary" aria-hidden="true" /> {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-10">
            {groups.map(({ id, title, icon: Icon, items }) => (
              <div key={id} id={id} className="scroll-mt-24">
                <Reveal>
                  <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-app-text">
                    <span className="rounded-lg bg-gradient-to-br from-blue-50 to-green-50 p-2.5 text-app-primary">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    {title}
                  </h2>
                </Reveal>
                <div className="mt-4 grid gap-3">
                  {items.map(([question, answer], i) => (
                    <Reveal key={question} delay={i * 70}>
                      <details className="app-card group p-5 transition hover:shadow-soft [&[open]_.chev]:rotate-180">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-app-text [&::-webkit-details-marker]:hidden">
                          {question}
                          <ChevronDown size={18} className="chev shrink-0 text-app-primary transition-transform duration-300" aria-hidden="true" />
                        </summary>
                        <p className="mt-3 text-sm leading-6 text-app-muted">{answer}</p>
                      </details>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="green">
        <Reveal>
          <Panel className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-green-50">
            <div>
              <h2 className="text-xl font-bold">Did not find your answer?</h2>
              <p className="mt-1 text-sm text-app-muted">Send us your question and we will add it here.</p>
            </div>
            <ButtonLink href="/contact" variant="green">Ask the team</ButtonLink>
          </Panel>
        </Reveal>
      </Section>
    </PublicShell>
  );
}

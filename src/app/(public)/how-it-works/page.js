import { CalendarCheck, Clock, Languages, MessageSquare, Phone, Repeat, Search, ShieldCheck, Star, UserPlus, Video, MapPin } from "lucide-react";
import { PublicShell, Badge, ButtonLink, CheckItem, Panel } from "@/components";
import { PageHero, Section, NumberDot } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const steps = [
  [Search, "Search with intent", "Find mentors by category, city, language, session mode, rating, price, and availability."],
  [ShieldCheck, "Evaluate trust", "Review profile photo, verification, experience, languages, ratings, and completed sessions."],
  [CalendarCheck, "Request guidance", "Choose a date, time, session mode, and optional note. The mentor confirms or suggests a reschedule."],
  [Repeat, "Continue the relationship", "Track sessions, leave reviews, save mentors, and return when you need the next conversation."],
];

const modes = [
  [Video, "Video session", "Talk one to one from home, with no travel."],
  [MapPin, "In person", "Meet at the guide's office or your own place for hands-on help."],
  [Phone, "Phone call", "A voice call for when video is hard: low bandwidth or an older phone."],
];

const statuses = [
  ["Requested", "amber", "You sent a request. The guide has not answered yet."],
  ["Confirmed", "green", "The guide accepted. Date, time and mode are fixed."],
  ["Reschedule requested", "amber", "The guide suggested another time. Accept it or pick a new slot."],
  ["Completed", "blue", "The session is done. You can leave a review and book again."],
];

const guideSteps = [
  [UserPlus, "Create your profile", "Register and tell seekers who you are, what you know and where you work."],
  [ShieldCheck, "Get verified", "Upload verification documents so your profile can carry the Verified badge."],
  [Clock, "Set availability", "Open weekly time windows that suit you. Seekers book inside them."],
  [MessageSquare, "Answer requests", "Confirm a request or suggest another time."],
  [Star, "Build your name", "Ratings and reviews from finished sessions appear on your public profile."],
];

const prep = [
  "Write your question in a sentence or two before you start.",
  "Pick the mode that suits you: video from home or in person.",
  "Choose a guide who speaks the language you are comfortable in.",
  "Add a short note to your request so the guide can prepare.",
];

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="How it works"
        title="From uncertainty to a"
        highlight="useful conversation"
        description="The flow is designed to help seekers understand where they are, what they can do, and what happens next."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/mentors">Find a Guide</ButtonLink>
          <ButtonLink href="/register?role=mentor" variant="green">Join as Guide</ButtonLink>
        </div>
      </PageHero>

      <Section eyebrow="For seekers" title="Four steps to" highlight="a guide">
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-gradient-to-r from-app-primary/30 to-green-500/30 lg:block" aria-hidden="true" />
          {steps.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 110}>
              <div className="relative text-center">
                <div className="flex justify-center"><NumberDot n={i + 1} /></div>
                <Icon size={22} className="mx-auto mt-4 text-app-primary" aria-hidden="true" />
                <h2 className="mt-2 text-lg font-bold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-app-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="blue" eyebrow="Your session" title="Pick the way you want to" highlight="meet">
        <div className="grid gap-4 md:grid-cols-3">
          {modes.map(([Icon, title, text], i) => (
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

      <Section eyebrow="After you request" title="What the status" highlight="means" description="A guide can also reject a request, and either side can cancel before the session.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statuses.map(([label, tone, text], i) => (
            <Reveal key={label} delay={i * 110}>
              <Panel className="h-full">
                <Badge tone={tone}>{label}</Badge>
                <p className="mt-3 text-sm leading-6 text-app-muted">{text}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="green" eyebrow="For guides" title="Five steps to" highlight="start guiding">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {guideSteps.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 90}>
              <Panel className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-gradient-to-br from-blue-50 to-green-50 p-3 text-app-primary">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-green-700">Step {i + 1}</p>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-app-muted">{text}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="wash" eyebrow="Before the call" title="Small things that make a session" highlight="better">
        <Reveal>
          <Panel className="max-w-3xl">
            <div className="grid gap-4">
              {prep.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-app-muted">
              <Languages size={16} className="text-app-primary" aria-hidden="true" />
              Speak in the language you think in. The guide is there to understand you.
            </p>
          </Panel>
        </Reveal>
      </Section>
    </PublicShell>
  );
}

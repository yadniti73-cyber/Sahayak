import { notFound } from "next/navigation";
import { Briefcase, CalendarDays, Clock, Languages, MapPin, ShieldCheck, Star, Wallet } from "lucide-react";
import { PublicShell, Avatar, Badge, ButtonLink, CheckItem, Panel, Rating, SectionHeading, StatCard } from "@/components";
import { MentorGrid } from "@/components/page-sections";
import { modeLabel } from "@/components/domain-cards";
import { Section } from "@/components/PageHero";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { Reveal } from "@/components/Reveal";
import { getMentorBySlug, getMentors } from "@/features/catalog/server/service";

export const revalidate = 300;
export const dynamicParams = true;

const expect = [
  ["Send a request", "Pick a mode, date and time, and add a short note."],
  ["The guide replies", "They confirm or suggest another time."],
  ["Talk it through", "Meet by video or in person and leave with a next step."],
];

export default async function MentorProfilePage({ params }) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);

  if (!mentor) {
    notFound();
  }

  const initials = mentor.name ? mentor.name.split(" ").map((word) => word[0]).join("") : "";
  const firstName = mentor.name ? mentor.name.split(" ")[0] : "this guide";

  const pool = (await getMentors({ limit: 12 })).filter((item) => item.slug !== mentor.slug);
  const sameArea = pool.filter((item) => item.category === mentor.category);
  const similar = (sameArea.length ? sameArea : pool).slice(0, 2);

  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-app-border bg-gradient-to-br from-white via-blue-50/60 to-green-50/50 py-12 lg:py-16">
        <HeroIconBackdrop />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl float-slow" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl float-slow" />

        <div className="app-container relative grid gap-8 lg:grid-cols-[1fr_360px]">
          <Reveal className="flex flex-col gap-5 sm:flex-row">
            <Avatar initials={initials} size="lg" />
            <div>
              <div className="flex flex-wrap gap-2">
                {mentor.verified ? <Badge tone="green">Verified</Badge> : null}
                <Badge>{mentor.category}</Badge>
              </div>
              <SectionHeading title={mentor.name} description={mentor.headline} />
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-app-muted">
                <span className="inline-flex items-center gap-2"><MapPin size={16} aria-hidden="true" /> {mentor.city}</span>
                <span className="inline-flex items-center gap-2"><Languages size={16} aria-hidden="true" /> {mentor.languages?.join(", ")}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} aria-hidden="true" /> {mentor.availability}</span>
                <Rating value={mentor.rating} reviews={mentor.reviewsCount || 0} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:row-span-2">
            <Panel className="shadow-soft lg:sticky lg:top-24">
              <h2 className="text-lg font-bold">Request guidance</h2>
              <p className="mt-2 text-sm text-app-muted">Choose a session mode, date, and time. Booking confirmation happens after mentor review.</p>
              <div className="mt-5 grid gap-3">
                <button type="button" className="app-input text-left">{modeLabel[mentor.mode] || "Video"} session - {mentor.price}</button>
                <button type="button" className="app-input text-left">{mentor.availability} - 6:00 PM</button>
                <textarea className="app-input min-h-24 resize-none" placeholder="Add a short note for the mentor" />
                <ButtonLink href="/login" variant="green">Request guidance</ButtonLink>
                <p className="text-center text-xs text-app-muted">You will be asked to sign in first.</p>
              </div>
            </Panel>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:col-start-1">
            <Reveal><StatCard label="Rating" value={mentor.reviewsCount ? Number(mentor.rating).toFixed(1) : "New"} detail={`${mentor.reviewsCount || 0} reviews`} icon={Star} /></Reveal>
            <Reveal delay={80}><StatCard label="Experience" value={String(mentor.experience ?? "-")} detail="In this field" icon={Briefcase} /></Reveal>
            <Reveal delay={160}><StatCard label="Price" value={String(mentor.price ?? "-")} detail="Per session" icon={Wallet} /></Reveal>
            <Reveal delay={240}><StatCard label="Response" value="4h" detail="Usually replies within" icon={Clock} /></Reveal>
          </div>
        </div>
      </section>

      <Section tone="blue">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            <Reveal>
              <Panel>
                <h2 className="text-xl font-bold">About {firstName}</h2>
                <p className="mt-3 leading-7 text-app-muted">{mentor.bio}</p>
                {mentor.specializations?.length ? (
                  <>
                    <h3 className="mt-6 font-semibold">Specializations</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mentor.specializations.map((item) => (
                        <Badge key={item} tone="gray">{item}</Badge>
                      ))}
                    </div>
                  </>
                ) : null}
              </Panel>
            </Reveal>

            <Reveal delay={100}>
              <Panel>
                <h2 className="text-xl font-bold">What to expect</h2>
                <ol className="mt-4 grid gap-4 sm:grid-cols-3">
                  {expect.map(([title, text], i) => (
                    <li key={title} className="text-sm">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-app-primary to-green-600 text-sm font-bold text-white">{i + 1}</span>
                      <p className="mt-2 font-semibold text-app-text">{title}</p>
                      <p className="mt-1 leading-6 text-app-muted">{text}</p>
                    </li>
                  ))}
                </ol>
              </Panel>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <Panel>
              <h2 className="text-xl font-bold">Trust signals</h2>
              <div className="mt-4 grid gap-3">
                {mentor.verified ? <CheckItem>Identity verified</CheckItem> : null}
                {mentor.experience ? <CheckItem>{mentor.experience} experience</CheckItem> : null}
                <CheckItem>{mentor.reviewsCount || 0} public reviews</CheckItem>
                <CheckItem>Usually responds within 4 hours</CheckItem>
              </div>
              <p className="mt-5 inline-flex items-center gap-2 text-xs text-app-muted">
                <ShieldCheck size={15} className="text-emerald-600" aria-hidden="true" />
                Sessions are requested and confirmed on GuideShala.
              </p>
            </Panel>
          </Reveal>
        </div>
      </Section>

      {similar.length ? (
        <Section eyebrow="More guides" title={`Guides like`} highlight={firstName}>
          <Reveal>
            <MentorGrid items={similar} />
          </Reveal>
        </Section>
      ) : null}
    </PublicShell>
  );
}

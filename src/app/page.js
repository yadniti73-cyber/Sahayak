import { PublicShell } from "@/components";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { ButtonLink, Panel, SectionHeading } from "@/components/app-primitives";
import { MentorCard } from "@/components/domain-cards";
import { mentors } from "@/lib/frontend-data";

export default function Home() {
  return (
    <PublicShell>
      <Hero />
      <Features />
      <section className="bg-white py-14">
        <div className="app-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured mentors"
              title="Start with people trusted by the community"
              description="Browse verified mentors across health, education, agriculture, business, and career decisions."
            />
            <ButtonLink href="/mentors" variant="secondary">Browse all</ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {mentors.slice(0, 4).map((mentor) => (
              <MentorCard key={mentor.slug} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="app-container grid gap-4 md:grid-cols-3">
          {["Choose a mentor", "Request guidance", "Grow with clarity"].map((step, index) => (
            <Panel key={step}>
              <span className="text-sm font-bold text-app-primary">0{index + 1}</span>
              <h2 className="mt-3 text-xl font-bold">{step}</h2>
              <p className="mt-2 text-sm leading-6 text-app-muted">
                {index === 0
                  ? "Search by category, city, language, rating, or availability."
                  : index === 1
                    ? "Pick a session mode, date, time, and add a short note."
                    : "Leave with practical next steps and continue the relationship."}
              </p>
            </Panel>
          ))}
        </div>
      </section>
      <Testimonials />
      <section className="bg-white py-14">
        <div className="app-container">
          <div className="rounded-lg bg-app-primary p-8 text-white md:p-10">
            <h2 className="font-display text-4xl font-semibold">Ready to begin your journey?</h2>
            <p className="mt-3 max-w-2xl text-blue-50">
              Find someone who understands your question and can help you move forward with confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/mentors" variant="secondary">Find mentor</ButtonLink>
              <ButtonLink href="/register" className="border-white bg-white text-app-primary hover:bg-blue-50">Become mentor</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

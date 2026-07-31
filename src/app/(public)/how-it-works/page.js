import { PublicShell, ButtonLink, Panel, SectionHeading } from "@/components";

const steps = [
  ["Search with intent", "Find mentors by category, city, language, session mode, rating, price, and availability."],
  ["Evaluate trust", "Review profile photo, verification, experience, languages, ratings, and completed sessions."],
  ["Request guidance", "Choose a date, time, session mode, and optional note. The mentor confirms or suggests a reschedule."],
  ["Continue the relationship", "Track sessions, leave reviews, save mentors, and return when you need the next conversation."],
];

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container">
          <SectionHeading
            eyebrow="How it works"
            title="From uncertainty to a useful conversation"
            description="The flow is designed to help seekers understand where they are, what they can do, and what happens next."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {steps.map(([title, description], index) => (
              <Panel key={title}>
                <span className="text-sm font-bold text-app-primary">Step {index + 1}</span>
                <h2 className="mt-3 text-xl font-bold">{title}</h2>
                <p className="mt-2 leading-7 text-app-muted">{description}</p>
              </Panel>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/mentors">Find a mentor</ButtonLink>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

import { PublicShell, Panel, SectionHeading } from "@/components";

const faqs = [
  ["Can visitors browse mentors?", "Yes. Visitors can search mentors and view public profiles before signing in."],
  ["When is login required?", "Login is required for booking sessions, saving favorites, editing profiles, and submitting reviews."],
  ["How are mentors trusted?", "Profiles show verification status, experience, languages, ratings, completed sessions, and availability."],
  ["Can sessions be online or offline?", "Yes. The architecture supports video and in-person guidance in V1, with more modes later."],
];

export default function FaqPage() {
  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before the first conversation"
            description="Simple guidance on browsing, booking, trust, and account access."
          />
          <div className="mt-8 grid gap-4">
            {faqs.map(([question, answer]) => (
              <Panel key={question}>
                <h2 className="font-semibold">{question}</h2>
                <p className="mt-2 text-sm leading-6 text-app-muted">{answer}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

import { PublicShell, CheckItem, Panel, SectionHeading } from "@/components";

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <SectionHeading
            eyebrow="About Sahayak"
            title="Built around one simple belief: people need people."
            description="Sahayak exists to make experienced guidance accessible for students, farmers, parents, patients, founders, artists, and anyone facing a meaningful decision."
          />
          <Panel>
            <h2 className="text-xl font-bold">Platform principles</h2>
            <div className="mt-5 grid gap-4">
              <CheckItem>Trust through verified identities and clear profiles.</CheckItem>
              <CheckItem>Simplicity through fewer clicks and calm layouts.</CheckItem>
              <CheckItem>Accessibility for mobile, low bandwidth, and senior users.</CheckItem>
              <CheckItem>Human-first experiences over transactional screens.</CheckItem>
            </div>
          </Panel>
        </div>
      </section>
      <section className="py-12">
        <div className="app-container grid gap-4 md:grid-cols-2">
          <Panel>
            <h2 className="text-2xl font-bold">Mission</h2>
            <p className="mt-3 leading-7 text-app-muted">
              Build India&apos;s largest mentorship ecosystem where every individual can find verified guidance within minutes.
            </p>
          </Panel>
          <Panel>
            <h2 className="text-2xl font-bold">Long-term vision</h2>
            <p className="mt-3 leading-7 text-app-muted">
              Become the default destination whenever someone says, &quot;I need guidance&quot; or &quot;I want to help someone.&quot;
            </p>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}

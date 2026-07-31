import { PublicShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function ForgotPasswordPage() {
  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Password recovery"
            title="Reset access without losing your path"
            description="Enter the email linked to your Sahayak account. The reset flow is designed to invalidate old sessions securely."
          />
          <Panel>
            <form className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input className="app-input" placeholder="you@example.com" type="email" />
              </label>
              <ButtonLink href="/reset-password">Send reset link</ButtonLink>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}

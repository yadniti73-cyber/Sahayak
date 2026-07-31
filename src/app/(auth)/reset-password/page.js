import { PublicShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function ResetPasswordPage() {
  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Create new password"
            title="Secure your account"
            description="Use a strong password with uppercase, lowercase, a number, and a special character."
          />
          <Panel>
            <form className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                New password
                <input className="app-input" placeholder="New password" type="password" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Confirm password
                <input className="app-input" placeholder="Confirm password" type="password" />
              </label>
              <ButtonLink href="/login">Update password</ButtonLink>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}

import Link from "next/link";
import { PublicShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Welcome back"
            title="Continue your guidance journey"
            description="Sign in to manage bookings, save mentors, view notifications, and return to your dashboard."
          />
          <Panel>
            <form className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input className="app-input" placeholder="you@example.com" type="email" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Password
                <input className="app-input" placeholder="Enter password" type="password" />
              </label>
              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-app-muted">
                  <input type="checkbox" className="h-4 w-4 rounded border-app-border" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="font-semibold text-app-primary">
                  Forgot password?
                </Link>
              </div>
              <ButtonLink href="/dashboard/home">Sign in</ButtonLink>
              <p className="text-center text-sm text-app-muted">
                New to Sahayak? <Link href="/register" className="font-semibold text-app-primary">Create account</Link>
              </p>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}

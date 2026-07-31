import Link from "next/link";
import { PublicShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function RegisterPage() {
  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[0.9fr_1fr]">
          <SectionHeading
            eyebrow="Create account"
            title="Join as a seeker or mentor"
            description="Start with the essentials. Mentors can complete profile details, verification, and availability after registration."
          />
          <Panel>
            <form className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Full name
                  <input className="app-input" placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Role
                  <select className="app-input">
                    <option>Seeker</option>
                    <option>Mentor</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Email
                  <input className="app-input" placeholder="you@example.com" type="email" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Phone
                  <input className="app-input" placeholder="+91" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  City
                  <input className="app-input" placeholder="City" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Password
                  <input className="app-input" placeholder="Create password" type="password" />
                </label>
              </div>
              <ButtonLink href="/dashboard/home">Create account</ButtonLink>
              <p className="text-center text-sm text-app-muted">
                Already registered? <Link href="/login" className="font-semibold text-app-primary">Sign in</Link>
              </p>
            </form>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}

import { DashboardShell, ButtonLink, Panel, ProgressBar, SectionHeading } from "@/components";

export default function MentorProfileEditPage() {
  return (
    <DashboardShell role="mentor" title="Mentor profile">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Public profile"
          title="Show seekers why they can trust you"
          description="Profiles should feel personal and professional, with clear experience, languages, session modes, and availability."
        />
        <Panel>
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold">
              <span>Profile completion</span>
              <span>82%</span>
            </div>
            <div className="mt-2"><ProgressBar value={82} /></div>
          </div>
          <form className="grid gap-4">
            <input className="app-input" placeholder="Professional headline" />
            <textarea className="app-input min-h-32" placeholder="About your mentorship approach" />
            <div className="grid gap-3 sm:grid-cols-3">
              <input className="app-input" placeholder="Category" />
              <input className="app-input" placeholder="Languages" />
              <input className="app-input" placeholder="Price" />
            </div>
            <ButtonLink href="/mentor/profile">Save profile</ButtonLink>
          </form>
        </Panel>
      </div>
    </DashboardShell>
  );
}

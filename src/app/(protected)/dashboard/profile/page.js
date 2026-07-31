import { DashboardShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function SeekerProfilePage() {
  return (
    <DashboardShell role="seeker" title="Profile">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Profile"
          title="Keep your guidance context clear"
          description="A useful profile helps mentors understand your city, language preference, and current goals."
        />
        <Panel>
          <form className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="app-input" placeholder="Full name" />
              <input className="app-input" placeholder="City" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="app-input" placeholder="Preferred language" />
              <input className="app-input" placeholder="Phone" />
            </div>
            <textarea className="app-input min-h-32" placeholder="What kind of guidance are you seeking?" />
            <ButtonLink href="/dashboard/profile">Save profile</ButtonLink>
          </form>
        </Panel>
      </div>
    </DashboardShell>
  );
}

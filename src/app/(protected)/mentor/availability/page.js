import { DashboardShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function MentorAvailabilityPage() {
  return (
    <DashboardShell role="mentor" title="Availability">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Availability"
          title="Define when seekers can request guidance"
          description="Recurring windows and exceptions keep booking reliable and prevent overlapping sessions."
        />
        <Panel>
          <form className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <select className="app-input"><option>Monday</option></select>
              <input className="app-input" type="time" defaultValue="10:00" />
              <input className="app-input" type="time" defaultValue="12:00" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <select className="app-input"><option>Video</option><option>In-person</option></select>
              <input className="app-input" placeholder="Asia/Kolkata" />
              <select className="app-input"><option>Active</option><option>Paused</option></select>
            </div>
            <ButtonLink href="/mentor/availability">Save availability</ButtonLink>
          </form>
        </Panel>
      </div>
    </DashboardShell>
  );
}

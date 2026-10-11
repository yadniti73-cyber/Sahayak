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
              <select className="app-input" defaultValue="">
                <option value="" disabled>Day</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <input className="app-input" type="time" aria-label="Start time" />
              <input className="app-input" type="time" aria-label="End time" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <select className="app-input" defaultValue="">
                <option value="" disabled>Mode</option>
                <option>Video</option>
                <option>Phone</option>
                <option>In-person</option>
              </select>
              <input className="app-input" placeholder="Timezone" />
              <select className="app-input" defaultValue="">
                <option value="" disabled>Status</option>
                <option>Active</option>
                <option>Paused</option>
              </select>
            </div>
            <p className="text-xs text-app-muted">Saving availability is not connected to the backend yet.</p>
            <ButtonLink href="/mentor/availability">Save availability</ButtonLink>
          </form>
        </Panel>
      </div>
    </DashboardShell>
  );
}

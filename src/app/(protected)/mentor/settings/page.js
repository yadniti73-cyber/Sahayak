import { DashboardShell, Panel, SectionHeading } from "@/components";

export default function MentorSettingsPage() {
  return (
    <DashboardShell role="mentor" title="Settings">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Settings"
          title="Manage mentor preferences"
          description="Tune notifications, profile visibility, session preferences, and verification reminders."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {["Accept video requests", "Accept in-person requests", "Show response time", "Notify for pending requests"].map((item) => (
            <Panel key={item}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{item}</h2>
                  <p className="mt-1 text-sm text-app-muted">This affects how seekers see and book your profile.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-app-border" />
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

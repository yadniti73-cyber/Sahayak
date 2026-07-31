import { DashboardShell, Panel, SectionHeading } from "@/components";

export default function AdminSettingsPage() {
  return (
    <DashboardShell role="admin" title="Settings">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Platform settings"
          title="Control operational defaults"
          description="Configure response deadlines, verification queues, reminder timing, and platform moderation defaults."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {["Booking response deadline", "Verification review SLA", "Reminder window", "Public search visibility"].map((item) => (
            <Panel key={item}>
              <h2 className="font-semibold">{item}</h2>
              <p className="mt-1 text-sm text-app-muted">Configured in admin services when backend implementation begins.</p>
              <input className="app-input mt-4" placeholder="Default value" />
            </Panel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

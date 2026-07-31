import { DashboardShell, Panel, SectionHeading } from "@/components";

export default function SeekerSettingsPage() {
  return (
    <DashboardShell role="seeker" title="Settings">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Settings"
          title="Control privacy and notifications"
          description="Manage account preferences, language defaults, reminders, and security settings."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {["Email reminders", "Booking notifications", "Profile visibility", "Security alerts"].map((item) => (
            <Panel key={item}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{item}</h2>
                  <p className="mt-1 text-sm text-app-muted">Recommended for a smoother guidance flow.</p>
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

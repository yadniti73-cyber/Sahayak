import { DashboardShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function DashboardPage() {
  return (
    <DashboardShell title="Choose workspace">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Dashboard"
          title="Pick up where you left off"
          description="GuideShala will route authenticated users by role. This frontend preview shows the available workspaces."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Seeker", "/dashboard/home", "Manage bookings, favorites, profile, and notifications."],
            ["Mentor", "/mentor/dashboard", "Review requests, update availability, and manage profile strength."],
            ["Admin", "/admin", "Oversee users, mentors, categories, reports, and platform health."],
          ].map(([title, href, description]) => (
            <Panel key={title}>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-2 min-h-14 text-sm leading-6 text-app-muted">{description}</p>
              <div className="mt-5">
                <ButtonLink href={href} variant="secondary">Open</ButtonLink>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

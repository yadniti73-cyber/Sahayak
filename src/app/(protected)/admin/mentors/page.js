import { DashboardShell, Badge, Panel, SectionHeading } from "@/components";
import { mentors } from "@/lib/frontend-data";

export default function AdminMentorsPage() {
  return (
    <DashboardShell role="admin" title="Mentors">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Verification"
          title="Review mentor trust and profile quality"
          description="The verification queue is where identity, credentials, profile completeness, and rejection reasons are handled."
        />
        <div className="grid gap-4">
          {mentors.map((mentor) => (
            <Panel key={mentor.slug}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{mentor.name}</h2>
                  <p className="mt-1 text-sm text-app-muted">{mentor.headline}</p>
                </div>
                <Badge tone={mentor.verified ? "green" : "amber"}>{mentor.verified ? "Verified" : "Pending"}</Badge>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

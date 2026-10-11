import { DashboardShell, EmptyState, SectionHeading } from "@/components";
import { requirePageAccess } from "@/server/auth/route-guards";

export default async function AdminReportsPage() {
  await requirePageAccess(["ADMIN"]);

  return (
    <DashboardShell role="admin" title="Reports">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Reports"
          title="Review safety and quality signals"
          description="Reports help admins respond to trust issues, booking disputes, and profile concerns."
        />
        <EmptyState
          title="No reports to review"
          description="User reports are not collected by the platform yet. Once reporting is added, flagged items will be listed here."
        />
      </div>
    </DashboardShell>
  );
}

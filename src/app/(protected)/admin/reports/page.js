import { DashboardShell, SectionHeading } from "@/components";
import { SimpleTable } from "@/components/domain-cards";

export default function AdminReportsPage() {
  return (
    <DashboardShell role="admin" title="Reports">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Reports"
          title="Review safety and quality signals"
          description="Reports help admins respond to trust issues, booking disputes, and profile concerns."
        />
        <SimpleTable
          headers={["Report", "Source", "Priority"]}
          rows={[["Profile credential mismatch", "Mentor profile", "High"], ["Session no-show", "Booking", "Medium"], ["Review dispute", "Review", "Low"]]}
        />
      </div>
    </DashboardShell>
  );
}

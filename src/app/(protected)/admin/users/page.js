import { DashboardShell, SectionHeading } from "@/components";
import { SimpleTable } from "@/components/domain-cards";

export default function AdminUsersPage() {
  return (
    <DashboardShell role="admin" title="Users">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="User management"
          title="Manage account health and access"
          description="Admins can review user status, role distribution, and account moderation signals."
        />
        <SimpleTable
          headers={["User", "Role", "Status"]}
          rows={[["Meera Sharma", "Seeker", "Active"], ["Raghav Bansal", "Mentor", "Active"], ["Admin Team", "Admin", "Active"]]}
        />
      </div>
    </DashboardShell>
  );
}

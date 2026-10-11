import { DashboardShell, SectionHeading } from "@/components";
import { SimpleTable } from "@/components/domain-cards";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getAdminUsers } from "@/server/dashboard/queries";

export default async function AdminUsersPage() {
  await requirePageAccess(["ADMIN"]);
  const { total, rows } = await getAdminUsers();

  return (
    <DashboardShell role="admin" title="Users">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="User management"
          title="Manage account health and access"
          description={`Showing ${rows.length} of ${total} registered users, newest first.`}
        />
        <SimpleTable headers={["User", "Email", "Role", "Status", "Joined"]} rows={rows} emptyMessage="No users yet." />
      </div>
    </DashboardShell>
  );
}

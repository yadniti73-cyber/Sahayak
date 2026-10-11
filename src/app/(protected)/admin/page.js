import { DashboardShell } from "@/components";
import { AdminOverview } from "@/components/page-sections";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getAdminOverview } from "@/server/dashboard/queries";

export default async function AdminPage() {
  await requirePageAccess(["ADMIN"]);
  const data = await getAdminOverview();

  return (
    <DashboardShell role="admin" title="Admin overview">
      <AdminOverview data={data} />
    </DashboardShell>
  );
}

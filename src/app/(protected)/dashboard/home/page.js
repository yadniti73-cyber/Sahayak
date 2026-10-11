import { DashboardShell } from "@/components";
import { DashboardOverview } from "@/components/page-sections";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getSeekerOverview } from "@/server/dashboard/queries";

export default async function SeekerHomePage() {
  const user = await requirePageAccess();
  const data = await getSeekerOverview(user.id);

  return (
    <DashboardShell role="seeker" title="Home">
      <DashboardOverview data={data} />
    </DashboardShell>
  );
}

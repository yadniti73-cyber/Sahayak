import { DashboardShell } from "@/components";
import { DashboardOverview } from "@/components/page-sections";

export default function SeekerHomePage() {
  return (
    <DashboardShell role="seeker" title="Home">
      <DashboardOverview />
    </DashboardShell>
  );
}

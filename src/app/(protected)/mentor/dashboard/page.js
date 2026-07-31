import { DashboardShell } from "@/components";
import { MentorWorkspaceOverview } from "@/components/page-sections";

export default function MentorDashboardPage() {
  return (
    <DashboardShell role="mentor" title="Mentor dashboard">
      <MentorWorkspaceOverview />
    </DashboardShell>
  );
}

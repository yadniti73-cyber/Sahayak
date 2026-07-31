import { DashboardShell } from "@/components";
import { AdminOverview } from "@/components/page-sections";

export default function AdminPage() {
  return (
    <DashboardShell role="admin" title="Admin overview">
      <AdminOverview />
    </DashboardShell>
  );
}

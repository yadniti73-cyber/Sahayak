import { DashboardShell, SectionHeading } from "@/components";
import { AdminFeedbackManager } from "@/features/admin";
import { requirePageAccess } from "@/server/auth/route-guards";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  await requirePageAccess(["ADMIN"]);
  return (
    <DashboardShell role="admin" title="Feedback">
      <div className="grid gap-6">
        <SectionHeading eyebrow="Community feedback" title="Review website feedback" description="Read submissions from the homepage, review ratings, and maintain feedback records." />
        <AdminFeedbackManager />
      </div>
    </DashboardShell>
  );
}

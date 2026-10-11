import { DashboardShell } from "@/components";
import { MentorWorkspaceOverview } from "@/components/page-sections";
import { VerificationBanner } from "@/components/mentor-verification/VerificationBanner";
import { getMentorVerificationStatus } from "@/features/mentor-verification/server/service";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getMentorOverview } from "@/server/dashboard/queries";

export default async function MentorDashboardPage() {
  const user = await requirePageAccess(["MENTOR"]);
  const [data, verification] = await Promise.all([getMentorOverview(user.id), getMentorVerificationStatus(user.id)]);

  return (
    <DashboardShell role="mentor" title="Mentor dashboard">
      <div className="grid gap-6">
        {verification.status !== "APPROVED" ? (
          <VerificationBanner status={verification.status} note={verification.note} href="/mentor/profile" />
        ) : null}
        <MentorWorkspaceOverview data={data} />
      </div>
    </DashboardShell>
  );
}

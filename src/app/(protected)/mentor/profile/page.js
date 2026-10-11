import { DashboardShell, ProgressBar, SectionHeading } from "@/components";
import { MentorApplicationForm } from "@/components/mentor-verification/MentorApplicationForm";
import { getCategories } from "@/features/catalog/server/service";
import { getMentorApplication } from "@/features/mentor-verification/server/service";
import { requirePageAccess } from "@/server/auth/route-guards";
import { mentorProfileStrength } from "@/server/dashboard/view-models";

export const dynamic = "force-dynamic";

export default async function MentorProfileEditPage() {
  const user = await requirePageAccess(["MENTOR"]);
  const [application, categories] = await Promise.all([getMentorApplication(user.id), getCategories()]);
  const strength = mentorProfileStrength({
    ...application.profile,
    verified: application.status === "APPROVED",
  });

  return (
    <DashboardShell role="mentor" title="Profile & verification">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Verification"
          title="Get verified to appear to seekers"
          description="Fill in your details and upload your documents. Our team reviews every application, and only verified mentors are shown on GuideShala."
        />
        <div className="app-card max-w-md p-4">
          <div className="flex justify-between text-sm font-semibold">
            <span>Profile completion</span>
            <span>{strength.percent}%</span>
          </div>
          <div className="mt-2"><ProgressBar value={strength.percent} /></div>
        </div>
        <MentorApplicationForm initial={application} categories={categories.map((c) => c.name)} />
      </div>
    </DashboardShell>
  );
}

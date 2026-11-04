import { DashboardShell, SectionHeading } from "@/components";
import { MentorCalendar } from "@/components/MentorCalendar";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getMentorBookingItems, getTodayKey } from "@/server/dashboard/queries";

export const dynamic = "force-dynamic";

const YEAR = 365 * 24 * 60 * 60 * 1000;

export default async function MentorSchedulePage() {
  const user = await requirePageAccess(["MENTOR"]);
  const now = Date.now();
  const items = await getMentorBookingItems(user.id, {
    statuses: ["REQUESTED", "RESCHEDULE_REQUESTED", "CONFIRMED", "COMPLETED"],
    from: new Date(now - YEAR),
    to: new Date(now + YEAR),
    limit: 500,
  });

  return (
    <DashboardShell role="mentor" title="Schedule">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Schedule"
          title="Your sessions at a glance"
          description="Grey days are free. Yellow days have requests waiting for you, green days have completed sessions, and today is highlighted in red."
        />
        <MentorCalendar items={items} todayKey={getTodayKey()} />
      </div>
    </DashboardShell>
  );
}

import { CalendarDays, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { DashboardShell, SectionHeading, StatCard } from "@/components";
import { SimpleTable } from "@/components/domain-cards";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getMentorAnalytics } from "@/server/dashboard/queries";

export default async function MentorAnalyticsPage() {
  const user = await requirePageAccess(["MENTOR"]);
  const { totals, breakdown } = await getMentorAnalytics(user.id);

  return (
    <DashboardShell role="mentor" title="Analytics">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Analytics"
          title="Understand your mentorship impact"
          description="Track bookings, completion rate, and how your sessions are distributed."
        />
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Bookings" value={String(totals.total)} detail="All time" icon={CalendarDays} />
          <StatCard label="Completed" value={String(totals.completed)} detail={`${totals.pending} pending`} icon={CheckCircle2} />
          <StatCard label="Rating" value={totals.rating} detail={`${totals.reviews} public reviews`} icon={Star} />
          <StatCard label="Completion" value={totals.completion} detail="Completed vs. missed or cancelled" icon={TrendingUp} />
        </div>
        <SimpleTable
          headers={["Status", "Bookings", "Share"]}
          rows={breakdown}
          emptyMessage="No bookings yet. Your breakdown will appear here."
        />
      </div>
    </DashboardShell>
  );
}

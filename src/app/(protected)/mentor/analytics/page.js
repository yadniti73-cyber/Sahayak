import { CalendarDays, Star, Timer, TrendingUp } from "lucide-react";
import { DashboardShell, SectionHeading, StatCard } from "@/components";
import { SimpleTable } from "@/components/domain-cards";

export default function MentorAnalyticsPage() {
  return (
    <DashboardShell role="mentor" title="Analytics">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Analytics"
          title="Understand your mentorship impact"
          description="Track bookings, completion rate, response time, and the categories seekers request most."
        />
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Sessions" value="178" detail="All time" icon={CalendarDays} />
          <StatCard label="Rating" value="4.8" detail="Public reviews" icon={Star} />
          <StatCard label="Response" value="4h" detail="Average" icon={Timer} />
          <StatCard label="Completion" value="92%" detail="This month" icon={TrendingUp} />
        </div>
        <SimpleTable
          headers={["Category", "Requests", "Completion"]}
          rows={[["Business strategy", "64", "94%"], ["Fundraising", "42", "90%"], ["Leadership", "31", "96%"]]}
        />
      </div>
    </DashboardShell>
  );
}

import { DashboardShell, SectionHeading } from "@/components";
import { MentorGrid } from "@/components/page-sections";
import { mentors } from "@/lib/frontend-data";

export default function FavoritesPage() {
  return (
    <DashboardShell role="seeker" title="Favorites">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Saved mentors"
          title="People you may return to"
          description="Favorites make it easy to book repeat sessions when the next question arrives."
        />
        <MentorGrid items={mentors.slice(0, 3)} />
      </div>
    </DashboardShell>
  );
}

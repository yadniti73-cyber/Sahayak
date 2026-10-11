import { DashboardShell, ButtonLink, EmptyState, SectionHeading } from "@/components";
import { MentorGrid } from "@/components/page-sections";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getFavoriteMentorViews } from "@/server/dashboard/queries";

export default async function FavoritesPage() {
  const user = await requirePageAccess();
  const mentors = await getFavoriteMentorViews(user.id);

  return (
    <DashboardShell role="seeker" title="Favorites">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Saved mentors"
          title="People you may return to"
          description="Favorites make it easy to book repeat sessions when the next question arrives."
        />
        {mentors.length === 0 ? (
          <EmptyState
            title="No saved mentors yet"
            description="Save a mentor from their profile and they will appear here."
            action={<ButtonLink href="/mentors">Browse mentors</ButtonLink>}
          />
        ) : (
          <MentorGrid items={mentors} />
        )}
      </div>
    </DashboardShell>
  );
}

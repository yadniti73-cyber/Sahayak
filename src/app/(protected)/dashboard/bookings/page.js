import { DashboardShell, ButtonLink, EmptyState, SectionHeading } from "@/components";
import { BookingCard } from "@/components/domain-cards";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getBookingViewsForUser } from "@/server/dashboard/queries";

export default async function SeekerBookingsPage() {
  const user = await requirePageAccess();
  const bookings = await getBookingViewsForUser(user.id, "SEEKER");

  return (
    <DashboardShell role="seeker" title="Bookings">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Bookings"
            title="Manage your guidance sessions"
            description="Track requested, confirmed, completed, and cancelled mentorship sessions."
          />
          <ButtonLink href="/mentors">Book new session</ButtonLink>
        </div>
        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="When you book a session with a mentor it will show up here."
            action={<ButtonLink href="/mentors">Find a mentor</ButtonLink>}
          />
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

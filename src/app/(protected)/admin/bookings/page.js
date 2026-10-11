import { DashboardShell, EmptyState, SectionHeading } from "@/components";
import { BookingCard } from "@/components/domain-cards";
import { requirePageAccess } from "@/server/auth/route-guards";
import { getAdminBookings } from "@/server/dashboard/queries";

export default async function AdminBookingsPage() {
  await requirePageAccess(["ADMIN"]);
  const bookings = await getAdminBookings();

  return (
    <DashboardShell role="admin" title="Bookings">
      <div className="grid gap-6">
        <SectionHeading
          eyebrow="Booking oversight"
          title="Monitor the lifecycle of guidance sessions"
          description="Admins can inspect requested, confirmed, cancelled, and completed bookings."
        />
        {bookings.length === 0 ? (
          <EmptyState title="No bookings yet" description="Bookings made on the platform will appear here." />
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

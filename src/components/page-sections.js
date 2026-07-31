import { Bell, CalendarDays, CheckCircle2, Heart, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { adminRows, bookings, categories, mentors, notifications } from "@/lib/frontend-data";
import { Badge, ButtonLink, CheckItem, Panel, ProgressBar, SectionHeading, StatCard } from "./app-primitives";
import { BookingCard, CategoryCard, MentorCard, SimpleTable } from "./domain-cards";

export function PublicPageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-app-border bg-white py-12">
      <div className="app-container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function MentorGrid({ items = mentors }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((mentor) => (
        <MentorCard key={mentor.slug} mentor={mentor} />
      ))}
    </div>
  );
}

export function CategoryGrid({ items = categories }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}

export function DashboardOverview() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Upcoming" value="2" detail="Sessions this week" icon={CalendarDays} />
        <StatCard label="Completed" value="18" detail="Guidance calls finished" icon={CheckCircle2} />
        <StatCard label="Saved mentors" value="7" detail="Ready for repeat booking" icon={Heart} />
        <StatCard label="Unread" value="3" detail="Notifications waiting" icon={Bell} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Upcoming sessions</h2>
            <ButtonLink href="/dashboard/bookings" variant="ghost">View all</ButtonLink>
          </div>
          <div className="mt-4 grid gap-3">
            {bookings.slice(0, 2).map((booking) => (
              <BookingCard key={booking.topic} booking={booking} />
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-bold">Recent activity</h2>
          <div className="mt-4 grid gap-3">
            {notifications.map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-3 text-sm text-app-muted">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function MentorWorkspaceOverview() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Today's schedule" value="4" detail="2 video, 2 in-person" icon={CalendarDays} />
        <StatCard label="Pending requests" value="9" detail="Average response 4h" icon={Bell} />
        <StatCard label="Rating" value="4.8" detail="178 public reviews" icon={TrendingUp} />
        <StatCard label="Completion" value="92%" detail="Monthly sessions" icon={CheckCircle2} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-lg font-bold">Profile strength</h2>
          <p className="mt-2 text-sm text-app-muted">Verification, availability, and story are visible to seekers.</p>
          <div className="mt-5">
            <ProgressBar value={82} />
          </div>
          <div className="mt-5 grid gap-3">
            <CheckItem>Verification documents uploaded</CheckItem>
            <CheckItem>Three weekly availability windows active</CheckItem>
            <CheckItem>Response time visible on public profile</CheckItem>
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-bold">Pending requests</h2>
          <div className="mt-4 grid gap-3">
            {bookings.slice(0, 2).map((booking) => (
              <BookingCard key={booking.topic} booking={booking} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function AdminOverview() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Registered users" value="84,210" detail="+284 today" icon={Users} />
        <StatCard label="Verified mentors" value="10,248" detail="18 waiting" icon={ShieldCheck} />
        <StatCard label="Active sessions" value="1,246" detail="Healthy" icon={CalendarDays} />
        <StatCard label="Reports" value="7" detail="2 high priority" icon={Bell} />
      </div>
      <SimpleTable headers={["Area", "Volume", "Status"]} rows={adminRows} />
    </div>
  );
}

export function FilterStrip() {
  return (
    <div className="app-card grid gap-3 p-4 md:grid-cols-5">
      {["Category", "City", "Language", "Mode", "Sort"].map((label) => (
        <label key={label} className="grid gap-1 text-xs font-semibold text-app-muted">
          {label}
          <select className="app-input py-2">
            <option>{label === "Sort" ? "Recommended" : `All ${label.toLowerCase()}`}</option>
          </select>
        </label>
      ))}
    </div>
  );
}

export function StatusList({ items }) {
  return (
    <div className="grid gap-3">
      {items.map(([title, detail, tone]) => (
        <Panel key={title}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-app-muted">{detail}</p>
            </div>
            <Badge tone={tone}>{tone}</Badge>
          </div>
        </Panel>
      ))}
    </div>
  );
}

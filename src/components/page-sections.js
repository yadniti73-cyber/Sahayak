import { Bell, CalendarDays, CheckCircle2, Heart, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { categories, mentors } from "@/lib/frontend-data";
import { Badge, ButtonLink, CheckItem, Panel, ProgressBar, SectionHeading, StatCard } from "./app-primitives";
import { BookingCard, CategoryCard, MentorCard, SimpleTable } from "./domain-cards";
import { Reveal } from "./Reveal";

export function PublicPageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden border-b border-app-border bg-gradient-to-br from-white via-blue-50/60 to-green-50/50 py-12">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 animate-float-slow rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 animate-float-slow rounded-full bg-green-200/40 blur-3xl [animation-delay:2s]" />
      <div className="app-container relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children ? <Reveal delay={150} className="mt-8">{children}</Reveal> : null}
      </div>
    </section>
  );
}

export function MentorGrid({ items = mentors }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((mentor, i) => (
        <Reveal key={mentor.slug} delay={(i % 2) * 100}>
          <MentorCard mentor={mentor} />
        </Reveal>
      ))}
    </div>
  );
}

export function CategoryGrid({ items = categories }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((category, i) => (
        <Reveal key={category.slug} delay={(i % 4) * 80}>
          <CategoryCard category={category} />
        </Reveal>
      ))}
    </div>
  );
}

export function DashboardOverview({ data }) {
  const { stats, upcoming, activity } = data;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Upcoming" value={String(stats.upcomingThisWeek)} detail="Sessions this week" icon={CalendarDays} />
        <StatCard label="Completed" value={String(stats.completed)} detail="Guidance calls finished" icon={CheckCircle2} />
        <StatCard label="Saved mentors" value={String(stats.savedMentors)} detail="Ready for repeat booking" icon={Heart} />
        <StatCard label="Unread" value={String(stats.unread)} detail="Notifications waiting" icon={Bell} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Upcoming sessions</h2>
            <ButtonLink href="/dashboard/bookings" variant="ghost">View all</ButtonLink>
          </div>
          <div className="mt-4 grid gap-3">
            {upcoming.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-app-muted">
                <p>No upcoming sessions.</p>
                <div className="mt-3">
                  <ButtonLink href="/mentors" variant="secondary">Find a mentor</ButtonLink>
                </div>
              </div>
            ) : (
              upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            )}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-bold">Recent activity</h2>
          <div className="mt-4 grid gap-3">
            {activity.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-app-muted">No activity yet.</div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm text-app-muted">
                  <p className={item.read ? "" : "font-semibold text-app-text"}>{item.title}</p>
                  {item.message ? <p className="mt-1">{item.message}</p> : null}
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function MentorWorkspaceOverview({ data }) {
  const { stats, strength, pendingRequests, hasProfile } = data;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Today's schedule" value={String(stats.todayCount)} detail={stats.todayDetail} icon={CalendarDays} />
        <StatCard label="Pending requests" value={String(stats.pending)} detail="Waiting for your response" icon={Bell} />
        <StatCard label="Rating" value={stats.rating} detail={stats.ratingDetail} icon={TrendingUp} />
        <StatCard label="Completion" value={stats.completion} detail={stats.completionDetail} icon={CheckCircle2} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-lg font-bold">Profile strength</h2>
          <p className="mt-2 text-sm text-app-muted">
            {hasProfile
              ? `Your profile is ${strength.percent}% complete. A fuller profile is easier for seekers to trust.`
              : "Your public mentor profile has not been created for this account yet."}
          </p>
          <div className="mt-5">
            <ProgressBar value={strength.percent} />
          </div>
          <div className="mt-5 grid gap-3">
            {strength.items.map((item) => (
              <CheckItem key={item.label} done={item.done}>{item.label}</CheckItem>
            ))}
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Pending requests</h2>
            <ButtonLink href="/mentor/bookings" variant="ghost">View all</ButtonLink>
          </div>
          <div className="mt-4 grid gap-3">
            {pendingRequests.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-app-muted">No pending requests right now.</div>
            ) : (
              pendingRequests.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function AdminOverview({ data }) {
  const { stats, rows } = data;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Registered users" value={stats.users} detail={`+${stats.signupsToday} today`} icon={Users} />
        <StatCard label="Verified mentors" value={stats.verifiedMentors} detail={`${stats.pendingMentors} waiting`} icon={ShieldCheck} />
        <StatCard label="Upcoming sessions" value={stats.upcomingConfirmed} detail={`${stats.totalBookings} bookings in total`} icon={CalendarDays} />
        <StatCard label="Pending requests" value={stats.pendingRequests} detail="Awaiting mentor response" icon={Bell} />
      </div>
      <SimpleTable headers={["Area", "Volume", "Status"]} rows={rows} />
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

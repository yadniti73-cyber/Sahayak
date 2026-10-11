import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Heart,
  Home,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { dashboardNavigation } from "@/lib/navigation";

const iconMap = {
  Dashboard: Home,
  Overview: Home,
  Bookings: CalendarDays,
  Favorites: Heart,
  Profile: User,
  Settings,
  Calendar: BookOpen,
  Availability: CalendarDays,
  Analytics: BarChart3,
  Users,
  Mentors: ShieldCheck,
  Categories: BookOpen,
  Reports: BarChart3,
};

export function DashboardShell({ children, role = "seeker", title = "Dashboard", className = "" }) {
  const navItems = dashboardNavigation[role] || dashboardNavigation.seeker;

  return (
    <div className={`min-h-screen bg-app-bg text-app-text ${className}`}>
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-app-border bg-white lg:block">
          <div className="flex h-16 items-center border-b border-app-border px-5">
            <Link href="/" className="text-xl font-bold text-app-primary">GuideShala</Link>
          </div>
          <nav className="grid gap-1 p-4" aria-label={`${role} navigation`}>
            {navItems.map((item) => {
              const Icon = iconMap[item.label] || Home;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-app-muted transition hover:bg-blue-50 hover:text-app-primary"
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-app-border bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase text-app-muted">{role} workspace</p>
                <h1 className="text-lg font-bold text-app-text">{title}</h1>
              </div>
              <form className="ml-auto hidden w-full max-w-sm items-center rounded-lg bg-slate-100 px-3 py-2 text-sm text-app-muted md:flex">
                <Search size={17} aria-hidden="true" />
                <input aria-label="Search workspace" className="w-full bg-transparent px-3 outline-none" placeholder="Search" />
              </form>
              <button className="rounded-lg border border-app-border bg-white p-2 text-app-muted hover:text-app-primary" aria-label="Notifications">
                <Bell size={19} aria-hidden="true" />
              </button>
              <SignOutButton iconOnly className="rounded-lg border border-app-border bg-white p-2 text-app-muted hover:text-app-primary" />
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { dashboardNavigation } from "@/lib/navigation";
import { APP_ROUTES } from "@/lib/routes";
import { Avatar } from "../app-primitives";
import { getInitials, useAuth } from "../providers/AuthContext";

const iconMap = {
  Dashboard: Home,
  Overview: Home,
  Bookings: CalendarDays,
  Favorites: Heart,
  Profile: User,
  Settings,
  Schedule: CalendarCheck,
  Availability: CalendarDays,
  Analytics: BarChart3,
  Users,
  Mentors: ShieldCheck,
  Categories: BookOpen,
  Reports: BarChart3,
  Feedback: MessageSquareText,
};

const roleTone = {
  seeker: "bg-blue-50 text-app-primary border-blue-100",
  mentor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  admin: "bg-slate-900 text-white border-slate-900",
};

const profileRoute = {
  seeker: APP_ROUTES.dashboardProfile,
  mentor: APP_ROUTES.mentorProfile,
  admin: APP_ROUTES.adminSettings, // admins have no profile page; settings is the closest thing
};

function SidebarUser({ role, user, loading, onNavigate, onLogout }) {
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "";

  return (
    <div className="flex items-center gap-1 rounded-xl border border-app-border bg-white p-2">
      <Link
        href={profileRoute[role] || APP_ROUTES.dashboardProfile}
        onClick={onNavigate}
        aria-label="Open profile"
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1.5 transition hover:bg-blue-50"
      >
        {loading || !user ? (
          <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100" aria-hidden="true" />
        ) : (
          <Avatar initials={getInitials(user.firstName, user.lastName)} src={user.pictureUrl} alt={fullName} size="sm" />
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-app-text">{user ? fullName : "Profile"}</span>
          <span className="block truncate text-xs text-app-muted">{user ? user.email : "View profile"}</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className="shrink-0 rounded-lg p-2 text-app-muted transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

function SidebarContent({ role, navItems, activeHref, onNavigate, user, authLoading, onLogout }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-app-border px-5">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5" aria-label="GuideShala home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" width={34} height={31} className="h-8 w-auto" />
          <span className="text-xl font-extrabold tracking-tight text-[#1366c4]">
            Guide<span className="text-[#0f7a3d]">Shala</span>
          </span>
        </Link>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${roleTone[role] || roleTone.seeker}`}>
          {role}
        </span>
      </div>

      <nav className="grid flex-1 content-start gap-1 overflow-y-auto p-4" aria-label={`${role} navigation`}>
        {navItems.map((item) => {
          const Icon = iconMap[item.label] || Home;
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition duration-200 ${
                active
                  ? "bg-gradient-to-r from-blue-50 to-green-50 text-app-primary shadow-sm ring-1 ring-blue-100"
                  : "text-app-muted hover:translate-x-0.5 hover:bg-blue-50 hover:text-app-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-app-primary"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-app-primary to-green-500 transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              />
              <Icon size={18} className={active ? "text-green-600" : "transition group-hover:text-green-600"} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="grid gap-3 p-4">
        <SidebarUser role={role} user={user} loading={authLoading} onNavigate={onNavigate} onLogout={onLogout} />
        <Link href="/" onClick={onNavigate} className="block text-center text-xs font-semibold text-app-muted transition hover:text-app-primary">
          Back to website
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({ children, role = "seeker", title = "Dashboard", className = "" }) {
  const navItems = dashboardNavigation[role] || dashboardNavigation.seeker;
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, clearUser } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Longest matching nav href wins, so /dashboard and /dashboard/home do not both light up.
  const activeHref = navItems
    .map((i) => i.href)
    .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
    .sort((a, b) => b.length - a.length)[0];

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      clearUser();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-green-50/40 text-app-text ${role === "admin" ? "admin-workspace" : ""} ${className}`}>
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-app-border bg-white/90 backdrop-blur lg:block">
          <SidebarContent role={role} navItems={navItems} activeHref={activeHref} user={user} authLoading={authLoading} onLogout={logout} />
        </aside>

        {/* Mobile drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? "visible" : "invisible"}`}>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${drawer ? "opacity-100" : "opacity-0"}`}
          />
          <aside
            className={`absolute left-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-soft transition-transform duration-300 ${
              drawer ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-app-muted hover:bg-blue-50 hover:text-app-primary"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <SidebarContent role={role} navItems={navItems} activeHref={activeHref} onNavigate={() => setDrawer(false)} user={user} authLoading={authLoading} onLogout={logout} />
          </aside>
        </div>

        <div className="min-w-0">
          <header
            className={`sticky top-0 z-30 border-b border-app-border transition duration-300 ${
              scrolled ? "bg-white/80 shadow-soft backdrop-blur-lg" : "bg-white/95 backdrop-blur"
            }`}
          >
            <div className="h-1 bg-gradient-to-r from-app-primary via-green-500 to-app-primary" aria-hidden="true" />
            <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                aria-label="Open menu"
                className="rounded-lg border border-app-border bg-white p-2 text-app-primary transition hover:bg-blue-50 lg:hidden"
              >
                <Menu size={19} aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{role} workspace</p>
                <h1 className="truncate text-lg font-bold text-app-text">{title}</h1>
              </div>
              <button
                type="button"
                className="relative ml-auto rounded-lg border border-app-border bg-white p-2 text-app-muted transition hover:border-green-300 hover:text-green-700"
                aria-label="Notifications"
              >
                <Bell size={19} aria-hidden="true" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" aria-hidden="true" />
              </button>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

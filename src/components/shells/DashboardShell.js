"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Heart,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
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

const roleTone = {
  seeker: "bg-blue-50 text-app-primary border-blue-100",
  mentor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  admin: "bg-slate-900 text-white border-slate-900",
};

function SidebarContent({ role, navItems, activeHref, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-app-border px-5">
        <Link href="/" onClick={onNavigate} className="bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-xl font-bold text-transparent">
          GuideShala
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
                  : "text-app-muted hover:translate-x-0.5 hover:bg-blue-50 hover:text-app-primary"
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

      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-app-primary to-green-600 p-4 text-white shadow-soft">
          <LifeBuoy size={20} aria-hidden="true" />
          <p className="mt-2 text-sm font-semibold">Need help?</p>
          <p className="mt-1 text-xs leading-5 text-white/85">A real person from our team replies within 24 hours.</p>
          <Link
            href="/contact"
            onClick={onNavigate}
            className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-app-primary transition hover:bg-green-50"
          >
            Contact us
          </Link>
        </div>
        <Link href="/" onClick={onNavigate} className="mt-3 block text-center text-xs font-semibold text-app-muted transition hover:text-app-primary">
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
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-green-50/40 text-app-text ${className}`}>
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-app-border bg-white/90 backdrop-blur lg:block">
          <SidebarContent role={role} navItems={navItems} activeHref={activeHref} />
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
            <SidebarContent role={role} navItems={navItems} activeHref={activeHref} onNavigate={() => setDrawer(false)} />
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
              <form className="ml-auto hidden w-full max-w-sm items-center rounded-full border border-transparent bg-slate-100/80 px-4 py-2 text-sm text-app-muted transition focus-within:border-green-400 focus-within:bg-white md:flex">
                <Search size={17} aria-hidden="true" />
                <input aria-label="Search workspace" className="w-full bg-transparent px-3 outline-none" placeholder="Search" />
              </form>
              <button
                type="button"
                className="relative ml-auto rounded-lg border border-app-border bg-white p-2 text-app-muted transition hover:border-green-300 hover:text-green-700 md:ml-0"
                aria-label="Notifications"
              >
                <Bell size={19} aria-hidden="true" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-app-border bg-white p-2 text-app-muted transition hover:border-red-200 hover:text-red-600"
                aria-label="Log out"
              >
                <LogOut size={19} aria-hidden="true" />
              </button>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

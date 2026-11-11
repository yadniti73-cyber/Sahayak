"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { categories } from "@/lib/frontend-data";
import { ROLE_HOME_ROUTES } from "@/lib/routes";
import { Avatar } from "../app-primitives";
import { GLogo } from "../GLogo";
import { getInitials, useAuth } from "../providers/AuthContext";

const links = [
  // { label: "Find Mentors", href: "/mentors" },
  { label: "How it works ?", href: "/how-it-works" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function PublicHeader({ children, className = "" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const catRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!catOpen) return undefined;
    function onDown(e) {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setCatOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  if (children) {
    return <header className={className}>{children}</header>;
  }

  function isActive(href) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/mentors?q=${encodeURIComponent(q)}` : "/mentors");
    setOpen(false);
  }

  const homeHref = user
    ? ROLE_HOME_ROUTES[user.role] || "/dashboard/home"
    : "/login";
  const linkCls = (active) =>
    `rounded-lg px-3 py-2 text-[15px] font-medium transition ${
      active
        ? "text-emerald-700"
        : "text-[#0b1736] hover:bg-white/70 hover:text-emerald-700"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur ${className}`}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="GuideShala home"
        >
          <GLogo size={38} />
          <span className="text-2xl font-extrabold tracking-tight text-[#0b1736]">
            Guide<span className="text-emerald-700">Shala</span>
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          className="hidden min-w-[220px] max-w-[330px] flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 transition focus-within:border-emerald-500 focus-within:bg-white xl:flex"
        >
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search mentors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 text-[15px] text-[#0b1736] outline-none placeholder:text-slate-400"
            placeholder="Search"
          />
        </form>

        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              aria-haspopup="true"
              className={`${linkCls(pathname.startsWith("/categor"))} inline-flex items-center gap-1`}
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition ${catOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {catOpen ? (
              <div className="absolute left-0 top-full mt-2 w-[360px] rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-[#0b1736] transition hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/categories"
                  className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  View all categories{" "}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </div>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={linkCls(isActive(item.href))}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          {user ? (
            <Link href={homeHref} title={`${user.firstName} ${user.lastName}`}>
              <Avatar
                initials={getInitials(user.firstName, user.lastName)}
                src={user.pictureUrl}
                alt={`${user.firstName} ${user.lastName}`}
                size="sm"
              />
            </Link>
          ) : authLoading ? (
            <span className="h-10 w-10" aria-hidden="true" />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-[15px] font-medium text-[#0b1736] transition hover:text-emerald-700 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register?role=mentor"
                className="hidden rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[15px] font-medium text-[#0b1736] transition hover:border-[#0b1736] md:inline-flex"
              >
                Join as guide
              </Link>
            </>
          )}
          <Link
            href="/mentors"
            className="hidden items-center gap-2 rounded-xl bg-[#0b1736] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#15275a] sm:inline-flex"
          >
            Find an Expert <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg border border-slate-200 bg-white p-2 text-[#0b1736] transition hover:bg-slate-50 lg:hidden"
          >
            {open ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full max-h-[80vh] origin-top overflow-y-auto border-t border-slate-200 bg-white shadow-soft transition duration-300 lg:hidden ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="app-container grid gap-4 py-4">
          <form
            onSubmit={onSearch}
            className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
          >
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search mentors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-3 outline-none"
              placeholder="Search"
            />
          </form>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            <Link
              href="/categories"
              className={`${linkCls(pathname.startsWith("/categor"))} py-3`}
            >
              Categories
            </Link>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkCls(isActive(item.href))} py-3`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <Link
              href={homeHref}
              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-3"
            >
              <Avatar
                initials={getInitials(user.firstName, user.lastName)}
                src={user.pictureUrl}
                alt=""
                size="sm"
              />
              <span className="font-medium text-[#0b1736]">
                {user.firstName} {user.lastName}
              </span>
            </Link>
          ) : authLoading ? null : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-[#0b1736]"
              >
                Login
              </Link>
              <Link
                href="/register?role=mentor"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-[#0b1736]"
              >
                Join as guide
              </Link>
            </div>
          )}
          <Link
            href="/mentors"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b1736] text-sm font-semibold text-white"
          >
            Find an Expert <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

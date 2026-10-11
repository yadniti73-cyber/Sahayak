"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { publicNavigationItems } from "@/lib/navigation";
import { ButtonLink } from "../app-primitives";

export function PublicHeader({ children, className = "" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Shadow + reading-progress bar
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 8);
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (children) {
    return <header className={className}>{children}</header>;
  }

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/mentors?q=${encodeURIComponent(q)}` : "/mentors");
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/80 shadow-soft backdrop-blur-lg" : "bg-white/95 backdrop-blur"
      } ${className}`}
    >
      <div className="h-1 bg-gradient-to-r from-app-primary via-green-500 to-app-primary" aria-hidden="true" />

      <div className="app-container flex min-h-16 items-center gap-4">
        <Link href="/" className="group flex items-center gap-2.5 text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-green-50 ring-1 ring-blue-100 transition duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Image src="/images/logo.png" alt="GuideShala logo" width={36} height={36} priority className="h-full w-full object-contain" />
          </span>
          <span className="bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent">GuideShala</span>
        </Link>

        <form
          onSubmit={onSearch}
          className="hidden min-w-64 flex-1 items-center rounded-full border border-transparent bg-slate-100/80 px-4 py-2 text-sm text-app-muted transition focus-within:border-green-400 focus-within:bg-white focus-within:shadow-sm md:flex"
        >
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Search mentors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 outline-none"
            placeholder="Search mentors, city, language"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {publicNavigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "text-app-primary" : "text-app-muted hover:bg-blue-50 hover:text-app-primary"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-app-primary to-green-500 transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
           <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-md font-bold text-white bg-green-500 hover:bg-green-600 sm:inline-flex"
          >
            Log in
          </Link>
          <ButtonLink href="/register" className="px-4 py-2 ">
            Get started
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg border border-app-border bg-white p-2 text-app-primary transition hover:bg-blue-50 lg:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full origin-top border-t border-app-border bg-white/95 shadow-soft backdrop-blur-lg transition duration-300 lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="app-container grid gap-4 py-4">
          <form onSubmit={onSearch} className="flex items-center rounded-full bg-slate-100 px-4 py-2.5 text-sm text-app-muted">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search mentors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-3 outline-none"
              placeholder="Search mentors, city, language"
            />
          </form>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {publicNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-3 text-md font-medium transition ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-50 to-green-50 text-app-primary"
                    : "text-app-muted hover:bg-blue-50 hover:text-app-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3">
            <ButtonLink href="/login" variant="primary">Log in</ButtonLink>
            <ButtonLink href="/register">Get started</ButtonLink>
          </div>
        </div>
      </div>

      {/* Reading progress */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-app-primary to-green-500 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </header>
  );
}


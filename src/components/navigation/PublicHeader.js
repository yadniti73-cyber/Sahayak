import Link from "next/link";
import { Search } from "lucide-react";
import { publicNavigationItems } from "@/lib/navigation";
import { ButtonLink } from "../app-primitives";
import Image from "next/image";
export function PublicHeader({ children, className = "" }) {
  if (children) {
    return <header className={className}>{children}</header>;
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b border-app-border bg-white/95 backdrop-blur ${className}`}
    >
      <div className="app-container flex min-h-16 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-app-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-app-primary text-white">
            <Image src="/images/logo.png" alt="logo" width={36} height={36} className="h-full w-full object-contain" />
          </span>
          Sahayak
        </Link>
        <form className="hidden min-w-64 flex-1 items-center rounded-lg bg-slate-100 px-3 py-2 text-sm text-app-muted md:flex">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Search mentors"
            className="w-full bg-transparent px-3 outline-none"
            placeholder="Search mentors, city, language"
          />
        </form>
        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {publicNavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-app-muted transition hover:bg-slate-100 hover:text-app-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-app-primary hover:bg-blue-50 sm:inline-flex"
          >
            Sign in
          </Link>
          <ButtonLink href="/register" className="px-4 py-2">
            Join
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
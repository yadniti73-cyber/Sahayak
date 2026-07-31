import Link from "next/link";

const footerGroups = [
  { title: "Explore", links: [["Find mentors", "/mentors"], ["Categories", "/categories"], ["How it works", "/how-it-works"]] },
  { title: "Company", links: [["About", "/about"], ["FAQ", "/faq"], ["Contact", "/contact"]] },
  { title: "Account", links: [["Login", "/login"], ["Register", "/register"], ["Dashboard", "/dashboard/home"]] },
];

export function PublicFooter({ children, className = "" }) {
  if (children) {
    return <footer className={className}>{children}</footer>;
  }

  return (
    <footer className={`border-t border-app-border bg-white ${className}`}>
      <div className="app-container grid gap-8 py-10 md:grid-cols-[1.5fr_2fr]">
        <div>
          <Link href="/" className="text-xl font-bold text-app-primary">Sahayak</Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-app-muted">
            A trusted mentorship ecosystem for people who need clarity, confidence, and human guidance.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-app-text">{group.title}</h2>
              <div className="mt-3 grid gap-2">
                {group.links.map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm text-app-muted hover:text-app-primary">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-app-border py-4 text-center text-xs text-app-muted">
        © {new Date().getFullYear()} Sahayak. Built for meaningful guidance.
      </div>
    </footer>
  );
}

import { PublicFooter, PublicHeader } from "../navigation";

export function PublicShell({
  children,
  header = <PublicHeader />,
  footer = <PublicFooter />,
  className = "",
}) {
  return (
    <div
      id="top"
      className={`relative flex min-h-screen flex-col bg-gradient-to-b from-white via-blue-50/40 to-green-50/40 text-app-text ${className}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-app-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      {header}
      <main id="main-content" className="min-h-[70vh] flex-1">
        {children}
      </main>
      {footer}
    </div>
  );
}

import { PublicFooter, PublicHeader } from "../navigation";

export function PublicShell({
  children,
  header = <PublicHeader />,
  footer = <PublicFooter />,
  className = "",
}) {
  return (
    <div className={`min-h-screen bg-app-bg text-app-text ${className}`}>
      {header}
      <main className="min-h-[70vh]">{children}</main>
      {footer}
    </div>
  );
}

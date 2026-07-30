export function DashboardShell({
  children,
  sidebar = null,
  topbar = null,
  className = "",
}) {
  return (
    <div className={className}>
      {sidebar}
      <div>
        {topbar}
        <main>{children}</main>
      </div>
    </div>
  );
}

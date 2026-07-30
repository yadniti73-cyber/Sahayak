export function PublicShell({
  children,
  header = null,
  footer = null,
  className = "",
}) {
  return (
    <div className={className}>
      {header}
      <main>{children}</main>
      {footer}
    </div>
  );
}

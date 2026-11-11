// Brand mark. Renders the final logo from /public/images/logo.png.
export function GLogo({ size = 36, className = "" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/images/logo.png" alt="" height={size} style={{ height: size, width: "auto" }} className={className} aria-hidden="true" />
  );
}

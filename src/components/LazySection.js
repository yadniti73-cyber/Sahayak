"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mount heavy sections: children render only when the placeholder
 * is within `margin` of the viewport. Pair with next/dynamic for code-splitting:
 *
 *   const Testimonials = dynamic(() => import("./Testimonials").then(m => m.Testimonials));
 *   <LazySection minHeight={420}><Testimonials /></LazySection>
 */
export function LazySection({ children, minHeight = 320, margin = "300px", className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className} style={show ? undefined : { minHeight }}>
      {show ? children : <div className="skeleton h-full w-full" style={{ minHeight }} aria-hidden="true" />}
    </div>
  );
}

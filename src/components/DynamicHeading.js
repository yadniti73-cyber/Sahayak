"use client";

import { useEffect, useState } from "react";

/**
 * Heading with a rotating highlighted word, e.g.
 *   <DynamicHeading prefix="Guidance for every" words={["student", "farmer", "founder"]} />
 */
export function DynamicHeading({
  prefix = "Guidance for every",
  words = ["student", "farmer", "entrepreneur", "parent", "artist", "professional"],
  suffix = "",
  interval = 2400,
  className = "",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <h2 className={`font-display text-3xl font-semibold leading-tight text-app-text sm:text-4xl ${className}`}>
      {prefix}{" "}
      <span
        key={words[index]}
        className="word-swap inline-block bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent"
        aria-live="polite"
      >
        {words[index]}
      </span>
      {suffix ? ` ${suffix}` : null}
    </h2>
  );
}

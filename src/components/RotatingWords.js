"use client";

import { useEffect, useState } from "react";

// Cycles through a list of words inside a heading. Screen readers get the first word only.
export function RotatingWords({ words, interval = 2400 }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="inline-block">
      <span className="sr-only">{words[0]}</span>
      <span
        key={words[i]}
        aria-hidden="true"
        className="word-swap inline-block bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent"
      >
        {words[i]}
      </span>
    </span>
  );
}

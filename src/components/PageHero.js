import { SectionHeading } from "./app-primitives";
import { Reveal } from "./Reveal";
import { HeroIconBackdrop } from "./HeroIconBackdrop";

// Shared top-of-page block so every route opens like the home hero.
export function PageHero({ eyebrow, title, highlight, description, children, aside }) {
  return (
    <section className="relative overflow-hidden border-b border-app-border bg-gradient-to-br from-white via-blue-50/60 to-green-50/50 py-12 lg:py-16">
      <HeroIconBackdrop />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl float-slow" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl float-slow" />
      <div className={`app-container relative grid items-center gap-8 ${aside ? "lg:grid-cols-[1fr_0.8fr]" : ""}`}>
        <div>
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} highlight={highlight} description={description} />
          </Reveal>
          {children ? <Reveal delay={150} className="mt-6">{children}</Reveal> : null}
        </div>
        {aside ? <Reveal delay={200}>{aside}</Reveal> : null}
      </div>
    </section>
  );
}

const tones = {
  white: "bg-white",
  blue: "bg-gradient-to-b from-white via-blue-50/50 to-white",
  green: "bg-gradient-to-b from-white via-green-50/60 to-white",
  wash: "bg-gradient-to-br from-blue-50/60 via-white to-green-50/60",
};

// A page section with an optional animated heading.
export function Section({ id, tone = "white", eyebrow, title, highlight, description, align = "left", className = "", children }) {
  return (
    <section id={id} className={`${tones[tone]} py-12 ${className}`}>
      <div className="app-container">
        {title ? (
          <Reveal>
            <SectionHeading as="h2" size="sm" eyebrow={eyebrow} title={title} highlight={highlight} description={description} align={align} />
          </Reveal>
        ) : null}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function IconTile({ Icon, label, detail }) {
  return (
    <div className="app-card group flex h-full items-center gap-3 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <span className="shrink-0 rounded-lg bg-blue-50 p-2.5 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
        <Icon size={20} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-app-text">{label}</p>
        {detail ? <p className="text-xs leading-5 text-app-muted">{detail}</p> : null}
      </div>
    </div>
  );
}

export function NumberDot({ n }) {
  return (
    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-app-primary to-green-600 text-lg font-bold text-white shadow-soft">
      {n}
    </span>
  );
}

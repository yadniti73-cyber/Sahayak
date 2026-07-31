import { testimonials } from "@/lib/frontend-data";
import { Avatar, Rating, SectionHeading } from "./app-primitives";

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-app-border bg-white py-14">
      <div className="app-container">
        <SectionHeading
          eyebrow="Trust"
          title="People leave with more confidence"
          description="Every screen is designed to reduce uncertainty and help one person help another."
          align="center"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="app-card p-5">
              <Rating value="5.0" />
              <p className="mt-4 text-sm leading-6 text-app-muted">{testimonial.quote}</p>
              <footer className="mt-5 flex items-center gap-3">
                <Avatar initials={testimonial.name.split(" ").map((part) => part[0]).join("")} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-app-text">{testimonial.name}</p>
                  <p className="text-xs text-app-muted">{testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

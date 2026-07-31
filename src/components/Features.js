import { LockKeyhole, MapPinned, MessageCircle, ShieldCheck } from "lucide-react";
import { categories } from "@/lib/frontend-data";
import { CategoryCard } from "./domain-cards";
import { SectionHeading } from "./app-primitives";

const features = [
  {
    title: "Verified mentors",
    description: "Profiles highlight identity, experience, languages, ratings, and availability.",
    icon: ShieldCheck,
  },
  {
    title: "Secure booking",
    description: "Every request follows a clear status flow with reminders and ownership checks.",
    icon: LockKeyhole,
  },
  {
    title: "Nationwide access",
    description: "Find guidance by city, language, category, session mode, and budget.",
    icon: MapPinned,
  },
  {
    title: "Human conversations",
    description: "The product is shaped around clarity, confidence, and supportive next steps.",
    icon: MessageCircle,
  },
];

export function Features() {
  return (
    <section id="features" className="py-14">
      <div className="app-container">
        <SectionHeading
          eyebrow="Why Sahayak"
          title="A calm way to find the right person"
          description="Search engines provide answers. Sahayak helps people reach someone experienced enough to guide the next step."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {features.map(({ icon: Icon, ...feature }) => (
            <div key={feature.title} className="app-card p-5">
              <Icon size={22} className="text-app-primary" aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-app-text">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-app-muted">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

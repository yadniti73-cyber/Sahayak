import { Mail, MapPin, Phone } from "lucide-react";
import { PublicShell, Panel, SectionHeading, Reveal } from "@/components";
import { ContactForm } from "@/components/ContactForm";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";

// Placeholder details: replace with your real email, phone and city.
const details = [
  { Icon: Mail, label: "Email", value: "support@GuideShala.in", href: "mailto:support@GuideShala.in" },
  { Icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { Icon: MapPin, label: "Based in", value: "India" },
];

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-app-border bg-gradient-to-br from-white via-blue-50/60 to-green-50/50 py-12 lg:py-16">
        <HeroIconBackdrop />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl float-slow" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-green-200/40 blur-3xl float-slow" />

        <div className="app-container relative grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="Reach the GuideShala"
              highlight="team"
              description="For partnerships, verification support, or platform questions, send a note and the team will respond with next steps."
            />
          </Reveal>
          <Reveal delay={150}>
            <Panel className="shadow-soft">
              <ContactForm />
            </Panel>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-green-50/50 py-12">
        <div className="app-container grid gap-4 md:grid-cols-3">
          {details.map(({ Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 110}>
              <Panel className="group h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-green-700">{label}</p>
                {href ? (
                  <a href={href} className="mt-1 block font-semibold text-app-text hover:text-app-primary">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold text-app-text">{value}</p>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
import Link from "next/link";
import { HeartHandshake, LifeBuoy, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PublicShell, Panel } from "@/components";
import { ContactForm } from "@/components/ContactForm";
import { PageHero, Section } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

// Placeholder details: replace with your real email, phone and city.
const details = [
  { Icon: Mail, label: "Email", value: "support@GuideShala.in", href: "mailto:support@GuideShala.in" },
  { Icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { Icon: MapPin, label: "Based in", value: "India" },
];

const reasons = [
  [HeartHandshake, "Partnerships", "NGOs, FPOs, colleges, community centres and companies that want to bring guidance to their people."],
  [ShieldCheck, "Mentor verification", "Questions about documents, the Verified badge or the status of your guide profile."],
  [LifeBuoy, "Support", "Trouble with an account, a booking or a session. Include the guide's name if there is one."],
];

const links = [
  ["/faq", "Read the FAQ", "Quick answers on booking, trust and accounts."],
  ["/how-it-works", "See how it works", "The full path from search to session."],
  ["/register", "Join as a guide", "Create a profile and start the verification."],
];

export default function ContactPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title="Reach the GuideShala"
        highlight="team"
        description="For partnerships, verification support, or platform questions, send a note and the team will respond with next steps."
        aside={
          <Panel className="shadow-soft">
            <ContactForm />
          </Panel>
        }
      />

      <Section tone="blue" eyebrow="Write to us about" title="What we can" highlight="help with">
        <div className="grid gap-4 md:grid-cols-3">
          {reasons.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 110}>
              <Panel className="group h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-app-muted">{text}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Direct" title="Other ways to" highlight="reach us">
        <div className="grid gap-4 md:grid-cols-3">
          {details.map(({ Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 110}>
              <Panel className="group h-full transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-blue-50 p-3 text-app-primary transition group-hover:bg-green-50 group-hover:text-green-600">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-green-700">{label}</p>
                {href ? (
                  <a href={href} className="mt-1 block font-semibold text-app-text hover:text-app-primary">{value}</a>
                ) : (
                  <p className="mt-1 font-semibold text-app-text">{value}</p>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="green" eyebrow="Before you write" title="You may find your answer" highlight="faster here">
        <div className="grid gap-4 md:grid-cols-3">
          {links.map(([href, title, text], i) => (
            <Reveal key={href} delay={i * 110}>
              <Link href={href} className="app-card group block h-full p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <h3 className="font-semibold text-app-text transition group-hover:text-green-700">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-app-muted">{text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}

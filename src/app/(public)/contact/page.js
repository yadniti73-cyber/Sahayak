import { Mail, MapPin, Phone } from "lucide-react";
import { PublicShell, ButtonLink, Panel, SectionHeading } from "@/components";

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <SectionHeading
            eyebrow="Contact"
            title="Reach the Sahayak team"
            description="For partnerships, verification support, or platform questions, send a note and the team will respond with next steps."
          />
          <Panel>
            <form className="grid gap-4">
              <input className="app-input" placeholder="Full name" />
              <input className="app-input" placeholder="Email" type="email" />
              <select className="app-input">
                <option>Partnership</option>
                <option>Mentor verification</option>
                <option>Support</option>
              </select>
              <textarea className="app-input min-h-32" placeholder="How can we help?" />
              <ButtonLink href="/contact">Send message</ButtonLink>
            </form>
          </Panel>
        </div>
      </section>
      <section className="py-10">
        <div className="app-container grid gap-4 md:grid-cols-3">
          {[
            [Mail, "support@sahayak.in"],
            [Phone, "+91 98765 43210"],
            [MapPin, "India"],
          ].map(([Icon, label]) => (
            <Panel key={label}>
              <Icon size={22} className="text-app-primary" />
              <p className="mt-3 font-semibold">{label}</p>
            </Panel>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}

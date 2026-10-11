import Link from "next/link";
import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { categories } from "@/lib/frontend-data";
import { Reveal } from "../Reveal";

// Contact details come from environment variables so nothing is invented.
// Set any of these in .env (all optional). Empty ones are simply not shown:
//   NEXT_PUBLIC_CONTACT_EMAIL, NEXT_PUBLIC_CONTACT_PHONE, NEXT_PUBLIC_CONTACT_LOCATION,
//   NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code, e.g. 919876543210),
//   NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_X_URL, NEXT_PUBLIC_LINKEDIN_URL
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
const location = process.env.NEXT_PUBLIC_CONTACT_LOCATION;
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const socials = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, icon: "instagram" },
  { label: "X", href: process.env.NEXT_PUBLIC_X_URL, icon: "x" },
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL, icon: "linkedin" },
  { label: "WhatsApp", href: whatsapp ? `https://wa.me/${whatsapp}` : "", icon: "whatsapp" },
].filter((s) => s.href);

const footerGroups = [
  { title: "Explore", links: [["Find mentors", "/mentors"], ["Categories", "/categories"], ["How it works", "/how-it-works"]] },
  { title: "Company", links: [["About", "/about"], ["FAQ", "/faq"], ["Contact", "/contact"]] },
  { title: "Account", links: [["Login", "/login"], ["Register", "/register"], ["Dashboard", "/dashboard/home"]] },
];

function SocialIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true };
  if (name === "instagram")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "x")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    );
  if (name === "linkedin")
    return (
      <svg {...common} fill="currentColor">
        <rect x="3" y="9" width="4" height="12" />
        <circle cx="5" cy="5" r="2" />
        <path d="M10 9h4v2c1-1.5 2.5-2.3 4.3-2.3C21 8.7 22 10.5 22 13.5V21h-4v-6.5c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V21h-4z" />
      </svg>
    );
  return <MessageCircle size={18} aria-hidden="true" />;
}

function ContactRow({ icon: Icon, href, children }) {
  const inner = (
    <>
      <Icon size={18} className="mt-0.5 shrink-0 text-green-200" aria-hidden="true" />
      <span>{children}</span>
    </>
  );
  const cls = "flex gap-3 text-sm text-green-50/85 transition hover:text-white";
  return href ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <p className={cls}>{inner}</p>
  );
}

export function PublicFooter({ children, className = "" }) {
  if (children) {
    return <footer className={className}>{children}</footer>;
  }

  const popular = (categories || []).slice(0, 6).map((c) => [c.name, `/category/${c.slug}`]);
  const groups = [footerGroups[0], ...(popular.length ? [{ title: "Popular categories", links: popular }] : []), footerGroups[1], footerGroups[2]];

  return (
    <footer className={`relative isolate mt-16 overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white ${className}`}>
      {/* decorative layers */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "26px 26px" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-400/25 blur-3xl animate-float-slow" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-0 -z-10 h-96 w-96 rounded-full bg-green-300/20 blur-3xl animate-float-slow [animation-delay:2s]" aria-hidden="true" />
      <div className="h-1 bg-gradient-to-r from-blue-400 via-white/70 to-green-300" aria-hidden="true" />

      <div className="app-container grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        {/* Brand + contact */}
        <Reveal>
          <Link href="/" className="inline-flex items-center gap-2 font-display text-3xl font-semibold">
            GuideShala
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-green-50/85">
            A trusted mentorship ecosystem for people who need clarity, confidence and human guidance.
          </p>

          <div className="mt-5 grid gap-3">
            {location ? <ContactRow icon={MapPin}>{location}</ContactRow> : null}
            {phone ? <ContactRow icon={Phone} href={`tel:${phone}`}>{phone}</ContactRow> : null}
            {email ? <ContactRow icon={Mail} href={`mailto:${email}`}>{email}</ContactRow> : null}
            <ContactRow icon={MessageCircle} href="/contact">Write to us</ContactRow>
          </div>

          {socials.length ? (
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/90 transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-green-800"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          ) : null}

          <Link
            href="/register"
            className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-800 shadow-soft transition hover:-translate-y-0.5 hover:bg-green-50"
          >
            Join as a guide
          </Link>
        </Reveal>

        {/* Link columns */}
        {groups.map((group, i) => (
          <Reveal key={group.title} delay={(i + 1) * 90}>
            <h2 className="font-display text-lg font-semibold">{group.title}</h2>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-300 to-green-300" aria-hidden="true" />
            <div className="mt-4 grid gap-2.5">
              {group.links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm text-green-50/85 transition duration-200 hover:translate-x-1 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="border-t border-white/15">
        <div className="app-container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-green-50/80">
          <p>
            © {new Date().getFullYear()} GuideShala. Built for meaningful guidance, by IITians from IIT Indore.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/faq" className="transition hover:text-white">FAQ</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
            <a
              href="#top"
              className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1.5 font-semibold text-white transition hover:bg-white hover:text-green-800"
            >
              Back to top <ArrowUp size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

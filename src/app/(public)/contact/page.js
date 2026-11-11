import Link from "next/link";
import {
  ArrowRight,
  Facebook,
  HeartHandshake,
  Instagram,
  LifeBuoy,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Twitter,
  Youtube,
  Zap,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";
import { PublicShell } from "@/components";
import { ContactForm } from "@/components/ContactForm";
import { HeroIconBackdrop } from "@/components/HeroIconBackdrop";
import { Section } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/gs-ui";

// Set these in .env.local. A row or icon is hidden until its value is set.
//   NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210   (country code + number, digits only)
//   NEXT_PUBLIC_LINKEDIN_URL, NEXT_PUBLIC_YOUTUBE_URL, NEXT_PUBLIC_X_URL,
//   NEXT_PUBLIC_FACEBOOK_URL, NEXT_PUBLIC_INSTAGRAM_URL
const WHATSAPP = String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

const socials = [
  [Linkedin, "LinkedIn", process.env.NEXT_PUBLIC_LINKEDIN_URL, "bg-[#0a66c2] text-white"],
  [Youtube, "YouTube", process.env.NEXT_PUBLIC_YOUTUBE_URL, "bg-[#ff0000] text-white"],
  [Twitter, "X", process.env.NEXT_PUBLIC_X_URL, "bg-black text-white"],
  [Facebook, "Facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL, "bg-[#1877f2] text-white"],
  [Instagram, "Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL, "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white"],
].filter(([, , url]) => url);

const before = [
  [BookOpen, "📖", "Read the FAQ", "Quick answers on booking, trust, payments, and accounts.", "/faq", "Search FAQs"],
  [Settings, "⚙️", "See how it works", "The full path from search to session. Learn how GuideShala works.", "/how-it-works", "View Guide"],
  [Sparkles, "✨", "Join as a guide", "Create a profile, start the verification process, and begin guiding.", "/register?role=mentor", "Start Onboarding"],
];

const help = [
  [
    HeartHandshake,
    "🤝",
    "Partnerships",
    "NGOs, FPOs, colleges, and companies that want to bring guidance to their people.",
    `/contact?topic=Partnership&message=${encodeURIComponent("I would like to discuss a partnership.")}#contact-form`,
    "Apply for Partnership",
  ],
  [
    ShieldCheck,
    "🛡️",
    "Mentor verification",
    "Questions about documents, the Verified badge, or the status of your guide profile.",
    "/contact?topic=Mentor%20verification#contact-form",
    "Check Verification Status",
  ],
  [
    LifeBuoy,
    "",
    "Support",
    "Trouble with an account, a booking, or a session. Include the guide's name if there is one.",
    "/contact?topic=Support#contact-form",
    "Get Help & Raise Ticket",
  ],
];

function InfoCard({ Icon, emoji, title, text, href, cta }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-xl font-bold text-[#0b1736]">
        {emoji ? <span aria-hidden="true">{emoji} </span> : null}
        {title}
      </h3>
      <p className="mt-2 flex-1 text-[15px] leading-6 text-slate-700">{text}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-base font-semibold text-blue-700 group-hover:underline">
        {cta} <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}

function ContactRow({ Icon, title, detail, href, tone }) {
  const body = (
    <div className={`flex items-center gap-4 rounded-xl border p-4 transition hover:shadow-soft ${tone}`}>
      <Icon size={26} className="shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-lg font-bold text-[#0b1736]">{title}</p>
        <p className="break-words text-[15px] text-slate-800">{detail}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    body
  );
}

const one = (v) => (typeof v === "string" ? v : "");

export default async function ContactPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const initialTopic = one(sp.topic).slice(0, 60);
  const initialMessage = one(sp.message).slice(0, 1000);

  return (
    <PublicShell>
      <section className="relative overflow-hidden py-14 lg:py-20">
        <HeroIconBackdrop />
        <div className="app-container relative grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <Eyebrow>Contact us</Eyebrow>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0b1736] sm:text-5xl lg:text-6xl">
              Reach the GuideShala <span className="text-teal-800">team</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              For partnerships, verification support, or platform questions, send us a note. We are here to help.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-[15px] font-medium text-emerald-900">
              <Zap size={16} aria-hidden="true" /> We usually respond within 12-24 hours
            </p>

            <div className="mt-6">
              <Link
                href={`/contact?topic=Partnership&message=${encodeURIComponent("I would like to discuss a partnership.")}#contact-form`}
                className="group inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-emerald-700 px-7 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-soft"
              >
                <HeartHandshake size={20} aria-hidden="true" />
                Partnership
                <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 grid max-w-2xl gap-3">
              <ContactRow
                Icon={Mail}
                title="Email"
                detail="support@guideshala.com (For all general inquiries)"
                href="mailto:support@guideshala.com"
                tone="border-blue-200 bg-blue-50/70 text-blue-800"
              />
              {WHATSAPP ? (
                <ContactRow
                  Icon={MessageCircle}
                  title="Support Chat"
                  detail="Message on WhatsApp (Fast response for active bookings)"
                  href={`https://wa.me/${WHATSAPP}`}
                  tone="border-emerald-300 bg-emerald-50 text-emerald-800"
                />
              ) : null}
              <ContactRow
                Icon={MapPin}
                title="Campus & Registered Office"
                detail="Built at IIT Indore Campus, Indore, Madhya Pradesh"
                tone="border-slate-200 bg-white text-slate-700"
              />
            </div>

            {socials.length ? (
              <div className="mt-6">
                <p className="text-lg text-slate-700">Follow &amp; connect with us:</p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {socials.map(([Icon, label, url, tone]) => (
                    <li key={label}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`flex h-11 w-11 items-center justify-center rounded-lg transition hover:-translate-y-0.5 hover:shadow-soft ${tone}`}
                      >
                        <Icon size={22} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={150}>
            <div
              id="contact-form"
              className="scroll-mt-28 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:p-8"
            >
              <h2 className="text-2xl font-extrabold text-[#0b1736]">Send us a message</h2>
              <div className="mt-5">
                <ContactForm initialTopic={initialTopic} initialMessage={initialMessage} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="blue" eyebrow="Before you write" title="You may find your answer" highlight="faster here">
        <div className="grid gap-5 md:grid-cols-3">
          {before.map(([Icon, emoji, title, text, href, cta], i) => (
            <Reveal key={title} delay={i * 110}>
              <InfoCard Icon={Icon} emoji={emoji} title={title} text={text} href={href} cta={cta} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="green" eyebrow="Still need help? Write to us about" title="What we can" highlight="help with">
        <div className="grid gap-5 md:grid-cols-3">
          {help.map(([Icon, emoji, title, text, href, cta], i) => (
            <Reveal key={title} delay={i * 110}>
              <InfoCard Icon={Icon} emoji={emoji} title={title} text={text} href={href} cta={cta} />
            </Reveal>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}

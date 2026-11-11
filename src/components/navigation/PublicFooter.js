import Link from "next/link";
import { ArrowUp, CreditCard, Instagram, Linkedin, Lock, Mail, MessageCircle, ShieldCheck, Youtube } from "lucide-react";

// Optional env overrides (see README §8). Fallbacks match the design.
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@guideshala.com";
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const socials = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#", Icon: Linkedin },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#", Icon: Instagram },
  { label: "X", href: process.env.NEXT_PUBLIC_X_URL || "#", Icon: null },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#", Icon: Youtube },
];

const columns = [
  { title: "Explore", links: [["Find mentors", "/mentors"], ["All Categories", "/categories"], ["How it works", "/how-it-works"], ["Safety & Escrow", "/faq#trust"], ["Success Stories", "/about"]] },
  { title: "Popular Categories", links: [["Career & Jobs", "/category/career"], ["Education & Study", "/category/education"], ["Agriculture", "/category/agriculture"], ["Business & Legal", "/category/business"], ["Healthcare & Wellness", "/category/health"], ["Technology", "/category/technology"]] },
  { title: "Company", links: [["About us", "/about"], ["Press & Media", "/about"], ["Careers", "/contact"], ["Contact us", "/contact"], ["FAQ", "/faq"]] },
];

const legal = [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Refund & Cancellation Policy", "/refund-policy"], ["Sitemap", "/sitemap.xml"]];

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M17.9 3H21l-6.8 7.8L22 21h-6.1l-4.8-6.3L5.5 21H2.4l7.3-8.3L2 3h6.2l4.3 5.7L17.9 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l11.3 14.5Z" />
    </svg>
  );
}

const chip = "flex h-[52px] items-center justify-center rounded-md bg-white px-4";

export function PublicFooter({ children, className = "" }) {
  if (children) {
    return <footer className={className}>{children}</footer>;
  }

  return (
    <footer className={`mt-16 bg-[#0a3b1e] text-white ${className}`}>
      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.35fr_0.8fr_1fr_0.9fr_1.1fr] lg:px-12">
        {/* Brand + contact */}
        <div>
          <Link href="/" className="inline-flex flex-col gap-3" aria-label="GuideShala home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-white.png" alt="" width={72} height={66} className="h-16 w-auto" />
            <span className="font-display text-4xl font-bold leading-none">GuideShala</span>
          </Link>
          <p className="mt-6 max-w-sm text-xl leading-9 text-white/90">
            A trusted mentorship ecosystem for people who need clarity, confidence, and human guidance.
          </p>
          <div className="mt-6 grid gap-4 text-xl text-white/95">
            <a href={`mailto:${email}`} className="flex items-center gap-3 transition hover:text-white">
              <Mail size={24} className="text-white/70" aria-hidden="true" />
              {email}
            </a>
            <a
              href={whatsapp ? `https://wa.me/${whatsapp}` : "/contact"}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <MessageCircle size={24} className="text-white/70" aria-hidden="true" />
              WhatsApp Support
            </a>
          </div>
          <Link
            href="/register?role=mentor"
            className="mt-7 inline-flex min-h-[56px] items-center rounded-lg bg-white px-8 text-2xl font-bold text-[#0b1736] transition hover:-translate-y-0.5 hover:bg-green-50"
          >
            Join as a Guide
          </Link>
          <div className="mt-8 flex gap-4">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href === "#" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-[#0b1736] transition hover:-translate-y-1"
              >
                {Icon ? <Icon size={24} aria-hidden="true" /> : <XIcon />}
              </a>
            ))}
          </div>
        </div>

        {columns.map(({ title, links }) => (
          <div key={title}>
            <h2 className="text-3xl font-bold">{title}</h2>
            <ul className="mt-6 grid gap-5">
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-xl text-white/90 transition hover:text-white hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Trust & Safety */}
        <div>
          <h2 className="text-3xl font-bold">Trust &amp; Safety</h2>
          <ul className="mt-6 grid gap-6 text-xl leading-8 text-white/95">
            <li className="flex items-center gap-3"><ShieldCheck size={36} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />100% KYC Verified Experts</li>
            <li className="flex items-center gap-3"><Lock size={36} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />SSL Encrypted Secure Booking</li>
            <li className="flex items-center gap-3"><CreditCard size={36} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden="true" />पेमेंट पार्टनर्स</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3" aria-label="Payment partners">
            <span className={chip}><span className="text-lg font-bold italic text-[#0b4fa8]">Razorpay</span></span>
            <span className={chip}><span className="text-xl font-black italic tracking-tight text-slate-600">UP<span className="text-[#f26522]">I</span><span className="text-[#1a9a4a]">▸</span></span></span>
            <span className={chip} aria-label="Mastercard">
              <svg viewBox="0 0 40 26" width="40" height="26" aria-hidden="true">
                <circle cx="14" cy="13" r="11" fill="#eb001b" />
                <circle cx="26" cy="13" r="11" fill="#f79e1b" fillOpacity="0.95" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-7 text-lg text-white/85 sm:px-6 lg:px-12">
          <p className="max-w-md">© {new Date().getFullYear()} GuideShala. Built for meaningful guidance, by IITians from IIT Indore.</p>
          <ul className="flex flex-wrap items-center gap-y-2">
            {legal.map(([label, href], i) => (
              <li key={label} className={`px-4 ${i < legal.length - 1 ? "border-r border-white/40" : ""}`}>
                <Link href={href} className="transition hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white hover:text-[#0a3b1e]"
          >
            Back to top <ArrowUp size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

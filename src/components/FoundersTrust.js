"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap, ShieldCheck, Clock, Heart, Search, UserCheck, CalendarCheck, Target, Eye } from "lucide-react";

// Founder details come from the Sahayak deck.
// To show real photos: put the images in public/images/team/ and set `photo` below.
const founders = [
  {
    name: "Nitish Kumar",
    initials: "NK",
    title: "CEO",
    credential: "Ph.D., IIT Indore",
    photo: "/images/team/nitish-kumar.jpg",
  },
  {
    name: "Anand Vivek",
    initials: "AV",
    title: "CTO",
    credential: "B.Tech, IIT Indore",
    photo: "/images/team/anand-vivek.png",
  },
];

const mission =
  "To build a bridge between need and knowledge: a seamless platform that connects a diverse range of experts with individuals and organizations seeking strategic guidance, and fosters a collaborative environment for growth and problem-solving.";

const vision =
  "A future where expertise is democratized and accessible to all. Our goal is to empower every individual to unlock their full potential by providing the right guidance and support at the right time.";

const promises = [
  { icon: UserCheck, title: "Every guide is checked", text: "We verify identity and experience before a guide is listed. No anonymous profiles." },
  { icon: Heart, title: "Your first session is risk-free", text: "If your first call isn't useful, tell us and we'll make it right or rematch you." },
  { icon: Clock, title: "We reply within 24 hours", text: "A real person from the founding team answers every message while we are small." },
  { icon: ShieldCheck, title: "Your details stay private", text: "We never sell your data. You decide what a guide can see." },
];

const steps = [
  { icon: Search, title: "Tell us your situation", text: "Career, farming, studies, health, a business idea. Say it in your own words." },
  { icon: UserCheck, title: "Meet a matched guide", text: "We suggest guides who have actually walked a similar path." },
  { icon: CalendarCheck, title: "Book and talk", text: "Pick a time, talk by video or in person, leave with a clear next step." },
];

function FounderPhoto({ founder }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-green-100 ring-2 ring-white shadow-soft">
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-app-primary">
        {founder.initials}
      </span>
      {founder.photo && !failed ? (
        <Image
          src={founder.photo}
          alt={`${founder.name}, ${founder.title}`}
          fill
          sizes="96px"
          loading="lazy"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

export function FoundersTrust() {
  return (
    <section id="trust" className="bg-gradient-to-br from-white via-green-50/60 to-blue-50/60 py-16">
      <div className="app-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-app-primary">Why trust us</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-app-text sm:text-5xl">
            Built by IITians, run with{" "}
            <span className="bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent">
              accountability
            </span>
          </h2>
          <p className="mt-4 text-base leading-7 text-app-muted sm:text-lg">
          We are not claiming big numbers yet. We are promising care, honesty and a real person behind every conversation.
          </p>
        </div>

        {/* Founders */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {founders.map((f) => (
            <div key={f.name}>
              <div className="app-card flex h-full flex-col items-center border-t-2 border-t-green-500/60 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                <FounderPhoto founder={f} />
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-green-700">{f.title}</p>
                <p className="mt-1 font-display text-xl font-semibold text-app-text">{f.name}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-app-primary">
                  <GraduationCap size={15} aria-hidden="true" /> {f.credential}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission and vision */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
          <div>
            <div className="app-card h-full bg-white p-6">
              <span className="inline-flex items-center gap-2 text-3xl font-semibold text-app-primary">
                <Target size={40} aria-hidden="true" className="text-4xl" /> Our mission
              </span>
              <p className="mt-3 text-md leading-7 text-app-muted">{mission}</p>
            </div>
          </div>
          <div>
            <div className="app-card h-full bg-white p-6">
              <span className="inline-flex items-center gap-2 text-3xl font-semibold text-green-700">
                <Eye size={40} aria-hidden="true" className="text-4xl" /> Our vision
              </span>
              <p className="mt-3 text-md leading-7 text-app-muted">{vision}</p>
            </div>
          </div>
        </div>

        {/* Promises */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <div className="app-card h-full bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex rounded-lg bg-gradient-to-br from-blue-50 to-green-50 p-3 text-app-primary">
                  <Icon size={30} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-2  leading-6 text-md">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-14 rounded-2xl border border-app-border bg-white/80 p-6 backdrop-blur sm:p-8">
          <h3 className="text-center font-display text-2xl font-semibold text-4xl">How it works</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-app-primary to-green-600 text-white">
                  <Icon size={30} aria-hidden="true" />
                </span>
                <p className="mt-3 font-semibold text-2xl">{i + 1}. {title}</p>
                <p className="mt-1 text-md leading-6 text-app-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

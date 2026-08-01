import { notFound } from "next/navigation";
import { CalendarDays, Languages, MapPin, ShieldCheck } from "lucide-react";
import { PublicShell, Avatar, Badge, ButtonLink, Panel, Rating, SectionHeading } from "@/components";
import { getMentorBySlug, getMentors } from "@/features/catalog/server/service";

export async function generateStaticParams() {
  const mentors = await getMentors({ limit: 50 });
  return mentors.map((mentor) => ({ slug: mentor.slug }));
}

export default async function MentorProfilePage({ params }) {
  const { slug } = params;
  const mentor = await getMentorBySlug(slug);

  if (!mentor) {
    notFound();
  }

  return (
    <PublicShell>
      <section className="bg-white py-12">
        <div className="app-container grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex gap-5">
            <Avatar initials={mentor.name ? mentor.name.split(" ").map((word) => word[0]).join("") : ""} size="lg" />
            <div>
              <div className="flex flex-wrap gap-2">
                {mentor.verified ? <Badge tone="green">Verified</Badge> : null}
                <Badge>{mentor.category}</Badge>
              </div>
              <SectionHeading title={mentor.name} description={mentor.headline} />
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-app-muted">
                <span className="inline-flex items-center gap-2"><MapPin size={16} /> {mentor.city}</span>
                <span className="inline-flex items-center gap-2"><Languages size={16} /> {mentor.languages?.join(", ")}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {mentor.availability}</span>
                <Rating value={mentor.rating} reviews={mentor.reviewsCount || 0} />
              </div>
            </div>
          </div>
          <Panel>
            <h2 className="text-lg font-bold">Request guidance</h2>
            <p className="mt-2 text-sm text-app-muted">Choose a session mode, date, and time. Booking confirmation happens after mentor review.</p>
            <div className="mt-5 grid gap-3">
              <button className="app-input text-left">{mentor.mode || "Video"} session - {mentor.price}</button>
              <button className="app-input text-left">{mentor.availability} - 6:00 PM</button>
              <textarea className="app-input min-h-24" placeholder="Add a short note for the mentor" />
              <ButtonLink href="/login">Request guidance</ButtonLink>
            </div>
          </Panel>
        </div>
      </section>
      <section className="py-10">
        <div className="app-container grid gap-6 lg:grid-cols-[1fr_360px]">
          <Panel>
            <h2 className="text-xl font-bold">About</h2>
            <p className="mt-3 leading-7 text-app-muted">{mentor.bio}</p>
            <h3 className="mt-6 font-semibold">Specializations</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {mentor.specializations?.map((item) => (
                <Badge key={item} tone="gray">{item}</Badge>
              ))}
            </div>
          </Panel>
          <Panel>
            <h2 className="text-xl font-bold">Trust signals</h2>
            <div className="mt-4 grid gap-3 text-sm text-app-muted">
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-600" /> Identity verified</span>
              <span>{mentor.experience} experience</span>
              <span>{mentor.reviewsCount || 0} public reviews</span>
              <span>Usually responds within 4 hours</span>
            </div>
          </Panel>
        </div>
      </section>
    </PublicShell>
  );
}

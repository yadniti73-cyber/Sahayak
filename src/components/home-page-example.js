// Example home page composition (e.g. app/page.js).
// Hero loads immediately; everything below the fold is code-split and
// mounted only when the visitor scrolls near it. The FeedbackForm replaces
// the old "Ready to begin" call-to-action block.
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { LazySection } from "@/components/LazySection";

const Features = dynamic(() => import("@/components/Features").then((m) => m.Features));
// const Testimonials = dynamic(() => import("@/components/Testimonials").then((m) => m.Testimonials));
const FoundersSection = dynamic(() => import("@/components/FoundersTrust").then((m) => m.FoundersTrust));
const FeedbackForm = dynamic(() => import("@/components/FeedbackForm").then((m) => m.FeedbackForm));

export default function HomePage() {
  return (
    <>
      <Hero />
      <LazySection minHeight={520}>
        <Features />
      </LazySection>
      <LazySection minHeight={420}>
        <FoundersSection />
      </LazySection>
      <LazySection minHeight={640}>
        <FeedbackForm />
      </LazySection>
    </>
  );
}

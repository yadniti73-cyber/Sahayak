// Home page composition (mirror this in app/page.js).
// Hero loads immediately; everything below the fold is code-split and
// mounted only when the visitor scrolls near it.
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { LazySection } from "@/components/LazySection";

const Features = dynamic(() => import("@/components/Features").then((m) => m.Features));
const FoundersSection = dynamic(() => import("@/components/FoundersTrust").then((m) => m.FoundersTrust));
const HomeFaq = dynamic(() => import("@/components/HomeFaq").then((m) => m.HomeFaq));
// FeedbackForm still exists: import it here if you want to keep it above the footer.

export default function HomePage() {
  return (
    <>
      <Hero />
      <LazySection minHeight={620}>
        <Features />
      </LazySection>
      <LazySection minHeight={760}>
        <FoundersSection />
      </LazySection>
      <LazySection minHeight={640}>
        <HomeFaq />
      </LazySection>
    </>
  );
}

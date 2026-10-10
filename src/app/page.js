import dynamic from "next/dynamic";
import { PublicShell } from "@/components";
import { Hero } from "@/components/Hero";

const Features = dynamic(() => import("@/components/Features").then((m) => m.Features), {
  loading: () => <div className="h-96" />,
});
const FoundersTrust = dynamic(() => import("@/components/FoundersTrust").then((m) => m.FoundersTrust  ), {
  loading: () => <div className="h-72" />,
});
const FeedbackForm = dynamic(() => import("@/components/FeedbackForm").then((m) => m.FeedbackForm), {
  loading: () => <div className="h-96" />,
});

export default function HomePage() {
  return (
    <PublicShell>
      <Hero />
      <Features />
        <FoundersTrust />
        <FeedbackForm />
      </PublicShell>
    );
  }

import {
  BookOpen, Brain, Briefcase, Code2, Cog, Cross, Dumbbell, Flower2, Gavel, GraduationCap,
  HeartPulse, Landmark, Lightbulb, LineChart, Scale, Sprout, Stethoscope, Timer, Trophy, Users,
} from "lucide-react";

// Faint category icons behind the hero: the PDF set (health, legal, skill, counselling,
// sports, time) plus every category icon used on the site. Positions are % of the hero.
const items = [
  { Icon: Cross,         top: 6,  left: 4,  size: 56, tone: "blue",  dur: 9 },
  { Icon: Gavel,         top: 30, left: 2,  size: 52, tone: "green", dur: 11, d: 1 },
  { Icon: Lightbulb,     top: 62, left: 5,  size: 50, tone: "blue",  dur: 10, d: 2 },
  { Icon: Cog,           top: 80, left: 14, size: 44, tone: "green", dur: 12, d: 0.5 },
  { Icon: Brain,         top: 4,  left: 30, size: 54, tone: "green", dur: 10, d: 1.5 },
  { Icon: Scale,         top: 88, left: 38, size: 52, tone: "blue",  dur: 11, d: 2.5 },
  { Icon: Stethoscope,   top: 8,  left: 52, size: 48, tone: "blue",  dur: 9,  d: 0.8 },
  { Icon: Timer,         top: 86, left: 58, size: 46, tone: "green", dur: 12, d: 1.2 },
  { Icon: Trophy,        top: 5,  left: 72, size: 48, tone: "green", dur: 10, d: 2 },
  { Icon: Dumbbell,      top: 22, left: 93, size: 50, tone: "blue",  dur: 11, d: 0.3 },
  { Icon: Landmark,      top: 52, left: 95, size: 52, tone: "green", dur: 9,  d: 1.8 },
  { Icon: Briefcase,     top: 78, left: 88, size: 48, tone: "blue",  dur: 12, d: 2.2 },
  { Icon: GraduationCap, top: 44, left: 22, size: 46, tone: "blue",  dur: 10, d: 0.6, hideSm: true },
  { Icon: HeartPulse,    top: 70, left: 28, size: 44, tone: "green", dur: 11, d: 1.4, hideSm: true },
  { Icon: Sprout,        top: 40, left: 47, size: 44, tone: "green", dur: 9,  d: 2.6, hideSm: true },
  { Icon: LineChart,     top: 18, left: 82, size: 46, tone: "blue",  dur: 12, d: 0.9, hideSm: true },
  { Icon: Users,         top: 68, left: 72, size: 46, tone: "green", dur: 10, d: 1.6, hideSm: true },
  { Icon: Code2,         top: 90, left: 76, size: 42, tone: "blue",  dur: 11, d: 0.4, hideSm: true },
  { Icon: BookOpen,      top: 36, left: 62, size: 44, tone: "blue",  dur: 12, d: 2.1, hideSm: true },
  { Icon: Flower2,       top: 56, left: 10, size: 44, tone: "green", dur: 9,  d: 1.1, hideSm: true },
];

const tones = { blue: "text-app-primary", green: "text-green-600" };

export function HeroIconBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map(({ Icon, top, left, size, tone, dur, d = 0, hideSm }, i) => (
        <span
          key={i}
          className={`float-slow absolute opacity-[0.10] ${tones[tone]} ${hideSm ? "hidden sm:block" : ""}`}
          style={{ top: `${top}%`, left: `${left}%`, animationDuration: `${dur}s`, animationDelay: `${d}s` }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

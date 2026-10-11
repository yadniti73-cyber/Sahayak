"use client";

import { useState } from "react";
import { BadgeCheck, CalendarCheck, Heart, LockKeyhole, MapPinned, MessageCircle, ShieldCheck } from "lucide-react";

// Icon tiles instead of photos: no image files needed, so nothing can 404.
const branches = [
  { label: "Verified mentors", Icon: ShieldCheck, tone: "blue" },
  { label: "Secure booking", Icon: LockKeyhole, tone: "green" },
  { label: "Nationwide access", Icon: MapPinned, tone: "blue" },
  { label: "Human conversations", Icon: MessageCircle, tone: "green" },
  { label: "Verified experts", Icon: BadgeCheck, tone: "blue" },
  { label: "Simple booking", Icon: CalendarCheck, tone: "green" },
  { label: "Human guidance", Icon: Heart, tone: "blue" },
];

const tones = {
  blue: "from-blue-500 to-blue-700",
  green: "from-green-500 to-green-700",
};

const RADIUS = 39; // % of container, center -> node distance
const TILT = 22; // max tilt in degrees
const PUSH = -36; // px pushed into the screen (-z)

const nodes = branches.map((branch, i) => {
  const angle = (i / branches.length) * Math.PI * 2 - Math.PI / 2;
  return {
    ...branch,
    x: 50 + RADIUS * Math.cos(angle),
    y: 50 + RADIUS * Math.sin(angle),
  };
});

const REST = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)";

function TiltCard({ label, Icon, tone }) {
  const [transform, setTransform] = useState(REST);
  const [hovering, setHovering] = useState(false);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // The side under the cursor sinks away from the viewer (bends inward)
    setTransform(
      `perspective(700px) rotateX(${-py * TILT}deg) rotateY(${px * TILT}deg) translateZ(${PUSH}px)`
    );
  }

  function handleLeave() {
    setHovering(false);
    setTransform(REST);
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`app-card overflow-hidden bg-white motion-reduce:!transform-none ${
        hovering ? "shadow-soft" : ""
      }`}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: hovering
          ? "transform 120ms ease-out, box-shadow 200ms"
          : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms",
        willChange: "transform",
      }}
    >
      <div className={`flex h-14 w-full items-center justify-center bg-gradient-to-br ${tones[tone]} sm:h-20`}>
        <Icon
          aria-hidden="true"
          className={`h-6 w-6 text-white transition-transform duration-500 sm:h-9 sm:w-9 ${
            hovering ? "scale-125" : "scale-100"
          }`}
        />
      </div>
      <p className="p-2 text-center text-[11px] font-semibold leading-tight text-app-text sm:text-sm">
        {label}
      </p>
    </div>
  );
}

export function GuideTree() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[620px]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full text-app-primary"
        aria-hidden="true"
      >
        {nodes.map((node) => (
          <line
            key={node.label}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Center */}
      <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-app-primary to-green-600 p-2 text-center shadow-soft sm:h-32 sm:w-32">
        <span className="font-display text-base font-semibold text-white sm:text-xl">
          Guideshala
        </span>
      </div>

      {/* Branches: outer div positions, inner TiltCard does the 3D */}
      {nodes.map(({ label, Icon, tone, x, y }) => (
        <div
          key={label}
          className="absolute z-10 w-24 -translate-x-1/2 -translate-y-1/2 hover:z-20 sm:w-36"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <TiltCard label={label} Icon={Icon} tone={tone} />
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Briefcase, Code2, GraduationCap, HeartPulse, LineChart, Scale, Sprout, Users,
} from "lucide-react";
import { categoryImages, withParams } from "./category-images";

const iconMap = { Briefcase, GraduationCap, HeartPulse, Sprout, LineChart, Scale, Users, Code2, BookOpen };

export function CategoryImageCard({ category }) {
  const [failed, setFailed] = useState(false);
  const src = withParams(categoryImages[category.icon]);
  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="app-card group block overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-green-100">
        {src && !failed ? (
          <img
            src={src}
            alt={category.name}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-app-primary">
            <Icon size={40} aria-hidden="true" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-app-primary/50 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-app-primary">
          {(category.mentorCount || 0).toLocaleString()} mentors
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg transition group-hover:text-green-700">{category.name}</h3>
        <p className="mt-2 text-md leading-6 text-app-muted">{category.description}</p>
      </div>
    </Link>
  );
}

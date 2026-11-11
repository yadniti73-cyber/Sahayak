// Extra mentor filters used by the Find Mentors and category pages.
// They run on the list that getMentors() already returned, so no query changes are needed.

export const AVAILABILITY_OPTIONS_PANEL = [
  ["", "Anytime / Today"],
  ["today", "Available today"],
];

export const AVAILABILITY_OPTIONS_BAR = [
  ["", "Availability"],
  ["today", "Available today"],
];

export const EXPERIENCE_OPTIONS = [
  ["", "Experience"],
  ["5", "5+ years"],
  ["10", "10+ years"],
  ["15", "15+ years"],
];

// "12+ yrs", "16 yrs", 8 -> number of years, or 0 when unknown.
export function yearsOf(mentor) {
  const n = parseInt(String(mentor?.experience ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function isAvailableToday(mentor) {
  return /\b(today|now)\b/i.test(String(mentor?.availability || ""));
}

export function subcategoryOptions(mentors, allLabel = "All Sub-categories") {
  const seen = new Map();
  for (const m of mentors || []) {
    for (const tag of m.specializations || []) {
      const key = String(tag).trim();
      if (key && !seen.has(key.toLowerCase())) seen.set(key.toLowerCase(), key);
    }
  }
  return [["", allLabel], ...[...seen.values()].sort((a, b) => a.localeCompare(b)).map((t) => [t, t])];
}

export function applyExtraFilters(mentors, { availability = "", experience = "", sub = "" } = {}) {
  const minYears = parseInt(experience, 10) || 0;
  const wanted = String(sub || "").toLowerCase();
  return (mentors || []).filter((m) => {
    if (availability === "today" && !isAvailableToday(m)) return false;
    if (minYears && yearsOf(m) < minYears) return false;
    if (wanted && !(m.specializations || []).some((t) => String(t).toLowerCase() === wanted)) return false;
    return true;
  });
}

mkdir -p /home/claude/out/src/lib && cd /home/claude/out/src && cat > lib/mentor-filters.js <<'EOF'
// Filtering and sorting for mentor lists. Works on the mentor objects the catalog service returns,
// so the URL (?language=...&price=...&sort=...) drives the results on the server.

const normMode = (v) => String(v || "").toUpperCase().replace(/[\s-]+/g, "_");

export function parsePrice(value) {
  const match = String(value ?? "").match(/\d[\d,]*(\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, "")) || 0 : 0;
}

export function formatPrice(value) {
  const s = String(value ?? "").trim();
  if (!s) return "Price on request";
  if (/^\d+(\.\d+)?$/.test(s)) return `₹${Number(s).toLocaleString("en-IN")} / session`;
  const withSymbol = s.replace(/^rs\.?\s*/i, "₹");
  return withSymbol.includes("/") ? withSymbol : `${withSymbol} / session`;
}

export const PRICE_OPTIONS = [
  ["", "Any price"],
  ["0-500", "Under ₹500"],
  ["500-1000", "₹500 - ₹1,000"],
  ["1000-", "Above ₹1,000"],
];

export const MODE_OPTIONS = [
  ["", "Any mode"],
  ["VIDEO", "Video"],
  ["PHONE", "Audio / phone"],
  ["IN_PERSON", "In person"],
];

export const SORT_OPTIONS = [
  ["", "Recommended"],
  ["rating", "Highest rated"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["experience", "Most experienced"],
];

export function languageOptions(items = []) {
  const set = new Set(["Hindi", "English"]);
  items.forEach((m) => (m.languages || []).forEach((l) => l && set.add(String(l))));
  return [["", "All languages"], ...[...set].sort().map((l) => [l, l])];
}

export function filterAndSortMentors(items = [], params = {}) {
  const language = String(params.language || "").toLowerCase();
  const mode = normMode(params.mode);
  const [min, max] = String(params.price || "").split("-");
  const lo = min ? Number(min) : null;
  const hi = max ? Number(max) : null;
  const sort = String(params.sort || "");

  let out = items.filter((m) => {
    if (language && !(m.languages || []).some((l) => String(l).toLowerCase() === language)) return false;
    if (mode && normMode(m.mode) !== mode) return false;
    if (lo !== null || hi !== null) {
      const p = parsePrice(m.price);
      if (!p) return false;
      if (lo !== null && p < lo) return false;
      if (hi !== null && p >= hi) return false;
    }
    return true;
  });

  const num = (v) => Number(String(v ?? "").match(/\d+(\.\d+)?/)?.[0]) || 0;
  if (sort === "rating") out = [...out].sort((a, b) => num(b.rating) - num(a.rating));
  else if (sort === "price-asc") out = [...out].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  else if (sort === "price-desc") out = [...out].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  else if (sort === "experience") out = [...out].sort((a, b) => num(b.experience) - num(a.experience));
  return out;
}
EOF
cat > components/MentorFilters.js <<'EOF'

EOF
python3 - <<'EOF'
import re
p='/home/claude/proj/src/components/domain-cards.js'
s=open(p,newline='').read()
print('\r\n' in s)
EOF
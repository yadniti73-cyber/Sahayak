// The 20 categories seekers ask for most often. They are written to the database
// the first time categories are read (see ensureDefaultCategories), so mentors can
// pick them in the application form. The first 8 keep the slugs already in use.
// Admins can add more from /admin/categories. Existing records are never overwritten.

export const CATEGORY_PRESETS = [
  { name: "Career", slug: "career", icon: "Briefcase", description: "Career planning, resumes, interviews, and role transitions." },
  { name: "Education", slug: "education", icon: "GraduationCap", description: "Study planning, admissions, scholarships, and learning paths." },
  { name: "Health", slug: "health", icon: "HeartPulse", description: "Second opinions, lifestyle guidance, and trusted health advice." },
  { name: "Agriculture", slug: "agriculture", icon: "Sprout", description: "Crop care, schemes, equipment, markets, and organic farming." },
  { name: "Business", slug: "business", icon: "LineChart", description: "Strategy, finance, fundraising, hiring, and growth." },
  { name: "Legal", slug: "legal", icon: "Scale", description: "Property, documentation, consumer rights, and legal direction." },
  { name: "Parenting", slug: "parenting", icon: "Users", description: "Child development, family wellbeing, nutrition, and counseling." },
  { name: "Technology", slug: "technology", icon: "Code2", description: "Software careers, product thinking, AI, and technical growth." },
  { name: "Mental Health", slug: "mental-health", icon: "Brain", description: "Stress, anxiety, burnout, and emotional support from trained counsellors." },
  { name: "Personal Finance", slug: "personal-finance", icon: "Wallet", description: "Budgeting, saving, investing, loans, insurance, and tax planning." },
  { name: "Government Jobs", slug: "government-jobs", icon: "Landmark", description: "UPSC, SSC, banking, railways, and state service exam strategy." },
  { name: "Competitive Exams", slug: "competitive-exams", icon: "Target", description: "JEE, NEET, CAT, GATE, CUET, and other entrance exam preparation." },
  { name: "Study Abroad", slug: "study-abroad", icon: "Plane", description: "Country and course choice, applications, visas, SOPs, and funding." },
  { name: "Resume & Interviews", slug: "resume-interviews", icon: "FileText", description: "Resume reviews, mock interviews, and job search strategy." },
  { name: "Relationships", slug: "relationships", icon: "Heart", description: "Marriage, family, dating, and communication in close relationships." },
  { name: "Fitness & Nutrition", slug: "fitness-nutrition", icon: "Dumbbell", description: "Workout plans, diet, weight management, and building healthy habits." },
  { name: "Real Estate", slug: "real-estate", icon: "Home", description: "Buying, renting, property checks, home loans, and registration." },
  { name: "Communication Skills", slug: "communication-skills", icon: "Mic", description: "Public speaking, spoken English, confidence, and presentation skills." },
  { name: "Design & Creative", slug: "design-creative", icon: "Palette", description: "Design careers, portfolios, content creation, music, writing, and the arts." },
  { name: "Digital Marketing", slug: "digital-marketing", icon: "Megaphone", description: "SEO, social media, ads, freelancing, and building an online income." },
];

// Icons an admin can choose for a new category (keys of categoryIconMap).
export const CATEGORY_ICON_NAMES = [
  "Briefcase", "GraduationCap", "HeartPulse", "Sprout", "LineChart", "Scale", "Users", "Code2",
  "Brain", "Wallet", "Landmark", "Target", "Plane", "FileText", "Heart", "Dumbbell",
  "Home", "Mic", "Palette", "Megaphone", "BookOpen",
];

export function slugifyCategory(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

import { connectMongo } from "../../src/server/db/mongo.js";
import { createCategory } from "../../src/server/repositories/categories.js";
import { createMentorProfile } from "../../src/server/repositories/mentorProfiles.js";
import { createUser, findUserByEmail } from "../../src/server/repositories/users.js";
import bcrypt from "bcryptjs";

async function upsertCategories() {
  const categories = [
    { name: "Career", slug: "career", icon: "Briefcase", description: "Career planning, resumes, interviews, and role transitions." },
    { name: "Education", slug: "education", icon: "GraduationCap", description: "Study planning, admissions, scholarships, and learning paths." },
    { name: "Health", slug: "health", icon: "HeartPulse", description: "Second opinions, lifestyle guidance, and trusted health advice." },
    { name: "Agriculture", slug: "agriculture", icon: "Sprout", description: "Crop care, schemes, equipment, markets, and organic farming." },
    { name: "Business", slug: "business", icon: "LineChart", description: "Strategy, finance, fundraising, hiring, and growth." },
    { name: "Legal", slug: "legal", icon: "Scale", description: "Property, documentation, consumer rights, and legal direction." },
    { name: "Parenting", slug: "parenting", icon: "Users", description: "Child development, family wellbeing, nutrition, and counseling." },
    { name: "Technology", slug: "technology", icon: "Code2", description: "Software careers, product thinking, AI, and technical growth." },
  ];

  for (const category of categories) {
    await createCategory({ ...category, active: true });
  }
}

async function seedMentors() {
  const mentors = [
    {
      slug: "dr-ananya-mehta",
      name: "Dr. Ananya Mehta",
      headline: "Cardiologist guiding families through second opinions",
      category: "Health",
      city: "Delhi",
      rating: 4.9,
      reviewsCount: 214,
      experience: "16 yrs",
      price: "Rs. 900",
      mode: "VIDEO",
      availability: "Today",
      verified: true,
      languages: ["Hindi", "English"],
      bio: "Helps patients understand reports, treatment options, and next steps with calm, practical guidance.",
      specializations: ["Second opinions", "Lifestyle", "Preventive care"],
    },
    {
      slug: "raghav-bansal",
      name: "Raghav Bansal",
      headline: "Startup founder and fundraising mentor",
      category: "Business",
      city: "Bengaluru",
      rating: 4.8,
      reviewsCount: 178,
      experience: "12 yrs",
      price: "Rs. 1200",
      mode: "VIDEO",
      availability: "Tomorrow",
      verified: true,
      languages: ["English", "Hindi"],
      bio: "Works with early founders on pitch narratives, GTM planning, hiring, and investor conversations.",
      specializations: ["Fundraising", "GTM", "Leadership"],
    },
    {
      slug: "prof-kavita-rao",
      name: "Prof. Kavita Rao",
      headline: "Professor helping students choose research paths",
      category: "Education",
      city: "Pune",
      rating: 4.9,
      reviewsCount: 302,
      experience: "22 yrs",
      price: "Rs. 700",
      mode: "VIDEO",
      availability: "Fri",
      verified: true,
      languages: ["English", "Marathi", "Hindi"],
      bio: "Guides students through higher education choices, research proposals, paper reviews, and scholarships.",
      specializations: ["Research", "Admissions", "Study planning"],
    },
    {
      slug: "suresh-patil",
      name: "Suresh Patil",
      headline: "Organic farming advisor for small farms",
      category: "Agriculture",
      city: "Nashik",
      rating: 4.7,
      reviewsCount: 96,
      experience: "18 yrs",
      price: "Rs. 0",
      mode: "PHONE",
      availability: "Today",
      verified: true,
      languages: ["Marathi", "Hindi"],
      bio: "Supports farmers with crop disease diagnosis, organic methods, seasonal planning, and government schemes.",
      specializations: ["Crop care", "Organic farming", "Schemes"],
    },
  ];

  for (const mentor of mentors) {
    const email = `${mentor.slug}@mentor.sahayak`;
    let user = await findUserByEmail(email);
    if (!user) {
      const passwordHash = await bcrypt.hash("Mentor@123", 12);
      user = await createUser({ email, passwordHash, firstName: mentor.name.split(" ")[0], lastName: mentor.name.split(" ").slice(1).join(" "), role: "MENTOR" });
    }
    await createMentorProfile({ ...mentor, userId: user._id });
  }
}

async function seedAdmin() {
  const email = "admin@sahayak.app";
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  await createUser({ email, passwordHash, firstName: "Platform", lastName: "Admin", role: "ADMIN" });
}

async function main() {
  try {
    await connectMongo();
    await seedAdmin();
    await upsertCategories();
    await seedMentors();
    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

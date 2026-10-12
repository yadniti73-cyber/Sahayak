// One Unsplash image per category icon name (the `icon` field in frontend-data).
// Paste the image URL from Unsplash: open a photo, right-click the image, "Copy image address".
// Add ?auto=format&fit=crop&w=700&q=70 to keep it small.
// Empty entries fall back to a blue/green gradient with the icon.
const q = "?auto=format&fit=crop&w=700&q=70";

export const categoryImages = {
  Briefcase: "",      // career / business
  GraduationCap: "",  // education
  HeartPulse: "",     // health
  Sprout: "",         // farming
  LineChart: "",      // finance
  Scale: "",          // legal
  Users: "",          // family / parenting
  Code2: "",          // technology
  BookOpen: "",       // arts / learning
  Brain: "",          // mental health
  Wallet: "",         // personal finance
  Landmark: "",       // government jobs
  Target: "",         // competitive exams
  Plane: "",          // study abroad
  FileText: "",       // resume & interviews
  Heart: "",          // relationships
  Dumbbell: "",       // fitness & nutrition
  Home: "",           // real estate
  Mic: "",            // communication skills
  Palette: "",        // design & creative
  Megaphone: "",      // digital marketing
};

export const withParams = (url) => (url ? (url.includes("?") ? url : url + q) : "");

import "./globals.css";
import { Inter, Merriweather } from "next/font/google";
import { AppProviders } from "@/components/providers";

// Body = Inter, headings (font-display) = Merriweather, as in the new design.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-merri",
  display: "swap",
});

export const metadata = {
  title: "GuideShala | Find trusted guidance",
  description:
    "GuideShala helps seekers discover verified mentors, request guidance, and manage long-term mentorship relationships.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

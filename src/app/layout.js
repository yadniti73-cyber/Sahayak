import "./globals.css";

export const metadata = {
  title: "Sahayak | Find trusted guidance",
  description:
    "Sahayak helps seekers discover verified mentors, request guidance, and manage long-term mentorship relationships.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

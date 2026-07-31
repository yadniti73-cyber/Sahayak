/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--background)",
          surface: "var(--surface)",
          elevated: "var(--elevated)",
          text: "var(--text-primary)",
          muted: "var(--text-muted)",
          border: "var(--border)",
          primary: "var(--primary)",
          primaryDark: "var(--primary-dark)",
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        soft: "0 8px 28px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

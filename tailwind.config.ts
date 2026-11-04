import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        ink: {
          950: "#0A0A0B",
          900: "#111113",
          850: "#17171A",
          800: "#1E1E22",
          700: "#2A2A30",
        },
        fg: "#EDEDEF",
        muted: "#8B8B92",
        line: "rgba(255,255,255,0.08)",
        accent: "#34D399",
        select: "#3B82F6",
        guide: "#F43F5E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 1.6rem + 4.6vw, 6.25rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        h2: ["clamp(2.25rem, 1.5rem + 2.8vw, 4.25rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.75rem, 1.3rem + 1.4vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        lede: ["clamp(1.125rem, 1rem + 0.4vw, 1.375rem)", { lineHeight: "1.5" }],
        label: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
      },
      maxWidth: {
        page: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;

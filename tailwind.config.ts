import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{mdx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        divider: "rgb(var(--color-divider) / <alpha-value>)",
        violet: "rgb(var(--color-violet) / <alpha-value>)",
        lavender: "rgb(var(--color-lavender) / <alpha-value>)",
        cyan: "rgb(var(--color-cyan) / <alpha-value>)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        ui: ["var(--font-ui)", "sans-serif"],
        tech: ["var(--font-tech)", "sans-serif"]
      },
      letterSpacing: {
        tightest: "-0.04em",
        wide: "0.18em"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#f97316", deep: "#c2410c" },
        ink: "#20233a",
        paper: "#f9f8f5",
        card: "#ffffff",
        line: "#e7e4dc",
        soft: "#565a72",
        faint: "#8b8ea1",
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(36px,9vw,144px)", { lineHeight: "0.92", fontWeight: "800" }],
        lead: ["clamp(22px,3.4vw,32px)", { lineHeight: "1.35" }],
        "section-h": ["clamp(24px,4vw,34px)", { lineHeight: "1.15" }],
        eyebrow: ["11.5px", { letterSpacing: "0.22em", lineHeight: "1.4" }],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

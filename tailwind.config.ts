import type { Config } from "tailwindcss";

/**
 * 1984 Brand Design Tokens
 *
 * Note: This project uses Tailwind CSS v4 which configures themes via
 * CSS @theme blocks in globals.css. This file documents the design tokens
 * and can be loaded via @config if needed.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#171717",
          surface: "#181818",
          navbar: "#191919",
          hover: "#242424",
          text: "#E1E1E1",
          salmon: "#FFB288",
          rose: "#EE94B0",
          peach: "#EFBC9F",
          hotpink: "#FF9ED1",
          accent: "#FEB089",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Instrument Serif", "serif"],
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

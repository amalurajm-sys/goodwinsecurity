import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#060E24", 900: "#0B1633", 800: "#12224A", 700: "#1E3A8A" },
        brand: { DEFAULT: "#3B82F6", dark: "#1E3A8A", light: "#93C5FD", 600: "#2563EB" },
      },
      fontFamily: {
        display: ['"Sora Variable"', "system-ui", "sans-serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: { site: "1240px" },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss"
import tailwindPreset from "@fmt/theme/tailwind-preset"

const config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "var(--space-md)",
      screens: {
        "2xl": "1400px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

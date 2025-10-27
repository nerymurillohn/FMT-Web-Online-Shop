import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f1f5f1",
          100: "#dde7e0",
          200: "#b9cfc0",
          300: "#94b79f",
          400: "#6f9f7f",
          500: "#4b8760",
          600: "#3a6a4a",
          700: "#2b4d37",
          800: "#1c3224",
          900: "#111f16",
          950: "#0a120d"
        }
      },
      backgroundImage: {
        "grid-overlay": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;

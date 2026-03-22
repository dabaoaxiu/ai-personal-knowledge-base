import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#f8f5ef",
        mist: "#ece7de",
        sage: "#cdd7c5",
        sand: "#e8dcc8",
        accent: "#0f766e"
      },
      boxShadow: {
        soft: "0 14px 40px -24px rgba(17, 17, 17, 0.18)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      fontFamily: {
        sans: ["'Segoe UI Variable Display'", "'Aptos'", "'Segoe UI'", "sans-serif"],
        serif: ["'Iowan Old Style'", "'Palatino Linotype'", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;


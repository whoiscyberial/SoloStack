import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-850": "#1e1e1e",
      },
    },
  },
  plugins: [],
} satisfies Config;

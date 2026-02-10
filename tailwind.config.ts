import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.08)",
        softer: "0 1px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;

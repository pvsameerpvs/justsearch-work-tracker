import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 16% 85%)",
        input: "hsl(214 16% 92%)",
        ring: "hsl(214 98% 58%)",
        background: "hsl(210 40% 99%)",
        foreground: "hsl(222.2 47.4% 11.2%)",
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#f9fafb"
        },
        secondary: {
          DEFAULT: "#0f172a",
          foreground: "#e5e7eb"
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 18px 45px -24px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;

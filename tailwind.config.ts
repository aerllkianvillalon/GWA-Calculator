import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#111725",
          700: "#2B3245",
          500: "#5B6478",
          300: "#A6ADBC",
          100: "#E7E9EE",
        },
        paper: {
          DEFAULT: "#F6F7F5",
          raised: "#FFFFFF",
        },
        ledger: {
          900: "#0E3B36",
          700: "#175E56",
          500: "#1F8377",
          300: "#8FCABE",
          100: "#E1F1EC",
        },
        amber: {
          600: "#B8862C",
          500: "#CB9A3E",
          100: "#F6EAD2",
        },
        danger: {
          600: "#B3423A",
          100: "#F6E1DE",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};

export default config;

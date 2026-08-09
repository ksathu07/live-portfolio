import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070c",
          900: "#0b0b14",
          800: "#12121e",
        },
        accent: {
          400: "#22d3ee",
          500: "#8b5cf6",
          600: "#d946ef",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out both",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 5s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
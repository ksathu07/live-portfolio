import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#0a0a08",
          800: "#121210",
        },
        gold: {
          100: "#F7E7C4",
          200: "#E8D08A",
          300: "#DDBB5F",
          400: "#D4AF37",
          500: "#B8912B",
          600: "#8C6D4F",
          700: "#6B5330",
          800: "#543B1A",
          900: "#3A2A12",
        },
        accent: {
          DEFAULT: "#D4AF37",
          400: "#D4AF37",
          500: "#B8912B",
          600: "#8C6D4F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out both",
        "fade-in-up": "fadeInUp 0.8s ease-out both",
        "fade-in-down": "fadeInDown 0.6s ease-out both",
        "fade-in-left": "fadeInLeft 0.7s ease-out both",
        "fade-in-right": "fadeInRight 0.7s ease-out both",
        "scale-in": "scaleIn 0.6s ease-out both",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-reverse": "floatReverse 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 5s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
        "spin-reverse": "spinReverse 30s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "gradient-shift": "gradientShift 6s ease infinite",
        "text-reveal": "textReveal 0.8s ease-out both",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out both",
        "marquee": "marquee 25s linear infinite",
        "wave": "wave 2.5s ease-in-out infinite",
        "typing": "typing 3.5s steps(40, end)",
        "blink": "blink 1s step-end infinite",
        "particle-float": "particleFloat 10s ease-in-out infinite",
        "border-flow": "borderFlow 3s linear infinite",
        "counter": "counter 2s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(2deg)" },
        },
        floatReverse: {
          "0%,100%": { transform: "translateY(-8px)" },
          "50%": { transform: "translateY(8px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.08)" },
        },
        pulseSlow: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        spinReverse: {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSubtle: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wave: {
          "0%,100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(15deg)" },
          "75%": { transform: "rotate(-15deg)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        particleFloat: {
          "0%,100%": { transform: "translateY(0) translateX(0)", opacity: "0.4" },
          "25%": { transform: "translateY(-30px) translateX(10px)", opacity: "0.8" },
          "50%": { transform: "translateY(-15px) translateX(-10px)", opacity: "0.5" },
          "75%": { transform: "translateY(-40px) translateX(5px)", opacity: "0.7" },
        },
        borderFlow: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        counter: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

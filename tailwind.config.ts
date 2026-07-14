import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
      },
      colors: {
        // App surfaces
        canvas: "#F7F9FC",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F9FC",
          sunken: "#EEF2F8",
        },
        hairline: "rgba(15,23,42,0.06)",
        // Primary brand blue (ConstrAI)
        primary: {
          50: "#eff5ff",
          100: "#dbe7fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#5f8bfa",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1d4ed8",
          800: "#1E3A8A",
          900: "#172a63",
          950: "#0f1e47",
          DEFAULT: "#1E3A8A",
        },
        // Alias kept so legacy `brand-*` utilities render blue
        brand: {
          50: "#eff5ff",
          100: "#dbe7fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#5f8bfa",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1d4ed8",
          800: "#1E3A8A",
          900: "#172a63",
        },
        accent: "#3B82F6",
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#F59E0B",
          600: "#d97706",
          700: "#b45309",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#EF4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        risk: {
          high: "#EF4444",
          med: "#F59E0B",
          low: "#10B981",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem", // 14px
        "2xl": "1.125rem", // 18px
        "3xl": "1.5rem", // 24px
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        card: "0 1px 3px rgba(16,24,40,0.05), 0 10px 28px -14px rgba(16,24,40,0.14)",
        "card-hover":
          "0 6px 16px rgba(16,24,40,0.08), 0 24px 48px -18px rgba(16,24,40,0.20)",
        glow: "0 0 0 1px rgba(59,130,246,0.14), 0 10px 34px -10px rgba(59,130,246,0.40)",
        neo: "6px 6px 16px rgba(163,177,198,0.35), -6px -6px 16px rgba(255,255,255,0.90)",
        "neo-inset":
          "inset 3px 3px 8px rgba(163,177,198,0.30), inset -3px -3px 8px rgba(255,255,255,0.85)",
        "inset-soft": "inset 0 1px 2px rgba(16,24,40,0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

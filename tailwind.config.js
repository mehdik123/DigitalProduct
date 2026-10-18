/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        macro: {
          protein: "hsl(var(--macro-protein))",
          carbs: "hsl(var(--macro-carbs))",
          fats: "hsl(var(--macro-fats))",
        },
        // ── Hybrid Athlete design system (single source of truth) ──
        // Mirrors the preview palette; see src/design/tokens.ts + src/index.css.
        bg: "#111110",
        surface: {
          DEFAULT: "#1A1918",
          1: "#1A1918",
          2: "#22201E",
          3: "#2C2A27",
        },
        hair: {
          DEFAULT: "#2E2C29",
          strong: "#3E3B37",
        },
        glass: {
          DEFAULT: "rgba(242,237,230,0.04)",
          hi: "rgba(242,237,230,0.07)",
        },
        txt: {
          hi: "#F2EDE6",
          mid: "#A8A29A",
          lo: "#6F6A64",
        },
        brand: {
          DEFAULT: "#E8112D",
          deep: "#C80E27",
          soft: "rgba(232,17,45,0.14)",
        },
        coral: "#E8112D",
        emerald: "#34d399",
        success: {
          DEFAULT: "#34d399",
          soft: "rgba(52,211,153,0.14)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['"Barlow"', "Helvetica Neue", "Arial", "sans-serif"],
        heading: ['"Barlow"', "sans-serif"],
        body: ['"Barlow"', "sans-serif"],
        display: ['"Saira Condensed"', "Arial Narrow", "sans-serif"],
        stat: ['"Saira Condensed"', "sans-serif"],
      },
      boxShadow: {
        glow: "none",
        "glow-sm": "none",
        card: "none",
        elevated: "none",
        soft: "none",
        red: "none",
      },
      backgroundImage: {
        "gradient-primary": "none",
        "gradient-card": "none",
        "gradient-hero": "none",
        "gradient-glow": "none",
        "grad-red": "linear-gradient(#E8112D,#E8112D)",
        "grad-coral": "linear-gradient(#E8112D,#E8112D)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.2,.8,.2,1)",
        smooth: "cubic-bezier(.2,.8,.2,1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "slide-in-italic": {
          "0%": { opacity: "0", transform: "translateX(-18px) skewX(-6deg)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in-down": "fade-in-down 0.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        rise: "rise 0.7s cubic-bezier(.22,.61,.36,1) forwards",
        "slide-in-italic": "slide-in-italic 0.7s cubic-bezier(.22,.61,.36,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

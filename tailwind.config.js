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
        bg: "#08090d",
        surface: {
          DEFAULT: "#101218", // surface-1
          1: "#101218",
          2: "#15171f",
          3: "#1b1e28",
        },
        hair: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.12)",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hi: "rgba(255,255,255,0.08)",
        },
        txt: {
          hi: "#f4f5fa",
          mid: "#9ea3b2",
          lo: "#646a7a",
        },
        brand: {
          DEFAULT: "#ff2d55",
          deep: "#e11d48",
          soft: "rgba(255,45,85,0.14)",
        },
        coral: "#ff6a55",
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
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        // Athletic italic lockup — big headings + CTA titles (the brand voice).
        display: ['"Saira Condensed"', "Inter", "sans-serif"],
        // Numbers / stats.
        stat: ['"Space Grotesk"', "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-sm": "var(--shadow-glow-sm)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        soft: "0 16px 40px -18px rgba(0,0,0,.6)",
        red: "0 16px 36px -12px rgba(255,45,85,.65)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-card": "var(--gradient-card)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-glow": "var(--gradient-glow)",
        "grad-red": "linear-gradient(135deg,#ff476a,#e11d48 55%,#c2123f)",
        "grad-coral": "linear-gradient(120deg,#ff8a5c,#ff2d55)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.34,1.56,.64,1)",
        smooth: "cubic-bezier(.22,.61,.36,1)",
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

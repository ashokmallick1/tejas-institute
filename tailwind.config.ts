import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* ── TEJAS brand palette (extracted from actual logo) ── */
        tejas: {
          // Deep navy from the wordmark
          navy: {
            DEFAULT: "#0E2B6E",
            50:  "#eef3ff",
            100: "#d9e4fd",
            200: "#bccefb",
            300: "#92aff8",
            400: "#6485f3",
            500: "#4260ed",
            600: "#2f40e1",
            700: "#2430c9",
            800: "#2129a3",
            900: "#0E2B6E",
            950: "#0a1d4d",
          },
          // Electric blue from the circle border
          blue: {
            DEFAULT: "#1A56DB",
            glow:   "#60a5fa",
            light:  "#dbeafe",
            dark:   "#1d4ed8",
            bright: "#3b82f6",
          },
          // Flame gradient — the speed streak in the logo
          flame: {
            red:    "#E63900",
            orange: "#FF6B00",
            amber:  "#FF8C00",
            gold:   "#FFD700",
            DEFAULT:"#FF6B00",
          },
          // Orange accent (the "A" triangle)
          orange: {
            DEFAULT: "#f97316",
            amber:   "#fb923c",
            glow:    "#fdba74",
            light:   "#fff7ed",
          },
          // Supporting palette
          cyan:   "#06b6d4",
          purple: "#8b5cf6",
          green:  "#22c55e",
          // Dark surfaces — near-black neutral (NOT dark navy)
          surface: {
            0: "#0a0a0a",  // page background
            1: "#111111",  // card
            2: "#1a1a1a",  // elevated card
            3: "#222222",  // hover state
            4: "#2a2a2a",  // active state
          },
        },

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
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        sans:    ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif:   ["'Source Serif 4'", "Georgia", "serif"],
        mono:    ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },

      backgroundImage: {
        "gradient-flame":  "linear-gradient(135deg, #E63900 0%, #FF8C00 50%, #FFD700 100%)",
        "gradient-brand":  "linear-gradient(135deg, #1A56DB 0%, #06b6d4 60%, #f97316 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.94)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":      { opacity: "0.9", transform: "scale(1.08)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        spinSlow: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in":        "fadeIn 0.4s ease-out forwards",
        "scale-in":       "scaleIn 0.35s ease-out forwards",
        float:            "float 6s ease-in-out infinite",
        marquee:          "marquee 35s linear infinite",
        "pulse-glow":     "pulseGlow 4s ease-in-out infinite",
        shimmer:          "shimmer 3s linear infinite",
        "spin-slow":      "spinSlow 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

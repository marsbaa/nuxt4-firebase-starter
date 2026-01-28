import type { Config } from "tailwindcss";

/**
 * Pastoral Care App - Tailwind Configuration
 *
 * COLOR PALETTE USAGE GUIDE:
 * ==========================
 *
 * PRIMARY (Soft Sage Green) - Growth, Peace, Hope
 * - Use for: Primary actions, navigation highlights, success states
 * - Text on white: primary-600+ (WCAG AA compliant)
 * - Text on primary: Use white or stone-50
 *
 * SECONDARY (Warm Taupe) - Stability, Grounding, Warmth
 * - Use for: Secondary actions, background sections, muted elements
 * - Text on white: secondary-700+ (WCAG AA compliant)
 * - Text on secondary: Use white or stone-50
 *
 * ACCENT (Gentle Gold) - Light, Guidance, Value
 * - Use for: Highlights, special callouts, emphasis
 * - Text on white: accent-700+ (WCAG AA compliant)
 * - Text on accent: Use white or stone-50
 *
 * STONE (Warm Neutrals) - Soft, Paper-like Backgrounds
 * - Use for: Body text, borders, backgrounds
 * - Text on white: stone-700+ (WCAG AA compliant)
 * - Text on stone-50: stone-700+
 *
 * SEMANTIC COLORS (Softened for Pastoral Context):
 * - SUCCESS: Affirming completion, positive outcomes
 * - WARNING: Gentle cautions, important notices
 * - DANGER: Errors, critical alerts (softened tone)
 * - INFO: Helpful information, guidance
 *
 * ACCESSIBILITY NOTES:
 * - All text uses minimum 14px (0.875rem) for readability
 * - Focus indicators are 2px wide with offset for visibility
 * - Color combinations tested for WCAG 2.1 AA compliance (4.5:1 minimum)
 * - Never rely on color alone - always include icons or text
 */

export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Warm tan - For members page and pastoral care aesthetic
        primary: {
          DEFAULT: "#c2a47a", // Base warm tan from style guide
          50: "#faf8f4",
          100: "#f3efd9",
          200: "#e7ddb3",
          300: "#dbc794",
          400: "#ceb37d",
          500: "#c2a47a", // Base color
          600: "#a9896a",
          700: "#8b6e56",
          800: "#6d5645",
          900: "#4f3f33",
          950: "#2d2319",
        },
        // Secondary: Warm taupe - Stability, grounding, warmth
        secondary: {
          50: "#f7f6f4",
          100: "#edeae6",
          200: "#dbd5cd",
          300: "#c4baad",
          400: "#ac9f8e",
          500: "#9c8b7a",
          600: "#8f7d6e",
          700: "#77675c",
          800: "#63574e",
          900: "#524941",
          950: "#2b2521",
        },
        // Accent: Gentle gold - Light, guidance, value
        accent: {
          50: "#faf8f0",
          100: "#f3efd9",
          200: "#e7ddb3",
          300: "#d8c584",
          400: "#c9a961",
          500: "#bf974d",
          600: "#a97d41",
          700: "#8b6238",
          800: "#735034",
          900: "#5f432e",
          950: "#362318",
        },
        // Warm neutrals - Soft, paper-like backgrounds
        stone: {
          50: "#fafaf8",
          100: "#f5f5f3",
          200: "#e8e8e5",
          300: "#d5d5d0",
          400: "#b5b5ae",
          500: "#9a9a91",
          600: "#7f7f77",
          700: "#6b6b68",
          800: "#5a5a58",
          900: "#4c4c4a",
          950: "#2c2c2a",
        },
        // Semantic colors (softened for pastoral care context)
        success: {
          50: "#f2f7f2",
          100: "#e1ede1",
          200: "#c5dbc4",
          300: "#9cc19b",
          400: "#6b9b6a",
          500: "#54825c",
          600: "#416845",
          700: "#355439",
          800: "#2d4430",
          900: "#263828",
          950: "#121f14",
        },
        warning: {
          50: "#faf6f0",
          100: "#f3eadb",
          200: "#e7d2b6",
          300: "#d8b488",
          400: "#d4a574",
          500: "#bc8650",
          600: "#a96f44",
          700: "#8d5a3a",
          800: "#744a34",
          900: "#5f3e2d",
          950: "#351f17",
        },
        danger: {
          50: "#faf4f3",
          100: "#f4e6e3",
          200: "#ead1cb",
          300: "#dbb1a8",
          400: "#c67b6b",
          500: "#b66655",
          600: "#a24d3d",
          700: "#873f32",
          800: "#70362d",
          900: "#5e322a",
          950: "#321713",
        },
        info: {
          50: "#f4f7f9",
          100: "#e9eef2",
          200: "#d7e1e8",
          300: "#b8cad7",
          400: "#93afc2",
          500: "#7b93a8",
          600: "#677c93",
          700: "#576778",
          800: "#4a5664",
          900: "#404955",
          950: "#282f38",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        // Comfortable base sizes
        xs: ["0.75rem", { lineHeight: "1.625" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.625" }], // 14px - minimum for accessibility
        base: ["1rem", { lineHeight: "2" }], // 16px - comfortable default
        lg: ["1.125rem", { lineHeight: "1.75" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.625" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "1.625" }], // 24px
        "3xl": ["1.875rem", { lineHeight: "1.625" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "1.625" }], // 36px
        "5xl": ["3rem", { lineHeight: "1.625" }], // 48px
      },
      fontWeight: {
        normal: "400",
        medium: "500", // For headings - softer than bold
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em", // For headings - openness
        wider: "0.05em",
        widest: "0.1em",
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625", // For headings - breathing room
        loose: "2", // For body text - comfortable reading
      },
      spacing: {
        // Extended spacing for generous whitespace
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
        26: "6.5rem", // 104px
        30: "7.5rem", // 120px
      },
      maxWidth: {
        // Comfortable content widths
        "7xl": "80rem",
        "8xl": "88rem",
      },
      borderRadius: {
        // Soft, gentle corners
        sm: "0.25rem", // 4px
        DEFAULT: "0.375rem", // 6px
        md: "0.375rem", // 6px - for form elements
        lg: "0.5rem", // 8px - for buttons and cards
        xl: "0.75rem", // 12px - for larger cards
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
      },
      boxShadow: {
        // Subtle, gentle shadows
        sm: "0 1px 2px 0 rgba(44, 44, 42, 0.05)", // Subtle for cards
        DEFAULT:
          "0 1px 3px 0 rgba(44, 44, 42, 0.1), 0 1px 2px -1px rgba(44, 44, 42, 0.1)",
        md: "0 4px 6px -1px rgba(44, 44, 42, 0.1), 0 2px 4px -2px rgba(44, 44, 42, 0.1)", // Gentle lift on hover
        lg: "0 10px 15px -3px rgba(44, 44, 42, 0.1), 0 4px 6px -4px rgba(44, 44, 42, 0.1)", // For modals
        xl: "0 20px 25px -5px rgba(44, 44, 42, 0.1), 0 8px 10px -6px rgba(44, 44, 42, 0.1)",
        "2xl": "0 25px 50px -12px rgba(44, 44, 42, 0.15)",
        soft: "0 2px 15px 0 rgba(44, 44, 42, 0.05)", // Maintaining existing soft shadow
        "soft-lg": "0 10px 40px 0 rgba(44, 44, 42, 0.08)", // Maintaining existing soft-lg shadow
        inner: "inset 0 2px 4px 0 rgba(44, 44, 42, 0.05)",
        none: "none",
      },
      ringWidth: {
        DEFAULT: "2px",
      },
      ringOffsetWidth: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;

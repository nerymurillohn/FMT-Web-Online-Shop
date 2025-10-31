import type { Config } from "tailwindcss"

const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))",
          foreground: "hsl(var(--color-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
        focus: {
          ring: "hsl(var(--color-focus-ring))",
        },
        state: {
          hover: "hsl(var(--color-state-hover))",
          active: "hsl(var(--color-state-active))",
          disabled: "hsl(var(--color-state-disabled))",
          "high-contrast": "hsl(var(--color-state-high-contrast))",
        },
      },
      borderRadius: {
        none: "0",
        xs: "calc(var(--radius) / 4)",
        sm: "calc(var(--radius) / 2)",
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) * 1.5)",
        full: "999px",
      },
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        gutter: "var(--space-gutter)",
      },
      fontSize: {
        "body-xs": ["var(--font-size-xs)", { lineHeight: "var(--line-height-normal)", letterSpacing: "var(--tracking-normal)" }],
        "body-sm": ["var(--font-size-sm)", { lineHeight: "var(--line-height-normal)", letterSpacing: "var(--tracking-normal)" }],
        body: ["var(--font-size-base)", { lineHeight: "var(--line-height-normal)", letterSpacing: "var(--tracking-normal)" }],
        "title-sm": ["var(--font-size-lg)", { lineHeight: "var(--line-height-snug)", letterSpacing: "var(--tracking-tight)" }],
        "title-lg": ["var(--font-size-xl)", { lineHeight: "var(--line-height-snug)", letterSpacing: "var(--tracking-tight)" }],
        "display-sm": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-tight)", letterSpacing: "var(--tracking-tight)" }],
        "display-lg": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-tight)", letterSpacing: "var(--tracking-tight)" }],
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      zIndex: {
        base: "var(--z-base)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
      },
      transitionDuration: {
        sm: "var(--motion-duration-sm)",
        md: "var(--motion-duration-md)",
        lg: "var(--motion-duration-lg)",
      },
      transitionTimingFunction: {
        standard: "var(--motion-easing-standard)",
        emphasized: "var(--motion-easing-emphasized)",
        decelerate: "var(--motion-easing-decelerate)",
        accelerate: "var(--motion-easing-accelerate)",
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down var(--motion-duration-md) var(--motion-easing-standard)",
        "accordion-up": "accordion-up var(--motion-duration-md) var(--motion-easing-standard)",
        "fade-in": "fade-in var(--motion-duration-md) var(--motion-easing-decelerate)",
      },
    },
  },
} satisfies Config

export default tailwindPreset

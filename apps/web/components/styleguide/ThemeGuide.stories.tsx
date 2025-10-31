import type { Meta, StoryObj } from "@storybook/react"
import clsx from "clsx"

interface TokenSwatchProps {
  readonly name: string
  readonly token: string
  readonly description?: string
  readonly className?: string
}

const TokenSwatch = ({ name, token, description, className }: TokenSwatchProps) => (
  <div className={clsx("rounded-lg border border-border bg-card p-sm shadow-xs", className)}>
    <div className="flex items-center justify-between gap-sm">
      <span className="font-semibold text-title-sm">{name}</span>
      <code className="rounded-sm bg-muted px-2 py-1 text-body-xs text-muted-foreground">{token}</code>
    </div>
    {description ? (
      <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
    ) : null}
  </div>
)

const meta: Meta = {
  title: "Foundations/Theme",
  parameters: {
    docs: {
      description: {
        component:
          "Live overview of the Forestal MT design tokens, with guidance on responsive spacing, typography and interaction states in light and dark mode.",
      },
    },
    layout: "fullscreen",
  },
}

export default meta

type Story = StoryObj

export const Foundations: Story = {
  render: () => (
    <div className="space-y-lg p-gutter">
      <section aria-label="Color palette" className="space-y-sm">
        <h2 className="text-title-lg">Semantic colors</h2>
        <p className="max-w-3xl text-body">
          Each semantic color references a CSS variable so components can respond instantly to light or dark themes.
          Hover and focus states are pulled from dedicated tokens and pass automated contrast checks via Storybook’s
          a11y addon.
        </p>
        <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Background", variable: "--color-background", sample: "bg-background" },
            { label: "Foreground", variable: "--color-foreground", sample: "bg-foreground text-background" },
            { label: "Primary", variable: "--color-primary", sample: "bg-primary text-primary-foreground" },
            { label: "Accent", variable: "--color-accent", sample: "bg-accent text-accent-foreground" },
            { label: "Secondary", variable: "--color-secondary", sample: "bg-secondary text-secondary-foreground" },
            { label: "Muted", variable: "--color-muted", sample: "bg-muted text-muted-foreground" },
            { label: "Destructive", variable: "--color-destructive", sample: "bg-destructive text-destructive-foreground" },
            { label: "Focus Ring", variable: "--color-focus-ring", sample: "bg-[hsl(var(--color-focus-ring))] text-background" },
          ].map((swatch) => (
            <div key={swatch.label} className={clsx("rounded-lg border border-border p-sm shadow-xs", swatch.sample)}>
              <span className="block text-title-sm">{swatch.label}</span>
              <span className="mt-2 block text-body-xs">{swatch.variable}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Spacing scale" className="space-y-sm">
        <h2 className="text-title-lg">Spacing scale</h2>
        <p className="max-w-3xl text-body">
          Utilities like <code>p-sm</code> or <code>gap-lg</code> map to the responsive gutter token so content breathes
          consistently across breakpoints.
        </p>
        <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
          {["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "gutter"].map((key) => (
            <TokenSwatch key={key} name={key} token={`--space-${key}`}>
              <div className="mt-4 h-2 w-full rounded-full bg-primary" style={{ height: "var(--space-3xs)" }}>
                <div className="h-full rounded-full bg-primary" style={{ width: `var(--space-${key})` }} />
              </div>
            </TokenSwatch>
          ))}
        </div>
      </section>

      <section aria-label="Typography ramp" className="space-y-sm">
        <h2 className="text-title-lg">Typography ramp</h2>
        <p className="max-w-3xl text-body">
          Typography tokens handle mobile-to-desktop scaling. Use <code>text-body</code> for long form copy and the
          <code>text-display-*</code> utilities for feature moments.
        </p>
        <div className="space-y-sm">
          {[
            { className: "text-body-xs", label: "Body XS", description: "Micro copy and supporting labels." },
            { className: "text-body", label: "Body", description: "Paragraph copy with relaxed leading." },
            { className: "text-title-sm", label: "Title Small", description: "Section headings and card titles." },
            { className: "text-display-sm", label: "Display Small", description: "Hero highlights on mobile." },
            { className: "text-display-lg", label: "Display Large", description: "Hero headlines and marketing moments." },
          ].map((item) => (
            <TokenSwatch key={item.label} name={item.label} token={`class:${item.className}`}>
              <p className={clsx("mt-4", item.className)}>The rainforest thrives when the system stays in sync.</p>
              <p className="mt-2 text-body-xs text-muted-foreground">{item.description}</p>
            </TokenSwatch>
          ))}
        </div>
      </section>

      <section aria-label="Interactive states" className="space-y-sm">
        <h2 className="text-title-lg">Interactive states</h2>
        <div className="grid gap-sm sm:grid-cols-2">
          <TokenSwatch
            name="Primary CTA"
            token="btn"
            description="Hover, focus, and disabled styles are sourced from the shared state tokens and validated with Storybook a11y checks."
          >
            <button className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-md py-2 text-primary-foreground shadow-sm transition-all duration-sm ease-standard hover:bg-[hsl(var(--color-state-hover))] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--color-focus-ring))] disabled:bg-[hsl(var(--color-state-disabled))] disabled:text-[hsl(var(--color-state-high-contrast))]">
              Request a quote
            </button>
          </TokenSwatch>
          <TokenSwatch
            name="High contrast example"
            token="--color-state-high-contrast"
            description="Reserve high-contrast colors for critical alerts or accessibility overrides."
          >
            <div className="mt-4 rounded-lg border border-border bg-[hsl(var(--color-state-high-contrast))] p-sm text-background shadow-sm">
              High contrast layer
            </div>
          </TokenSwatch>
        </div>
      </section>
    </div>
  ),
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "inverse" },
  },
  render: () => (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="space-y-lg p-gutter">
        <p className="text-body">
          Toggle the Storybook background control to compare how tokens adapt to dark surfaces without custom overrides.
        </p>
        <div className="rounded-lg border border-border bg-card p-sm shadow-sm">
          <h2 className="text-title-lg">Dark theme card</h2>
          <p className="mt-2 text-body">
            Components consume the same Tailwind utilities, so the palette swap happens automatically.
          </p>
          <button className="mt-sm inline-flex items-center rounded-lg bg-primary px-sm py-2 text-primary-foreground shadow-xs transition-all duration-sm ease-standard hover:bg-[hsl(var(--color-state-hover))] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--color-focus-ring))]">
            Explore catalog
          </button>
        </div>
      </div>
    </div>
  ),
}

import type { Preview } from "@storybook/react"
import "../app/globals.css"

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "hsl(var(--color-background))" },
        { name: "inverse", value: "hsl(var(--color-foreground))" },
      ],
    },
  },
}

export default preview

import StyleDictionary from "style-dictionary"

const DARK_FALLBACK = "light"

StyleDictionary.registerFormat({
  name: "css/variables-with-dark",
  format({ dictionary }) {
    const lightLines = []
    const darkLines = []

    for (const token of dictionary.allTokens) {
      const cssVar = `--${token.name.replace(/\./g, "-")}`
      const tokenValue = token.value

      if (typeof tokenValue === "object" && tokenValue !== null && "light" in tokenValue) {
        const lightValue = tokenValue.light
        const darkValue = tokenValue.dark ?? tokenValue[DARK_FALLBACK]
        lightLines.push(`  ${cssVar}: ${lightValue};`)
        darkLines.push(`  ${cssVar}: ${darkValue};`)
      } else {
        lightLines.push(`  ${cssVar}: ${tokenValue};`)
        darkLines.push(`  ${cssVar}: ${tokenValue};`)
      }
    }

    return `:root {\n${lightLines.join("\n")}\n}\n\n.dark {\n${darkLines.join("\n")}\n}`
  },
})

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables-with-dark",
        },
      ],
    },
    json: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.json",
          format: "json",
        },
      ],
    },
  },
}

export default config

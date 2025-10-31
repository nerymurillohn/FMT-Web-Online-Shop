# Knowledge Base Content Guidelines

This directory contains Markdown knowledge entries that can be surfaced by AI powered flows.
Follow these guidelines to keep the knowledge base consistent and easy to extend.

## Directory structure

Each subfolder represents a high level knowledge category:

- `brand/` – stories, mission statements, partnerships, and PR ready talking points.
- `products/` – product specifications, launches, bundles, and merchandising notes.
- `policies/` – store policies such as returns, warranties, payment terms, and compliance notices.
- `shipping/` – fulfillment details, carrier service levels, and packaging requirements.

Add new files inside the folder that best matches the subject. Create a new category only when
multiple entries will share the same theme.

## File naming convention

- Use `kebab-case` for filenames (e.g., `international-shipping-guide.md`).
- Choose a descriptive slug that matches the filename to aid discoverability.
- Avoid dates in filenames—capture the effective date in the front matter instead.

## Front matter schema

Every Markdown file **must** start with YAML front matter that follows the schema below:

```yaml
---
slug: unique-url-safe-identifier
category: products | policies | shipping | brand
locale: en-US # optional, defaults to en-US
locales: [en-US, fr-CA] # optional additional locales served by the content
title: Human readable title
summary: One sentence summary for quick previews
updated: 2024-01-31 # ISO date string
status: draft | published # optional, defaults to published
audiences:
  - customers
  - support
  - marketing
  - operations
  # add more as needed
keywords:
  - seo
  - marketing
  # optional tags that improve searchability
---
```

- `slug` should match the filename and remain stable once published.
- `category` must match the folder where the file resides.
- `locale` is the primary locale; use BCP 47 tags (e.g., `en-US`, `fr-CA`).
- `locales` can list additional locales that share the same content.
- `audiences` identifies who should see the entry (e.g., `customers`, `support`).
- `keywords` are free-form tags to improve search relevance.
- `status` defaults to `published`; set to `draft` for in-progress content.

## Content guidelines

- Lead with the most actionable information in the opening paragraph.
- Use headings (`##`) to break down long documents.
- For tables, prefer Markdown tables so they can be parsed programmatically.
- Include links to canonical documentation when appropriate.
- Keep tone consistent with the brand voice—friendly, transparent, and helpful.

## Localization expectations

- Every entry must be authored in `en-US` first.
- When adding localized copies, keep them in the same file and update `locale`/`locales` metadata.
- Use inline notes (e.g., `> Translator note`) to document tricky phrases or cultural context.
- If a locale specific detail deviates from the primary content, call it out in a dedicated section.

## Contribution workflow

1. Create or update Markdown files following the schema above.
2. Run `npm run lint` at the repo root to ensure lint checks pass.
3. If adding new locales, confirm terminology with the localization team.
4. Submit a pull request with a summary of what changed and why.

## Review checklist

- [ ] Filename matches the `slug` value.
- [ ] Front matter is valid YAML and adheres to the schema.
- [ ] Content is fact checked and references current policies.
- [ ] Tone aligns with the brand guidelines.
- [ ] Localization notes are present when applicable.


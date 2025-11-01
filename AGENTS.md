# AGENTS.md - Forestal MT Project

This document outlines the standards and practices for the development of the Forestal MT website.

## 1. Code Quality & Style
- **TypeScript:** Use strict mode. All new code must be strongly typed.
- **ESLint & Prettier:** Code must be free of linting errors and formatted with Prettier before commit.
- **Component Structure:** Components should be small, single-purpose, and reusable. Use functional components with hooks.
- **Naming Conventions:** Follow standard React/Next.js naming conventions (PascalCase for components, camelCase for variables/functions).

## 2. Project Structure
- **`apps/web/`:** Main Next.js application.
- **`apps/web/app/`:** App Router directory.
- **`apps/web/components/`:** Reusable UI components.
- **`apps/web/content/`:** MDX/YAML content.
- **`apps/web/data/`:** Generated JSON data.
- **`apps/web/lib/`:** Utility functions, hooks, and configurations.
- **`apps/web/public/`:** Static assets (images, fonts).
- **`scripts/`:** Node scripts for automation (e.g., catalog generation).

## 3. Asset & Content Management
- **Images:** All images must be optimized using Next/Image and served in modern formats (WebP/AVIF).
- **Product Data:** Product information should be generated from the `scripts/gen-catalog.ts` script. Do not manually edit `data/products.json`.

## 4. Performance
- **Lighthouse Scores:** Target >85 for performance, >95 for accessibility, >95 for best practices.
- **Bundle Size:** Keep the client-side bundle lean. Use dynamic imports for heavy components/libraries.
- **Image Loading:** Ensure images are sized correctly to avoid Cumulative Layout Shift (CLS).

## 5. Accessibility
- Adhere to WCAG 2.1 AA standards.
- Use semantic HTML.
- Ensure all interactive elements are keyboard-accessible and have proper focus states.

## 6. SEO
- Use `next-seo` for managing SEO metadata.
- Generate `sitemap.xml` and `robots.txt`.
- Use JSON-LD for structured data (Organization, Product).

## 7. Environment Variables
- All secret keys and environment-specific configurations must be stored in `.env.local`.
- Use the `NEXT_PUBLIC_` prefix for variables that need to be exposed to the browser.

## 8. Verification
- Before submitting, ensure `npm run build` completes successfully.
- All pages must be tested on mobile (360px) and desktop resolutions.
- The Stripe Checkout flow must be tested in test mode.
- The "Request Bulk Pricing" functionality must be verified.

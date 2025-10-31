# Forestal MT Web Audit

Date: 2024-11-26

## Critical Issues

### 1. Checkout session trusts client pricing and uses invalid Stripe configuration
- **Evidence:** The checkout API route instantiates Stripe with a non-existent API version and never verifies that `STRIPE_SECRET_KEY` is present. It also builds `line_items` directly from the client payload, trusting client-supplied names, prices, and quantities without validation.【F:apps/web/app/api/checkout/route.ts†L1-L35】【F:apps/web/components/Cart.tsx†L21-L66】
- **Impact:** Attackers can change prices in local storage/devtools before submitting the cart and pay arbitrary amounts. Missing or future-dated API versions cause runtime failures during checkout. Dereferencing `process.env.STRIPE_SECRET_KEY!` crashes the server if the key is unset.
- **Fix:**
  1. Replace the inline `!` assertion with an explicit guard that throws a descriptive error during startup if the key is missing. Use a stable Stripe API version (e.g., `2023-10-16`).
  2. Replace client-calculated `price_data` with server-side lookup (e.g., map SKU → Stripe Price ID) and use those fixed IDs when building `line_items`.
  3. Validate the incoming body with Zod/TypeScript types, ignore unexpected fields, and reject requests when validation fails.

### 2. Product catalog API points to the wrong path and lacks resiliency
- **Evidence:** `/api/products` reads `process.cwd()/data/products.json`, but the generated catalog lives under `apps/web/data/products.json`. The handler also omits error handling around file IO and JSON parsing.【F:apps/web/app/api/products/route.ts†L5-L9】【F:scripts/gen-catalog.ts†L12-L60】
- **Impact:** The API throws `ENOENT` in production, breaking the shop page. Any malformed file would crash the route and return 500 without context.
- **Fix:** Use `path.join(process.cwd(), 'apps', 'web', 'data', 'products.json')` (or import the JSON module directly) and wrap the read/parse logic in `try/catch` to return a 500 with a stable error payload plus server-side logging.

### 3. AI chat widget calls a non-existent endpoint
- **Evidence:** `ChatWidget` posts to `/api/chat`, streams a response, and expects headers, but there is no matching route in the codebase.【F:apps/web/components/ChatWidget.tsx†L46-L137】【F:apps/web/app/api/checkout/route.ts†L1-L35】
- **Impact:** Users always hit a 404, triggering the generic “technical difficulties” copy. The widget keeps UI complexity without working functionality.
- **Fix:** Either (a) implement `/api/chat` with OpenAI/other provider backing, streaming support, and proper error handling, or (b) remove/feature-flag the widget until the backend exists so the UI reflects the actual capabilities.

## High Issues

### 4. Cart UI does not handle Stripe initialization or checkout failures
- **Evidence:** The cart loads Stripe inside a component-level `useEffect`, stores it as `any`, and never checks for null or fetch errors when creating a checkout session.【F:apps/web/components/Cart.tsx†L8-L70】
- **Impact:** Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` crashes the component. Network or server errors produce uncaught rejections and a broken checkout flow with no user feedback.
- **Fix:** Hoist `loadStripe` to a shared module (per Stripe docs), keep the instance typed, and guard against missing publishable keys. Wrap the `/api/checkout` call in `try/catch`, surface an error banner, and disable the button while the request is in flight.

### 5. Shop page relies on untyped state and lacks loading/error states
- **Evidence:** The shop page stores products as `any`, filters synchronously, and assumes the API call always succeeds.【F:apps/web/app/shop/page.tsx†L6-L55】
- **Impact:** TypeScript cannot catch schema drift, and users see a blank page if the fetch fails or is slow.
- **Fix:** Introduce a typed `Product` interface, add loading and error states, and consider fetching products in a server component (or with `use` in Next 14) to leverage built-in caching and reduce client bundle size.

## Medium Issues

### 6. Image gallery references missing assets and undefined styles
- **Evidence:** `ImageGallery` requests `/images/before.jpg` and `/images/after.jpg`, but the public assets folder only contains product catalog imagery and SVG placeholders. The component also references `embla__*` class names without any corresponding CSS definitions.【F:apps/web/components/ImageGallery.tsx†L10-L28】【21fdf9†L1-L44】【695f29†L1-L5】
- **Impact:** Both slides render broken images, and Embla receives no styling, so the carousel collapses. This degrades the storefront hero experience.
- **Fix:** Swap the sources for real assets that exist (e.g., `/images/catalog/FMT-BO-BO-2025.png`) and add the required Embla styles (via Tailwind utilities or a scoped CSS module) so slides display horizontally with proper overflow handling.

### 7. Custom component styles are missing from the global stylesheet
- **Evidence:** Components such as `Hero` and `ChatWidget` depend on bespoke class names (`hero__copy`, `chat-widget__window`, etc.), but no CSS definitions exist in `globals.css` or elsewhere.【F:apps/web/components/Hero.tsx†L37-L84】【F:apps/web/components/ChatWidget.tsx†L177-L237】【49a43e†L1-L56】
- **Impact:** Layout defaults to unstyled blocks, animations fail, and accessibility affordances (e.g., focus rings) are inconsistent. Designers cannot reason about the component look-and-feel.
- **Fix:** Either convert these components to Tailwind utility classes exclusively or add a dedicated stylesheet (e.g., `app/(styles)/hero.css`, `chat-widget.css`) that defines the referenced selectors and import it in the respective components.

### 8. Social floating action buttons render broken links when env vars are unset
- **Evidence:** `FloatingIcons` builds WhatsApp, Instagram, Facebook, and LinkedIn URLs directly from `NEXT_PUBLIC_*` environment variables, defaulting to empty strings when unset.【F:apps/web/components/FloatingIcons.tsx†L6-L25】
- **Impact:** Production builds without the env vars generate links like `https://wa.me/?text=...`, which open invalid chats or 404s. This harms credibility and analytics.
- **Fix:** Gate each icon behind a presence check (e.g., don’t render the anchor when the env var is missing) and optionally show a tooltip instructing admins to configure the value.

---

Addressing the critical and high-severity items above will stabilize checkout, product discovery, and support channels while reducing the risk of fraudulent orders. Medium fixes tighten presentation quality and operational polish.

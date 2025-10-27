# Forestal MT Online Shop Blueprint

## 1. Guiding Principles
- **Mission Alignment:** The web platform must embody Forestal MT's heritage narrative, indigenous partnerships, and proof of Honduran excellence. All user flows should reinforce authenticity, traceability, and sustainability commitments.
- **Performance & Reliability:** Favor TypeScript, strongly typed APIs, static asset optimization, and automated testing. Every deployable artifact must pass automated unit, integration, accessibility, and performance checks.
- **Security & Compliance:** Zero-trust defaults, audited access to secrets, and GDPR/CCPA-ready data handling. Shipping and payment workflows require dual review and observability.
- **Scalability:** Architect for global distribution, regional pricing, and future product-line expansion without structural refactors.

## 2. Target Architecture Overview
| Layer | Technology | Key Responsibilities |
| --- | --- | --- |
| Frontend Web | Next.js 14 App Router, TypeScript, Tailwind CSS, Radix UI | Static/SSR content, storytelling pages, shop catalog, cart, checkout UI, localization, accessibility |
| Backend APIs | Next.js Route Handlers (BFF) + Node-based microservices (NestJS or Fastify) | Catalog CRUD, order orchestration, user auth, integration with payment, shipping, ERP/CRM |
| Data Layer | PostgreSQL (primary), Redis (cache/session), S3-compatible object storage (product media) | Persistent storage for products, content, orders, customers; caching; asset delivery |
| Content Management | **Phase 1:** Strapi (self-hosted) → **Phase 2:** Sanity SaaS | Manage brand narrative, blog, landing content, marketing assets with a documented migration bridge |
| Search & Recommendations | Algolia or Meilisearch | Product search, filters, personalization |
| Payments | Stripe (global) + PayPal alternative; future BANHPROVI/local rails | Secure payment capture, subscriptions, refunds |
| Shipping & Logistics | DHL Express API + Honduran carriers (Cargo Expreso) | Rate calculation, label generation, tracking |
| Analytics & Telemetry | Plausible (self-hosted) + Mixpanel, OpenTelemetry, Logtail | Customer insights, conversion tracking, application monitoring |
| Authentication | Auth0 or Clerk + passwordless OTP fallback | Customer accounts, B2B portals, admin login |
| Infrastructure | Vercel (frontend), Fly.io or AWS Fargate (backend), Neon.tech (Postgres) | Managed deployments for dev/staging/prod, multi-region support |

## 3. Repository Structure (Implementation Target)
```
/
├── apps/
│   ├── web/                 # Next.js storefront
│   ├── admin/               # Internal admin portal (optional phase 2)
│   └── docs/                # Docusaurus or Mintlify for public documentation
├── packages/
│   ├── ui/                  # Shared UI components (Storybook-ready)
│   ├── config/              # ESLint, Tailwind, tsconfig packages
│   ├── api-client/          # Typed SDK for backend APIs
│   └── workflows/           # Reusable GitHub Actions workflows
├── services/
│   ├── core-api/            # NestJS or Fastify service for business logic
│   └── workers/             # Background jobs, queues (BullMQ)
├── infra/
│   ├── terraform/           # IaC for cloud resources
│   ├── ansible/             # Optional server provisioning playbooks
│   └── k8s/                 # Manifests if migrating to Kubernetes
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   └── ISSUE_TEMPLATE/      # Issue templates & PR checklists
├── docs/                    # Project documentation (this folder)
└── README.md
```

## 4. Environment Matrix & Pipelines
| Environment | Purpose | Hosting | Branch Trigger | Deployment Steps |
| --- | --- | --- | --- | --- |
| **Local** | Developer iteration | Docker Compose, pnpm | Manual | `pnpm install`, `pnpm dev`, seeded database via Prisma migrations |
| **Preview** | Feature validation | Vercel Preview + Fly.io Ephemeral | Pull Requests | GitHub Action -> run lint/tests -> build -> deploy preview URLs (auto comment) |
| **Staging** | UAT, stakeholder demos | Vercel Production (staging project), Fly.io staging | `main` branch | CI runs full test suite, database migrations, smoke tests, notify Slack |
| **Production** | Live traffic | Vercel Production, Fly.io prod | Git tag `v*` | Manual approval -> CI -> infra checks -> deploy -> run synthetic monitoring |

### CI/CD Workflow Requirements
1. **Checks:** ESLint, TypeScript, unit tests (Vitest/Jest), Playwright e2e, Lighthouse CI, dependency audit.
2. **Artifacts:** Build outputs, Storybook static build, coverage reports.
3. **Gates:** Require successful checks + manual approval for production deployment.
4. **Tags:** Add `dx` label automatically when workflows touch `packages/config` or `.github` only.

## 5. CMS Phased Implementation (Strapi → Sanity)

### Phase 1 — Strapi Foundations (Self-Hosted)
1. **Provisioning:** Deploy Strapi in Docker Compose with PostgreSQL and object storage (S3-compatible) inside the project infra stack. Use infrastructure-as-code modules defined in `/infra/terraform/strapi`.
2. **Schema Design:** Model all catalog, storytelling, and editorial content types in Strapi using shared schema definitions stored in `/apps/cms/strapi/models`. Keep field names and locales aligned with the target Sanity schema to ease migration.
3. **Content Authoring:** Populate product, blog, landing, and asset entries directly within Strapi. Store media in the same S3 bucket planned for long-term use to preserve URLs.
4. **APIs & Webhooks:** Expose Strapi REST/GraphQL endpoints secured with API tokens. Configure webhooks that trigger Next.js ISR revalidation endpoints and content export jobs.
5. **Backups & Exports:** Schedule nightly exports of content as JSON/CSV plus asset manifests into `/backups/strapi` to maintain a migration-ready snapshot.

### Migration Bridge
1. **Schema Mapping:** Maintain a bi-directional mapping file at `/docs/cms/migration-map.json` that pairs Strapi content types/fields with their Sanity equivalents.
2. **Export Pipeline:** Create a script (`/packages/workflows/src/scripts/export-strapi.ts`) that pulls Strapi data via API, normalizes to the Sanity schema, and emits NDJSON files accepted by Sanity's import CLI.
3. **Validation:** Use Zod schema validation in the export pipeline to ensure data types, locales, and references conform to Sanity expectations before import.

### Phase 2 — Sanity SaaS Adoption
1. **Environment Setup:** Instantiate Sanity projects for staging and production, mirroring dataset names and access policies defined in the migration map.
2. **Data Import:** Run the export pipeline outputs through `sanity import` to seed initial datasets. Verify references, media links, and localized content.
3. **Editor Workflows:** Recreate editorial roles, review steps, and desk structure based on the Strapi configuration, storing GROQ-powered structures in `/apps/cms/sanity`.
4. **Decommission Plan:** Once Sanity is live, transition Strapi to read-only mode for 30 days while monitoring parity dashboards. After validation, archive Strapi backups and remove operational workloads.

## 6. Data, Secrets & Configuration Inputs Needed from Forestal MT
| Category | Required Items | Notes |
| --- | --- | --- |
| Branding | Final brand guidelines, typography, color palette, iconography, hi-res photography, approved copy blocks | Provide via shared drive with usage rights |
| Product Catalog | SKU list (46+), descriptions, ingredients, sourcing notes, pricing tiers (B2C/B2B/bulk), certifications, HS codes, inventory levels | Deliver as CSV/JSON; include translation variants |
| Compliance | Certificates (COA, MSDS), export licenses, privacy policy text, terms & conditions, indigenous partnership MOUs | Needed for legal pages and traceability features |
| Payments | Stripe account keys (test/live), PayPal client IDs, local bank integrations, refund policies | Share via secure secret manager (1Password, Vault) |
| Shipping | DHL API keys, local courier credentials, packaging dimensions, warehouse address, pickup schedules | Required for rate calculation and fulfillment | 
| Operations | ERP/CRM system details (if any), accounting export format, notification preferences, support email routing | Enables integration roadmap |
| Analytics | Tracking IDs (Plausible, Mixpanel), consent requirements | Configure via environment variables |
| Access Control | Admin user roster, RBAC matrix, SSO/IdP metadata | For admin portal and CMS |

## 7. Automation & Tooling Backlog
- **Infrastructure as Code:** Terraform modules for Vercel, Fly.io, Neon, Algolia, Sanity, Stripe webhooks, and S3 buckets.
- **Secrets Management:** GitHub OIDC + HashiCorp Vault or Doppler with environment-specific scopes.
- **Database Migration Pipelines:** Prisma or Drizzle migrations enforced via CI check.
- **Content Sync:** Scripts to pull Sanity content into static builds; webhooks to revalidate.
- **Monitoring:** OpenTelemetry collector deployment, alert routing to Opsgenie/Slack.
- **QA Automation:** Playwright suite covering hero flows (shop, cart, checkout, B2B wholesale request).
- **Documentation Automation:** Mintlify or Docusaurus site auto-deployed from `/apps/docs`.

## 8. Development Workflow Standards
1. **Branching:** `main` (protected), `develop` (integration), feature branches named `feat/...`, `fix/...`, `chore/...`.
2. **Commit Convention:** Conventional Commits enforced via Husky + Commitlint.
3. **Code Quality:** Prettier, ESLint, Stylelint, Knip (unused exports), dependency-review.
4. **Testing:** Vitest unit tests, Testing Library for React, Playwright e2e, schema contract tests with Pact.
5. **Accessibility:** Axe CI, manual WCAG 2.1 AA checklist pre-release.
6. **Localization:** i18n with Spanish (es-HN) default, English (en), French (fr) expansion-ready.
7. **Content Review:** CMS changes require editorial workflow with approval gates mirroring Git branching.

## 9. Roadmap & Milestones
| Phase | Duration | Deliverables |
| --- | --- | --- |
| **Phase 0: Discovery** | 2 weeks | Data gathering (Section 5), UX workshops, analytics requirements, success metrics baseline |
| **Phase 1: Foundations** | 4 weeks | Repo scaffold, CI/CD pipelines, infrastructure provisioning, CMS schema, initial components, Storybook |
| **Phase 2: Commerce Core** | 6 weeks | Product catalog, cart, checkout (Stripe test), account management, localization, search integration |
| **Phase 3: Content & Storytelling** | 3 weeks | Editorial pages, blog, traceability explorer, multimedia storytelling |
| **Phase 4: B2B Enhancements** | 4 weeks | Bulk ordering workflows, quote requests, wholesale pricing, CRM hooks |
| **Phase 5: Optimization** | Ongoing | A/B testing, performance tuning, additional payment rails, predictive analytics |

## 10. Outstanding Clarifications for Nery
1. Strapi hosting preference (self-managed VPS vs. Fly.io/AWS) and approval to allocate infrastructure budget for Phase 1 deployment.
2. Confirmation on target regions for currency/localization (USD, HNL, EUR?).
3. Requirements for loyalty programs, subscriptions, or memberships.
4. Existing ERP/CRM tools to integrate (e.g., Odoo, Zoho, HubSpot).
5. Policies for returns, refunds, and compliance disclosures needing automation.
6. Desired SLA for uptime/support to size monitoring & alerting investment.
7. Media asset storage preferences (cloud provider, CDN strategy) to finalize shared bucket usage across Strapi and Sanity.
8. Legal review process for terms/privacy updates.
9. Need for headless marketplace integrations (Amazon, Etsy, Faire).

## 11. Next Actions
1. Receive approvals/answers for Section 10 items.
2. Gather and ingest datasets/secrets from Section 5 via secure channels.
3. Lock architecture decisions (Section 2) and confirm hosting budgets.
4. Generate repository scaffold per Section 3 using Codex CLI (await instructions if automation required).
5. Provision baseline infrastructure via Terraform once secrets provided and installation approved.
6. Kick off Phase 0 discovery workshops (remote sessions) and confirm milestone schedule.

# Gap Analysis — Forestal MT Online Shop Repository

## Purpose
This document catalogs the gaps between the current state of the repository and the implementation targets outlined in the project blueprint. Use it as a checklist to prioritize scaffolding work and stakeholder follow-ups.

## Summary of Findings
- The repository currently contains only top-level documentation (`README.md` and `docs/project-blueprint.md`). No application code, configuration, or infrastructure assets exist yet.
- All structural elements described in the blueprint (Next.js apps, shared packages, backend services, infrastructure, and automation) are absent.
- Required operational assets—such as CI/CD workflows, environment configuration, and testing suites—are not present.
- Data inputs, secrets, and external integrations called out in the blueprint remain uncollected.

## Detailed Gap Inventory

### 1. Repository Structure vs. Target Scaffold
The blueprint specifies a monorepo layout with `apps/`, `packages/`, `services/`, `infra/`, and `.github/` directories, among others.【F:docs/project-blueprint.md†L31-L56】 None of these directories currently exist, leaving the implementation without a foundational scaffold.

**Action Needed:** Generate the monorepo skeleton (directories, package managers, baseline configuration files) to align with the architecture plan.

### 2. Application & Service Code
No frontend (Next.js), backend (NestJS/Fastify), or worker services are present despite being required for the target architecture.【F:docs/project-blueprint.md†L15-L28】

**Action Needed:** Implement initial application shells, including routing, API handlers, and worker queues per the blueprint.

### 3. Infrastructure as Code & DevOps Assets
Terraform modules, deployment manifests, and automation scripts referenced in the blueprint are missing from the repository.【F:docs/project-blueprint.md†L57-L75】【F:docs/project-blueprint.md†L115-L126】 Likewise, there are no GitHub Actions workflows or CI/CD configurations.

**Action Needed:** Introduce IaC directories, baseline Terraform modules, deployment scripts, and CI/CD pipeline definitions that satisfy the blueprint's automation backlog and workflow standards.

### 4. Testing & Quality Gates
The blueprint mandates comprehensive testing (unit, integration, e2e), linting, accessibility checks, and telemetry instrumentation.【F:docs/project-blueprint.md†L92-L109】【F:docs/project-blueprint.md†L127-L142】 None of these tools or configurations are currently implemented.

**Action Needed:** Add testing frameworks (Vitest, Playwright), linting configs (ESLint, Prettier, Stylelint), and monitoring scaffolding to enforce the required quality gates.

### 5. Content Management Migration Assets
Artifacts supporting the Strapi-to-Sanity migration—schemas, export scripts, and mapping files—are not yet available.【F:docs/project-blueprint.md†L58-L112】

**Action Needed:** Build the CMS directories (`/apps/cms/strapi`, `/apps/cms/sanity`), define schemas, and author the migration tooling described in the blueprint.

### 6. Data & Secret Intake
Critical data sets, credentials, and compliance documents listed in Section 6 of the blueprint have not been collected or referenced in the repository.【F:docs/project-blueprint.md†L113-L141】

**Action Needed:** Coordinate with stakeholders to ingest the required inputs and establish secure storage mechanisms (e.g., Vault, Doppler) before implementation proceeds.

### 7. Outstanding Clarifications & Next Steps
Open questions for stakeholders (Section 10) and preparatory actions (Section 11) remain unresolved within the repo.【F:docs/project-blueprint.md†L143-L179】 There is no tracking mechanism to ensure these dependencies are addressed.

**Action Needed:** Create an issue tracker or project board to manage stakeholder responses and operational next steps.

## Recommendations
1. **Initialize the Monorepo:** Set up the directory structure, package manager configuration (`npm`), and baseline TypeScript/Next.js projects.
2. **Establish CI/CD Early:** Implement GitHub Actions with linting, testing, and build steps to prevent regressions as code is introduced.
3. **Prioritize Data Intake:** Secure the datasets and credentials enumerated in the blueprint to unlock development of commerce, CMS, and integrations.
4. **Document Ownership:** Assign leads for each architectural area (frontend, backend, infra, CMS) to drive gap closure.

Maintaining this gap analysis as the project evolves will ensure alignment with the strategic blueprint and highlight any new deficiencies that surface.

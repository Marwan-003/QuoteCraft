# Implementation Plan: QuoteCraft Quote Calculator

**Branch**: `N/A` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-quote-calculator/spec.md`

## Summary

Build a single-page, front-end-only quote calculator **inside the existing Next.js project**. The
project already exists; extend it in place and do not run `create-next-app` or re-scaffold it. The
salesperson selects one project type (Landing page, Multi-page site, or E-commerce), adjusts Extra
pages and add-ons (SEO setup, Hosting setup, Bilingual), enters optional client and project names,
and sees a live EGP total with a line-by-line breakdown. The quote can be copied as text or
printed. The last quote is remembered on the same device. Bilingual is a service add-on for the
client's website; the quote stays in English. No backend, login, database, payments, PDF export,
or multiple saved quotes.

## Technical Context

**Language/Version**: TypeScript in strict mode; the Next.js App Router version already installed
in the existing project. Do not re-scaffold or change the app's existing setup.

**Primary Dependencies**: The dependencies already present in the existing project (Next.js,
React, Tailwind CSS) plus Vitest for tests. **No icon library** in the MVP; actions use text
labels only. This intentionally does not use `BRAND.md`'s lucide-react icon rule; that rule
applies only if icons are added later. No UI kit, animation library, state library, validation
library, database client, auth client, or payment library.

**Storage**: Browser localStorage; one versioned key; last quote only. No database.

**Testing**: Vitest; unit tests for pricing, copied text, and stored-quote validation. Pricing
tests are written and confirmed failing before pricing code. Before the first test file exists,
use `npx vitest run --passWithNoTests` so setup tasks can still pass the gate. Each test-first
task confirms the failure inside the task, then implements the module and ends with
`npx vitest run` passing before it is committed. Every committed task ends green.

**Target Platform**: Modern desktop and mobile browsers; 375px to desktop; keyboard-only use.

**Project Type**: Single front-end web application.

**Performance Goals**: Total and breakdown update within 1 second; a complete quote takes under
60 seconds.

**Constraints**: Front-end only; no login, database, payments, PDF export, or multiple saved
quotes; extend the existing project without re-scaffolding; remove the create-next-app Geist
fonts, dark-mode block, and Arial body fallback and replace them with the two `BRAND.md` fonts and
Paper/Ink tokens; use named typography tokens (`--text-total`, `--text-h1`, `--text-h2`,
`--text-h3`, `--text-body`, `--text-label`, `--text-small`); whole EGP with thousands separators
and **each computed line-item amount rounded to the nearest whole EGP before totaling**;
`BRAND.md` tokens; full accessibility baseline; no icon library (the MVP uses text labels only, so
`BRAND.md`'s lucide-react icon rule is not triggered); no unapproved packages; the fixed mobile
total bar is hidden in print styles; each finished task gets its own commit and ends green.

**Scale/Scope**: One page, one quote at a time, 3 project types, 4 add-ons.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Plan compliance |
|-----------|------|-----------------|
| I. Simple, readable code | Small components with one job; no premature abstraction | `QuoteCalculator` holds state; presentational components stay focused; no abstraction until three uses |
| II. Test-first pricing | Pricing is pure and tested before code | All pricing math lives in `lib/pricing.ts`; each line-item amount is rounded to the nearest whole EGP before totaling; tests are written first; no React inside |
| III. Spec is the source of truth | Every build item maps to the spec | Plan maps to FR-001–FR-023; no extra features; clarifications are recorded in the spec |
| IV. One brand | `BRAND.md` tokens and components only | Tailwind theme tokens from `BRAND.md`; no raw color, font, spacing, or size values in components; "Do Not" list enforced |
| V. Accessible by default | Labels, keyboard, focus, contrast, targets, motion | Native controls, visible labels, visible focus, 4.5:1 contrast, 44px targets, reduced-motion handling |
| VI. Small, verified steps | One task at a time; build and tests pass; separate commits | Tasks are implemented one at a time; each test-first task confirms the failure inside the task, then implements and ends green; `npm run build` and Vitest gate every committed task; `--passWithNoTests` applies only until the first test file exists; one commit per task |
| VII. Minimal dependencies and scope | Front-end only; no unapproved packages | Extend the existing project; no backend, auth, database, payments, PDF, or multi-quote; no icon library; dependencies limited to the approved stack |

**Result: PASS.** No violations and no complexity-tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/001-quote-calculator/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 validation guide
├── contracts/
│   └── ui.md            # UI and copy/print contract
└── tasks.md             # Task breakdown
```

### Source Code (repository root)

The Next.js project already exists. Add only the feature files below; do not run
`create-next-app`, overwrite the existing configuration, or re-scaffold the app.

```text
app/                     # existing Next.js App Router
├── layout.tsx           # existing; change only if needed
├── page.tsx             # render the calculator
└── globals.css          # add brand tokens and the print rules

components/              # feature components
├── QuoteCalculator.tsx  # Client state container
├── ProjectTypeSelector.tsx
├── AddOnControls.tsx
├── QuoteFields.tsx
├── QuoteSheet.tsx
└── QuoteActions.tsx

lib/                     # feature logic
├── types.ts
├── pricing.ts
├── pricing.test.ts
├── quote-text.ts
├── quote-text.test.ts
├── quote-storage.ts
└── quote-storage.test.ts
```

**Structure Decision**: Extend the existing Next.js App Router project in place with no backend
or API routes. `components/QuoteCalculator.tsx` owns the single quote state, loads storage behind
a hydrated flag, and never overwrites stored data with the initial empty quote.
`components/QuoteSheet.tsx` renders the optional client and project names, the project type, the
line items, and the total. `components/QuoteActions.tsx` owns both the copy action and the browser
print action. `lib/pricing.ts` owns all pricing math, including rounding each line-item amount to
the nearest whole EGP. `lib/quote-text.ts` builds the copied quote text. `lib/quote-storage.ts`
loads, validates, and saves the single quote in localStorage. Actions use text labels only, so no
icon library is added.

## Complexity Tracking

No constitution violations. No entries.

**Post-design re-check**: PASS. The design adds no backend, no extra dependencies, and no
features outside the specification.

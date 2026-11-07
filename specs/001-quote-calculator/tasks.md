# Tasks: QuoteCraft Quote Calculator

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

**Input**: Existing create-next-app project + `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/ui.md`, `quickstart.md`

## Execution Constraints

- The Next.js App Router project **already exists**. No task may run `create-next-app`, re-scaffold the app, replace its configuration, or delete existing files.
- Add **Vitest only** as a new package. Do not add jsdom, Testing Library, an icon library, a UI kit, an animation library, a state library, or any other dependency. The MVP uses text labels only and adds no icon library. `BRAND.md`'s lucide-react icon rule is intentionally not used in this release; it applies only if icons are added later.
- Add the Tailwind brand tokens from `BRAND.md` and load exactly two fonts with `next/font/google`: **Bricolage Grotesque** (700) and **IBM Plex Sans** (400, 500, 600). Remove the create-next-app Geist fonts, dark-mode block, and Arial body fallback.
- Pricing tests MUST be written and confirmed failing before `lib/pricing.ts` is implemented.
- Work one task at a time. T001 runs only `npm run build`; Vitest is installed in T002. For T002–T006, run `npx vitest run --passWithNoTests` because no test file exists yet. For every test-first task (T007, T014, T020), write the failing tests first, run `npx vitest run` and confirm the expected failure inside the task, then implement the module and run `npx vitest run` until green. From T007 onward, `npx vitest run` must pass at the end of every task. Run `npm run build` for every task. Then stop for owner review.
- A task is done only when its build passes, its applicable tests are green at the end of the task, and it is committed on its own. No committed task may end with failing tests.

**Repository check**: If `package.json`, `app/layout.tsx`, `app/page.tsx`, or `app/globals.css` is missing, stop and report. Do not scaffold or recreate the app.

---

## Phase 1: Setup

**Goal**: Prepare the existing app for the feature without changing its scaffold.

- [X] T001 Verify the existing create-next-app project by confirming `package.json`, `app/layout.tsx`, `app/page.tsx`, and `app/globals.css` exist. Record the installed Next.js, React, Tailwind, and TypeScript versions. Do not run `create-next-app` or scaffold anything. Run only `npm run build` in this task; Vitest is installed in T002. If a file is missing, stop. Commit the verification note.
- [X] T002 Add Vitest as the only new dependency: run `npm install --save-dev vitest`, add `"test": "vitest run"` to `package.json`, and update `package-lock.json`. Do not add jsdom, Testing Library, or any other package. Run `npm run build` and `npx vitest run --passWithNoTests`, then commit.
- [ ] T003 [P] Add the `BRAND.md` design tokens to `app/globals.css`: Paper `#F5F6F2`, Sheet `#FFFFFF`, Ink `#1A2238`, Graphite `#4A5368`, Pencil `#6B7385`, Lapis `#274690`, Highlighter `#FFD84D`, Red pencil `#B3261E`; `--radius-control: 6px`; `--radius-sheet: 2px`; and named typography tokens `--text-total: 49px` with line height `1.1`, `--text-h1: 39px` / `1.15`, `--text-h2: 25px` / `1.25`, `--text-h3: 20px` / `1.3`, `--text-body: 16px` / `1.6`, `--text-label: 16px` / `1.4`, and `--text-small: 14px` / `1.5`. Use the project's existing Tailwind version (v4 `@theme` when available) and preserve the existing Tailwind import. Do not invent colors, fonts, or sizes outside `BRAND.md`. Run `npm run build` and `npx vitest run --passWithNoTests`, then commit.
- [ ] T004 [P] Replace the create-next-app default fonts in `app/layout.tsx`: remove the `Geist` and `Geist_Mono` imports, their `--font-geist-sans` and `--font-geist-mono` variables, and their `<html>` classes. Configure only the two fonts with `next/font/google`: `Bricolage_Grotesque` weight `700` exposing `--font-bricolage`, and `IBM_Plex_Sans` weights `400`, `500`, `600` exposing `--font-plex`. Apply only the two new variable classes to the `<html>` element while keeping the existing `h-full antialiased` classes. Do not add a font package. Run `npm run build` and `npx vitest run --passWithNoTests`, then commit.
- [ ] T005 Replace the create-next-app defaults in `app/globals.css`: remove the `--background` and `--foreground` variables, the `@theme inline` Geist font mappings, the `prefers-color-scheme: dark` block, and the Arial body font. Then add base styles: map `--font-display: var(--font-bricolage), system-ui, sans-serif` and `--font-body: var(--font-plex), system-ui, sans-serif`; set the body to Paper background, Ink text, and `--font-body`; use tabular numbers for prices; use the 4/8/16/24/32 spacing scale; add a 2px Lapis `:focus-visible` outline with 2px offset; disable non-essential motion under `prefers-reduced-motion: reduce`. Run `npm run build` and `npx vitest run --passWithNoTests`, then commit.

---

## Phase 2: Foundational

**Goal**: Create shared types and a tested, pure pricing engine. This phase blocks every user story.

- [ ] T006 Create `lib/types.ts` with no React. Define `ProjectType` as `"landing" | "multi-page" | "e-commerce"`; `Quote` with `projectType: ProjectType | null`, `extraPages` (whole number, zero or more, no upper limit, forced to zero on Landing page), `seo`, `hosting`, `bilingual` (booleans defaulting to false), `clientName`, and `projectName` (optional text; blank or whitespace-only is omitted from output); `LineItem` with `label` and whole-EGP `amount`; `QuoteResult` with `lineItems` and `total`; and `EMPTY_QUOTE`. Run `npm run build` and `npx vitest run --passWithNoTests`, then commit.
- [ ] T007 **Pricing engine, test-first**: Write failing tests in `lib/pricing.test.ts` for base prices 8,000 / 15,000 / 35,000; Extra pages at 1,200 each including quantities above 5; zero Extra pages producing no line item; Landing page with a non-zero Extra pages value producing no Extra pages line item and a base-only total; SEO setup 3,000; Hosting setup 1,500; an empty project type producing 0 EGP and an empty breakdown; Bilingual at 25% of the base price only (2,000 / 3,750 / 8,750); Bilingual never applying to add-ons or Extra pages; base price first and Extra pages then add-ons then Bilingual in the line-item order; each line-item amount rounded to the nearest whole EGP before totaling; total equaling the sum of rounded line items; the Multi-page example totaling 25,650 EGP; and `formatEgp(25650)` returning `"25,650 EGP"`. Run `npx vitest run` and confirm the tests fail because `lib/pricing.ts` is missing. Then implement `lib/pricing.ts` as pure functions with no React: `calculateQuote(quote: Quote): QuoteResult` and `formatEgp(amount: number): string`. For a Landing-page quote with non-zero `extraPages`, ignore the extra-page quantity, emit no Extra pages line item, and total the base price only; the UI still prevents entry. Round every computed line-item amount with `Math.round` before adding it, sum the rounded line items for the total, and apply all rules exactly as written in `spec.md`. Run `npx vitest run` until every pricing test passes, run `npm run build`, and commit once. The task is not done while any test fails.

---

## Phase 3: User Story 1 — Build a quote from project type and add-ons (P1)

**Goal**: A salesperson selects one project type, adjusts Extra pages and add-ons, and sees a live total with a line-by-line breakdown.

**Independent Test**: Select each project type, change add-ons, and verify the total and breakdown using only the calculator. Do not use copy, print, or saved-quote behavior.

- [ ] T008 [P] [US1] Create `components/ProjectTypeSelector.tsx`: three radio rows for Landing page, Multi-page site (up to 5 pages), and E-commerce, each with a visible label and its price right-aligned. Exactly one choice is possible. No pricing math inside the component.
- [ ] T009 [P] [US1] Create `components/AddOnControls.tsx`: a labeled Extra pages number input accepting only whole numbers of zero or more with no upper limit; disable and reset it to zero on Landing page with the plain message "Extra pages aren't available for a landing page. Choose Multi-page site to add pages."; add labeled SEO setup, Hosting setup, and Bilingual (Arabic + English) checkboxes. Invalid entries keep the last valid value and show a plain message. No pricing math inside the component.
- [ ] T010 [P] [US1] Create `components/QuoteSheet.tsx`: render the optional client and project names and the selected project type; omit blank names. Render each line item with its label on the left and rounded amount right-aligned with tabular numbers; show the total using the `--text-total` typography token (49px/1.1) on the single Highlighter band; render the fixed bottom total bar for mobile layouts. Use tokens or shared classes from `app/globals.css`, never raw color, font, spacing, or size values in the component.
- [ ] T011 [US1] Create `components/QuoteCalculator.tsx` as a client component that owns one `Quote` state starting at `EMPTY_QUOTE`, derives `QuoteResult` with `calculateQuote`, updates immediately on every change, and resets `extraPages` to zero when Landing page is selected. Pass values and handlers to the presentational components. Do not add copy, print, or storage behavior in this task.
- [ ] T012 [US1] Update `app/page.tsx` to render `QuoteCalculator` on the single quote page. Keep the page server-safe and do not add routing, a backend, or API routes.
- [ ] T013 [US1] Apply the responsive layout in `app/page.tsx`, `components/QuoteCalculator.tsx`, and `components/QuoteSheet.tsx`: two columns on desktop with options on the left and a sticky quote sheet on the right; one column under 1024px with a fixed bottom total bar; no horizontal scrolling at 375px or 1280px.

**Checkpoint**: User Story 1 is independently usable: a live, correct quote exists before copy, print, or persistence.

---

## Phase 4: User Story 2 — Identify and share the quote (P2)

**Goal**: The salesperson adds optional client and project names, then copies the quote as text or prints a clean version.

**Independent Test**: Complete a quote, enter names, copy it, and print it. Confirm both outputs contain the same names, project type, charges, breakdown, and total.

- [ ] T014 [US2] **Quote-text builder, test-first**: Write failing tests in `lib/quote-text.test.ts` for the copied text: include the heading, project type, each selected charge, breakdown amounts, and total; include client and project names when provided; omit both name lines when blank or whitespace-only; omit Extra pages at zero; omit unselected add-ons; keep the quote in English; add no date, quote number, logo, or greeting. Run `npx vitest run` and confirm the tests fail because `lib/quote-text.ts` is missing. Then implement `lib/quote-text.ts` as a pure `buildQuoteText(quote: Quote, result: QuoteResult): string` with no React. Keep charge names and rounded amounts identical to `contracts/ui.md`. Run `npx vitest run` until the quote-text tests pass, run `npm run build`, and commit once.
- [ ] T015 [P] [US2] Create `components/QuoteFields.tsx`: visible labels and text inputs for Client name and Project name. Both are optional; blank or whitespace-only values are trimmed and omitted from output. Neither field blocks copy or print.
- [ ] T016 [P] [US2] Create `components/QuoteActions.tsx`: a primary text button "Copy quote as text" and a secondary text button "Print quote". Use text labels only, no icon library. Both buttons are disabled until a project type is chosen; names do not affect availability. Both meet the 44px minimum target.
- [ ] T017 [US2] Implement copy and print behavior in `components/QuoteActions.tsx`: call `buildQuoteText`, use `navigator.clipboard.writeText` when available, fall back to selecting and copying a temporary textarea, and show "Quote copied" on success. The Print quote button calls `window.print()` to open the browser print dialog. Show a plain recovery message on copy failure.
- [ ] T018 [P] [US2] Add print styles to `app/globals.css`: hide the options panel and action buttons, explicitly hide the fixed mobile total bar, keep the quote sheet with names, project type, line items, and total, and allow long quotes to span pages without losing the total.
- [ ] T019 [US2] Wire `QuoteFields` and `QuoteActions` into `components/QuoteCalculator.tsx` and `app/page.tsx`. Keep one primary action, preserve the live total, and ensure copy and print become available only after a project type is chosen.

**Checkpoint**: User Stories 1 and 2 work together: the quote can be identified and shared with the same amounts shown on screen.

---

## Phase 5: User Story 3 — Keep the last quote after a refresh (P3)

**Goal**: A page refresh restores the most recent quote instead of losing it.

**Independent Test**: Build a quote with names and several options, refresh the page, and compare every selection, name, line item, and total.

- [ ] T020 [US3] **Quote storage, test-first**: Write failing tests in `lib/quote-storage.test.ts` using a small in-memory Storage-like object, with no jsdom: save under `quotecraft.quote.v1` with `version: 1`; load a valid quote; accept `projectType: null` as a valid empty quote; return no quote when the key is missing; reject malformed JSON, a wrong version, a non-null invalid project type, a negative or fractional `extraPages`, non-boolean add-ons, and names that are present but not strings; accept missing or empty `clientName` and `projectName` as empty strings; normalize a Landing-page quote with non-zero `extraPages` to zero; persist only one quote; and assert `saveQuote` stores only the quote inputs, never line items or totals. Run `npx vitest run` and confirm the tests fail because `lib/quote-storage.ts` is missing. Then implement `lib/quote-storage.ts` as pure functions with no React: `loadQuote(storage)` returns `Quote | null` after validation, and `saveQuote(storage, quote)` writes only the quote inputs, never line items or totals. Run `npx vitest run` until the storage tests pass, run `npm run build`, and commit once.
- [ ] T021 [US3] Wire persistence into `components/QuoteCalculator.tsx`: load after mount behind a hydrated flag to avoid server/client mismatch; save only after hydration completes so the initial empty quote never overwrites stored data; validate the stored shape; save after every accepted change; replace the remembered quote on each edit. There is no save button and no separate "new quote" action.
- [ ] T022 [US3] Handle missing, unreadable, or throwing storage in `lib/quote-storage.ts` and `components/QuoteCalculator.tsx`: start from `EMPTY_QUOTE` with no error message, including when localStorage is unavailable.
- [ ] T023 [US3] Verify restored quotes in `components/QuoteCalculator.tsx`: selections, names, and total return; line items are recalculated from the current pricing rules; editing the restored quote replaces the remembered one.

**Checkpoint**: All three user stories work independently and together; refreshing restores the last quote without a save action.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Verify the whole feature against the constitution, contract, and quickstart.

- [ ] T024 Run `npm run build`, `npx vitest run`, and `npm run lint` from the repository root. Fix only failures caused by files touched in this feature. Do not weaken tests to make them pass.
- [ ] T025 Audit accessibility across `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, and `components/`: every input has a visible label, every control is keyboard operable, focus is always visible, text contrast is at least 4.5:1, touch targets are at least 44px, and reduced-motion removes non-essential motion. Fix any gaps.
- [ ] T026 Audit responsive and print behavior at 375px and 1280px in `app/page.tsx`, `components/QuoteCalculator.tsx`, `components/QuoteSheet.tsx`, and `app/globals.css`: no horizontal scrolling, the mobile total bar is fixed and visible on screen, the desktop quote sheet is sticky, and print hides the options panel, actions, and fixed mobile total bar.
- [ ] T027 Audit brand compliance across `app/globals.css` and `components/`: only BRAND.md tokens, no raw hex values in components, exactly the two fonts, Highlighter only behind the total, sentence case, and copy matching `BRAND.md`. Confirm no icon library or `lucide-react` dependency exists.
- [ ] T028 Audit `package.json` and `package-lock.json`: Vitest is the only new package, and there is no icon library, UI kit, animation library, state library, validation library, database client, or auth client. Remove any unapproved addition before finishing.
- [ ] T029 Run every manual scenario in `quickstart.md` (1–19), including whole-EGP rounding and text-only actions. Record pass or fail for each scenario and fix any failure in the feature files that caused it.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** has no dependencies. T001 comes first and runs build only; T002 comes before all test tasks; T003 and T004 can run in parallel; T005 follows T003 and T004. T002–T006 use `npx vitest run --passWithNoTests`.
- **Phase 2 (Foundational)** depends on Phase 1. T006 precedes T007. T007 writes the failing pricing tests, confirms the failure, then implements and ends green.
- **Phase 3 (US1)** depends on T005 and T007. T008, T009, and T010 can run in parallel; T011 depends on T008–T010; T012 depends on T011; T013 depends on T011 and T012.
- **Phase 4 (US2)** depends on T007 and the US1 shell. T014 depends on T006 and T007; T015, T016, and T018 can run in parallel after T014; T017 depends on T014 and T016; T019 depends on T011 and T014–T018.
- **Phase 5 (US3)** depends on T006 and T011. T020 depends on T006; T021–T023 follow T020 and T011.
- **Phase 6 (Polish)** depends on all story phases.

### User Story Dependencies

- **US1 (P1)** is the MVP and depends only on Setup and Foundational.
- **US2 (P2)** depends on US1 for the shared quote state and display, plus the pricing and quote-text modules.
- **US3 (P3)** depends on US1 for the quote state and on the storage module; it can be built after US1 without US2.

### Within Each User Story

- Tests and implementation are one task where test-first is required: T007 (pricing), T014 (quote-text), T020 (storage). Each confirms the failure inside the task, then implements and ends green.
- Presentational components before the state container that wires them.
- State container before page integration.
- Story checkpoint must pass before moving to the next priority.

---

## Parallel Execution Examples

### Setup

```text
Task: "Add BRAND.md design tokens to app/globals.css"
Task: "Configure Bricolage Grotesque and IBM Plex Sans in app/layout.tsx"
```

### User Story 1

```text
Task: "Create components/ProjectTypeSelector.tsx"
Task: "Create components/AddOnControls.tsx"
Task: "Create components/QuoteSheet.tsx"
```

### User Story 2

```text
Task: "Create components/QuoteFields.tsx"
Task: "Create components/QuoteActions.tsx"
Task: "Add print styles to app/globals.css"
```

### User Story 3

No parallel tasks: storage tests, implementation, wiring, and verification share one dependency chain.

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 (T001–T005).
2. Complete Phase 2 (T006–T007), proving pricing with tests before code inside T007.
3. Complete Phase 3 (T008–T013), giving a working live calculator.
4. Stop and review the MVP before adding sharing or persistence.

### Incremental Delivery

1. **MVP**: US1 — live quote, breakdown, responsive layout.
2. **Share**: US2 — names, copied text, print view.
3. **Restore**: US3 — last quote after refresh.
4. **Polish**: accessibility, responsive, brand, dependency, and quickstart audits.

Do not start Phase 3 until the pricing task (T007) is green and committed. Do not add copy, print, or storage before the live quote is correct. Commit each task before moving on. Use `npx vitest run --passWithNoTests` only for T002–T006; from T007 onward the tests must pass.

---

## Format Validation

- Every task starts with `- [ ]`.
- Every task has a sequential ID from T001 to T029.
- `[P]` appears only on tasks that touch different files and have no incomplete dependency.
- `[US1]`, `[US2]`, and `[US3]` appear only in user-story phases.
- Setup, Foundational, and Polish tasks have no story label.
- Every task names an exact file path or the command it runs.
- Every task has the per-task commit requirement stated in Execution Constraints.
- T001 runs build only; T002–T006 use `--passWithNoTests`; T007, T014, and T020 confirm the failure inside the task and must end green.
- No committed task is allowed to end with failing tests.

# Phase 0 Research: QuoteCraft Quote Calculator

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No `NEEDS CLARIFICATION` items remain. The technical context is fixed by `AGENTS.md`,
`BRAND.md`, the PRD, and the clarifications recorded in the spec.

## 1. Application Shape

- **Decision**: Extend the existing Next.js App Router project in place with one page and a
  client-side state container. Do not run `create-next-app` or re-scaffold the project.
- **Rationale**: The project already exists, so the feature adds files to it without disturbing
  the existing setup. The product is a single screen with no backend. A client component can hold
  the quote, recalculate immediately, and persist to localStorage without server round trips.
- **Alternatives considered**: Re-scaffolding a new app (rejected: the project already exists and
  re-scaffolding would discard its setup); a separate backend (rejected: out of scope); a
  multi-page wizard (rejected: adds steps to a tool that must finish a quote in under a minute).

## 2. Pricing Engine

- **Decision**: Put every pricing rule in `lib/pricing.ts` as pure functions returning line items
  and a total. Every computed line-item amount is rounded to the nearest whole EGP, and the total
  is the sum of those rounded line items.
- **Rationale**: Pure functions are easy to test first and keep pricing out of components. The
  rules are small and fixed: base price, extra pages, fixed add-ons, and a base-only percentage.
  Rounding each line item before totaling guarantees the displayed lines add up to the displayed
  total.
- **Alternatives considered**: Calculating inside components (rejected: violates the
  constitution); a pricing configuration service (rejected: unnecessary for three fixed types);
  rounding only the final total (rejected: displayed lines would not sum to the total).

## 3. Pricing Calculation Details

- **Decision**: Calculate the Bilingual surcharge as `basePrice * 0.25`, round it to the nearest
  whole EGP, then include the rounded amount as a line item. Calculate Extra pages as
  `1,200 * extraPages`. Base prices and fixed add-on prices are already whole. Round every
  computed line-item amount to the nearest whole EGP before summing, so the total equals the sum
  of the displayed rounded lines.
- **Rationale**: The current base prices produce whole-EGP surcharges, and rounding each line
  item keeps displayed lines consistent with the total if placeholder prices change.
- **Alternatives considered**: Floating-point display with decimals (rejected: the product shows
  whole EGP); rounding only the final total (rejected: line items would not add up); adding the
  surcharge to each add-on (rejected: the rule says base only).

## 4. Quote and Add-On Model

- **Decision**: Model the quote with one nullable project type, a non-negative integer extra-page
  count, three boolean add-ons, and two optional name strings. Derive line items and total from
  that input.
- **Rationale**: The model matches the screen and makes persistence and validation simple. There
  is one quote at a time and no identity or list behavior.
- **Alternatives considered**: A generic product catalogue (rejected: three fixed types); storing
  derived totals as source data (rejected: totals should follow the rules).

## 5. Persistence

- **Decision**: Save the quote inputs to localStorage under one versioned key on every change.
  Load after mount, validate the stored shape, and fall back to an empty quote when data is
  missing or invalid. Do not save until load completes, so the initial empty quote cannot
  overwrite the stored quote. Normalize a loaded Landing-page quote by setting Extra pages to
  zero.
- **Rationale**: The spec requires the last quote to survive a refresh on the same device, with
  no separate save action. Loading after mount avoids server/client rendering mismatches, and the
  hydration guard protects the stored quote.
- **Alternatives considered**: Cookies or a backend (rejected: no backend and no account); a
  saved-quote list (explicitly out of scope).

## 6. Copied Text

- **Decision**: Generate the copied text with a pure function in `lib/quote-text.ts`. Include the
  quote heading, optional names, project type, each selected charge, and the total. Omit blank
  names and unselected charges.
- **Rationale**: A pure text builder is testable without UI tooling and keeps the copy format
  consistent with the printed quote.
- **Alternatives considered**: Building the text inside the click handler (rejected: harder to
  test); using a third-party formatting library (rejected: unnecessary dependency).

## 7. Clipboard Behavior

- **Decision**: Use the Clipboard API when available, with a small fallback that selects a
  temporary text area and copies it. Show "Quote copied" on success and a plain recovery message
  on failure.
- **Rationale**: Copying is the primary sharing action and must work in the browsers the sales
  team uses without adding a library.
- **Alternatives considered**: A copy library (rejected: unnecessary dependency); requiring the
  user to select text manually (rejected: worse primary flow).

## 8. Print Behavior

- **Decision**: Use a print stylesheet that hides the form, actions, and the fixed mobile total
  bar, and prints the quote sheet with names, line items, and total intact. The fixed mobile total
  bar must explicitly carry the print-hidden rule, even though it is only visible at phone widths.
- **Rationale**: The spec requires a print-friendly view without adding PDF export. CSS print
  styles are the smallest solution, and explicitly hiding the fixed bar prevents it from appearing
  in print output at narrow print widths.
- **Alternatives considered**: A PDF library (explicitly out of scope); a second printable page
  (rejected: unnecessary duplication); relying on responsive hiding alone (rejected: the fixed bar
  could still print at narrow page widths).

## 9. Accessibility

- **Decision**: Use native radio buttons, checkboxes, number input, and text inputs with visible
  labels. Keep a visible focus ring, 4.5:1 text contrast, 44px minimum touch targets, and disable
  non-essential motion when reduced motion is requested.
- **Rationale**: Native controls provide keyboard and screen-reader behavior without extra code.
  The constitution and `BRAND.md` require the full baseline.
- **Alternatives considered**: Custom div-based controls (rejected: more code and more
  accessibility risk); adding an accessibility library (rejected: native controls suffice).

## 10. Styling and Layout

- **Decision**: Replace the create-next-app Geist fonts, `--font-geist-*` theme mappings,
  dark-mode block, and Arial body fallback. Use Tailwind CSS theme tokens defined in
  `app/globals.css` from `BRAND.md`, including named typography tokens (`--text-total`,
  `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-label`, `--text-small`). Use a
  two-column desktop layout with a sticky quote sheet and a single-column mobile layout with a
  fixed bottom total bar. Add an explicit print rule that hides the fixed mobile total bar.
- **Rationale**: The brand guide supplies the tokens and layout. Replacing the starter defaults
  keeps the app at exactly two font families and the Paper/Ink palette. The explicit print rule
  satisfies the print requirement.
- **Alternatives considered**: A UI kit (forbidden by `AGENTS.md`); a custom CSS system
  (rejected: duplicates the provided Tailwind tokens); relying on viewport styles for print
  (rejected: print width does not follow the mobile breakpoint reliably).

## 11. Dependencies

- **Decision**: Use the dependencies already installed in the existing project (Next.js, React,
  Tailwind CSS) plus Vitest. Do not add an icon library for the MVP. Actions use text labels only.
  Do not add a state library, validation library, UI kit, animation
  library, database client, or auth client.
- **Rationale**: The feature is small enough for built-in React state and plain TypeScript
  validation. The approved stack already covers the build and styling, and text labels remove any
  need for icons.
- **Alternatives considered**: An icon library (rejected for the MVP: text labels communicate the
  actions without another dependency); Zustand or Redux (rejected: one quote does not need a
  store); Zod (rejected: a small type guard is enough); a UI kit
  (forbidden).

## 12. Validation and Error Handling

- **Decision**: Accept Extra pages as a whole number of zero or more. Keep the last valid value
  when an entry is invalid and show a plain message. Disable Extra pages on Landing page and
  explain why. If a Landing-page quote reaches pricing with a non-zero quantity, ignore the
  quantity, emit no Extra pages line item, and return the base price only. Treat invalid saved
  data as an empty quote with no error.
- **Rationale**: These behaviors match the spec's edge cases and keep the quote usable during a
  live client call.
- **Alternatives considered**: Rejecting the whole quote on one invalid field (rejected: too
  disruptive); silently accepting invalid values (rejected: wrong totals).

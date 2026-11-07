# UI Contract: QuoteCraft Quote Calculator

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

This contract describes what the salesperson sees and gets from the quote screen. It is the
external interface for this feature; there are no network or service contracts.

## Screen Regions

1. **Options panel**
   - Project type choice: Landing page, Multi-page site (up to 5 pages), E-commerce.
   - Extra pages number input.
   - SEO setup, Hosting setup, and Bilingual (Arabic + English) checkboxes.
2. **Quote details**
   - Client name input.
   - Project name input.
3. **Quote sheet**
   - Optional client and project names.
   - Project type.
   - Line-by-line breakdown.
   - Total, visually emphasized.
4. **Actions**
   - Primary: "Copy quote as text".
   - Secondary: print action.
   - Actions use text labels only; no icon library is used.
5. **Mobile total bar**
   - Fixed to the bottom of the screen on phone-sized layouts; always shows the current total.
   - Hidden by an explicit print rule, not only by the mobile breakpoint.

## Input Behavior

| Input | Behavior |
|-------|----------|
| Project type | Exactly one choice; choosing a type enables the quote |
| Extra pages | Whole number, zero or more, no upper limit; disabled and reset to zero on Landing page; invalid entries keep the last valid total and show a plain message |
| SEO setup | Independent on/off choice |
| Hosting setup | Independent on/off choice |
| Bilingual | Independent on/off choice; adds 25% of the project base price only, rounded to the nearest whole EGP; does not translate the quote |
| Client name | Optional free text; blank is omitted from output |
| Project name | Optional free text; blank is omitted from output |

## Display Contract

- The total is shown in EGP with thousands separators, for example `25,650 EGP`.
- The quote sheet shows the optional client and project names and the selected project type when
  provided; blank names are omitted.
- Each computed line-item amount is rounded to the nearest whole EGP before it is displayed.
- The breakdown shows the base price first, then Extra pages when greater than zero, then each
  selected add-on, then the Bilingual surcharge when selected, then the total.
- Every displayed total equals the sum of the displayed rounded line items.
- The total updates immediately after any option, quantity, or name change.
- No separate save or submit action exists.
- The quote stays in English; Bilingual describes the client's website.
- Actions are text-labeled buttons; no icon library is used.

## States

| State | What the salesperson sees |
|-------|---------------------------|
| Empty | "Choose a project type to start your quote." Total shows 0 EGP; breakdown is empty; copy and print are unavailable |
| Draft | Live breakdown and total; copy and print available |
| Restored | Same selections, names, and total as before the refresh |
| Invalid saved data | Fresh empty quote; no error message |
| Invalid Extra pages | Last valid total remains; plain message explains that a whole number of zero or more is required |
| Landing page with Extra pages | Extra pages unavailable; plain message explains that extra pages are not available for a landing page |
| Copied | "Quote copied" confirmation |
| Copy failure | Plain message explaining the copy did not work and how to copy manually |

## Copied Text Contract

The copied text is plain text. Blank names and unselected charges are omitted.

```text
QuoteCraft
Client: Acme
Project: Website redesign
Project type: Multi-page site (up to 5 pages)
Extra pages: 2 x 1,200 EGP = 2,400 EGP
SEO setup: 3,000 EGP
Hosting setup: 1,500 EGP
Bilingual (Arabic + English): 3,750 EGP
Total: 25,650 EGP
```

Rules:

- Include the quote heading, optional names, project type, every selected charge, and the total.
- Omit the Client and Project lines when those names are blank.
- Omit Extra pages when the quantity is zero.
- Omit unselected add-ons.
- Keep the same charge names and amounts as the on-screen breakdown.
- Do not add a date, quote number, logo, or greeting that is not in the specification.

## Print Contract

- Printing shows the quote sheet with the optional names, project type, every selected charge,
  and the total.
- The print action opens the browser's print dialog; it does not export a PDF.
- The options panel and action buttons are hidden in print.
- The fixed mobile total bar is explicitly hidden in print styles, so it does not appear at
  narrow print widths.
- A quote with many items may span pages; every line item and the total still appear.
- The printed quote uses the same rounded charge amounts as the screen.
- PDF export is out of scope; the browser's print action is the supported sharing path.

## Accessibility Contract

- Every input has a visible label.
- The full quote can be completed, copied, and printed with the keyboard alone.
- Every interactive control shows a visible focus ring.
- Text contrast is at least 4.5:1.
- Touch targets are at least 44px.
- Reduced-motion settings remove non-essential motion, including the total cross-fade.
- Meaning is never conveyed by color alone; errors include text.

## Responsive Contract

- Desktop: two columns; options on the left, quote sheet on the right, sticky at the top.
- Mobile: one column; the total sits in a bar fixed to the bottom of the screen.
- The quote remains usable at phone width and desktop width without horizontal scrolling.
- Content is grouped with dividers and spacing, not a grid of identical cards.
- The fixed mobile total bar is hidden in print styles regardless of viewport.

## Boundaries

- No login, account, database, payments, PDF export, or multiple saved quotes.
- No separate "new quote" action; editing the current quote replaces the remembered one.
- No quote history or quote list.
- The quote language stays English even when Bilingual is selected as a service add-on.

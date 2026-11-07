# QuoteCraft - PRD

## Problem
Agency staff quote website prices by hand in chat. It's slow and prices are inconsistent.

## Goal
A web page where you pick a project type and add-ons and instantly get a clear price quote in EGP that you can copy or print.

## Users
Me and my teammates at the agency (non-technical sales people included).

## MVP features
1. Choose ONE project type: Landing page, Multi-page site (up to 5 pages), E-commerce.
2. Choose add-ons: Extra pages (number input), SEO setup, Hosting setup, Bilingual (Arabic + English).
3. Live total that updates on every change, with a line-by-line breakdown.
4. Client name + project name fields shown on the quote.
5. "Copy quote as text" button and a print-friendly view.
6. Last quote saved in the browser (localStorage) so a refresh doesn't lose it.

## Pricing rules (placeholder numbers, I can change them)
- Landing page 8,000 / Multi-page 15,000 / E-commerce 35,000
- Extra page 1,200 each (not allowed on Landing page)
- SEO setup 3,000 / Hosting setup 1,500
- Bilingual adds +25% on the project base price only (not on add-ons)

## Non-goals (do NOT build)
Login, database, payments, PDF export, multiple saved quotes.

## Tech
Next.js, Tailwind, Vitest for tests. Pricing logic lives in one pure file: lib/pricing.ts

## Acceptance criteria
- Changing any option updates the total instantly.
- Pricing function has unit tests covering every rule above.
- Works on mobile and desktop, keyboard accessible.
- No console errors, builds with `npm run build`.

## Done means
Deployed on Vercel, README written, all tests passing.
# Quickstart Validation: QuoteCraft Quote Calculator

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Contract**: [contracts/ui.md](./contracts/ui.md)

This guide proves the feature works end to end after implementation. It contains no
implementation code.

## Prerequisites

- Node.js and npm installed.
- The existing Next.js project present in the repository. Extend it in place; do not run
  `create-next-app` or re-scaffold it.
- The repository dependencies installed.
- The app running locally.
- A modern browser with a print preview.

## Commands

Run these from the repository root:

```text
npm install
npm run dev
npm run build
npx vitest run
npm run lint
```

The app opens at `http://localhost:3000`.

## Validation Scenarios

### 1. Empty state

1. Open the app with no saved quote.
2. Check the initial screen.

**Expected**: The prompt "Choose a project type to start your quote." is visible. The total is
0 EGP, the breakdown is empty, and copy and print are unavailable.

### 2. Landing page

1. Choose Landing page.
2. Try to use Extra pages.

**Expected**: The total is 8,000 EGP. Extra pages is unavailable and a plain message says extra
pages are not available for a landing page. No extra-page charge appears.

### 3. Multi-page with add-ons

1. Choose Multi-page.
2. Enter 2 extra pages.
3. Turn on SEO setup, Hosting setup, and Bilingual.

**Expected**: The breakdown shows 15,000 + 2,400 + 3,000 + 1,500 + 3,750 EGP and the total is
25,650 EGP. The quote stays in English.

### 4. E-commerce with Bilingual

1. Choose E-commerce.
2. Turn on Bilingual.

**Expected**: The Bilingual charge is 8,750 EGP and the total is 43,750 EGP. No add-on amount
changes.

### 5. E-commerce with all add-ons

1. Choose E-commerce.
2. Turn on SEO setup, Hosting setup, and Bilingual.

**Expected**: The total is 35,000 + 3,000 + 1,500 + 8,750 = 48,250 EGP.

### 6. Copy the quote

1. Enter client name "Acme" and project name "Website redesign".
2. Complete a quote.
3. Choose "Copy quote as text".
4. Paste the copied text into a plain-text editor.

**Expected**: The quote sheet shows both names and the project type. The text contains both names,
the project type, every selected charge, and the total. The confirmation says "Quote copied".
Blank names and unselected charges are omitted.

### 7. Copy with blank names

1. Leave the client and project names blank.
2. Complete a quote.
3. Copy it.

**Expected**: The quote copies successfully. No empty Client or Project labels appear.

### 8. Print the quote

1. Complete a quote.
2. Open the print action and preview the output.

**Expected**: The preview shows the quote sheet with the names, project type, line items, and
total. The options panel and action buttons are hidden, and the fixed mobile total bar is
explicitly hidden in the print styles even when the print width is narrow.

### 9. Refresh and restore

1. Complete a quote with names and several options.
2. Refresh the page.

**Expected**: The same selections, names, and total return.

### 10. Unreadable saved quote

1. Complete a quote.
2. Make the saved data invalid in the browser's storage tools.
3. Refresh.

**Expected**: A fresh empty quote appears without an error message.

### 11. Invalid Extra pages

1. Choose Multi-page.
2. Enter a valid number of extra pages, then try a blank, negative, fractional, or non-numeric
   value.

**Expected**: The last valid total remains. A plain message says to enter a whole number of pages,
zero or more.

### 12. Extra pages above 5

1. Choose Multi-page or E-commerce.
2. Enter 6 or more extra pages.

**Expected**: The quantity is accepted and charged at 1,200 per page. No cap message appears.

### 13. New quote behavior

1. Restore a previous quote.
2. Change the project type or any option.

**Expected**: The edited quote replaces the remembered one. There is no separate "new quote"
action.

### 14. Keyboard-only use

1. Start from the top of the page.
2. Use Tab and keyboard controls to choose a project type, change options, enter names, copy, and
   print.

**Expected**: Every control is reachable, focus is always visible, and no pointer is needed.

### 15. Responsive behavior

1. Check the quote at 375px wide.
2. Check it at desktop width (1280px).

**Expected**: The mobile layout uses one column with a fixed bottom total bar. The desktop layout
uses two columns with a sticky quote sheet. No horizontal scrolling or lost controls.

### 16. Accessibility baseline

1. Check every input for a visible label.
2. Check text contrast at 4.5:1 or better.
3. Check touch targets at 44px or larger.
4. Turn on reduced motion and change an option.

**Expected**: Labels are visible, contrast passes, targets are large enough, and the total updates
without non-essential motion.

### 17. Build and test gate

1. Run `npm run build`.
2. Run `npx vitest run`.
3. Run `npm run lint`.

**Expected**: All three pass with no errors.

### 18. Whole-EGP rounding

1. Complete quotes for each project type and confirm each line-item amount.
2. Check the Bilingual surcharge for each base price.
3. Add the displayed line items and compare the sum with the displayed total.

**Expected**: Every line-item amount is a whole number of EGP rounded to the nearest whole EGP.
The Bilingual surcharge is 2,000 EGP for Landing page, 3,750 EGP for Multi-page, and 8,750 EGP for
E-commerce. The displayed line items sum exactly to the displayed total, with no decimals.

### 19. Text-only actions

1. Inspect both the copy and print actions.
2. Check the installed dependencies.

**Expected**: Both actions use visible text labels. No icon library is present or used in the MVP.

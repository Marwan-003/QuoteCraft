# Phase 1 Data Model: QuoteCraft Quote Calculator

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

The product holds one quote at a time. The quote stores the salesperson's inputs; line items and
the total are derived from those inputs using the fixed pricing rules. There is no account,
database, quote list, or quote identity beyond the current quote.

## Entities

### Quote

| Field | Type | Rules |
|-------|------|-------|
| `projectType` | `landing`, `multi-page`, `e-commerce`, or empty | Exactly one when chosen; empty on first load and after unreadable saved data |
| `extraPages` | Whole number | Zero or more; no upper limit; forced to zero when `projectType` is `landing` |
| `seo` | Boolean | Default false |
| `hosting` | Boolean | Default false |
| `bilingual` | Boolean | Default false; describes the client's website, not the quote language |
| `clientName` | Text | Optional; blank or whitespace-only is omitted from the quote output |
| `projectName` | Text | Optional; blank or whitespace-only is omitted from the quote output |

### Project Type

| Value | Display label | Base price (EGP) |
|-------|---------------|------------------|
| `landing` | Landing page | 8,000 |
| `multi-page` | Multi-page site (up to 5 pages) | 15,000 |
| `e-commerce` | E-commerce | 35,000 |

### Add-On

| Add-on | Charge rule | Allowed project types |
|--------|-------------|-----------------------|
| Extra pages | 1,200 per page | Multi-page and E-commerce; not Landing page |
| SEO setup | 3,000 | All project types |
| Hosting setup | 1,500 | All project types |
| Bilingual (Arabic + English) | 25% of the project base price only, rounded to the nearest whole EGP | All project types |

### Line Item

| Field | Type | Rules |
|-------|------|-------|
| `label` | Text | Plain-language label shown in the breakdown and copied quote |
| `amount` | Whole EGP | Non-negative; each computed amount is rounded to the nearest whole EGP before it is stored on the line item |

### Quote Result

| Field | Type | Rules |
|-------|------|-------|
| `lineItems` | List of line items | Base price first; then Extra pages when greater than zero; then selected add-ons; then the Bilingual surcharge when selected |
| `total` | Whole EGP | Equal to the sum of all rounded line-item amounts |

## Relationships

- One **Quote** has one optional **Project Type**.
- One **Quote** has zero or more **Add-Ons**.
- One **Quote** produces many **Line Items** and one **Quote Result**.
- There is no relationship to a user, account, customer record, or saved-quote collection.

## Validation Rules

- A project type is required before copy or print is available.
- Extra pages must be a whole number of zero or more; invalid input does not change the last
  valid total.
- Selecting Landing page resets Extra pages to zero and removes its charge.
- If a Landing-page quote reaches pricing with a non-zero `extraPages` value, `calculateQuote` ignores the extra-page quantity, emits no Extra pages line item, and returns the Landing page base price only.
- Extra pages is accepted on Multi-page and E-commerce with no upper limit.
- Bilingual adds 25% of the base price only; it is never applied to add-ons or Extra pages. The
  Bilingual charge is rounded to the nearest whole EGP.
- Every computed line-item amount is rounded to the nearest whole EGP before totaling, so the
  displayed lines always sum to the displayed total.
- The total always equals the sum of the displayed rounded line items.
- Client and project names are optional and do not block copy or print.
- Amounts are whole EGP and display with thousands separators.

## State Transitions

| State | Trigger | Result |
|-------|---------|--------|
| Empty | First visit; no saved quote; unreadable saved quote | Total 0 EGP, empty breakdown, copy and print unavailable |
| Draft | Salesperson chooses a project type | Line items and total calculate live; copy and print become available |
| Edited | Any option, quantity, or name change | Single current quote updates and is saved; remembered quote is replaced |
| Restored | Valid saved quote is found on load | Same selections and names return; total recalculates from the fixed rules |
| Invalid saved data | Stored shape or values fail validation | Empty quote; no error shown |

There is no separate "new quote" state or action. Editing the current quote is how a new quote
replaces the remembered one.

## Persistence Shape

Stored under one versioned key, `quotecraft.quote.v1`. The stored value contains the quote inputs,
not the derived line items or total.

```json
{
  "version": 1,
  "quote": {
    "projectType": "multi-page",
    "extraPages": 2,
    "seo": true,
    "hosting": true,
    "bilingual": true,
    "clientName": "Acme",
    "projectName": "Website redesign"
  }
}
```

### Persistence Rules

- Save after every accepted change; there is no separate save action.
- Do not save until the stored quote has loaded; never let the initial empty quote overwrite existing stored data.
- Load after mount to avoid server/client rendering differences.
- Normalize a loaded Landing-page quote by setting `extraPages` to zero before rendering.
- Validate the version, project type, extra-page quantity, booleans, and name types.
- Recompute line items and total from the fixed pricing rules on load.
- If any stored value is invalid, discard the stored quote and start empty without an error.
- Persist only the last quote; never store a list of quotes.

## Example Derived Result

For Multi-page with 2 extra pages, SEO setup, Hosting setup, and Bilingual (every amount below is
already rounded to the nearest whole EGP):

| Line item | Amount (EGP) |
|-----------|--------------|
| Multi-page site | 15,000 |
| Extra pages (2 x 1,200) | 2,400 |
| SEO setup | 3,000 |
| Hosting setup | 1,500 |
| Bilingual (25% of 15,000) | 3,750 |
| **Total** | **25,650** |

// Pricing engine for QuoteCraft. Pure functions, no React.
// All amounts are whole EGP; every line-item amount is rounded with
// Math.round before it is added to the total.

import type { LineItem, ProjectType, Quote, QuoteResult } from "./types";

const BASE_PRICES: Record<ProjectType, number> = {
  landing: 8000,
  "multi-page": 15000,
  "e-commerce": 35000,
};

const EXTRA_PAGE_PRICE = 1200;
const SEO_PRICE = 3000;
const HOSTING_PRICE = 1500;
/** Bilingual surcharge: 25% of the project base price only. */
const BILINGUAL_SHARE = 0.25;

function baseLabel(type: ProjectType): string {
  switch (type) {
    case "landing":
      return "Landing page";
    case "multi-page":
      return "Multi-page site (up to 5 pages)";
    case "e-commerce":
      return "E-commerce";
  }
}

function extraPagesLabel(quantity: number): string {
  return `Extra pages (${quantity} x 1,200 EGP)`;
}

export function calculateQuote(quote: Quote): QuoteResult {
  const lineItems: LineItem[] = [];

  if (quote.projectType === null) {
    return { lineItems: [], total: 0 };
  }

  const base = BASE_PRICES[quote.projectType];
  lineItems.push({ label: baseLabel(quote.projectType), amount: base });

  // Extra pages exist for multi-page and e-commerce only; the UI forces the
  // count to zero on a landing page, and the engine ignores any stray value.
  const extraPages =
    quote.projectType === "landing" ? 0 : Math.max(0, quote.extraPages);
  if (extraPages > 0) {
    lineItems.push({
      label: extraPagesLabel(extraPages),
      amount: Math.round(extraPages * EXTRA_PAGE_PRICE),
    });
  }

  if (quote.seo) {
    lineItems.push({ label: "SEO setup", amount: Math.round(SEO_PRICE) });
  }

  if (quote.hosting) {
    lineItems.push({ label: "Hosting setup", amount: Math.round(HOSTING_PRICE) });
  }

  if (quote.bilingual) {
    lineItems.push({
      label: "Bilingual (Arabic + English)",
      amount: Math.round(base * BILINGUAL_SHARE),
    });
  }

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  return { lineItems, total };
}

/** Formats a whole-EGP amount with thousands separators, e.g. "25,650 EGP". */
export function formatEgp(amount: number): string {
  return `${amount.toLocaleString("en-US")} EGP`;
}

// Builds the copied quote text. Pure, no React. Charge names and amounts
// match the on-screen breakdown; the extra pages line shows the walk
// (quantity x unit = amount) as in the copied-text contract.

import type { LineItem, Quote, QuoteResult } from "./types";

function formatEgp(amount: number): string {
  return `${amount.toLocaleString("en-US")} EGP`;
}

const TYPE_LABELS: Record<NonNullable<Quote["projectType"]>, string> = {
  landing: "Landing page",
  "multi-page": "Multi-page site (up to 5 pages)",
  "e-commerce": "E-commerce",
};

const EXTRA_PAGES_UNIT = 1200;
const EXTRA_PAGES_LABEL = "Extra pages";

function lineToText(item: LineItem, quote: Quote): string {
  if (item.label.startsWith(EXTRA_PAGES_LABEL)) {
    const quantity = quote.extraPages;
    return `${EXTRA_PAGES_LABEL}: ${quantity.toLocaleString("en-US")} x ${EXTRA_PAGES_UNIT.toLocaleString("en-US")} EGP = ${formatEgp(item.amount)}`;
  }
  return `${item.label}: ${formatEgp(item.amount)}`;
}

export function buildQuoteText(quote: Quote, result: QuoteResult): string {
  const lines: string[] = ["QuoteCraft"];

  const clientName = quote.clientName.trim();
  if (clientName) {
    lines.push(`Client: ${clientName}`);
  }

  const projectName = quote.projectName.trim();
  if (projectName) {
    lines.push(`Project: ${projectName}`);
  }

  if (quote.projectType !== null) {
    lines.push(`Project type: ${TYPE_LABELS[quote.projectType]}`);
  }

  for (const item of result.lineItems) {
    lines.push(lineToText(item, quote));
  }

  lines.push(`Total: ${formatEgp(result.total)}`);
  return lines.join("\n");
}

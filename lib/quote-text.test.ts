// Copied quote text tests. These MUST fail before lib/quote-text.ts exists.
import { describe, expect, it } from "vitest";
import { buildQuoteText } from "./quote-text";
import { calculateQuote } from "./pricing";
import { EMPTY_QUOTE, type Quote } from "./types";

function format(amount: number): string {
  return `${amount.toLocaleString("en-US")} EGP`;
}

function quote(partial: Partial<Quote>): Quote {
  return { ...EMPTY_QUOTE, ...partial };
}

describe("copied quote text", () => {
  it("starts with the QuoteCraft heading", () => {
    const text = buildQuoteText(quote({ projectType: "landing" }), {
      lineItems: [{ label: "Landing page", amount: 8000 }],
      total: 8000,
    });
    expect(text).toContain("QuoteCraft");
  });

  it("includes the project type", () => {
    const text = buildQuoteText(
      quote({ projectType: "multi-page" }),
      calculateQuote(quote({ projectType: "multi-page" })),
    );
    expect(text).toContain("Project type: Multi-page site (up to 5 pages)");
  });

  it("includes every selected charge with its amount", () => {
    const q = quote({
      projectType: "multi-page",
      extraPages: 2,
      seo: true,
      hosting: true,
      bilingual: true,
    });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).toContain("Multi-page site (up to 5 pages): 15,000 EGP");
    expect(text).toContain("Extra pages: 2 x 1,200 EGP = 2,400 EGP");
    expect(text).toContain("SEO setup: 3,000 EGP");
    expect(text).toContain("Hosting setup: 1,500 EGP");
    expect(text).toContain("Bilingual (Arabic + English): 3,750 EGP");
  });

  it("includes the total", () => {
    const q = quote({
      projectType: "multi-page",
      extraPages: 2,
      seo: true,
      hosting: true,
      bilingual: true,
    });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).toContain("Total: 25,650 EGP");
  });

  it("uses the same charge names and amounts as the on-screen breakdown", () => {
    const q = quote({
      projectType: "multi-page",
      extraPages: 2,
      seo: true,
      hosting: true,
      bilingual: true,
    });
    const result = calculateQuote(q);
    const text = buildQuoteText(q, result);
    for (const item of result.lineItems) {
      // Every on-screen amount appears in the copied text with its charge
      // name; the extra pages line follows the contract's walk format.
      expect(text).toContain(format(item.amount));
      if (item.label.startsWith("Extra pages")) {
        expect(text).toContain(`Extra pages: 2 x 1,200 EGP = ${format(item.amount)}`);
      } else {
        expect(text).toContain(`${item.label}: ${format(item.amount)}`);
      }
    }
  });

  it("includes client and project names when provided", () => {
    const q = quote({ projectType: "landing", clientName: "Acme", projectName: "Website redesign" });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).toContain("Client: Acme");
    expect(text).toContain("Project: Website redesign");
  });

  it("omits both name lines when blank", () => {
    const q = quote({ projectType: "landing", clientName: "", projectName: "" });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).not.toContain("Client:");
    expect(text).not.toContain("Project:");
  });

  it("omits whitespace-only name lines", () => {
    const q = quote({ projectType: "landing", clientName: "   ", projectName: "\t" });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).not.toContain("Client:");
    expect(text).not.toContain("Project:");
  });

  it("adds an extra pages line only when the quantity is greater than zero", () => {
    const q = quote({ projectType: "multi-page", extraPages: 0 });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).not.toContain("Extra pages");
  });

  it("omits unselected add-ons", () => {
    const q = quote({ projectType: "landing" });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).not.toContain("SEO setup");
    expect(text).not.toContain("Hosting setup");
    expect(text).not.toContain("Bilingual");
  });

  it("omits the extra pages line on a landing page even with a stray count", () => {
    const q = quote({ projectType: "landing", extraPages: 3 });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).not.toContain("Extra pages");
  });

  it("stays in English and stays bare", () => {
    // Keep the quote in English; add no date, quote number, logo or greeting.
    const q = quote({ projectType: "landing", bilingual: true });
    const text = buildQuoteText(q, calculateQuote(q));
    expect(text).not.toContain("Date");
    expect(text).not.toContain("#");
    expect(text).not.toContain("Hello");
    expect(text).not.toContain("Dears");
    expect(text).not.toContain("Thanks");
  });
});

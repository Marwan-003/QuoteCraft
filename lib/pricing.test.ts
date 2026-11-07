// Pricing engine tests. These MUST fail before lib/pricing.ts exists.
import { describe, expect, it } from "vitest";
import { calculateQuote, formatEgp } from "./pricing";
import type { Quote } from "./types";
import { EMPTY_QUOTE } from "./types";

function quote(partial: Partial<Quote>): Quote {
  return { ...EMPTY_QUOTE, ...partial };
}

describe("base prices", () => {
  it("charges 8,000 EGP for a Landing page", () => {
    const result = calculateQuote(quote({ projectType: "landing" }));
    expect(result.lineItems).toEqual([{ label: "Landing page", amount: 8000 }]);
    expect(result.total).toBe(8000);
  });

  it("charges 15,000 EGP for a Multi-page site", () => {
    const result = calculateQuote(quote({ projectType: "multi-page" }));
    expect(result.lineItems).toEqual([
      { label: "Multi-page site (up to 5 pages)", amount: 15000 },
    ]);
    expect(result.total).toBe(15000);
  });

  it("charges 35,000 EGP for an E-commerce project", () => {
    const result = calculateQuote(quote({ projectType: "e-commerce" }));
    expect(result.lineItems).toEqual([
      { label: "E-commerce", amount: 35000 },
    ]);
    expect(result.total).toBe(35000);
  });
});

describe("extra pages", () => {
  it("charges 1,200 EGP per extra page", () => {
    const result = calculateQuote(
      quote({ projectType: "multi-page", extraPages: 2 }),
    );
    expect(result.lineItems).toContainEqual({
      label: "Extra pages (2 x 1,200 EGP)",
      amount: 2400,
    });
    expect(result.total).toBe(17400);
  });

  it("accepts quantities above 5 pages", () => {
    const result = calculateQuote(
      quote({ projectType: "multi-page", extraPages: 6 }),
    );
    expect(result.lineItems).toContainEqual({
      label: "Extra pages (6 x 1,200 EGP)",
      amount: 7200,
    });
    expect(result.total).toBe(22200);
  });

  it("emits no line item when extra pages are zero", () => {
    const result = calculateQuote(quote({ projectType: "multi-page" }));
    expect(result.lineItems).toHaveLength(1);
  });

  it("ignores a non-zero extra-page count on a Landing page (base only)", () => {
    const result = calculateQuote(
      quote({ projectType: "landing", extraPages: 3 }),
    );
    expect(result.lineItems).toEqual([{ label: "Landing page", amount: 8000 }]);
    expect(result.total).toBe(8000);
  });
});

describe("add-ons", () => {
  it("charges 3,000 EGP for SEO setup", () => {
    const result = calculateQuote(quote({ projectType: "landing", seo: true }));
    expect(result.lineItems).toContainEqual({ label: "SEO setup", amount: 3000 });
    expect(result.total).toBe(11000);
  });

  it("charges 1,500 EGP for Hosting setup", () => {
    const result = calculateQuote(
      quote({ projectType: "landing", hosting: true }),
    );
    expect(result.lineItems).toContainEqual({
      label: "Hosting setup",
      amount: 1500,
    });
    expect(result.total).toBe(9500);
  });
});

describe("bilingual add-on", () => {
  it("adds 25% of the base price only (2,000 EGP for Landing page)", () => {
    const result = calculateQuote(
      quote({ projectType: "landing", bilingual: true }),
    );
    expect(result.lineItems).toContainEqual({
      label: "Bilingual (Arabic + English)",
      amount: 2000,
    });
    expect(result.total).toBe(10000);
  });

  it("adds 25% of the base price only (3,750 EGP for Multi-page)", () => {
    const result = calculateQuote(
      quote({ projectType: "multi-page", bilingual: true }),
    );
    expect(result.lineItems).toContainEqual({
      label: "Bilingual (Arabic + English)",
      amount: 3750,
    });
    expect(result.total).toBe(18750);
  });

  it("adds 25% of the base price only (8,750 EGP for E-commerce)", () => {
    const result = calculateQuote(
      quote({ projectType: "e-commerce", bilingual: true }),
    );
    expect(result.lineItems).toContainEqual({
      label: "Bilingual (Arabic + English)",
      amount: 8750,
    });
    expect(result.total).toBe(43750);
  });

  it("never applies the surcharge to add-ons", () => {
    // SEO + Hosting = 4,500; bilingual surcharge must be on 35,000, not 39,500.
    const result = calculateQuote(
      quote({
        projectType: "e-commerce",
        seo: true,
        hosting: true,
        bilingual: true,
      }),
    );
    expect(result.total).toBe(35000 + 3000 + 1500 + 8750);
  });

  it("never applies the surcharge to extra pages", () => {
    // 2 extra pages = 2,400; surcharge on 15,000 only, not 17,400.
    const result = calculateQuote(
      quote({
        projectType: "multi-page",
        extraPages: 2,
        bilingual: true,
      }),
    );
    expect(result.total).toBe(15000 + 2400 + 3750);
  });
});

describe("empty quote", () => {
  it("produces 0 EGP and an empty breakdown without a project type", () => {
    const result = calculateQuote(quote({}));
    expect(result.lineItems).toEqual([]);
    expect(result.total).toBe(0);
  });
});

describe("line-item order", () => {
  it("lists the base price first, then Extra pages, then add-ons, then Bilingual", () => {
    const result = calculateQuote(
      quote({
        projectType: "multi-page",
        extraPages: 2,
        seo: true,
        hosting: true,
        bilingual: true,
      }),
    );
    expect(result.lineItems.map((item) => item.label)).toEqual([
      "Multi-page site (up to 5 pages)",
      "Extra pages (2 x 1,200 EGP)",
      "SEO setup",
      "Hosting setup",
      "Bilingual (Arabic + English)",
    ]);
  });
});

describe("rounding", () => {
  it("rounds each line-item amount to the nearest whole EGP before totaling", () => {
    // The Bilingual surcharge on a whole base is always whole; use a base +
    // surcharge combination and assert every amount is an integer.
    const result = calculateQuote(
      quote({
        projectType: "multi-page",
        extraPages: 1,
        seo: true,
        hosting: true,
        bilingual: true,
      }),
    );
    expect(result.lineItems.every((item) => Number.isInteger(item.amount))).toBe(
      true,
    );
    const sum = result.lineItems.reduce((acc, item) => acc + item.amount, 0);
    expect(result.total).toBe(sum);
  });

  it("totals the sum of the rounded line items", () => {
    const result = calculateQuote(
      quote({
        projectType: "e-commerce",
        extraPages: 3,
      }),
    );
    const sum = result.lineItems.reduce((acc, item) => acc + item.amount, 0);
    expect(result.total).toBe(sum);
  });
});

describe("the contract example", () => {
  it("totals 25,650 EGP for a Multi-page site with 2 extra pages and all add-ons", () => {
    const result = calculateQuote(
      quote({
        projectType: "multi-page",
        extraPages: 2,
        seo: true,
        hosting: true,
        bilingual: true,
      }),
    );
    expect(result.total).toBe(25650);
  });
});

describe("formatEgp", () => {
  it("formats 25,650 as '25,650 EGP'", () => {
    expect(formatEgp(25650)).toBe("25,650 EGP");
  });

  it("formats 0 as '0 EGP'", () => {
    expect(formatEgp(0)).toBe("0 EGP");
  });

  it("formats 8,000 as '8,000 EGP'", () => {
    expect(formatEgp(8000)).toBe("8,000 EGP");
  });
});

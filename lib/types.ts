// Shared types and the empty-quote constant for the QuoteCraft calculator.
// Pure module: no React imports here.

export type ProjectType = "landing" | "multi-page" | "e-commerce";

export interface Quote {
  /** Selected project type; null until the salesperson picks one. */
  projectType: ProjectType | null;
  /** Extra pages; whole number, zero or more, forced to zero on Landing page. */
  extraPages: number;
  seo: boolean;
  hosting: boolean;
  bilingual: boolean;
  clientName: string;
  projectName: string;
}

/** One charge in the breakdown. Amounts are whole EGP. */
export interface LineItem {
  label: string;
  amount: number;
}

export interface QuoteResult {
  lineItems: LineItem[];
  total: number;
}

export const EMPTY_QUOTE: Quote = {
  projectType: null,
  extraPages: 0,
  seo: false,
  hosting: false,
  bilingual: false,
  clientName: "",
  projectName: "",
};

// Single-quote persistence in localStorage. Pure functions, no React.
// Malformed, wrong-versioned, or hostile data always yields null (or a
// silent no-op on save); the app starts fresh without error messages.

import { type ProjectType, type Quote } from "./types";

const KEY = "quotecraft.quote.v1";

const PROJECT_TYPES: ProjectType[] = ["landing", "multi-page", "e-commerce"];

/** Storage-like read/write so tests can pass an in-memory object. */
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface StoredQuote {
  version: number;
  projectType: string | null;
  extraPages: number;
  seo: boolean;
  hosting: boolean;
  bilingual: boolean;
  clientName: string;
  projectName: string;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isWholeNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isProjectType(value: unknown): value is ProjectType {
  return (
    typeof value === "string" &&
    (PROJECT_TYPES as string[]).includes(value)
  );
}

function parseStored(raw: string): Quote | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }
  const stored = data as Partial<StoredQuote>;

  if (stored.version !== 1) {
    return null;
  }
  if (stored.projectType !== null && !isProjectType(stored.projectType)) {
    return null;
  }
  if (!isWholeNonNegative(stored.extraPages)) {
    return null;
  }
  if (!isBoolean(stored.seo) || !isBoolean(stored.hosting) || !isBoolean(stored.bilingual)) {
    return null;
  }
  // Names are optional; when present they must be strings.
  if (stored.clientName !== undefined && typeof stored.clientName !== "string") {
    return null;
  }
  if (stored.projectName !== undefined && typeof stored.projectName !== "string") {
    return null;
  }

  const quote: Quote = {
    projectType: isProjectType(stored.projectType) ? stored.projectType : null,
    extraPages: stored.extraPages,
    seo: stored.seo,
    hosting: stored.hosting,
    bilingual: stored.bilingual,
    clientName: stored.clientName ?? "",
    projectName: stored.projectName ?? "",
  };

  // A landing page cannot carry extra pages; normalize stray values.
  if (quote.projectType === "landing" && quote.extraPages !== 0) {
    quote.extraPages = 0;
  }

  return quote;
}

export function loadQuote(storage: StorageLike): Quote | null {
  let raw: string | null;
  try {
    raw = storage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw === null) {
    return null;
  }
  try {
    return parseStored(raw);
  } catch {
    return null;
  }
}

export function saveQuote(storage: StorageLike, quote: Quote): void {
  const stored: StoredQuote & { extraPages: number } = {
    version: 1,
    projectType: quote.projectType,
    // Only the quote inputs are saved; never line items or totals.
    extraPages: quote.projectType === "landing" ? 0 : quote.extraPages,
    seo: quote.seo,
    hosting: quote.hosting,
    bilingual: quote.bilingual,
    clientName: quote.clientName,
    projectName: quote.projectName,
  };
  try {
    storage.setItem(KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable or full: the quote simply isn't remembered.
  }
}

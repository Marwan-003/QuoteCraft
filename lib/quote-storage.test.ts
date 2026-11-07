// Quote storage tests. These MUST fail before lib/quote-storage.ts exists.
import { describe, expect, it } from "vitest";
import { loadQuote, saveQuote } from "./quote-storage";
import { EMPTY_QUOTE, type Quote } from "./types";

/** Minimal Storage-like in-memory object; no jsdom. */
function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    clear: () => map.clear(),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size;
    },
  } as Storage;
}

const KEY = "quotecraft.quote.v1";

/** A well-formed stored payload spread with overrides. */
function stored(partial: Record<string, unknown>): Record<string, unknown> {
  return {
    version: 1,
    projectType: "multi-page",
    extraPages: 2,
    seo: true,
    hosting: false,
    bilingual: true,
    clientName: "Acme",
    projectName: "Website redesign",
    ...partial,
  };
}

const VALID_QUOTE: Quote = {
  projectType: "multi-page",
  extraPages: 2,
  seo: true,
  hosting: false,
  bilingual: true,
  clientName: "Acme",
  projectName: "Website redesign",
};

describe("saveQuote", () => {
  it("saves under the versioned key with version: 1", () => {
    const storage = memoryStorage();
    saveQuote(storage, VALID_QUOTE);
    const raw = JSON.parse(storage.getItem(KEY)!) as Record<string, unknown>;
    expect(raw.version).toBe(1);
    expect(Object.keys(raw)).toContain("projectType");
  });

  it("persists only the quote inputs, never line items or totals", () => {
    const storage = memoryStorage();
    saveQuote(storage, VALID_QUOTE);
    const raw = storage.getItem(KEY)!;
    expect(raw).not.toContain("lineItems");
    expect(raw).not.toContain("total");
  });

  it("overwrites the previous quote; only one quote is persisted", () => {
    const storage = memoryStorage();
    saveQuote(storage, VALID_QUOTE);
    saveQuote(storage, { ...EMPTY_QUOTE });
    expect(storage.getItem(KEY)!.includes("multi-page")).toBe(false);
  });

  it("keeps surviving when storage throws (no crash)", () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    } as unknown as Storage;
    expect(() => saveQuote(storage, VALID_QUOTE)).not.toThrow();
  });
});

describe("loadQuote", () => {
  it("returns no quote when the key is missing", () => {
    expect(loadQuote(memoryStorage())).toBeNull();
  });

  it("loads a valid saved quote", () => {
    const storage = memoryStorage();
    saveQuote(storage, VALID_QUOTE);
    expect(loadQuote(storage)).toEqual(VALID_QUOTE);
  });

  it("accepts projectType: null as a valid empty quote", () => {
    const storage = memoryStorage();
    saveQuote(storage, { ...EMPTY_QUOTE, projectType: null });
    expect(loadQuote(storage)).toEqual({ ...EMPTY_QUOTE, projectType: null });
  });

  it("returns null for malformed JSON", () => {
    const storage = memoryStorage({ [KEY]: "not json" });
    expect(loadQuote(storage)).toBeNull();
  });

  it("returns null for a wrong version", () => {
    const storage = memoryStorage({ [KEY]: JSON.stringify(stored({ version: 2 })) });
    expect(loadQuote(storage)).toBeNull();
  });

  it.each<
    ["landing2", "a non-null invalid project type"] | [42, "a non-string invalid project type"]
  >([
    ["landing2", "a non-null invalid project type"],
    [42, "a non-string invalid project type"],
  /* eslint-disable @typescript-eslint/no-unused-vars -- vitest it.each passes tuple elements as separate args */
])("returns null for %p as projectType (%s)", (projectType, _label) => {
/* eslint-enable @typescript-eslint/no-unused-vars */
    const storage = memoryStorage({ [KEY]: JSON.stringify(stored({ projectType })) });
    expect(loadQuote(storage)).toBeNull();
  });

  it("returns null for a negative extraPages count", () => {
    const storage = memoryStorage({ [KEY]: JSON.stringify(stored({ extraPages: -1 })) });
    expect(loadQuote(storage)).toBeNull();
  });

  it("returns null for a fractional extraPages count", () => {
    const storage = memoryStorage({ [KEY]: JSON.stringify(stored({ extraPages: 2.5 })) });
    expect(loadQuote(storage)).toBeNull();
  });

  it.each(["seo", "hosting", "bilingual"])(
    "returns null when %s is not boolean",
    (field) => {
      const storage = memoryStorage({
        [KEY]: JSON.stringify(stored({ [field]: "yes" })),
      });
      expect(loadQuote(storage)).toBeNull();
    },
  );

  it("returns null when clientName is present but not a string", () => {
    const storage = memoryStorage({
      [KEY]: JSON.stringify(stored({ clientName: 5 })),
    });
    expect(loadQuote(storage)).toBeNull();
  });

  it("returns null when projectName is present but not a string", () => {
    const storage = memoryStorage({
      [KEY]: JSON.stringify(stored({ projectName: [] })),
    });
    expect(loadQuote(storage)).toBeNull();
  });

  it("accepts missing or empty names as empty strings", () => {
    const storage = memoryStorage();
    saveQuote(storage, { ...VALID_QUOTE, clientName: "", projectName: "" });
    const loaded = loadQuote(storage);
    expect(loaded?.clientName).toBe("");
    expect(loaded?.projectName).toBe("");
    const storage2 = memoryStorage({
      [KEY]: JSON.stringify(
        stored({
          projectType: "landing",
          extraPages: 0,
          seo: false,
          hosting: false,
          bilingual: false,
          clientName: "",
          projectName: "",
        }),
      ),
    });
    const loaded2 = loadQuote(storage2);
    expect(loaded2?.clientName).toBe("");
    expect(loaded2?.projectName).toBe("");
  });

  it("normalizes a landing-page quote with a non-zero extraPages count to zero", () => {
    const storage = memoryStorage({
      [KEY]: JSON.stringify(stored({ projectType: "landing", extraPages: 5 })),
    });
    const loaded = loadQuote(storage);
    expect(loaded?.projectType).toBe("landing");
    expect(loaded?.extraPages).toBe(0);
  });

  it("starts from an empty quote without an error when storage throws", () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {},
    } as unknown as Storage;
    expect(loadQuote(storage)).toBeNull();
  });

  it("returns null when the payload is not an object", () => {
    expect(loadQuote(memoryStorage({ [KEY]: JSON.stringify([1, 2]) }))).toBeNull();
    expect(loadQuote(memoryStorage({ [KEY]: JSON.stringify(null) }))).toBeNull();
    expect(loadQuote(memoryStorage({ [KEY]: JSON.stringify("x") }))).toBeNull();
  });
});

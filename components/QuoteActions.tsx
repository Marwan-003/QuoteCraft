// Presentational: the copy and print actions. Text labels only, no icons.
"use client";

import { useCallback, useState } from "react";
import { buildQuoteText } from "../lib/quote-text";
import type { Quote, QuoteResult } from "../lib/types";

export function QuoteActions({
  quote,
  result,
}: {
  quote: Quote;
  result: QuoteResult;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const disabled = quote.projectType === null;

  const copyQuote = useCallback(async () => {
    const text = buildQuoteText(quote, result);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: select and copy a temporary textarea.
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(area);
        if (!copied) {
          throw new Error("copy command failed");
        }
      }
      setStatus("Quote copied");
    } catch {
      setStatus(
        "The copy didn't work. Select and copy the quote text manually.",
      );
    }
  }, [quote, result]);

  function printQuote() {
    window.print();
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={copyQuote}
        disabled={disabled}
        className="h-12 rounded-control bg-lapis px-6 text-label font-medium text-white transition-colors hover:brightness-90 disabled:opacity-60"
      >
        Copy quote as text
      </button>
      <button
        type="button"
        onClick={printQuote}
        disabled={disabled}
        className="h-12 rounded-control border border-lapis bg-transparent px-6 text-label font-medium text-lapis transition-colors hover:bg-lapis hover:text-white disabled:opacity-60"
      >
        Print quote
      </button>
      {status && (
        <p className="text-small text-graphite" role="status">
          {status}
        </p>
      )}
    </div>
  );
}

// Presentational: the quote sheet (names, project type, breakdown, total)
// and the fixed mobile total bar. No pricing math here.
import type { Quote, QuoteResult } from "../lib/types";
import { formatEgp } from "../lib/pricing";

const TYPE_LABELS: Record<string, string> = {
  landing: "Landing page",
  "multi-page": "Multi-page site (up to 5 pages)",
  "e-commerce": "E-commerce",
};

function typeLabel(type: Quote["projectType"]): string {
  return type === null ? "" : TYPE_LABELS[type];
}

export function QuoteSheet({
  quote,
  result,
}: {
  quote: Quote;
  result: QuoteResult;
}) {
  const clientName = quote.clientName.trim();
  const projectName = quote.projectName.trim();
  const selectedType = typeLabel(quote.projectType);

  const bar = (
    <div className="bg-highlighter px-4 py-4 flex items-baseline justify-between gap-4">
      <span className="text-label font-medium text-ink">Total</span>
      <span
        key={result.total}
        data-testid="bar-total"
        className="total-fade font-display text-h2 text-ink [font-variant-numeric:tabular-nums]"
      >
        {formatEgp(result.total)}
      </span>
    </div>
  );

  return (
    <div>
      {/* Sticky quote sheet (desktop) */}
      <section
        aria-label="Quote sheet"
        className="rounded-sheet border border-pencil bg-sheet p-6"
      >
        {(clientName || projectName || selectedType) && (
          <dl className="mb-6 space-y-2 border-b border-pencil/60 pb-6">
            {clientName && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-label font-medium text-graphite">Client</dt>
                <dd className="text-body text-ink text-right">{clientName}</dd>
              </div>
            )}
            {projectName && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-label font-medium text-graphite">Project</dt>
                <dd className="text-body text-ink text-right">{projectName}</dd>
              </div>
            )}
            {selectedType && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-label font-medium text-graphite">
                  Project type
                </dt>
                <dd className="text-body text-ink text-right">{selectedType}</dd>
              </div>
            )}
          </dl>
        )}

        {result.lineItems.length === 0 ? (
          <p className="text-body text-graphite">
            Choose a project type to start your quote.
          </p>
        ) : (
          <dl className="space-y-3">
            {result.lineItems.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="text-body text-ink">{item.label}</dt>
                <dd className="text-body text-ink [font-variant-numeric:tabular-nums]">
                  {formatEgp(item.amount)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 border-t border-pencil" data-testid="sheet-total-runner">
          {/* The one Highlighter band per screen: in-sheet on desktop and in
              print, in the fixed bar on phone layouts. The bar also carries a
              data attribute so the base print rule can hide it explicitly. */}
          <div data-testid="sheet-total-band" className="hidden bg-highlighter mt-8 -ms-6 -me-6 px-6 py-4 items-baseline justify-between gap-4 lg:flex print:flex">
            <span className="text-label font-medium text-ink">Total</span>
            <span
              key={result.total}
              data-testid="sheet-total"
              aria-live="polite"
              className="total-fade font-display text-total text-ink [font-variant-numeric:tabular-nums]"
            >
              {formatEgp(result.total)}
            </span>
          </div>
        </div>
      </section>

      {/* Fixed mobile total bar: phone layouts only, never in print. The
          quote sheet already announces the total (aria-live), so this is
          hidden from assistive tech. */}
      <div
        aria-hidden="true"
        data-mobile-total-bar=""
        className="print:hidden fixed inset-x-0 bottom-0 z-10 border-t border-pencil bg-sheet lg:hidden"
      >
        {bar}
      </div>
    </div>
  );
}


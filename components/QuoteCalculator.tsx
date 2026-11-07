// Client state container for the quote. Owns the single Quote and derives
// the QuoteResult; presentational components stay stateless about pricing.
"use client";

import { useMemo, useState } from "react";
import { calculateQuote } from "../lib/pricing";
import { EMPTY_QUOTE, type ProjectType, type Quote } from "../lib/types";
import { AddOnControls } from "./AddOnControls";
import { ProjectTypeSelector } from "./ProjectTypeSelector";
import { QuoteFields } from "./QuoteFields";
import { QuoteSheet } from "./QuoteSheet";

export function QuoteCalculator() {
  const [quote, setQuote] = useState<Quote>(EMPTY_QUOTE);

  // The total and breakdown update on every change.
  const result = useMemo(() => calculateQuote(quote), [quote]);

  function setProjectType(type: ProjectType) {
    setQuote((current) =>
      // Extra pages are forced to zero on a landing page.
      type === "landing" ? { ...current, projectType: type, extraPages: 0 } : { ...current, projectType: type },
    );
  }

  function setExtraPages(count: number) {
    setQuote((current) => ({ ...current, extraPages: count }));
  }

  function setClientName(name: string) {
    setQuote((current) => ({ ...current, clientName: name }));
  }

  function setProjectName(name: string) {
    setQuote((current) => ({ ...current, projectName: name }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,432px] lg:gap-16">
      <div className="min-w-0">
        <section aria-labelledby="options-project-type">
          <h3 id="options-project-type" className="font-display text-h2 text-ink">
            Project type
          </h3>
          <div className="mt-4">
            <ProjectTypeSelector value={quote.projectType} onChange={setProjectType} />
          </div>
        </section>

        <section aria-labelledby="options-addons" className="mt-8 border-t border-pencil/60 pt-8">
          <h3 id="options-addons" className="font-display text-h2 text-ink">
            Add-ons
          </h3>
          <div className="mt-4">
            <AddOnControls
              extraPages={quote.extraPages}
              onExtraPages={setExtraPages}
              hasProjectType={quote.projectType !== null}
              landingSelected={quote.projectType === "landing"}
              seo={quote.seo}
              onSeo={(seo) => setQuote((current) => ({ ...current, seo }))}
              hosting={quote.hosting}
              onHosting={(hosting) => setQuote((current) => ({ ...current, hosting }))}
              bilingual={quote.bilingual}
              onBilingual={(bilingual) => setQuote((current) => ({ ...current, bilingual }))}
            />
          </div>
        </section>

        <section aria-labelledby="options-names" className="mt-8 border-t border-pencil/60 pt-8">
          <h3 id="options-names" className="font-display text-h2 text-ink">
            Quote details
          </h3>
          <div className="mt-4">
            <QuoteFields
              clientName={quote.clientName}
              onClientName={setClientName}
              projectName={quote.projectName}
              onProjectName={setProjectName}
            />
          </div>
        </section>
      </div>

      <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
        <QuoteSheet quote={quote} result={result} />
      </div>
    </div>
  );
}

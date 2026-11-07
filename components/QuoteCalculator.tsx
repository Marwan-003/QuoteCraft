// Client state container for the quote. Owns the single Quote and derives
// the QuoteResult; presentational components stay stateless about pricing.
"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateQuote } from "../lib/pricing";
import { EMPTY_QUOTE, type ProjectType, type Quote } from "../lib/types";
import { loadQuote, saveQuote } from "../lib/quote-storage";
import { AddOnControls } from "./AddOnControls";
import { ProjectTypeSelector } from "./ProjectTypeSelector";
import { QuoteActions } from "./QuoteActions";
import { QuoteFields } from "./QuoteFields";
import { QuoteSheet } from "./QuoteSheet";

export function QuoteCalculator() {
  const [quote, setQuote] = useState<Quote>(EMPTY_QUOTE);
  const [hydrated, setHydrated] = useState(false);

  // Load the saved quote after mount (client-side only) to avoid SSR mismatch.
  useEffect(() => {
    try {
      const saved = loadQuote(window.localStorage);
      if (saved !== null) {
        setQuote(saved);
      }
    } catch {
      // Storage unavailable or blocked: start fresh with no error message.
    } finally {
      setHydrated(true);
    }
  }, []);

  // The total and breakdown update on every change.
  const result = useMemo(() => calculateQuote(quote), [quote]);

  // Persist after every accepted change, but only after hydration so the
  // initial empty quote never overwrites stored data.
  useEffect(() => {
    if (!hydrated) {
      return;
    }
    try {
      saveQuote(window.localStorage, quote);
    } catch {
      // Storage unavailable or full: the quote simply isn't remembered.
    }
  }, [quote, hydrated]);

  function setProjectType(type: ProjectType) {
    setQuote((current) =>
      // Extra pages are forced to zero on a landing page.
      type === "landing"
        ? { ...current, projectType: type, extraPages: 0 }
        : { ...current, projectType: type },
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

  // Before hydration, render a stable placeholder to avoid flash.
  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr,432px] lg:gap-16">
        <div className="min-w-0 print:hidden" aria-hidden="true">
          <section aria-labelledby="options-project-type">
            <h3 id="options-project-type" className="font-display text-h2 text-ink">
              Project type
            </h3>
            <div className="mt-4">
              <ProjectTypeSelector value={null} onChange={() => {}} />
            </div>
          </section>
          <section aria-labelledby="options-addons" className="mt-8 border-t border-pencil/60 pt-8">
            <h3 id="options-addons" className="font-display text-h2 text-ink">
              Add-ons
            </h3>
            <div className="mt-4">
              <AddOnControls
                extraPages={0}
                onExtraPages={() => {}}
                hasProjectType={false}
                landingSelected={false}
                seo={false}
                onSeo={() => {}}
                hosting={false}
                onHosting={() => {}}
                bilingual={false}
                onBilingual={() => {}}
              />
            </div>
          </section>
          <section aria-labelledby="options-names" className="mt-8 border-t border-pencil/60 pt-8">
            <h3 id="options-names" className="font-display text-h2 text-ink">
              Quote details
            </h3>
            <div className="mt-4">
              <QuoteFields
                clientName=""
                onClientName={() => {}}
                projectName=""
                onProjectName={() => {}}
              />
            </div>
          </section>
        </div>
        <div className="min-w-0 lg:sticky lg:top-8 lg:self-start" aria-hidden="true">
          <QuoteSheet quote={EMPTY_QUOTE} result={{ lineItems: [], total: 0 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,432px] lg:gap-16">
      <div className="min-w-0 print:hidden">
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
        <div className="mt-6 print:hidden">
          <QuoteActions quote={quote} result={result} />
        </div>
      </div>
    </div>
  );
}
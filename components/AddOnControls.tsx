// Presentational: the extra pages count and the add-on checkboxes.
// No pricing math here.
import { useState } from "react";

const LANDING_MESSAGE =
  "Extra pages aren't available for a landing page. Choose Multi-page site to add pages.";
const INVALID_MESSAGE = "Enter a whole number of pages, zero or more.";

export interface AddOnControlsProps {
  extraPages: number;
  onExtraPages: (count: number) => void;
  /** No project type chosen yet: the input is disabled. */
  hasProjectType: boolean;
  /** Landing page is selected: input disabled, reset to zero by the parent. */
  landingSelected: boolean;
  seo: boolean;
  onSeo: (on: boolean) => void;
  hosting: boolean;
  onHosting: (on: boolean) => void;
  bilingual: boolean;
  onBilingual: (on: boolean) => void;
}

/** Accepts a whole number of zero or more; rejects everything else. */
function parseExtraPages(raw: string): number | null {
  if (!/^\d+$/.test(raw)) {
    return null;
  }
  return Number(raw);
}

export function AddOnControls({
  extraPages,
  onExtraPages,
  hasProjectType,
  landingSelected,
  seo,
  onSeo,
  hosting,
  onHosting,
  bilingual,
  onBilingual,
}: AddOnControlsProps) {
  const [error, setError] = useState<string | null>(null);
  const extraPagesDisabled = !hasProjectType || landingSelected;

  function handleExtraPagesChange(raw: string) {
    const value = parseExtraPages(raw);
    if (value === null) {
      // Keep the last valid value in the input; explain what went wrong.
      setError(INVALID_MESSAGE);
      return;
    }
    setError(null);
    onExtraPages(value);
  }

  const message = landingSelected ? LANDING_MESSAGE : error;

  return (
    <div>
      <label htmlFor="extra-pages" className="block text-label font-medium text-ink">
        Extra pages
      </label>
      <input
        id="extra-pages"
        name="extra-pages"
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        value={extraPages}
        onChange={(event) => handleExtraPagesChange(event.target.value)}
        disabled={extraPagesDisabled}
        aria-disabled={extraPagesDisabled}
        aria-describedby={message ? "extra-pages-message" : undefined}
        className="mt-2 h-12 w-full rounded-control border border-pencil bg-sheet px-4 text-body text-ink [font-variant-numeric:tabular-nums] disabled:opacity-60 aria-[invalid=true]:border-red-pencil"
      />
      {message && (
        <p
          id="extra-pages-message"
          className="mt-2 text-small text-red-pencil"
        >
          {message}
        </p>
      )}

      <ul className="mt-6 divide-y divide-pencil/60">
        <li>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 py-4 text-body text-ink">
            <input
              type="checkbox"
              checked={seo}
              onChange={(event) => onSeo(event.target.checked)}
              className="size-5 accent-lapis"
            />
            SEO setup
          </label>
        </li>
        <li>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 py-4 text-body text-ink">
            <input
              type="checkbox"
              checked={hosting}
              onChange={(event) => onHosting(event.target.checked)}
              className="size-5 accent-lapis"
            />
            Hosting setup
          </label>
        </li>
        <li>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 py-4 text-body text-ink">
            <input
              type="checkbox"
              checked={bilingual}
              onChange={(event) => onBilingual(event.target.checked)}
              className="size-5 accent-lapis"
            />
            Bilingual (Arabic + English)
          </label>
        </li>
      </ul>
    </div>
  );
}

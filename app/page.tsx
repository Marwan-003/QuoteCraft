import { QuoteCalculator } from "../components/QuoteCalculator";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-quote px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <header className="border-b border-pencil/60 pb-6 print:hidden">
        <p className="font-display text-h3 text-lapis">QuoteCraft</p>
        <div className="mt-2 grid gap-2 lg:grid-cols-2 lg:items-end">
          <h1 className="font-display text-h1 text-ink">Build the quote</h1>
          <p className="max-w-[65ch] text-body text-graphite">
            Pick a project type, add extras, and watch the price update as the
            client talk goes.
          </p>
        </div>
      </header>
      <main className="mt-8 pb-24">
        <QuoteCalculator />
      </main>
    </div>
  );
}

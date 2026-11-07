// Presentational: the project type choice list. No pricing math here.
import type { ProjectType } from "../lib/types";

const CHOICES: Array<{
  value: ProjectType;
  label: string;
  price: number;
  hint?: string;
}> = [
  { value: "landing", label: "Landing page", price: 8000 },
  {
    value: "multi-page",
    label: "Multi-page site (up to 5 pages)",
    price: 15000,
  },
  { value: "e-commerce", label: "E-commerce", price: 35000 },
];

function formatEgp(amount: number): string {
  return `${amount.toLocaleString("en-US")} EGP`;
}

export function ProjectTypeSelector({
  value,
  onChange,
}: {
  value: ProjectType | null;
  onChange: (type: ProjectType) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Project type" className="divide-y divide-pencil/60">
      {CHOICES.map((choice) => (
        <label
          key={choice.value}
          className="flex min-h-12 cursor-pointer items-center justify-between gap-4 py-4"
        >
          <span className="flex items-center gap-3 text-body font-normal text-ink">
            <input
              type="radio"
              name="project-type"
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
              className="size-5 accent-lapis"
            />
            {choice.label}
          </span>
          <span className="text-label font-medium text-graphite [font-variant-numeric:tabular-nums]">
            {formatEgp(choice.price)}
          </span>
        </label>
      ))}
    </div>
  );
}

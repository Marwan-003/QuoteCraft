// Presentational: the optional client and project name fields.
// No pricing math here.

export function QuoteFields({
  clientName,
  onClientName,
  projectName,
  onProjectName,
}: {
  clientName: string;
  onClientName: (name: string) => void;
  projectName: string;
  onProjectName: (name: string) => void;
}) {
  return (
    <div className="grid gap-6">
      <div>
        <label htmlFor="client-name" className="block text-label font-medium text-ink">
          Client name
        </label>
        <input
          id="client-name"
          name="client-name"
          type="text"
          value={clientName}
          onChange={(event) => onClientName(event.target.value)}
          className="mt-2 h-12 w-full rounded-control border border-pencil bg-sheet px-4 text-body text-ink"
        />
      </div>
      <div>
        <label htmlFor="project-name" className="block text-label font-medium text-ink">
          Project name
        </label>
        <input
          id="project-name"
          name="project-name"
          type="text"
          value={projectName}
          onChange={(event) => onProjectName(event.target.value)}
          className="mt-2 h-12 w-full rounded-control border border-pencil bg-sheet px-4 text-body text-ink"
        />
      </div>
    </div>
  );
}

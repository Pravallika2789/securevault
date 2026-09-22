import { CheckCircle2, Download, RotateCcw } from "lucide-react";

interface SuccessCardProps {
  title: string;
  details: { label: string; value: string }[];
  downloadLabel: string;
  onDownload: () => void;
  resetLabel: string;
  onReset: () => void;
}

export function SuccessCard({
  title,
  details,
  downloadLabel,
  onDownload,
  resetLabel,
  onReset,
}: SuccessCardProps) {
  return (
    <div className="panel border-success/40 p-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-6 text-success" aria-hidden />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <dl className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-wrap gap-1 bg-surface/60 px-4 py-3 text-sm">
            <dt className="w-full text-muted-foreground sm:w-56">{detail.label}</dt>
            <dd className="min-w-0 flex-1 break-all font-mono text-xs sm:text-sm">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Download className="size-4" aria-hidden />
          {downloadLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <RotateCcw className="size-4" aria-hidden />
          {resetLabel}
        </button>
      </div>
    </div>
  );
}

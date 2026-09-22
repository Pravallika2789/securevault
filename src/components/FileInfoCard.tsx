import { FileLock2, Trash2 } from "lucide-react";
import { formatFileSize } from "@/lib/format";

interface FileInfoCardProps {
  file: File;
  onRemove?: () => void;
  disabled?: boolean;
}

export function FileInfoCard({ file, onRemove, disabled }: FileInfoCardProps) {
  return (
    <div className="panel flex flex-wrap items-center gap-4 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary">
        <FileLock2 className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          {formatFileSize(file.size)} · {file.type || "unknown type"}
        </p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed"
        >
          <Trash2 className="size-3.5" aria-hidden />
          Remove file
        </button>
      )}
    </div>
  );
}

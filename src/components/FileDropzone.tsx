import { useRef, useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";

interface FileDropzoneProps {
  title: string;
  subtitle: string;
  accept?: string;
  onSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileDropzone({ title, subtitle, accept, onSelect, disabled }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`grid-lines rounded-xl border-2 border-dashed p-8 text-center transition-colors sm:p-12 ${
        dragging ? "border-primary bg-primary/5" : "border-input bg-surface/60"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <UploadCloud className="size-6" aria-hidden />
        </span>
        <p className="text-base font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="mt-1 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          aria-label="Choose a file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelect(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

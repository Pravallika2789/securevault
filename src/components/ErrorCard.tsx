import { AlertTriangle } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export function ErrorCard({ title = "Something went wrong", message, onDismiss }: ErrorCardProps) {
  return (
    <div className="panel border-destructive/45 p-5" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-destructive">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

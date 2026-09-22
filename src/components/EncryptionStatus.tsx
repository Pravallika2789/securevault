import { Loader2 } from "lucide-react";

interface EncryptionStatusProps {
  message: string;
  detail?: string;
}

export function EncryptionStatus({ message, detail }: EncryptionStatusProps) {
  return (
    <div className="panel flex items-center gap-4 p-5" role="status" aria-live="polite">
      <Loader2 className="size-5 shrink-0 animate-spin text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{message}</p>
        {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

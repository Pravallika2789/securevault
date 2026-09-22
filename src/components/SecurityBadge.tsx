import type { LucideIcon } from "lucide-react";

interface SecurityBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function SecurityBadge({ icon: Icon, title, description }: SecurityBadgeProps) {
  return (
    <div className="panel p-5 transition-colors hover:border-primary/45">
      <span className="flex size-9 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <h3 className="mt-3.5 font-mono text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

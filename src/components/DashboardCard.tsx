import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  to: "/encrypt" | "/decrypt";
}

export function DashboardCard({ icon: Icon, title, description, action, to }: DashboardCardProps) {
  return (
    <div className="panel flex flex-col p-6 transition-colors hover:border-primary/45">
      <span className="flex size-11 items-center justify-center rounded-xl border border-primary/35 bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{description}</p>
      <Link
        to={to}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {action}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

import { passwordStrength } from "@/lib/format";

const styles = {
  weak: { bar: "bg-destructive", text: "text-destructive", width: "33%" },
  medium: { bar: "bg-warning", text: "text-warning", width: "66%" },
  strong: { bar: "bg-success", text: "text-success", width: "100%" },
} as const;

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { level, label } = passwordStrength(password);
  const style = styles[level];

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-300 ${style.bar}`}
          style={{ width: style.width }}
        />
      </div>
      <p className={`text-xs font-medium ${style.text}`}>Password strength: {label}</p>
    </div>
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export function passwordStrength(password: string): {
  level: PasswordStrengthLevel;
  label: string;
  score: number;
} {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 8 || score <= 2) return { level: "weak", label: "Weak", score };
  if (score <= 4) return { level: "medium", label: "Medium", score };
  return { level: "strong", label: "Strong", score };
}

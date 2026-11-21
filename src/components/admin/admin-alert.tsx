import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "cn";

interface AdminAlertProps {
  variant?: "error" | "success";
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/** Inline banner for API errors and one-off notices on admin pages. */
export function AdminAlert({ variant = "error", children, onDismiss, className }: AdminAlertProps) {
  const Icon = variant === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm mb-4",
        variant === "error"
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        className,
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 opacity-70 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

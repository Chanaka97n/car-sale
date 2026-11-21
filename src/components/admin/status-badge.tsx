import { cn } from "cn";

type BadgeVariant =
  | "active"
  | "inactive"
  | "admin"
  | "manager"
  | "staff"
  | "featured"
  | "petrol"
  | "diesel"
  | "hybrid"
  | "electric"
  | "automatic"
  | "manual"
  | "info"
  | "success"
  | "warning"
  | "default";

const variantStyles: Record<BadgeVariant, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  admin: "bg-orange/10 text-orange border-orange/20",
  manager: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  staff: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  featured: "bg-orange/10 text-orange border-orange/20",
  petrol: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  diesel: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  hybrid: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  electric: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  automatic: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  manual: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  default: "bg-secondary text-secondary-foreground border-transparent",
};

const dotStyles: Record<BadgeVariant, string> = {
  active: "bg-emerald-400",
  inactive: "bg-zinc-500",
  admin: "bg-orange",
  manager: "bg-blue-400",
  staff: "bg-zinc-400",
  featured: "bg-orange",
  petrol: "bg-amber-400",
  diesel: "bg-zinc-400",
  hybrid: "bg-teal-400",
  electric: "bg-blue-400",
  automatic: "bg-purple-400",
  manual: "bg-zinc-400",
  info: "bg-blue-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  default: "bg-zinc-400",
};

interface StatusBadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant = "default", dot = false, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])} />}
      {children}
    </span>
  );
}

export function getStatusVariant(status: string): BadgeVariant {
  return (variantStyles[status.toLowerCase() as BadgeVariant] ? status.toLowerCase() : "default") as BadgeVariant;
}

export function getFuelVariant(fuelType: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    "Petrol": "petrol",
    "Diesel": "diesel",
    "Hybrid": "hybrid",
    "Plug-in Hybrid": "hybrid",
    "Electric": "electric",
  };
  return map[fuelType] ?? "default";
}

export function getTransmissionVariant(transmission: string): BadgeVariant {
  return transmission === "Automatic" ? "automatic" : "manual";
}

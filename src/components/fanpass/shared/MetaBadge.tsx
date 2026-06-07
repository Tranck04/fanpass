import type { LucideIcon } from "lucide-react";

export function MetaBadge({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-primary-glow" />
      <span className="min-w-0 truncate text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

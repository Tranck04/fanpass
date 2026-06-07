import type { LucideIcon } from "lucide-react";

export function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-white/5"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15">
        <Icon className="h-5 w-5 text-primary-glow" />
      </div>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="label-xs text-muted-foreground">Ouvrir</div>
      </div>
    </button>
  );
}

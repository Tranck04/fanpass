import type { LucideIcon } from "lucide-react";

export function HeroBanner({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  stats,
  gradient = "from-primary via-primary to-primary-glow",
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  gradient?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 text-primary-foreground shadow-elevated`}
    >
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="label-xs opacity-80">{eyebrow}</div>
          <h2 className="mt-1 font-display text-2xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm opacity-90">{subtitle}</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="relative mt-5 grid grid-cols-3 gap-2 text-center text-sm">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/15 px-2 py-3">
            <div className="truncate font-display text-lg font-semibold">
              {s.value}
            </div>
            <div className="label-xs opacity-75">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Ellipsis, MapPin, Ticket, Users, type LucideIcon } from "lucide-react";
import type { PrimaryTab } from "@/lib/types";

export function BottomNav({
  tab,
  setTab,
}: {
  tab: PrimaryTab;
  setTab: (t: PrimaryTab) => void;
}) {
  const items: { id: PrimaryTab; icon: LucideIcon; label: string }[] = [
    { id: "billet", icon: Ticket, label: "Billet" },
    { id: "parcours", icon: MapPin, label: "Parcours" },
    { id: "communaute", icon: Users, label: "Communauté" },
    { id: "plus", icon: Ellipsis, label: "Plus" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-4 pt-2 px-3">
      <div className="mx-auto max-w-md glass rounded-2xl px-2 py-2 flex items-center justify-between shadow-elevated">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition ${
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <div className="absolute inset-0 bg-primary rounded-xl glow-primary -z-0" />
              )}
              <it.icon className={`h-5 w-5 relative z-10`} />
              <span className="label-xs relative z-10">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

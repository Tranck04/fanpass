export function FilterBar<Id extends string>({
  items,
  activeId,
  onChange,
}: {
  items: { id: Id; label: string }[];
  activeId: Id;
  onChange: (id: Id) => void;
}) {
  return (
    <div
      className="grid rounded-2xl bg-white/5 p-1"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((it) => {
        const active = it.id === activeId;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            className={`rounded-xl px-1 py-2 text-[0.68rem] font-semibold transition sm:text-xs ${
              active
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

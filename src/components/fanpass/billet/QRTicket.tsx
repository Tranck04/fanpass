export function QRTicket({
  seed = 49297,
  sizeClassName = "w-48",
}: {
  seed?: number;
  sizeClassName?: string;
}) {
  // Decorative QR-like pattern
  const cells = Array.from({ length: 169 }, (_, i) => {
    const value = (i * 9301 + seed) % 233280;
    return value / 233280 > 0.5;
  });
  return (
    <div
      className={`relative mx-auto aspect-square ${sizeClassName} rounded-2xl bg-white p-3 shadow-elevated`}
    >
      <div
        className="grid h-full w-full grid-cols-13 gap-[2px]"
        style={{ gridTemplateColumns: "repeat(13, 1fr)" }}
      >
        {cells.map((on, i) => (
          <div
            key={i}
            className={on ? "bg-[#0D1F3C] rounded-[2px]" : "bg-transparent"}
          />
        ))}
      </div>
      {/* Corner markers */}
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2"].map((p) => (
        <div
          key={p}
          className={`absolute ${p} h-8 w-8 border-[3px] border-[#0D1F3C] rounded-md bg-white`}
        >
          <div className="absolute inset-1 bg-[#0D1F3C] rounded-sm" />
        </div>
      ))}
      {/* Scan line */}
      <div className="absolute inset-3 overflow-hidden rounded-lg pointer-events-none">
        <div className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-primary/40 to-transparent animate-scan" />
      </div>
    </div>
  );
}

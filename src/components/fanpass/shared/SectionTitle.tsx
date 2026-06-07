export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="label-xs text-primary-glow">{eyebrow}</div>
      <h1 className="font-display text-2xl font-semibold mt-1">{title}</h1>
    </div>
  );
}

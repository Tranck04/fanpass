export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-primary">
        <div className="h-3 w-3 rounded-sm bg-background rotate-45" />
      </div>
      <span className="font-display font-semibold tracking-tight text-lg">
        Fan<span className="text-primary-glow">Pass</span>
      </span>
    </div>
  );
}

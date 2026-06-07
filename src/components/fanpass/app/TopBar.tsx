import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";

export function TopBar({ onProfileClick }: { onProfileClick: () => void }) {
  const { avatarInitials } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <Logo />
        <button
          onClick={onProfileClick}
          className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-xs font-semibold hover:scale-105 transition"
          title="Mon profil"
        >
          {avatarInitials}
        </button>
      </div>
    </header>
  );
}

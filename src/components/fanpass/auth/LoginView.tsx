import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, LockKeyhole } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";

export function LoginView({
  onBack,
  onSwitchToRegister,
}: {
  onBack: () => void;
  onSwitchToRegister: () => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <Logo />
          <div className="w-8" />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 pt-12 pb-8 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4">
            <LogIn className="h-8 w-8 text-primary-glow" />
          </div>
          <h1 className="font-display text-3xl font-semibold">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous à votre compte FanPass
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-12 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-primary-glow hover:underline font-medium"
          >
            S'inscrire
          </button>
        </p>
      </main>
    </div>
  );
}

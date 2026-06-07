import { useState } from "react";
import {
  ArrowLeft,
  UserPlus,
  Mail,
  LockKeyhole,
  User,
  Globe,
  Star,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";

const TEAMS = ["Maroc", "France", "Bresil", "Espagne", "Neutre"] as const;
const PROFILES = [
  { id: "solo", label: "Solo" },
  { id: "family", label: "Famille" },
  { id: "tourist", label: "Touriste" },
  { id: "local", label: "Local" },
  { id: "group", label: "Groupe" },
  { id: "calm", label: "Calme" },
] as const;

export function RegisterView({
  onBack,
  onSwitchToLogin,
}: {
  onBack: () => void;
  onSwitchToLogin: () => void;
}) {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    nationality: "",
    language: "fr",
    supported_team: "Maroc",
    fan_profile: "solo",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={step === 2 ? () => setStep(1) : onBack}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> {step === 2 ? "Retour" : "Retour"}
          </button>
          <Logo />
          <div className="text-xs text-muted-foreground">{step}/2</div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 pt-8 pb-8">
        <div className="text-center mb-8">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4">
            <UserPlus className="h-8 w-8 text-primary-glow" />
          </div>
          <h1 className="font-display text-3xl font-semibold">Inscription</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 1
              ? "Créez votre compte FanPass"
              : "Personnalisez votre profil supporter"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-xs text-muted-foreground block mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) => update("first_name", e.target.value)}
                      required
                      className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-xs text-muted-foreground block mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="label-xs text-muted-foreground block mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
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
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="label-xs text-muted-foreground block mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="label-xs text-muted-foreground block mb-2">
                  Nationalité
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    placeholder="Marocaine"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="glass rounded-3xl p-5 space-y-4">
                <div>
                  <div className="label-xs text-primary-glow mb-3">
                    <Star className="inline h-3 w-3 mr-1" />
                    Équipe supportée
                  </div>
                  <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1">
                    {TEAMS.map((team) => (
                      <button
                        type="button"
                        key={team}
                        onClick={() => update("supported_team", team)}
                        className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                          form.supported_team === team
                            ? "bg-primary text-primary-foreground shadow-elevated"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <div className="label-xs text-primary-glow mb-3">
                  <Users className="inline h-3 w-3 mr-1" />
                  Profil fan
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PROFILES.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => update("fan_profile", p.id)}
                      className={`rounded-2xl p-3 text-left transition ${
                        form.fan_profile === p.id
                          ? "bg-primary/15 ring-1 ring-primary/40"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-semibold">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Inscription..."
              : step === 1
                ? "Continuer"
                : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-glow hover:underline font-medium"
          >
            Se connecter
          </button>
        </p>
      </main>
    </div>
  );
}

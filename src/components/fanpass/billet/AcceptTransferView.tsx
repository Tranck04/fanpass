import { useState } from "react";
import { ArrowLeft, Gift, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";
import { fanpassFetch } from "@/lib/fanpass-api";

export function AcceptTransferView({
  onBack,
  onAccepted,
}: {
  onBack: () => void;
  onAccepted: () => void;
}) {
  const { token } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleAccept() {
    setError("");
    setLoading(true);
    try {
      const res = await fanpassFetch(
        `/tickets/transfer/accept/${code.toUpperCase()}`,
        token,
        { method: "POST" },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Code invalide");
      }
      setSuccess(true);
      setTimeout(onAccepted, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-20 w-20 rounded-full bg-success/15 grid place-items-center">
          <Check className="h-10 w-10 text-success" />
        </div>
        <h2 className="font-display text-xl font-semibold">Billet reçu !</h2>
        <p className="text-sm text-muted-foreground">
          Le billet a été ajouté à votre wallet.
        </p>
      </div>
    );
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
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-success/15 mb-4">
            <Gift className="h-8 w-8 text-success" />
          </div>
          <h1 className="font-display text-2xl font-semibold">
            Accepter un billet
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quelqu'un vous a transféré un billet ? Saisissez le code reçu.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="glass rounded-3xl p-5 space-y-4">
          <label className="label-xs text-muted-foreground block">
            Code de transfert
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABCD1234"
            maxLength={8}
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-center font-mono text-2xl tracking-[0.3em] placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/40 uppercase"
          />
        </div>

        <button
          onClick={handleAccept}
          disabled={loading || code.length < 8}
          className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Vérification..." : "Accepter le billet"}
        </button>
      </main>
    </div>
  );
}

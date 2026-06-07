import { useState } from "react";
import { X, Send, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fanpassFetch } from "@/lib/fanpass-api";

type TransferResult = {
  transfer_id: string;
  transfer_code: string;
  to_email: string;
  message: string;
};

export function TransferModal({
  ticketId,
  ticketTitle,
  onClose,
}: {
  ticketId: string;
  ticketTitle: string;
  onClose: () => void;
}) {
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TransferResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleTransfer() {
    setError("");
    setLoading(true);
    try {
      const res = await fanpassFetch(`/tickets/${ticketId}/transfer`, token, {
        method: "POST",
        body: JSON.stringify({ to_email: email }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur de transfert");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    if (result) {
      navigator.clipboard.writeText(result.transfer_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 px-3 pb-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-background p-5 shadow-elevated">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="label-xs text-primary-glow">
              Transférer un billet
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold">
              {ticketTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!result ? (
          <>
            <div className="mt-5">
              <label className="label-xs text-muted-foreground block mb-2">
                Email du destinataire
              </label>
              <div className="relative">
                <Send className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="danielle@email.com"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-primary/10 p-4 text-xs text-muted-foreground">
              Le destinataire recevra un code de transfert valable 24h. Il devra
              avoir un compte FanPass pour accepter le billet.
            </div>

            <button
              onClick={handleTransfer}
              disabled={loading || !email}
              className="mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Transfert..." : "Envoyer le billet"}
            </button>
          </>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-success/15 p-5 text-center">
              <div className="text-sm text-success font-semibold mb-2">
                ✅ Transfert initié
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Communiquez ce code au destinataire :
              </div>
              <div className="font-mono text-2xl font-bold tracking-[0.2em] text-foreground">
                {result.transfer_code}
              </div>
              <button
                onClick={copyCode}
                className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-xs font-medium"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-white/5 py-3 text-sm font-medium"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

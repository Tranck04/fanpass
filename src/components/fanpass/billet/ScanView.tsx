import { useState } from "react";
import {
  ArrowLeft,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";
import { fanpassFetch } from "@/lib/fanpass-api";

type ScanResult = {
  result: string;
  message: string;
  ticket_id: string | null;
  gate_id: string;
  scanned_at: string;
};

export function ScanView({ onBack }: { onBack: () => void }) {
  const { token } = useAuth();
  const [qrInput, setQrInput] = useState("");
  const [gateId, setGateId] = useState("gate-c");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function handleScan() {
    setLoading(true);
    try {
      const res = await fanpassFetch("/scan/validate", token, {
        method: "POST",
        body: JSON.stringify({
          qr_raw: qrInput,
          gate_id: gateId,
          device_id: "demo-scanner",
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        result: "invalid_ticket",
        message: "Erreur réseau",
        ticket_id: null,
        gate_id: gateId,
        scanned_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  const resultIcon = {
    access_granted: <CheckCircle2 className="h-12 w-12 text-success" />,
    wrong_gate: <AlertTriangle className="h-12 w-12 text-primary-glow" />,
    already_used: <XCircle className="h-12 w-12 text-destructive" />,
    invalid_ticket: <ShieldAlert className="h-12 w-12 text-destructive" />,
    ticket_cancelled: <XCircle className="h-12 w-12 text-destructive" />,
  }[result?.result ?? ""] ?? (
    <Search className="h-12 w-12 text-muted-foreground" />
  );

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

      <main className="flex-1 mx-auto w-full max-w-md px-5 pt-8 pb-8 space-y-6">
        <div className="text-center">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4">
            <ScanLine className="h-8 w-8 text-primary-glow" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Scan billet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Simulation du scanner à l'entrée du stade.
          </p>
        </div>

        <div className="glass rounded-3xl p-5 space-y-4">
          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              QR Payload (coller)
            </label>
            <textarea
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder='{"ticket_id":"...","fan_id":"...","gate_code":"C",...}'
              rows={3}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
            />
          </div>

          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Gate ID
            </label>
            <select
              value={gateId}
              onChange={(e) => setGateId(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="gate-c">Gate C - Nord</option>
              <option value="gate-e">Gate E - Est</option>
              <option value="gate-b">Gate B - Sud</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !qrInput}
          className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ScanLine className="h-4 w-4" />
          {loading ? "Scan en cours..." : "Scanner le billet"}
        </button>

        {result && (
          <div
            className={`rounded-3xl p-6 text-center ${
              result.result === "access_granted"
                ? "bg-success/10 ring-1 ring-success/30"
                : result.result === "wrong_gate"
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "bg-destructive/10 ring-1 ring-destructive/30"
            }`}
          >
            <div className="grid place-items-center mb-3">{resultIcon}</div>
            <h2 className="font-display text-xl font-semibold">
              {result.message}
            </h2>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>
                Résultat :{" "}
                <span className="font-mono font-semibold">{result.result}</span>
              </div>
              {result.ticket_id && (
                <div>
                  Ticket : <span className="font-mono">{result.ticket_id}</span>
                </div>
              )}
              <div>
                Scanné à :{" "}
                <span>
                  {new Date(result.scanned_at).toLocaleTimeString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

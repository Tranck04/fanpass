import { useState } from "react";
import { ArrowLeft, QrCode, FileText, Hash, Upload, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";
import { fanpassFetch } from "@/lib/fanpass-api";

export function ImportTicketView({
  onBack,
  onImported,
}: {
  onBack: () => void;
  onImported: () => void;
}) {
  const { token } = useAuth();
  const [tab, setTab] = useState<"ref" | "qr">("ref");
  const [reference, setReference] = useState("");
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleImport() {
    setError("");
    setLoading(true);
    try {
      const body =
        tab === "ref"
          ? { type: "ref", reference }
          : { type: "qr", qr_data: qrData };

      const res = await fanpassFetch("/tickets/import", token, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur d'import");
      }
      setSuccess(true);
      setTimeout(() => {
        onImported();
      }, 1200);
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
        <h2 className="font-display text-xl font-semibold">Billet importé !</h2>
        <p className="text-sm text-muted-foreground">
          Redirection vers votre wallet...
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

      <main className="flex-1 mx-auto w-full max-w-md px-5 pt-8 pb-8 space-y-6">
        <div className="text-center">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4">
            <Upload className="h-8 w-8 text-primary-glow" />
          </div>
          <h1 className="font-display text-2xl font-semibold">
            Importer un billet
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Billet acheté ailleurs ? Importez-le dans votre wallet FanPass.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 rounded-2xl bg-white/5 p-1">
          <button
            onClick={() => setTab("ref")}
            className={`rounded-xl px-2 py-3 text-xs font-semibold transition flex items-center justify-center gap-2 ${
              tab === "ref"
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Hash className="h-4 w-4" /> Référence
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`rounded-xl px-2 py-3 text-xs font-semibold transition flex items-center justify-center gap-2 ${
              tab === "qr"
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <QrCode className="h-4 w-4" /> QR Code
          </button>
        </div>

        {tab === "ref" ? (
          <div className="glass rounded-3xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15">
                <FileText className="h-6 w-6 text-primary-glow" />
              </div>
              <div>
                <div className="text-sm font-semibold">Référence de billet</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Saisissez la référence reçue par email ou sur votre billet
                  officiel.
                </p>
              </div>
            </div>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: WC2030-MAR-ESP-A0042"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
        ) : (
          <div className="glass rounded-3xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15">
                <QrCode className="h-6 w-6 text-primary-glow" />
              </div>
              <div>
                <div className="text-sm font-semibold">Scanner un QR</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Collez les données du QR code scanné depuis votre billet
                  officiel.
                </p>
              </div>
            </div>
            <textarea
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder="Collez les données du QR ici..."
              rows={3}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
            />
            <button
              type="button"
              onClick={() =>
                setError(
                  "Scan camera non branche dans ce prototype : collez les donnees du QR.",
                )
              }
              className="w-full rounded-2xl border border-dashed border-white/15 bg-white/5 py-8 text-sm text-muted-foreground hover:bg-white/10 transition flex flex-col items-center gap-2"
            >
              <QrCode className="h-8 w-8" />
              <span>Scanner avec la caméra</span>
            </button>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || (tab === "ref" ? !reference : !qrData)}
          className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Importation..." : "Importer le billet"}
        </button>
      </main>
    </div>
  );
}

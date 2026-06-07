import {
  ArrowLeft,
  BadgePercent,
  Check,
  Minus,
  Plus,
  QrCode,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fanpassFetch } from "@/lib/fanpass-api";
const PICKUPS: Record<string, string> = {
  stadium: "Stade",
  fan_zone: "Fan zone",
  event: "Event",
};
function fmt(n: number) {
  return `${n.toLocaleString("fr-MA")} MAD`;
}

type CartProduct = {
  id: string;
  name: string;
  price: number;
  qty: number;
  visual: { label: string; from: string; to: string };
};
type Props = {
  items: CartProduct[];
  pickup: string;
  onChangePickup: (p: string) => void;
  onChangeQty: (id: string, q: number) => void;
  onBack: () => void;
  onOrderComplete?: () => void;
};

export function PanierView({
  items,
  pickup,
  onChangePickup,
  onChangeQty,
  onBack,
  onOrderComplete,
}: Props) {
  const { token } = useAuth();
  const [order, setOrder] = useState<{
    order_id: string;
    pickup_location: string;
    qr_code: string;
    available_at: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function confirmOrder() {
    if (items.length === 0) return;
    setError("");
    setLoading(true);
    try {
      const payload = items.map((c) => ({
        id: c.id,
        qty: c.qty,
      }));
      const r = await fanpassFetch("/merch/order", token, {
        method: "POST",
        body: JSON.stringify({ items: payload, pickup }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => null);
        throw new Error(data?.detail ?? "Commande impossible");
      }
      setOrder(await r.json());
      onOrderComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur reseau");
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 glass border-b border-white/5">
          <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Boutique
            </button>
            <span className="text-sm font-semibold">Confirmation</span>
            <div className="w-16" />
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-md px-5 pt-10 pb-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-success/15 grid place-items-center">
            <Check className="h-10 w-10 text-success" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Commande confirmée !
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.order_id}
            </p>
          </div>
          <div className="glass rounded-3xl p-6 w-full text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <QrCode className="h-8 w-8 text-primary-glow" />
              <span className="font-mono text-lg font-semibold">
                {order.qr_code}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Retrait : {order.pickup_location}
            </div>
            <div className="text-sm text-primary-glow font-semibold">
              Disponible à partir de {order.available_at}
            </div>
          </div>
          <button
            onClick={onBack}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary"
          >
            Retour à la boutique
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Boutique
          </button>
          <span className="text-sm font-semibold">Mon panier</span>
          <div className="text-xs text-muted-foreground">
            {count} article{count > 1 ? "s" : ""}
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 pt-6 pb-8 space-y-5">
        {/* Pickup selector */}
        <div className="glass rounded-3xl p-5">
          <div className="label-xs text-primary-glow mb-3">Mode de retrait</div>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1">
            {Object.entries(PICKUPS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => onChangePickup(k)}
                className={`rounded-xl px-2 py-3 text-xs font-semibold transition ${pickup === k ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-primary-glow">
            <Truck className="h-4 w-4" /> Retrait proche de votre gate — Stand
            Merch C2
          </div>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Votre panier est vide</p>
            <button
              onClick={onBack}
              className="mt-4 rounded-2xl bg-white/5 px-6 py-3 text-sm"
            >
              Parcourir la boutique
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="glass rounded-3xl p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-2xl shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${item.visual.from}, ${item.visual.to})`,
                    }}
                  >
                    <div className="h-full w-full grid place-items-center">
                      <span className="text-xs font-bold text-white">
                        {item.visual.label}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {fmt(item.price)} / unité
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onChangeQty(item.id, item.qty - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onChangeQty(item.id, item.qty + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-semibold text-primary-glow">
                      {fmt(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {items.length > 0 && (
          <>
            {error && (
              <div className="rounded-2xl bg-destructive/15 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Retrait</span>
                <span className="text-success">Gratuit</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-display text-xl font-semibold text-primary-glow">
                  {fmt(subtotal)}
                </span>
              </div>
            </div>
            <button
              onClick={confirmOrder}
              disabled={loading}
              className="w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? "Confirmation..." : `Commander · ${fmt(subtotal)}`}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

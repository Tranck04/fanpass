import { BadgePercent, Plus, ShoppingCart, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { FilterBar } from "@/components/fanpass/shared/FilterBar";
import { PanierView } from "./PanierView";
import { fanpassFetch } from "@/lib/fanpass-api";

type Product = {
  id: string;
  name: string;
  category: string;
  team: string;
  match_tag?: string;
  event_tag?: string;
  price: number;
  rating: number;
  stock: number;
  badge: string;
  promo: string;
  pickup: string[];
  visual: { label: string; from: string; to: string };
};
type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  visual: { label: string; from: string; to: string };
};
type MerchFilter = "all" | "match" | "official" | "club" | "local" | "sponsor";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "maroc-home",
    name: "Maillot Maroc 2030 Home",
    category: "official",
    team: "Maroc",
    match_tag: "Maroc vs Espagne",
    price: 790,
    rating: 4.9,
    stock: 84,
    badge: "Officiel",
    promo: "15% avec billet Gate C",
    pickup: ["stadium", "fan_zone", "event"],
    visual: { label: "MAR", from: "#C8102E", to: "#006233" },
  },
  {
    id: "scarf-opening",
    name: "Écharpe Maroc vs Espagne",
    category: "souvenir",
    team: "Maroc",
    match_tag: "Maroc vs Espagne",
    price: 220,
    rating: 4.8,
    stock: 62,
    badge: "Match-day",
    promo: "Retrait express",
    pickup: ["stadium", "fan_zone"],
    visual: { label: "M/E", from: "#D92332", to: "#0D1F3C" },
  },
  {
    id: "corniche-pack",
    name: "Pack Casablanca Corniche",
    category: "sponsor",
    team: "FanPass",
    event_tag: "Casablanca Corniche",
    price: 360,
    rating: 4.7,
    stock: 51,
    badge: "Sponsor",
    promo: "Boisson + badge + tote",
    pickup: ["fan_zone"],
    visual: { label: "CFC", from: "#1A6FE8", to: "#00C48C" },
  },
  {
    id: "cap-gate-c",
    name: "Casquette Atlas Gate C",
    category: "official",
    team: "Maroc",
    match_tag: "Maroc vs Espagne",
    price: 280,
    rating: 4.6,
    stock: 39,
    badge: "Gate C",
    promo: "Retrait Nord",
    pickup: ["stadium"],
    visual: { label: "GC", from: "#0D1F3C", to: "#1A6FE8" },
  },
  {
    id: "wydad-heritage",
    name: "Wydad Heritage 2031",
    category: "club",
    team: "Wydad AC",
    price: 640,
    rating: 4.8,
    stock: 44,
    badge: "Club",
    promo: "Précommande club",
    pickup: ["event", "stadium"],
    visual: { label: "WAC", from: "#B80F1C", to: "#F6F6F6" },
  },
  {
    id: "raja-drop",
    name: "Raja Streetwear Drop",
    category: "club",
    team: "Raja CA",
    price: 590,
    rating: 4.7,
    stock: 37,
    badge: "Club",
    promo: "Drop limité",
    pickup: ["event", "fan_zone"],
    visual: { label: "RCA", from: "#00843D", to: "#111827" },
  },
  {
    id: "babouche",
    name: "Babouche Supporter",
    category: "local",
    team: "Artisans Maroc",
    price: 310,
    rating: 4.9,
    stock: 29,
    badge: "Local",
    promo: "Fait main",
    pickup: ["event", "fan_zone"],
    visual: { label: "ART", from: "#C17C2C", to: "#006D77" },
  },
  {
    id: "ceramic-mug",
    name: "Mug Céramique 2030",
    category: "local",
    team: "Safialab",
    price: 180,
    rating: 4.5,
    stock: 73,
    badge: "Souvenir",
    promo: "Offre duo",
    pickup: ["fan_zone", "event"],
    visual: { label: "2030", from: "#FFFFFF", to: "#1A6FE8" },
  },
];

const FILTERS: { id: MerchFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "match", label: "Mon match" },
  { id: "official", label: "Officiel" },
  { id: "club", label: "Clubs" },
  { id: "local", label: "Local" },
  { id: "sponsor", label: "Sponsor" },
];
const PICKUPS: Record<string, string> = {
  stadium: "Stade",
  fan_zone: "Fan zone",
  event: "Event",
};
function fmt(n: number) {
  return `${n.toLocaleString("fr-MA")} MAD`;
}

export function MerchSection({ onBack }: { onBack: () => void }) {
  const { token } = useAuth();
  const ticket = useActiveTicket();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [filter, setFilter] = useState<MerchFilter>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pickup, setPickup] = useState("stadium");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => setLoading(false), 4000);
    (async () => {
      try {
        const r = await fanpassFetch(`/merch?filter=${filter}`, token, {
          signal: AbortSignal.timeout(4000),
        });
        if (r.ok) {
          const d = await r.json();
          setProducts(d.products);
        }
      } catch {
        // Keep fallback products if the API is unavailable.
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();
    return () => clearTimeout(t);
  }, [token, filter]);

  const filtered = useMemo(() => {
    if (filter === "all") return products;
    if (filter === "match")
      return products.filter(
        (p) => p.match_tag === ticket.title || p.team === "Maroc",
      );
    return products.filter((p) => p.category === filter);
  }, [products, filter, ticket]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(p: Product) {
    if (!p.pickup.includes(pickup)) setPickup(p.pickup[0]);
    setCart((prev) => {
      const ex = prev.find((x) => x.id === p.id);
      if (ex)
        return prev.map((x) =>
          x.id === p.id ? { ...x, qty: Math.min(9, x.qty + 1) } : x,
        );
      return [
        ...prev,
        { id: p.id, name: p.name, price: p.price, qty: 1, visual: p.visual },
      ];
    });
  }
  function changeQty(id: string, q: number) {
    setCart((prev) =>
      prev
        .map((x) =>
          x.id === id ? { ...x, qty: Math.max(0, Math.min(9, q)) } : x,
        )
        .filter((x) => x.qty > 0),
    );
  }

  if (showCart)
    return (
      <PanierView
        items={cart}
        pickup={pickup}
        onChangePickup={setPickup}
        onChangeQty={changeQty}
        onBack={() => setShowCart(false)}
        onOrderComplete={() => setCart([])}
      />
    );
  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="glass rounded-3xl p-6 animate-pulse space-y-3"
          >
            <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
            <div className="h-3 w-full bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Retour
        </button>
        <div>
          <div className="label-xs text-primary-glow">Merchandising</div>
          <h1 className="font-display text-2xl font-semibold">Boutique fan</h1>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15">
            <BadgePercent className="h-5 w-5 text-primary-glow" />
          </div>
          <div>
            <div className="label-xs text-primary-glow">
              Recommandé pour vous
            </div>
            <div className="mt-1 font-display text-lg font-semibold">
              {ticket.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Produits liés à votre match · {ticket.gate}
            </p>
          </div>
        </div>
      </div>

      {/* Cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="w-full glass rounded-3xl p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15">
              <ShoppingCart className="h-5 w-5 text-primary-glow" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                {cartCount} article{cartCount > 1 ? "s" : ""}
              </div>
              <div className="text-xs text-muted-foreground">
                {fmt(cart.reduce((s, i) => s + i.price * i.qty, 0))}
              </div>
            </div>
          </div>
          <span className="label-xs text-primary-glow">Voir le panier →</span>
        </button>
      )}

      {/* Catalog */}
      <FilterBar items={FILTERS} activeId={filter} onChange={setFilter} />
      <div className="space-y-3">
        {filtered.map((p) => (
          <article key={p.id} className="glass rounded-3xl p-4">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div
                className="h-20 rounded-2xl shrink-0 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${p.visual.from}, ${p.visual.to})`,
                }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div className="rounded-xl bg-black/20 px-2 py-1 text-xs font-bold text-white">
                    {p.visual.label}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="label-xs text-primary-glow">
                        {p.badge}
                      </span>
                    </div>
                    <h2 className="mt-1 font-display text-base font-semibold leading-tight">
                      {p.name}
                    </h2>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="font-display text-lg font-semibold text-primary-glow">
                      {fmt(p.price)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-primary-glow text-primary-glow" />
                      {p.rating} · {p.team}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="rounded-2xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground glow-primary"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-white/5 p-3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <BadgePercent className="h-4 w-4 text-primary-glow" />
                {p.promo}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.pickup.map((pk) => (
                  <span
                    key={pk}
                    className="rounded-full bg-primary/10 px-2 py-1 text-[0.65rem] font-semibold text-primary-glow"
                  >
                    {PICKUPS[pk]}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

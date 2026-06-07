import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  Navigation,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { MetaBadge } from "@/components/fanpass/shared/MetaBadge";
import { FilterBar } from "@/components/fanpass/shared/FilterBar";
import { fanpassFetch } from "@/lib/fanpass-api";

const RESERVATIONS_STORAGE_KEY = "fanpass:eventReservations:v1";

type FanEvent = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  capacity: number;
  safety: string;
  is_official: boolean;
  verified: boolean;
  description: string;
  program: string[];
  partners: string[];
  merch: string;
  route: string;
  team: string;
  ambiance: string;
  languages: string[];
  linked_match: string;
};
type RoutePreview = {
  eventId: string;
  title: string;
  detail: string;
};

const FALLBACK_EVENTS: FanEvent[] = [
  {
    id: "casa-corniche",
    category: "fan_zone",
    title: "Casablanca Corniche",
    subtitle: "Fan zone officielle",
    city: "Casablanca",
    venue: "Corniche Ain Diab",
    date: "14 juin 2030",
    time: "16:00 - 01:00",
    price: "Gratuit (réservation)",
    capacity: 82,
    safety: "Dense",
    is_official: true,
    verified: true,
    description: "Écran géant, DJ live, food court et zone sponsors.",
    program: [
      "16:00 ouverture",
      "18:30 show supporters",
      "22:15 DJ post-match",
    ],
    partners: ["ONMT", "Maroc Telecom", "Coca-Cola"],
    merch: "Écharpe Maroc 2030",
    route: "Tram Casa Port + navette Corniche",
    team: "Maroc",
    ambiance: "festive",
    languages: ["FR", "AR", "EN"],
    linked_match: "Maroc vs Espagne",
  },
  {
    id: "marrakech-medina",
    category: "fan_zone",
    title: "Marrakech Medina Live",
    subtitle: "Football, concerts et artisans",
    city: "Marrakech",
    venue: "Esplanade Menara",
    date: "4 juillet 2030",
    time: "15:00 - 00:30",
    price: "À partir de 180 MAD",
    capacity: 68,
    safety: "Controle",
    is_official: true,
    verified: true,
    description: "Fan zone mêlant football mondial et culture marocaine.",
    program: [
      "15:00 village artisans",
      "18:00 concert Gnawa",
      "23:00 after match",
    ],
    partners: ["Visit Marrakech", "Royal Air Maroc"],
    merch: "Pack souvenir Menara",
    route: "Drop-off Menara",
    team: "Neutre",
    ambiance: "culturelle",
    languages: ["FR", "EN", "AR"],
    linked_match: "Argentine vs Allemagne",
  },
  {
    id: "rabat-ocean",
    category: "watch_party",
    title: "Rabat Ocean Stage",
    subtitle: "Familles, food court",
    city: "Rabat",
    venue: "Bouregreg Fan Park",
    date: "18 juin 2030",
    time: "14:00 - 23:30",
    price: "160 MAD",
    capacity: 46,
    safety: "Calme",
    is_official: false,
    verified: true,
    description: "Zone assise, stats live et animations enfants.",
    program: ["14:00 ouverture", "17:30 quiz", "20:15 highlights"],
    partners: ["Bouregreg Marina", "Decathlon"],
    merch: "Maillot enfant",
    route: "Parking Marina + entrée Family",
    team: "Neutre",
    ambiance: "famille",
    languages: ["FR", "AR"],
    linked_match: "France vs Bresil",
  },
  {
    id: "jersey-launch",
    category: "club_event",
    title: "Lancement Maillot Maroc 2030",
    subtitle: "Showcase officiel",
    city: "Casablanca",
    venue: "FanPass Arena Pop-up",
    date: "13 juin 2030",
    time: "19:00 - 22:00",
    price: "120 MAD",
    capacity: 54,
    safety: "Controle",
    is_official: true,
    verified: true,
    description: "Révélation maillot, rencontre légendes, précommande.",
    program: ["19:00 reveal", "20:00 légendes", "21:00 précommande"],
    partners: ["FRMF", "Puma"],
    merch: "-15% précommande",
    route: "Taxi/VTC partenaire",
    team: "Maroc",
    ambiance: "premium",
    languages: ["FR", "AR"],
    linked_match: "Maroc vs Espagne",
  },
  {
    id: "sponsor-skills",
    category: "sponsor",
    title: "Skills Challenge Atlas",
    subtitle: "Mini-tournoi sponsor",
    city: "Casablanca",
    venue: "Village Sponsors Nord",
    date: "14 juin 2030",
    time: "12:00 - 18:30",
    price: "Pass requis",
    capacity: 61,
    safety: "Controle",
    is_official: false,
    verified: true,
    description: "Défis football et lots partenaires.",
    program: ["12:00 inscriptions", "14:00 tournoi", "17:30 lots"],
    partners: ["Adidas", "Orange", "CAF"],
    merch: "Ballon collector",
    route: "Corridor Nord",
    team: "Neutre",
    ambiance: "festive",
    languages: ["FR", "EN", "AR"],
    linked_match: "Maroc vs Espagne",
  },
  {
    id: "supporters-meetup",
    category: "community",
    title: "Meet-up Supporters Atlas",
    subtitle: "Point de rencontre",
    city: "Rabat",
    venue: "Place Al Barid",
    date: "18 juin 2030",
    time: "15:30 - 17:00",
    price: "Gratuit",
    capacity: 38,
    safety: "Calme",
    is_official: false,
    verified: false,
    description: "Groupe temporaire vers le stade.",
    program: ["15:30 check-in", "16:15 chants", "17:00 départ"],
    partners: ["Tram Rabat"],
    merch: "Badge offert",
    route: "Départ collectif Gate E",
    team: "Neutre",
    ambiance: "sociale",
    languages: ["FR", "EN"],
    linked_match: "France vs Bresil",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "fan_zone", label: "Fan Zones" },
  { id: "watch_party", label: "Watch" },
  { id: "sponsor", label: "Sponsors" },
  { id: "club_event", label: "Club" },
  { id: "community", label: "Communauté" },
];

function catIcon(c: string) {
  if (c === "fan_zone") return Sparkles;
  if (c === "watch_party") return Users;
  if (c === "sponsor") return Trophy;
  if (c === "club_event") return ShoppingBag;
  return CheckCircle2;
}
function catLabel(c: string) {
  if (c === "fan_zone") return "Fan zone officielle";
  if (c === "watch_party") return "Watch party";
  if (c === "sponsor") return "Activation sponsor";
  if (c === "club_event") return "Club & merch";
  return "Communauté";
}
function safetyClass(s: string) {
  if (s === "Dense") return "bg-destructive/20 text-destructive";
  if (s === "Controle") return "bg-primary/20 text-primary-glow";
  return "bg-success/20 text-success";
}

function readReservedIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function EvenementsSection() {
  const { token } = useAuth();
  const ticket = useActiveTicket();
  const [events, setEvents] = useState<FanEvent[]>(FALLBACK_EVENTS);
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(FALLBACK_EVENTS[0].id);
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [routePreview, setRoutePreview] = useState<RoutePreview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReservedIds(readReservedIds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(
      RESERVATIONS_STORAGE_KEY,
      JSON.stringify(reservedIds),
    );
  }, [hydrated, reservedIds]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => setLoading(false), 4000);
    (async () => {
      try {
        const r = await fanpassFetch("/events", token, {
          signal: AbortSignal.timeout(4000),
        });
        if (r.ok) setEvents(await r.json());
      } catch {
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();
    return () => clearTimeout(t);
  }, [token]);

  const filtered = useMemo(
    () =>
      category === "all"
        ? events
        : events.filter((e) => e.category === category),
    [events, category],
  );
  const selected =
    filtered.find((e) => e.id === selectedId) ??
    filtered[0] ??
    FALLBACK_EVENTS[0];

  async function reserve(id: string) {
    setReservedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (!token) return;
    try {
      await fanpassFetch(`/events/${id}/reserve`, token, {
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Keep the local reservation if the API is unavailable during a demo.
    }
  }

  function openRoute(event: FanEvent) {
    setRoutePreview({
      eventId: event.id,
      title: event.title,
      detail: `${event.route} depuis ${ticket.city}. Arrivee : ${event.venue}.`,
    });
  }

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
      <FilterBar
        items={CATEGORIES.map((c) => ({ id: c.id as any, label: c.label }))}
        activeId={category as any}
        onChange={(id: any) => setCategory(id)}
      />

      {/* Selected event detail */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-xs text-primary-glow">
                {catLabel(selected.category)}
              </span>
              {selected.is_official && (
                <span className="label-xs rounded-full bg-success/15 px-2 py-1 text-success flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3" /> Officiel
                </span>
              )}
            </div>
            <div className="mt-1 font-display text-xl font-semibold">
              {selected.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {selected.subtitle} · {selected.city}
            </p>
          </div>
          <span
            className={`label-xs rounded-full px-2 py-1 ${safetyClass(selected.safety)}`}
          >
            {selected.safety}
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {selected.description}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <MetaBadge icon={MapPin} label={selected.venue} />
          <MetaBadge
            icon={CalendarDays}
            label={`${selected.date} · ${selected.time}`}
          />
          <MetaBadge icon={Ticket} label={selected.price} />
          <MetaBadge icon={Flame} label={`Capacité ${selected.capacity}%`} />
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-success via-primary-glow to-destructive"
            style={{ width: `${selected.capacity}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => reserve(selected.id)}
            className={`rounded-2xl py-3 text-xs font-medium transition ${reservedIds.includes(selected.id) ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground glow-primary"}`}
          >
            {reservedIds.includes(selected.id) ? "✓ Réservé" : "Réserver"}
          </button>
          <button
            onClick={() => openRoute(selected)}
            className="glass rounded-2xl py-3 text-xs font-medium"
          >
            Itinéraire
          </button>
        </div>
      </div>

      {routePreview && (
        <div className="glass rounded-3xl p-5 ring-1 ring-primary/20">
          <div className="label-xs text-primary-glow">Itineraire event</div>
          <div className="mt-1 font-display text-lg font-semibold">
            {routePreview.title}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {routePreview.detail}
          </p>
          <button
            onClick={() => setRoutePreview(null)}
            className="mt-4 rounded-2xl bg-white/5 px-4 py-2 text-xs font-medium"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Event list */}
      <div className="space-y-3">
        {filtered.map((e) => {
          const I = catIcon(e.category);
          const sel = e.id === selected.id;
          const linked = e.linked_match === ticket.title;
          return (
            <article
              key={e.id}
              className={`rounded-3xl p-5 transition ${sel ? "bg-primary/15 ring-1 ring-primary/40" : "glass"}`}
            >
              <button
                onClick={() => setSelectedId(e.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15">
                      <I className="h-5 w-5 text-primary-glow" />
                    </div>
                    <div>
                      <div className="label-xs text-primary-glow">
                        {catLabel(e.category)}
                      </div>
                      <h2 className="mt-1 font-display text-lg font-semibold">
                        {e.title}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {e.subtitle}
                      </p>
                    </div>
                  </div>
                  {linked && (
                    <span className="label-xs rounded-full bg-success/20 px-2 py-1 text-success">
                      Lié au billet
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {e.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <MetaBadge icon={MapPin} label={e.venue} />
                  <MetaBadge
                    icon={CalendarDays}
                    label={`${e.date} · ${e.time}`}
                  />
                  <MetaBadge icon={Ticket} label={e.price} />
                  <MetaBadge icon={Users} label={e.partners.join(", ")} />
                </div>
              </button>
            </article>
          );
        })}
      </div>

      {/* Program */}
      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">
          Programme · {selected.title}
        </div>
        <div className="mt-4 space-y-2">
          {selected.program.map((s) => (
            <div
              key={s}
              className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm"
            >
              <Clock className="h-4 w-4 text-primary-glow" />
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Safety + Merch + Route */}
      <div className="grid grid-cols-2 gap-3">
        <IC
          icon={ShieldCheck}
          title="Sécurité"
          detail={`${selected.safety} · jauge ${selected.capacity}%`}
        />
        <IC icon={ShoppingBag} title="Merch" detail={selected.merch} />
        <IC icon={Navigation} title="Accès" detail={selected.route} />
        <IC
          icon={Star}
          title="Langues"
          detail={selected.languages.join(", ")}
        />
      </div>
    </div>
  );
}

function IC({
  icon: I,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15">
          <I className="h-5 w-5 text-primary-glow" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
      </div>
    </div>
  );
}

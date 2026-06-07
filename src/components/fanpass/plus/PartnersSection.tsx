import {
  BadgePercent,
  CalendarDays,
  Car,
  Check,
  Clock,
  Crown,
  Handshake,
  Hotel,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import type { PartnerCategory, ActiveTicket } from "@/lib/types";
import { FilterBar } from "@/components/fanpass/shared/FilterBar";
import { MetaBadge } from "@/components/fanpass/shared/MetaBadge";

const BOOKINGS_STORAGE_KEY = "fanpass:partnerBookings:v1";

type PartnerFilter = "all" | PartnerCategory;
type JourneyStep = "pre_match" | "to_gate" | "post_match" | "fan_zone";

type PartnerService = {
  id: string;
  category: PartnerCategory;
  name: string;
  partner: string;
  city: string;
  journeyStep: JourneyStep;
  price: string;
  rating: number;
  eta: string;
  distance: string;
  matchTag?: string;
  gateTag?: string;
  linkedEvent?: string;
  benefit: string;
  detail: string;
  restrictions: string[];
  pickupHint: string;
};

type PartnerBooking = {
  id: string;
  serviceId: string;
  serviceName: string;
  category: PartnerCategory;
  city: string;
  ticketTitle: string;
  gate: string;
  status: "reserved" | "ready";
  createdAt: string;
};

const SERVICES: PartnerService[] = [
  {
    id: "casa-vtc-gate-c",
    category: "mobility",
    name: "VTC Gate C Drop-off",
    partner: "Taxi Vert Partner",
    city: "Casablanca",
    journeyStep: "to_gate",
    price: "À partir de 95 MAD",
    rating: 4.8,
    eta: "8 min",
    distance: "Drop-off Nord",
    matchTag: "Maroc vs Espagne",
    gateTag: "Gate C",
    benefit: "Point de dépôt validé par le périmètre sécurité.",
    detail: "Trajet court vers le drop-off Nord puis marche finale Gate C.",
    restrictions: ["Pas de dépôt devant gate", "Prix fixe avant coup d'envoi"],
    pickupHint: "Prise en charge hôtel ou fan zone",
  },
  {
    id: "casa-hotel-fanpass",
    category: "stay",
    name: "Hotel Fan Shuttle Casa",
    partner: "Atlas Hospitality",
    city: "Casablanca",
    journeyStep: "pre_match",
    price: "Pack 1 nuit",
    rating: 4.6,
    eta: "Navette 17:40",
    distance: "4.2 km stade",
    matchTag: "Maroc vs Espagne",
    benefit: "Navette officielle incluse vers Gate C.",
    detail: "Hébergement partenaire avec horaire navette calé sur le billet.",
    restrictions: ["Offre match-day uniquement", "Confirmation hôtel externe"],
    pickupHint: "Lobby partenaire",
  },
  {
    id: "corniche-food-table",
    category: "food",
    name: "Table supporter Corniche",
    partner: "Casa Food Court",
    city: "Casablanca",
    journeyStep: "fan_zone",
    price: "Menu 160 MAD",
    rating: 4.7,
    eta: "Créneau 16:30",
    distance: "Fan zone",
    linkedEvent: "Casablanca Corniche",
    benefit: "Menu rapide avant navette stade.",
    detail: "Restauration partenaire connectée à la fan zone officielle.",
    restrictions: ["Créneau de 45 min", "Retrait via QR FanPass"],
    pickupHint: "Comptoir food court A",
  },
  {
    id: "casa-tour-halfday",
    category: "tourism",
    name: "Mini tour Casablanca",
    partner: "Visit Morocco",
    city: "Casablanca",
    journeyStep: "pre_match",
    price: "290 MAD",
    rating: 4.5,
    eta: "Départ 11:00",
    distance: "Retour fan zone",
    matchTag: "Maroc vs Espagne",
    benefit: "Retour garanti avant ouverture fan zone.",
    detail: "Tour court pour supporters internationaux le jour du match.",
    restrictions: ["Bagage cabine uniquement", "Langues FR/EN/ES"],
    pickupHint: "Place Mohammed V",
  },
  {
    id: "fan-experience-atlas",
    category: "experience",
    name: "Atlas Fan Experience Pack",
    partner: "Fan Embassy",
    city: "Casablanca",
    journeyStep: "to_gate",
    price: "420 MAD",
    rating: 4.9,
    eta: "Départ 17:25",
    distance: "Casa Port",
    matchTag: "Maroc vs Espagne",
    gateTag: "Gate C",
    benefit: "Guide groupe + chant supporters + route Gate C.",
    detail: "Pack temporaire pour rejoindre le stade avec un groupe encadré.",
    restrictions: ["Groupe limité à 60 fans", "Arrivée 15 min avant départ"],
    pickupHint: "Casa Port - sortie tram",
  },
  {
    id: "premium-lounge-atlas",
    category: "premium",
    name: "Lounge Atlas Upgrade",
    partner: "FRMF Premium",
    city: "Casablanca",
    journeyStep: "pre_match",
    price: "Sur invitation",
    rating: 4.9,
    eta: "Ouverture 17:30",
    distance: "Tribune Atlas",
    matchTag: "Maroc vs Espagne",
    gateTag: "Gate C",
    benefit: "Accueil premium lié au billet et retrait merch.",
    detail: "Service premium connecté au billet, pas une vente libre.",
    restrictions: ["Éligibilité selon billet", "Contrôle identité"],
    pickupHint: "Gate C - desk premium",
  },
  {
    id: "rabat-family-restaurant",
    category: "food",
    name: "Family Dinner Bouregreg",
    partner: "Marina Rabat",
    city: "Rabat",
    journeyStep: "fan_zone",
    price: "Menu famille 390 MAD",
    rating: 4.6,
    eta: "Créneau 14:30",
    distance: "Bouregreg Fan Park",
    matchTag: "France vs Bresil",
    benefit: "Table proche fan zone famille.",
    detail: "Restauration avant match pour familles et supporters calmes.",
    restrictions: ["Réservation 4 personnes max", "Arrivée avant 15:00"],
    pickupHint: "Marina - entrée Family",
  },
  {
    id: "rabat-vtc-return",
    category: "mobility",
    name: "Retour VTC Supporters",
    partner: "Rabat Mobility",
    city: "Rabat",
    journeyStep: "post_match",
    price: "Prix bloqué 120 MAD",
    rating: 4.4,
    eta: "Après 21:30",
    distance: "Zone Est",
    matchTag: "France vs Bresil",
    gateTag: "Gate E",
    benefit: "Retour après match depuis zone officielle.",
    detail: "Service de retour uniquement depuis les zones autorisées.",
    restrictions: ["Pas de prise en charge hors périmètre", "Créneau variable"],
    pickupHint: "Zone Est VTC",
  },
  {
    id: "marrakech-culture-pack",
    category: "tourism",
    name: "Menara Culture Pack",
    partner: "Visit Marrakech",
    city: "Marrakech",
    journeyStep: "fan_zone",
    price: "250 MAD",
    rating: 4.8,
    eta: "Départ 15:00",
    distance: "Esplanade Menara",
    matchTag: "Argentine vs Allemagne",
    linkedEvent: "Marrakech Medina Live",
    benefit: "Culture locale puis fan zone officielle.",
    detail: "Pack court lié au quart de finale et à la fan zone Menara.",
    restrictions: ["Retour avant 18:00", "Guide FR/EN"],
    pickupHint: "Desk Menara",
  },
];

const FILTER_ITEMS: { id: PartnerFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "mobility", label: "VTC" },
  { id: "stay", label: "Hôtel" },
  { id: "food", label: "Food" },
  { id: "tourism", label: "Tour" },
  { id: "experience", label: "Packs" },
];

function readBookings(): PartnerBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((b) => typeof b?.id === "string");
  } catch {
    return [];
  }
}

function categoryLabel(c: PartnerCategory) {
  if (c === "mobility") return "Transport";
  if (c === "stay") return "Hébergement";
  if (c === "food") return "Restaurant";
  if (c === "tourism") return "Tourisme";
  if (c === "experience") return "Fan pack";
  return "Premium";
}

function categoryIcon(c: PartnerCategory) {
  if (c === "mobility") return Car;
  if (c === "stay") return Hotel;
  if (c === "food") return Utensils;
  if (c === "tourism") return MapPin;
  if (c === "experience") return Sparkles;
  return Crown;
}

function journeyLabel(step: JourneyStep) {
  if (step === "pre_match") return "Avant match";
  if (step === "to_gate") return "Vers gate";
  if (step === "post_match") return "Retour";
  return "Fan zone";
}

function createBooking(
  service: PartnerService,
  ticket: ActiveTicket,
): PartnerBooking {
  return {
    id: `partner-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    city: service.city,
    ticketTitle: ticket.title,
    gate: ticket.gate,
    status: service.category === "premium" ? "ready" : "reserved",
    createdAt: new Date().toISOString(),
  };
}

export function PartnersSection({ onBack }: { onBack: () => void }) {
  const ticket = useActiveTicket();
  const [filter, setFilter] = useState<PartnerFilter>("all");
  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [selectedId, setSelectedId] = useState(SERVICES[0].id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookings(readBookings());
    const best =
      SERVICES.find(
        (s) => s.matchTag === ticket.title || s.gateTag === ticket.gate,
      ) ?? SERVICES[0];
    setSelectedId(best.id);
    setHydrated(true);
  }, [ticket.gate, ticket.title]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings, hydrated]);

  const visibleServices = useMemo(() => {
    const filtered =
      filter === "all"
        ? SERVICES
        : SERVICES.filter((s) => s.category === filter);
    return [...filtered].sort((a, b) => {
      const aFit =
        Number(a.matchTag === ticket.title) + Number(a.gateTag === ticket.gate);
      const bFit =
        Number(b.matchTag === ticket.title) + Number(b.gateTag === ticket.gate);
      return bFit - aFit;
    });
  }, [filter, ticket.gate, ticket.title]);

  const selectedService =
    visibleServices.find((s) => s.id === selectedId) ??
    visibleServices[0] ??
    SERVICES[0];
  const cityServices = SERVICES.filter((s) => s.city === ticket.city);
  const latestBooking = bookings[0];

  function reserve(service: PartnerService) {
    setSelectedId(service.id);
    setBookings((c) => [createBooking(service, ticket), ...c]);
  }

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
          <div className="label-xs text-primary-glow">Partner Services</div>
          <h1 className="font-display text-2xl font-semibold">Services fan</h1>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15">
            <Handshake className="h-5 w-5 text-primary-glow" />
          </div>
          <div className="min-w-0">
            <div className="label-xs text-primary-glow">Contexte fan</div>
            <div className="mt-1 font-display text-lg font-semibold">
              {ticket.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {ticket.venue} - {ticket.date} - {ticket.gate}
            </p>
          </div>
        </div>
      </div>

      {latestBooking && (
        <div className="glass rounded-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label-xs text-primary-glow">
                Réservation active
              </div>
              <div className="mt-1 font-display text-xl font-semibold">
                {latestBooking.serviceName}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {categoryLabel(latestBooking.category)} -{" "}
                {latestBooking.ticketTitle}
              </p>
            </div>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              {latestBooking.status === "ready" ? "Prêt" : "Réservé"}
            </span>
          </div>
        </div>
      )}

      <FilterBar items={FILTER_ITEMS} activeId={filter} onChange={setFilter} />

      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">Service sélectionné</div>
        <div className="mt-1 font-display text-xl font-semibold">
          {selectedService.name}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedService.detail}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <MetaBadge icon={MapPin} label={selectedService.distance} />
          <MetaBadge icon={Clock} label={selectedService.eta} />
          <MetaBadge
            icon={CalendarDays}
            label={journeyLabel(selectedService.journeyStep)}
          />
          <MetaBadge icon={BadgePercent} label={selectedService.price} />
        </div>
        <div className="mt-4 rounded-2xl bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary-glow" /> Connecté au
            parcours fan
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {selectedService.benefit}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visibleServices.map((service) => {
          const Icon = categoryIcon(service.category);
          const linked =
            service.matchTag === ticket.title ||
            service.gateTag === ticket.gate ||
            service.city === ticket.city;
          return (
            <article
              key={service.id}
              className={`rounded-3xl p-5 transition ${service.id === selectedId ? "bg-primary/15 ring-1 ring-primary/40" : "glass"}`}
            >
              <button
                type="button"
                onClick={() => setSelectedId(service.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15">
                      <Icon className="h-5 w-5 text-primary-glow" />
                    </div>
                    <div>
                      <div className="label-xs text-primary-glow">
                        {categoryLabel(service.category)} -{" "}
                        {journeyLabel(service.journeyStep)}
                      </div>
                      <h2 className="mt-1 font-display text-lg font-semibold">
                        {service.name}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {service.partner}
                      </p>
                    </div>
                  </div>
                  {linked && (
                    <span className="label-xs rounded-full bg-success/20 px-2 py-1 text-success">
                      Lié
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {service.benefit}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <MetaBadge icon={MapPin} label={service.pickupHint} />
                  <MetaBadge icon={Clock} label={service.eta} />
                  <MetaBadge
                    icon={Star}
                    label={`${service.rating.toFixed(1)} partenaire`}
                  />
                  <MetaBadge icon={BadgePercent} label={service.price} />
                </div>
              </button>
              <button
                onClick={() => reserve(service)}
                className="mt-4 w-full rounded-2xl bg-primary py-3 text-xs font-medium text-primary-foreground glow-primary"
              >
                Réserver
              </button>
            </article>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">Limites du service</div>
        <div className="mt-3 space-y-2">
          {selectedService.restrictions.map((r) => (
            <div
              key={r}
              className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-3 text-xs"
            >
              <Check className="h-4 w-4 shrink-0 text-success" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

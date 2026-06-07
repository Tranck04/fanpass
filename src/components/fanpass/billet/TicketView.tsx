import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Fingerprint,
  LockKeyhole,
  MapPin,
  Minus,
  Navigation,
  Plus,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Upload,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QRTicket } from "./QRTicket";
import { SectionTitle } from "@/components/fanpass/shared/SectionTitle";
import { ImportTicketView } from "./ImportTicketView";
import { AcceptTransferView } from "./AcceptTransferView";
import { ScanView } from "./ScanView";
import { TransferModal } from "./TransferModal";
import { useAuth } from "@/hooks/useAuth";
import { fanpassFetch } from "@/lib/fanpass-api";
import type {
  TicketEventType,
  TicketSegment,
  TicketStatus,
  TicketTier,
  TicketAccess,
  TicketEvent,
  PurchasedTicket,
  Density,
  PrimaryTab,
} from "@/lib/types";

type TicketEventDensity = "Calme" | "Moderee" | "Forte" | "Vibrante";

const STORAGE_KEY = "fanpass:purchasedTickets:v1";

type ApiTicketTier = {
  id: string;
  name: string;
  price_mad?: number;
  price?: number;
  benefits?: string[];
};

type ApiTicketEvent = {
  id: string;
  type: TicketEventType;
  title: string;
  subtitle?: string;
  city?: string;
  venue?: string;
  date?: string;
  time?: string;
  density?: TicketEventDensity;
  description?: string;
  access?: Partial<TicketAccess>;
  tiers?: ApiTicketTier[];
};

type ApiPurchasedTicket = {
  id: string;
  match_id?: string | null;
  event_id?: string | null;
  event_type?: TicketEventType;
  title?: string;
  subtitle?: string;
  city?: string;
  venue?: string;
  date?: string;
  time?: string;
  tier_name?: string;
  price_mad?: number;
  total_mad?: number;
  quantity?: number;
  qr_seed?: number;
  qr_raw?: string;
  gate?: string;
  gate_id?: string;
  access_zone?: string;
  tribune?: string;
  seat_label?: string;
  seat_section?: string;
  seat_row?: string;
  seat_number?: string;
  access_control?: string;
  access_rules?: string[];
  security_code?: string;
  status?: string;
  purchased_at?: string;
};

const MATCH_EVENTS: TicketEvent[] = [
  {
    id: "match-mar-esp-opening",
    type: "match",
    title: "Maroc vs Espagne",
    subtitle: "Match d'ouverture",
    city: "Casablanca",
    venue: "Grand Stade Hassan II",
    date: "14 juin 2030",
    time: "20:00",
    density: "Forte",
    description: "Le premier grand soir de la Coupe du Monde 2030 au Maroc.",
    access: {
      gate: "Gate C",
      accessZone: "Perimetre Nord",
      tribune: "Tribune Atlas",
      seatHint: "Rang 12 - Siege 47",
      accessControl: "Scan QR + controle identite aleatoire",
      rules: [
        "Arrivee conseillee 18:30",
        "Sac cabine uniquement",
        "Gate C dediee VIP",
      ],
    },
    tiers: [
      {
        id: "standard",
        name: "Standard",
        price: 950,
        currency: "MAD",
        benefits: [
          "Siege assigne",
          "QR mobile securise",
          "Itineraire gate-aware",
        ],
      },
      {
        id: "premium",
        name: "Fan Premium",
        price: 1800,
        currency: "MAD",
        benefits: ["Meilleure vue", "Acces rapide", "Pack souvenir"],
      },
      {
        id: "vip",
        name: "Atlas VIP",
        price: 3200,
        currency: "MAD",
        benefits: ["Lounge avant-match", "Gate prioritaire", "Merch inclus"],
      },
    ],
  },
  {
    id: "match-fra-bra-group",
    type: "match",
    title: "France vs Bresil",
    subtitle: "Phase de groupes",
    city: "Rabat",
    venue: "Stade Prince Moulay Abdellah",
    date: "18 juin 2030",
    time: "18:00",
    density: "Vibrante",
    description: "Un choc international dans une atmosphere de grande affiche.",
    access: {
      gate: "Gate E",
      accessZone: "Perimetre Est",
      tribune: "Tribune Ocean",
      seatHint: "Bloc E4 - Rang 8",
      accessControl: "QR dynamique + validation anti-copie",
      rules: [
        "Arrivee conseillee 16:45",
        "Passeport recommande",
        "Entree supporters visiteurs",
      ],
    },
    tiers: [
      {
        id: "standard",
        name: "Standard",
        price: 820,
        currency: "MAD",
        benefits: ["Siege assigne", "QR mobile securise", "Fan route"],
      },
      {
        id: "club",
        name: "Club Fan",
        price: 1550,
        currency: "MAD",
        benefits: ["Zone centrale", "Entree dediee", "Boisson incluse"],
      },
    ],
  },
  {
    id: "match-arg-ger-quarter",
    type: "match",
    title: "Argentine vs Allemagne",
    subtitle: "Quart de finale",
    city: "Marrakech",
    venue: "Stade de Marrakech",
    date: "4 juillet 2030",
    time: "21:00",
    density: "Forte",
    description: "Un quart de finale premium dans la ville rouge.",
    access: {
      gate: "Gate B",
      accessZone: "Perimetre Sud",
      tribune: "Tribune Menara",
      seatHint: "Bloc B2 - Rang 14",
      accessControl: "QR unique + controle billet nominatif",
      rules: [
        "Arrivee conseillee 19:15",
        "Hydratation autorisee",
        "Acces famille a proximite",
      ],
    },
    tiers: [
      {
        id: "standard",
        name: "Standard",
        price: 1100,
        currency: "MAD",
        benefits: ["Siege assigne", "QR mobile securise", "Guidage porte"],
      },
      {
        id: "premium",
        name: "Premium",
        price: 2100,
        currency: "MAD",
        benefits: ["Tribune basse", "Acces rapide", "Fan kit"],
      },
    ],
  },
];

const FAN_ZONE_EVENTS: TicketEvent[] = [
  {
    id: "zone-casa-corniche",
    type: "fan_zone",
    title: "Casablanca Corniche",
    subtitle: "Ecran geant, DJ live, street food",
    city: "Casablanca",
    venue: "Corniche Ain Diab",
    date: "14 juin 2030",
    time: "16:00 - 01:00",
    density: "Vibrante",
    description: "Fan zone oceanique liee au match d'ouverture.",
    access: {
      gate: "Entree A",
      accessZone: "Zone Atlantique",
      tribune: "Standing Fan Zone",
      seatHint: "Acces libre controle",
      accessControl: "QR fan zone + controle capacite",
      rules: [
        "Entree possible des 16:00",
        "Sortie definitive apres scan",
        "Capacite limitee",
      ],
    },
    tiers: [
      {
        id: "evening",
        name: "Pass Soiree",
        price: 220,
        currency: "MAD",
        benefits: ["Acces fan zone", "Animations live", "QR mobile securise"],
      },
      {
        id: "lounge",
        name: "Lounge Atlantique",
        price: 640,
        currency: "MAD",
        benefits: ["Zone lounge", "File rapide", "Credit food inclus"],
      },
    ],
  },
  {
    id: "zone-marrakech-medina",
    type: "fan_zone",
    title: "Marrakech Medina Live",
    subtitle: "Concerts, artisans, gastronomie",
    city: "Marrakech",
    venue: "Esplanade Menara",
    date: "4 juillet 2030",
    time: "15:00 - 00:30",
    density: "Forte",
    description:
      "Experience football et culture marocaine avant le quart de finale.",
    access: {
      gate: "Entree Medina",
      accessZone: "Village Culture",
      tribune: "Zone Scene",
      seatHint: "Acces debout",
      accessControl: "QR dynamique + jauge evenement",
      rules: [
        "Arrivee conseillee 17:00",
        "Objets encombrants interdits",
        "Re-scan necessaire apres sortie",
      ],
    },
    tiers: [
      {
        id: "access",
        name: "Pass Culture",
        price: 180,
        currency: "MAD",
        benefits: ["Acces scene", "Village artisans", "QR mobile securise"],
      },
      {
        id: "gold",
        name: "Pass Gold",
        price: 520,
        currency: "MAD",
        benefits: [
          "Vue scene premium",
          "Entree prioritaire",
          "Degustation incluse",
        ],
      },
    ],
  },
  {
    id: "zone-rabat-ocean",
    type: "fan_zone",
    title: "Rabat Ocean Stage",
    subtitle: "Families, food court, live stats",
    city: "Rabat",
    venue: "Bouregreg Fan Park",
    date: "18 juin 2030",
    time: "14:00 - 23:30",
    density: "Moderee",
    description: "Fan zone fluide pour familles et supporters internationaux.",
    access: {
      gate: "Entree Family",
      accessZone: "Zone Bouregreg",
      tribune: "Espace Famille",
      seatHint: "Zone assise non assignee",
      accessControl: "QR mobile + controle age famille",
      rules: [
        "Acces enfant accompagne",
        "Bracelet remis au scan",
        "Sortie possible avant 20:00",
      ],
    },
    tiers: [
      {
        id: "day",
        name: "Pass Journee",
        price: 160,
        currency: "MAD",
        benefits: ["Acces complet", "Live stats", "QR mobile securise"],
      },
      {
        id: "family",
        name: "Pass Confort",
        price: 480,
        currency: "MAD",
        benefits: ["Zone assise", "Entree rapide", "Pack boisson"],
      },
    ],
  },
];

const FOOTBALL_EVENTS: TicketEvent[] = [
  {
    id: "event-jersey-launch",
    type: "event",
    title: "Lancement Maillot Maroc 2030",
    subtitle: "Showcase officiel et precommande",
    city: "Casablanca",
    venue: "FanPass Arena Pop-up",
    date: "13 juin 2030",
    time: "19:00 - 22:00",
    density: "Moderee",
    description:
      "Evenement officiel autour du maillot et des souvenirs Maroc 2030.",
    access: {
      gate: "Entree Pop-up",
      accessZone: "Showroom Officiel",
      tribune: "Zone Partenaire",
      seatHint: "Creneau 19:00",
      accessControl: "QR evenement + slot horaire",
      rules: [
        "Acces sur creneau",
        "Precommande nominative",
        "Retrait possible sur place",
      ],
    },
    tiers: [
      {
        id: "access",
        name: "Pass Decouverte",
        price: 120,
        currency: "MAD",
        benefits: ["Acces showcase", "Photo booth", "QR mobile securise"],
      },
      {
        id: "collector",
        name: "Pass Collector",
        price: 450,
        currency: "MAD",
        benefits: [
          "Acces prioritaire",
          "Echarpe collector",
          "Reduction boutique",
        ],
      },
    ],
  },
  {
    id: "event-supporters-meetup",
    type: "event",
    title: "Meet-up Supporters Atlas",
    subtitle: "Point de rencontre avant stade",
    city: "Rabat",
    venue: "Place Al Barid",
    date: "18 juin 2030",
    time: "15:30 - 17:00",
    density: "Calme",
    description:
      "Groupe temporaire pour aller au stade avec des fans de la meme equipe.",
    access: {
      gate: "Check-in FanPass",
      accessZone: "Point de rencontre",
      tribune: "Groupe Atlas",
      seatHint: "Depart groupe 17:00",
      accessControl: "QR check-in + bracelet groupe",
      rules: [
        "Arrivee 15 min avant depart",
        "Langues FR/EN",
        "Guide FanPass present",
      ],
    },
    tiers: [
      {
        id: "group",
        name: "Pass Groupe",
        price: 90,
        currency: "MAD",
        benefits: ["Guide vers stade", "Point rencontre", "QR mobile securise"],
      },
    ],
  },
];

const ALL_EVENTS = [...MATCH_EVENTS, ...FAN_ZONE_EVENTS, ...FOOTBALL_EVENTS];

const INITIAL_TICKET: PurchasedTicket = {
  id: "initial-mar-esp-vip",
  eventId: "match-mar-esp-opening",
  eventType: "match",
  title: "Maroc vs Espagne",
  subtitle: "Match d'ouverture",
  city: "Casablanca",
  venue: "Grand Stade Hassan II",
  date: "14 juin 2030",
  time: "20:00",
  tierName: "Atlas VIP",
  quantity: 1,
  total: 3200,
  currency: "MAD",
  qrSeed: 203014,
  purchasedAt: "2030-06-14T12:00:00.000Z",
  status: "valid",
  gate: "Gate C",
  accessZone: "Perimetre Nord",
  tribune: "Tribune Atlas",
  seat: "Rang 12 - Siege 47",
  accessControl: "Scan QR + controle identite aleatoire",
  accessRules: [
    "Arrivee conseillee 18:30",
    "Sac cabine uniquement",
    "Gate C dediee VIP",
  ],
  securityCode: "FP-2030-C-ATLAS",
};

function formatMoney(amount: number, currency: "MAD") {
  return `${amount.toLocaleString("fr-MA")} ${currency}`;
}

function getEventLabel(type: TicketEventType) {
  if (type === "match") return "Match";
  if (type === "fan_zone") return "Fan Zone";
  return "Event";
}

function getStatusLabel(status: TicketStatus) {
  if (status === "used") return "Utilise";
  if (status === "locked") return "Bloque";
  return "Valide";
}

function densityClass(density: TicketEventDensity) {
  if (density === "Forte") return "bg-destructive/20 text-destructive";
  if (density === "Vibrante") return "bg-primary/20 text-primary-glow";
  if (density === "Moderee") return "bg-primary/15 text-primary-glow";
  return "bg-success/20 text-success";
}

function createTicketId(event: TicketEvent) {
  return `${event.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function createQrSeed(event: TicketEvent) {
  const eventSeed = Array.from(event.id).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return (eventSeed * 97 + Date.now()) % 233280;
}

function createSecurityCode(event: TicketEvent, tier: TicketTier) {
  return `FP-${event.type.toUpperCase()}-${event.id.slice(-5).toUpperCase()}-${tier.id.toUpperCase()}`;
}

function findEvent(eventId: string) {
  return ALL_EVENTS.find((event) => event.id === eventId);
}

function formatGate(gate?: string | null) {
  if (!gate) return INITIAL_TICKET.gate;
  if (gate.startsWith("Gate ")) return gate;
  if (gate.startsWith("gate-"))
    return `Gate ${gate.replace("gate-", "").toUpperCase()}`;
  return gate;
}

function statusFromApi(status?: string): TicketStatus {
  if (status === "scanned") return "used";
  if (
    status === "cancelled" ||
    status === "expired" ||
    status === "transferred"
  ) {
    return "locked";
  }
  return "valid";
}

function seedFromString(value: string) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function mapApiEvent(event: ApiTicketEvent): TicketEvent {
  const fallback = findEvent(event.id) ?? MATCH_EVENTS[0];
  const access = event.access ?? {};
  return {
    id: event.id,
    type: event.type,
    title: event.title,
    subtitle: event.subtitle ?? fallback.subtitle,
    city: event.city ?? fallback.city,
    venue: event.venue ?? fallback.venue,
    date: event.date ?? fallback.date,
    time: event.time ?? fallback.time,
    density: event.density ?? fallback.density,
    description: event.description ?? fallback.description,
    access: {
      gate: access.gate ?? fallback.access.gate,
      accessZone: access.accessZone ?? fallback.access.accessZone,
      tribune: access.tribune ?? fallback.access.tribune,
      seatHint: access.seatHint ?? fallback.access.seatHint,
      accessControl: access.accessControl ?? fallback.access.accessControl,
      rules: access.rules ?? fallback.access.rules,
    },
    tiers:
      event.tiers?.map((tier) => ({
        id: tier.id,
        name: tier.name,
        price: tier.price_mad ?? tier.price ?? 0,
        currency: "MAD",
        benefits: tier.benefits ?? [],
      })) ?? fallback.tiers,
  };
}

function mapApiTicket(ticket: ApiPurchasedTicket): PurchasedTicket {
  const eventId = ticket.event_id ?? ticket.match_id ?? "api-ticket";
  const gate = formatGate(ticket.gate ?? ticket.gate_id);
  const seat =
    ticket.seat_label ??
    [ticket.seat_section, ticket.seat_row, ticket.seat_number]
      .filter(Boolean)
      .join(" - ") ??
    INITIAL_TICKET.seat;
  return {
    ...INITIAL_TICKET,
    id: ticket.id,
    apiId: ticket.id,
    eventId,
    eventType: ticket.event_type ?? (ticket.event_id ? "event" : "match"),
    title: ticket.title ?? INITIAL_TICKET.title,
    subtitle: ticket.subtitle ?? INITIAL_TICKET.subtitle,
    city: ticket.city ?? INITIAL_TICKET.city,
    venue: ticket.venue ?? INITIAL_TICKET.venue,
    date: ticket.date ?? INITIAL_TICKET.date,
    time: ticket.time ?? INITIAL_TICKET.time,
    tierName: ticket.tier_name ?? INITIAL_TICKET.tierName,
    quantity: ticket.quantity ?? 1,
    total: ticket.total_mad ?? ticket.price_mad ?? INITIAL_TICKET.total,
    qrSeed: ticket.qr_seed ?? seedFromString(ticket.id),
    purchasedAt: ticket.purchased_at ?? new Date().toISOString(),
    status: statusFromApi(ticket.status),
    gate,
    accessZone: ticket.access_zone ?? INITIAL_TICKET.accessZone,
    tribune: ticket.tribune ?? INITIAL_TICKET.tribune,
    seat,
    accessControl: ticket.access_control ?? INITIAL_TICKET.accessControl,
    accessRules: ticket.access_rules ?? INITIAL_TICKET.accessRules,
    securityCode: ticket.security_code ?? INITIAL_TICKET.securityCode,
    qrRaw: ticket.qr_raw,
  };
}

function normalizeStoredTicket(
  ticket: Partial<PurchasedTicket>,
): PurchasedTicket {
  const event = ticket.eventId ? findEvent(ticket.eventId) : undefined;
  const fallbackAccess = event?.access ?? MATCH_EVENTS[0].access;
  return {
    ...INITIAL_TICKET,
    ...ticket,
    eventType: ticket.eventType ?? event?.type ?? INITIAL_TICKET.eventType,
    gate: ticket.gate ?? fallbackAccess.gate,
    accessZone: ticket.accessZone ?? fallbackAccess.accessZone,
    tribune: ticket.tribune ?? fallbackAccess.tribune,
    seat: ticket.seat ?? fallbackAccess.seatHint,
    accessControl: ticket.accessControl ?? fallbackAccess.accessControl,
    accessRules: ticket.accessRules ?? fallbackAccess.rules,
    status: ticket.status ?? "valid",
    securityCode: ticket.securityCode ?? "FP-LEGACY-SECURE",
  };
}

function readStoredTickets(): PurchasedTicket[] {
  if (typeof window === "undefined") return [INITIAL_TICKET];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [INITIAL_TICKET];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [INITIAL_TICKET];
    return parsed.map((ticket) => normalizeStoredTicket(ticket));
  } catch {
    return [INITIAL_TICKET];
  }
}

export function TicketView({ onNav }: { onNav?: (t: PrimaryTab) => void }) {
  const { token } = useAuth();
  const [segment, setSegment] = useState<TicketSegment>("wallet");
  const [tickets, setTickets] = useState<PurchasedTicket[]>([INITIAL_TICKET]);
  const [catalogEvents, setCatalogEvents] = useState<TicketEvent[]>(ALL_EVENTS);
  const [hydrated, setHydrated] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(INITIAL_TICKET.id);
  const [checkoutEvent, setCheckoutEvent] = useState<TicketEvent | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showAcceptTransfer, setShowAcceptTransfer] = useState(false);
  const [transferTicket, setTransferTicket] = useState<PurchasedTicket | null>(
    null,
  );

  const loadRemoteWallet = useCallback(async () => {
    if (!token) return false;
    try {
      const response = await fanpassFetch("/tickets", token, {
        signal: AbortSignal.timeout(4000),
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return false;
      const apiTickets = data.map((ticket) => mapApiTicket(ticket));
      setTickets(apiTickets);
      setActiveTicketId(apiTickets[0]?.id ?? INITIAL_TICKET.id);
      return true;
    } catch {
      return false;
    }
  }, [token]);

  useEffect(() => {
    const storedTickets = readStoredTickets();
    setTickets(storedTickets);
    setActiveTicketId(storedTickets[0]?.id ?? INITIAL_TICKET.id);
    setHydrated(true);
    void loadRemoteWallet();
  }, [loadRemoteWallet]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fanpassFetch("/tickets/events", token, {
          signal: AbortSignal.timeout(4000),
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogEvents(data.map((event) => mapApiEvent(event)));
        }
      } catch {
        // Keep the local catalogue if the API is unavailable.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [hydrated, tickets]);

  const activeTicket =
    tickets.find((ticket) => ticket.id === activeTicketId) ??
    tickets[0] ??
    INITIAL_TICKET;
  const visibleEvents =
    segment === "zones"
      ? catalogEvents.filter((event) => event.type === "fan_zone")
      : segment === "events"
        ? catalogEvents.filter((event) => event.type === "event")
        : catalogEvents.filter((event) => event.type === "match");
  const selectedTier =
    checkoutEvent?.tiers.find((tier) => tier.id === selectedTierId) ??
    checkoutEvent?.tiers[0];
  const total = selectedTier ? selectedTier.price * quantity : 0;

  const walletStats = useMemo(() => {
    const matchCount = tickets.filter(
      (ticket) => ticket.eventType === "match",
    ).length;
    const zoneCount = tickets.filter(
      (ticket) => ticket.eventType === "fan_zone",
    ).length;
    const eventCount = tickets.filter(
      (ticket) => ticket.eventType === "event",
    ).length;
    return { eventCount, matchCount, zoneCount };
  }, [tickets]);

  function openCheckout(event: TicketEvent) {
    setCheckoutEvent(event);
    setSelectedTierId(event.tiers[0]?.id ?? "");
    setQuantity(1);
  }

  function addPurchasedTicket(purchasedTicket: PurchasedTicket) {
    setTickets((currentTickets) => [purchasedTicket, ...currentTickets]);
    setActiveTicketId(purchasedTicket.id);
    setSegment("wallet");
    setCheckoutEvent(null);
  }

  function createLocalPurchase(
    event: TicketEvent,
    tier: TicketTier,
  ): PurchasedTicket {
    const localTotal = tier.price * quantity;
    return {
      id: createTicketId(event),
      eventId: event.id,
      eventType: event.type,
      title: event.title,
      subtitle: event.subtitle,
      city: event.city,
      venue: event.venue,
      date: event.date,
      time: event.time,
      tierName: tier.name,
      quantity,
      total: localTotal,
      currency: tier.currency,
      qrSeed: createQrSeed(event),
      purchasedAt: new Date().toISOString(),
      status: "valid",
      gate: event.access.gate,
      accessZone: event.access.accessZone,
      tribune: event.access.tribune,
      seat: event.access.seatHint,
      accessControl: event.access.accessControl,
      accessRules: event.access.rules,
      securityCode: createSecurityCode(event, tier),
    };
  }

  async function confirmCheckout() {
    if (!checkoutEvent || !selectedTier) return;
    if (token) {
      try {
        const response = await fanpassFetch("/tickets/purchase", token, {
          method: "POST",
          body: JSON.stringify({
            event_id: checkoutEvent.id,
            tier_id: selectedTier.id,
            gate_id: checkoutEvent.access.gate.toLowerCase().replace(" ", "-"),
            quantity,
          }),
        });
        if (response.ok) {
          const apiTicket = mapApiTicket(await response.json());
          addPurchasedTicket(apiTicket);
          return;
        }
      } catch {
        // Fall back to the local prototype purchase below.
      }
    }

    addPurchasedTicket(createLocalPurchase(checkoutEvent, selectedTier));
  }

  const navigate = (tab: PrimaryTab) => onNav?.(tab);

  if (showImport) {
    return (
      <ImportTicketView
        onBack={() => setShowImport(false)}
        onImported={() => {
          setShowImport(false);
          void loadRemoteWallet();
        }}
      />
    );
  }

  if (showScan) {
    return <ScanView onBack={() => setShowScan(false)} />;
  }

  if (showAcceptTransfer) {
    return (
      <AcceptTransferView
        onBack={() => setShowAcceptTransfer(false)}
        onAccepted={() => {
          setShowAcceptTransfer(false);
          void loadRemoteWallet();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Smart Ticketing" title="Billets sécurisés" />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-5 text-primary-foreground shadow-elevated">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="label-xs opacity-80">
              Coupe du Monde 2030 - Maroc
            </div>
            <div className="mt-1 font-display text-2xl font-semibold">
              Le billet pilote le parcours
            </div>
            <p className="mt-2 text-sm opacity-90">
              QR unique, anti-fraude, contrôle d'accès et gate associée dans un
              seul wallet.
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <WalletCards className="h-6 w-6" />
          </div>
        </div>
        <div className="relative mt-5 grid grid-cols-4 gap-2 text-center text-sm">
          <Stat label="Billets" value={tickets.length} />
          <Stat label="Matchs" value={walletStats.matchCount} />
          <Stat label="Zones" value={walletStats.zoneCount} />
          <Stat label="Events" value={walletStats.eventCount} />
        </div>
      </div>

      <div className="grid grid-cols-4 rounded-2xl bg-white/5 p-1">
        <SegmentButton
          active={segment === "wallet"}
          label="Wallet"
          onClick={() => setSegment("wallet")}
        />
        <SegmentButton
          active={segment === "matches"}
          label="Matchs"
          onClick={() => setSegment("matches")}
        />
        <SegmentButton
          active={segment === "zones"}
          label="Zones"
          onClick={() => setSegment("zones")}
        />
        <SegmentButton
          active={segment === "events"}
          label="Events"
          onClick={() => setSegment("events")}
        />
      </div>

      {segment === "wallet" ? (
        <WalletView
          activeTicket={activeTicket}
          tickets={tickets}
          onSelectTicket={setActiveTicketId}
          onOpenMatches={() => setSegment("matches")}
          onOpenZones={() => setSegment("zones")}
          onOpenEvents={() => setSegment("events")}
          onTransferTicket={setTransferTicket}
        />
      ) : (
        <CatalogView events={visibleEvents} onCheckout={openCheckout} />
      )}

      <div className="grid grid-cols-2 gap-3">
        <QuickAction
          icon={Upload}
          label="Importer un billet"
          onClick={() => setShowImport(true)}
        />
        <QuickAction
          icon={Ticket}
          label="Recevoir transfert"
          onClick={() => setShowAcceptTransfer(true)}
        />
        <QuickAction
          icon={ScanLine}
          label="Scanner demo"
          onClick={() => setShowScan(true)}
        />
        <QuickAction
          icon={Navigation}
          label="Vers ma gate"
          onClick={() => navigate("parcours")}
        />
        <QuickAction
          icon={DoorOpen}
          label="Accès stade"
          onClick={() => navigate("parcours")}
        />
        <QuickAction
          icon={Users}
          label="Matching"
          onClick={() => navigate("communaute")}
        />
        <QuickAction
          icon={ShoppingBag}
          label="Merch lié"
          onClick={() => navigate("plus")}
        />
      </div>

      {checkoutEvent && selectedTier && (
        <CheckoutModal
          event={checkoutEvent}
          selectedTier={selectedTier}
          selectedTierId={selectedTierId}
          quantity={quantity}
          total={total}
          onClose={() => setCheckoutEvent(null)}
          onSelectTier={setSelectedTierId}
          onQuantityChange={setQuantity}
          onConfirm={confirmCheckout}
        />
      )}

      {transferTicket && (
        <TransferModal
          ticketId={transferTicket.apiId ?? transferTicket.id}
          ticketTitle={transferTicket.title}
          onClose={() => setTransferTicket(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/15 px-2 py-3">
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="label-xs opacity-75">{label}</div>
    </div>
  );
}

function SegmentButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-1 py-2 text-[0.68rem] font-semibold transition sm:text-xs ${
        active
          ? "bg-primary text-primary-foreground shadow-elevated"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function WalletView({
  activeTicket,
  tickets,
  onSelectTicket,
  onOpenMatches,
  onOpenZones,
  onOpenEvents,
  onTransferTicket,
}: {
  activeTicket: PurchasedTicket;
  tickets: PurchasedTicket[];
  onSelectTicket: (id: string) => void;
  onOpenMatches: () => void;
  onOpenZones: () => void;
  onOpenEvents: () => void;
  onTransferTicket: (ticket: PurchasedTicket) => void;
}) {
  function copySignedQr() {
    if (!activeTicket.qrRaw || typeof navigator === "undefined") return;
    void navigator.clipboard.writeText(activeTicket.qrRaw);
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label-xs text-primary-glow">
              {getEventLabel(activeTicket.eventType)}
            </div>
            <div className="mt-1 font-display text-xl font-semibold">
              {activeTicket.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {activeTicket.subtitle}
            </div>
          </div>
          <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
            {getStatusLabel(activeTicket.status)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="space-y-3 text-sm">
            <TicketFact label="Lieu" value={activeTicket.venue} />
            <TicketFact
              label="Date"
              value={`${activeTicket.date} - ${activeTicket.time}`}
            />
            <TicketFact label="Gate associée" value={activeTicket.gate} />
            <TicketFact label="Zone / Tribune" value={activeTicket.tribune} />
            <TicketFact label="Place / accès" value={activeTicket.seat} />
          </div>
          <QRTicket seed={activeTicket.qrSeed} sizeClassName="w-32" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <SecurityPill icon={Fingerprint} label="QR unique" />
          <SecurityPill icon={LockKeyhole} label="Anti-copie actif" />
          <SecurityPill icon={ScanLine} label="Contrôle gate" />
          <SecurityPill icon={ShieldCheck} label="Billet sécurisé" />
        </div>

        {(activeTicket.qrRaw || activeTicket.apiId) && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {activeTicket.qrRaw && (
              <button
                onClick={copySignedQr}
                className="rounded-2xl bg-white/5 px-3 py-3 text-xs font-medium"
              >
                Copier QR signe
              </button>
            )}
            {activeTicket.apiId && (
              <button
                onClick={() => onTransferTicket(activeTicket)}
                className="rounded-2xl bg-primary px-3 py-3 text-xs font-medium text-primary-foreground glow-primary"
              >
                Transferer
              </button>
            )}
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-white/5 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Contrôle d'accès</span>
            <span className="text-right font-semibold">
              {activeTicket.accessControl}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Code sécurité</span>
            <span className="font-mono text-xs font-semibold">
              {activeTicket.securityCode}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="label-xs text-muted-foreground">
            Règles liées au billet
          </div>
          {activeTicket.accessRules.map((rule) => (
            <div
              key={rule}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-success" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onOpenMatches}
          className="rounded-2xl bg-primary px-3 py-3 text-xs font-medium text-primary-foreground glow-primary"
        >
          Match
        </button>
        <button
          onClick={onOpenZones}
          className="glass rounded-2xl px-3 py-3 text-xs font-medium"
        >
          Fan zone
        </button>
        <button
          onClick={onOpenEvents}
          className="glass rounded-2xl px-3 py-3 text-xs font-medium"
        >
          Event
        </button>
      </div>

      <div className="space-y-2">
        <div className="label-xs px-1 text-muted-foreground">
          Tous mes billets sécurisés
        </div>
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onSelectTicket(ticket.id)}
            className={`w-full rounded-2xl p-4 text-left transition ${
              activeTicket.id === ticket.id
                ? "bg-primary/15 ring-1 ring-primary/40"
                : "glass hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{ticket.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {ticket.gate} - {ticket.date}
                </div>
              </div>
              <div className="text-right">
                <div className="label-xs text-primary-glow">
                  {getEventLabel(ticket.eventType)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  x{ticket.quantity}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TicketFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

function SecurityPill({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-primary-glow" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function CatalogView({
  events,
  onCheckout,
}: {
  events: TicketEvent[];
  onCheckout: (e: TicketEvent) => void;
}) {
  return (
    <div className="space-y-3">
      {events.map((event) => {
        const minPrice = Math.min(...event.tiers.map((tier) => tier.price));
        return (
          <article key={event.id} className="glass rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="label-xs text-primary-glow">
                  {getEventLabel(event.type)}
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold">
                  {event.title}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {event.subtitle}
                </p>
              </div>
              <span
                className={`label-xs rounded-full px-2 py-1 ${densityClass(event.density)}`}
              >
                {event.density}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {event.description}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <EventMeta icon={MapPin} label={event.venue} />
              <EventMeta
                icon={CalendarDays}
                label={`${event.date} - ${event.time}`}
              />
              <EventMeta icon={DoorOpen} label={event.access.gate} />
              <EventMeta
                icon={ShieldCheck}
                label={event.access.accessControl}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <div className="label-xs text-muted-foreground">
                  À partir de
                </div>
                <div className="font-display text-lg font-semibold">
                  {formatMoney(minPrice, "MAD")}
                </div>
              </div>
              <button
                onClick={() => onCheckout(event)}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground glow-primary"
              >
                <Ticket className="h-4 w-4" />
                Acheter
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function EventMeta({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-primary-glow" />
      <span className="min-w-0 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function CheckoutModal({
  event,
  selectedTier,
  selectedTierId,
  quantity,
  total,
  onClose,
  onSelectTier,
  onQuantityChange,
  onConfirm,
}: {
  event: TicketEvent;
  selectedTier: TicketTier;
  selectedTierId: string;
  quantity: number;
  total: number;
  onClose: () => void;
  onSelectTier: (tierId: string) => void;
  onQuantityChange: (qty: number) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 px-3 pb-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-background p-5 shadow-elevated">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="label-xs text-primary-glow">
              Achat {getEventLabel(event.type).toLowerCase()}
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold">
              {event.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {event.city} - {event.date} - {event.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 rounded-2xl bg-primary/10 p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold text-primary-glow">
            <ShieldCheck className="h-4 w-4" />
            Billet sécurisé FanPass
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            QR unique, anti-copie actif et accès associé à {event.access.gate}.
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="label-xs text-muted-foreground">Catégorie</div>
          {event.tiers.map((tier) => {
            const selected = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                onClick={() => onSelectTier(tier.id)}
                className={`w-full rounded-2xl p-4 text-left transition ${selected ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{tier.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {tier.benefits.join(" - ")}
                    </div>
                  </div>
                  <div className="text-right text-sm font-semibold">
                    {formatMoney(tier.price, tier.currency)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
          <div>
            <div className="label-xs text-muted-foreground">Quantité</div>
            <div className="text-sm font-semibold">Maximum 4 billets</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="w-7 text-center font-display text-lg font-semibold">
              {quantity}
            </div>
            <button
              onClick={() => onQuantityChange(Math.min(4, quantity + 1))}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-primary/15 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedTier.name} x{quantity}
            </span>
            <span className="font-semibold">
              {formatMoney(total, selectedTier.currency)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-primary-glow">
            <Check className="h-4 w-4" />
            Le QR et les règles d'accès seront ajoutés au wallet.
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[auto_1fr_auto] gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onConfirm}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground glow-primary"
          >
            Confirmer l'achat
          </button>
          <div className="grid place-items-center rounded-2xl bg-white/5 px-4 py-3">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-white/5"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15">
        <Icon className="h-5 w-5 text-primary-glow" />
      </div>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="label-xs text-muted-foreground">Ouvrir</div>
      </div>
    </button>
  );
}

import {
  AlertTriangle,
  BadgeHelp,
  Check,
  ChevronRight,
  CircleHelp,
  Clock,
  FileWarning,
  HeartPulse,
  Hospital,
  Languages,
  LifeBuoy,
  MapPin,
  Phone,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Ticket,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import type { AlertSeverity, ActiveTicket } from "@/lib/types";

const REQUESTS_STORAGE_KEY = "fanpass:safetyRequests:v1";

type AssistanceType =
  | "emergency"
  | "medical"
  | "ticket"
  | "lost"
  | "tourism"
  | "incident";
type SafetyPlaceType = "hospital" | "pharmacy" | "police" | "tourism";
type SupportRequestStatus = "open" | "triage" | "resolved";

type SafetyPlace = {
  id: string;
  type: SafetyPlaceType;
  name: string;
  city: string;
  distance: string;
  eta: string;
  open: string;
  detail: string;
};
type EmergencyContact = {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "critical" | "info" | "success";
};
type OfficialAlert = {
  id: string;
  severity: AlertSeverity;
  time: string;
  title: string;
  detail: string;
};
type SupportRequest = {
  id: string;
  type: AssistanceType;
  title: string;
  city: string;
  gate: string;
  ticketTitle: string;
  status: SupportRequestStatus;
  createdAt: string;
};

const PLACES: SafetyPlace[] = [
  {
    id: "casa-hospital-anfa",
    type: "hospital",
    name: "Poste médical Anfa",
    city: "Casablanca",
    distance: "850 m",
    eta: "7 min",
    open: "24/7",
    detail: "Premiers soins et orientation ambulance stade.",
  },
  {
    id: "casa-pharmacy-corniche",
    type: "pharmacy",
    name: "Pharmacie Corniche",
    city: "Casablanca",
    distance: "1.2 km",
    eta: "10 min",
    open: "Jusqu'à 01:00",
    detail: "Médicaments courants, hydratation, pansements.",
  },
  {
    id: "casa-police-nord",
    type: "police",
    name: "Point police Nord",
    city: "Casablanca",
    distance: "300 m",
    eta: "3 min",
    open: "Match-day",
    detail: "Perte, vol, incident ou aide d'urgence.",
  },
  {
    id: "casa-tourism-desk",
    type: "tourism",
    name: "Assistance touristique",
    city: "Casablanca",
    distance: "Gate C",
    eta: "2 min",
    open: "12:00 - 01:00",
    detail: "Support EN/FR/ES, passeport perdu, orientation ville.",
  },
  {
    id: "rabat-hospital-souissi",
    type: "hospital",
    name: "Clinique Souissi Support",
    city: "Rabat",
    distance: "1.8 km",
    eta: "12 min",
    open: "24/7",
    detail: "Urgences légères et transfert médical.",
  },
  {
    id: "rabat-police-bouregreg",
    type: "police",
    name: "Police Bouregreg",
    city: "Rabat",
    distance: "650 m",
    eta: "6 min",
    open: "Match-day",
    detail: "Assistance supporters visiteurs et objets perdus.",
  },
  {
    id: "marrakech-medical-menara",
    type: "hospital",
    name: "Poste médical Menara",
    city: "Marrakech",
    distance: "950 m",
    eta: "8 min",
    open: "24/7",
    detail: "Hydratation, premiers soins, transfert ambulance.",
  },
  {
    id: "marrakech-tourism-menara",
    type: "tourism",
    name: "Desk tourisme Menara",
    city: "Marrakech",
    distance: "Fan zone",
    eta: "4 min",
    open: "14:00 - 00:30",
    detail: "Aide hôtel, transport retour, traduction.",
  },
];

const CONTACTS: EmergencyContact[] = [
  {
    id: "sos",
    title: "Urgence supporter",
    value: "SOS FanPass",
    detail: "Alerte staff stade + position gate",
    icon: Siren,
    tone: "critical",
  },
  {
    id: "police",
    title: "Police",
    value: "19",
    detail: "Incident, vol, foule dangereuse",
    icon: ShieldAlert,
    tone: "info",
  },
  {
    id: "ambulance",
    title: "Ambulance",
    value: "15",
    detail: "Malaise, blessure, urgence médicale",
    icon: HeartPulse,
    tone: "critical",
  },
  {
    id: "tourism",
    title: "Assistance touristique",
    value: "ONMT Desk",
    detail: "Langues, perte documents, orientation",
    icon: Languages,
    tone: "success",
  },
];

const ALERTS: OfficialAlert[] = [
  {
    id: "gate-e-saturated",
    severity: "warning",
    time: "18:12",
    title: "Gate E chargée",
    detail: "Supporters visiteurs redirigés vers corridor Est secondaire.",
  },
  {
    id: "route-nord-closed",
    severity: "critical",
    time: "18:20",
    title: "Route Nord fermée",
    detail: "Utilisez le drop-off Anfa Nord puis marche sécurisée.",
  },
  {
    id: "tourism-desk-open",
    severity: "info",
    time: "14:00",
    title: "Desk touristique ouvert",
    detail: "Assistance FR/EN/ES disponible près de Gate C.",
  },
];

const ASSISTANCE_ACTIONS: {
  type: AssistanceType;
  title: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    type: "ticket",
    title: "Problème billet",
    detail: "QR bloqué, achat manquant, gate incorrecte",
    icon: Ticket,
  },
  {
    type: "lost",
    title: "Objet perdu",
    detail: "Passeport, téléphone, sac ou souvenir",
    icon: UserRoundSearch,
  },
  {
    type: "medical",
    title: "Malaise léger",
    detail: "Orientation vers poste médical proche",
    icon: HeartPulse,
  },
  {
    type: "tourism",
    title: "Aide touriste",
    detail: "Langue, transport, hôtel, documents",
    icon: BadgeHelp,
  },
  {
    type: "incident",
    title: "Signaler incident",
    detail: "Foule, comportement dangereux, sécurité",
    icon: FileWarning,
  },
];

function readRequests(): SupportRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => typeof r?.id === "string");
  } catch {
    return [];
  }
}

function createRequest(
  type: AssistanceType,
  ticket: ActiveTicket,
): SupportRequest {
  return {
    id: `safety-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    title:
      ASSISTANCE_ACTIONS.find((a) => a.type === type)?.title ??
      "Assistance supporter",
    city: ticket.city,
    gate: ticket.gate,
    ticketTitle: ticket.title,
    status: type === "emergency" ? "triage" : "open",
    createdAt: new Date().toISOString(),
  };
}

function placeIcon(type: SafetyPlaceType) {
  if (type === "hospital") return Hospital;
  if (type === "pharmacy") return Pill;
  if (type === "police") return ShieldAlert;
  return CircleHelp;
}

function placeLabel(type: SafetyPlaceType) {
  if (type === "hospital") return "Hôpital";
  if (type === "pharmacy") return "Pharmacie";
  if (type === "police") return "Police";
  return "Tourisme";
}

function severityClass(s: AlertSeverity) {
  if (s === "critical") return "bg-destructive/20 text-destructive";
  if (s === "warning") return "bg-primary/20 text-primary-glow";
  return "bg-success/20 text-success";
}

function contactClass(tone: EmergencyContact["tone"]) {
  if (tone === "critical") return "bg-destructive text-destructive-foreground";
  if (tone === "success") return "bg-success text-success-foreground";
  return "bg-primary text-primary-foreground";
}

function statusLabel(status: SupportRequestStatus) {
  if (status === "triage") return "Prioritaire";
  if (status === "resolved") return "Résolue";
  return "Ouverte";
}

export function SafetySection({ onBack }: { onBack: () => void }) {
  const ticket = useActiveTicket();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRequests(readRequests());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  }, [hydrated, requests]);

  const nearbyPlaces = useMemo(() => {
    const cityPlaces = PLACES.filter((p) => p.city === ticket.city);
    return cityPlaces.length > 0 ? cityPlaces : PLACES.slice(0, 4);
  }, [ticket.city]);

  const latestRequest = requests[0];

  function submitRequest(type: AssistanceType) {
    setRequests((c) => [createRequest(type, ticket), ...c]);
  }

  function resolveLatestRequest() {
    setRequests((c) =>
      c.map((r, i) => (i === 0 ? { ...r, status: "resolved" } : r)),
    );
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
          <div className="label-xs text-primary-glow">Safety & Assistance</div>
          <h1 className="font-display text-2xl font-semibold">
            Aide supporter
          </h1>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label-xs text-primary-glow">Contexte actif</div>
            <div className="mt-1 font-display text-xl font-semibold">
              {ticket.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {ticket.venue} - {ticket.date} - {ticket.time}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => submitRequest("emergency")}
        className="w-full rounded-3xl bg-destructive p-5 text-left text-destructive-foreground shadow-elevated transition hover:scale-[1.01]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <Siren className="h-7 w-7" />
            </div>
            <div>
              <div className="font-display text-xl font-semibold">
                Bouton aide urgent
              </div>
              <div className="mt-1 text-sm opacity-90">
                Alerte staff avec ville, gate et billet actif.
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </div>
      </button>

      {latestRequest && (
        <div className="glass rounded-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label-xs text-primary-glow">Demande active</div>
              <div className="mt-1 font-display text-xl font-semibold">
                {latestRequest.title}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {latestRequest.ticketTitle} - {latestRequest.gate} -{" "}
                {statusLabel(latestRequest.status)}
              </p>
            </div>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              {statusLabel(latestRequest.status)}
            </span>
          </div>
          <button
            onClick={resolveLatestRequest}
            className="mt-4 w-full rounded-2xl bg-white/5 py-3 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" /> Marquer comme résolue
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {CONTACTS.map((contact) => {
          const Icon = contact.icon;
          return (
            <button
              key={contact.id}
              onClick={() =>
                submitRequest(contact.id === "sos" ? "emergency" : "incident")
              }
              className={`rounded-3xl p-4 text-left shadow-elevated ${contactClass(contact.tone)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                <Phone className="h-4 w-4 opacity-80" />
              </div>
              <div className="mt-4 text-sm font-semibold">{contact.title}</div>
              <div className="mt-1 font-display text-lg font-semibold">
                {contact.value}
              </div>
              <div className="mt-1 text-xs opacity-80">{contact.detail}</div>
            </button>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">Assistance rapide</div>
        <div className="mt-1 font-display text-xl font-semibold">
          Que se passe-t-il ?
        </div>
        <div className="mt-4 grid gap-2">
          {ASSISTANCE_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => submitRequest(action.type)}
                className="rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary-glow" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{action.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {action.detail}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="label-xs px-1 text-muted-foreground">
          Lieux utiles proches
        </div>
        {nearbyPlaces.map((place) => {
          const Icon = placeIcon(place.type);
          return (
            <article key={place.id} className="glass rounded-3xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary-glow" />
                  </div>
                  <div>
                    <div className="label-xs text-primary-glow">
                      {placeLabel(place.type)}
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">
                      {place.name}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {place.detail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 px-2 py-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-glow" />
                  <span className="min-w-0 truncate text-muted-foreground">
                    {place.distance}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 px-2 py-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-primary-glow" />
                  <span className="min-w-0 truncate text-muted-foreground">
                    {place.eta}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 px-2 py-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary-glow" />
                  <span className="min-w-0 truncate text-muted-foreground">
                    {place.open}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">Alertes officielles</div>
        <div className="mt-3 space-y-2">
          {ALERTS.map((alert) => (
            <div key={alert.id} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${severityClass(alert.severity)}`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{alert.title}</span>
                    <span className="label-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {alert.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

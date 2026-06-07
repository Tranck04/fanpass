import {
  AlertTriangle,
  ArrowRight,
  Bus,
  Car,
  Clock,
  DoorOpen,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Train,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GateAwareMap } from "./GateAwareMap";
import { fanpassFetch } from "@/lib/fanpass-api";

type GatePlan = {
  gate_id: string;
  headline: string;
  destination_label: string;
  estimated_time_min: number;
  departure_time: string;
  gate_wait_min: number;
  crowd_status: string;
  recommended_mode: string;
  drop_off: string;
  parking: string;
  final_walk: string;
  alternative_gate: string;
  return_plan: string;
  closed_roads: string[];
  checkpoints: string[];
  coordinates: { lat: number; lon: number };
  dropoff_coords: { lat: number; lon: number };
};

type TransportMode = { id: string; label: string; icon: string };
type Alert = {
  id: string;
  severity: string;
  type: string;
  title: string;
  detail: string;
};
type MobilityData = {
  gate_id: string;
  ticket_title: string;
  ticket_date: string;
  kickoff_time: string;
  plan: GatePlan;
  transport_modes: TransportMode[];
  departure: string;
};
type RecalculatedRoute = {
  gate_id: string;
  transport_mode: string;
  plan: GatePlan;
  arrival_point: string;
  final_walk: string;
  closed_roads: string[];
  checkpoints: string[];
  departure: string;
};

function transportIcon(id: string): LucideIcon {
  if (id === "tram") return Train;
  if (id === "bus") return Bus;
  if (id === "drive" || id === "taxi") return Car;
  if (id === "group") return Users;
  return Navigation;
}
function statusClass(s: string) {
  if (s === "high" || s === "Sature")
    return "bg-destructive/20 text-destructive";
  if (s === "medium" || s === "Charge")
    return "bg-primary/20 text-primary-glow";
  if (s === "closed" || s === "Ferme")
    return "bg-white/10 text-muted-foreground";
  return "bg-success/20 text-success";
}
function statusLabel(s: string) {
  if (s === "high") return "Saturé";
  if (s === "medium") return "Chargé";
  if (s === "closed") return "Fermé";
  return "Fluide";
}

const fallbackPlan: GatePlan = {
  gate_id: "gate-c",
  headline: "Route optimisée vers Gate C",
  destination_label: "Entrée Nord — Gate C",
  estimated_time_min: 24,
  departure_time: "18:30",
  gate_wait_min: 8,
  crowd_status: "medium",
  recommended_mode: "Tramway T2",
  drop_off: "Drop-off Boulevard des Sports Nord",
  parking: "Parking P3 Nord, 420 places",
  final_walk: "650 m via corridor bleu",
  alternative_gate: "Gate D",
  return_plan: "Navette Nord 22:45",
  closed_roads: ["Avenue des Stades"],
  checkpoints: ["Checkpoint Alpha (300m)"],
  coordinates: { lat: 33.5731, lon: -7.6698 },
  dropoff_coords: { lat: 33.581, lon: -7.665 },
};

const fallbackModes: TransportMode[] = [
  { id: "taxi", label: "Taxi/VTC", icon: "Car" },
  { id: "tram", label: "Tramway", icon: "Train" },
  { id: "bus", label: "Navette", icon: "Bus" },
  { id: "drive", label: "Voiture", icon: "Car" },
  { id: "walk", label: "Marche", icon: "Walk" },
  { id: "group", label: "Groupe", icon: "Users" },
];

export function ItineraireSection() {
  const { token } = useAuth();
  const [data, setData] = useState<MobilityData | null>(null);
  const [transportMode, setTransportMode] = useState("taxi");
  const [recalculated, setRecalculated] = useState<RecalculatedRoute | null>(
    null,
  );
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [guidanceStarted, setGuidanceStarted] = useState(false);

  useEffect(() => {
    // Timeout: always resolve within 4s to prevent infinite loading
    const timeout = setTimeout(() => setLoading(false), 4000);
    if (!token) {
      setLoading(false);
      return () => clearTimeout(timeout);
    }

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);

    (async () => {
      try {
        const [mr, ar] = await Promise.all([
          fanpassFetch("/mobility/gate-plan", token, {
            signal: controller.signal,
          }),
          fanpassFetch("/mobility/alerts", token, {
            signal: controller.signal,
          }),
        ]);
        if (mr.ok) setData(await mr.json());
        if (ar.ok) setAlerts(await ar.json());
      } catch {
        // API unavailable — use fallback silently
      } finally {
        clearTimeout(t);
        clearTimeout(timeout);
        setLoading(false);
      }
    })();

    return () => {
      clearTimeout(t);
      clearTimeout(timeout);
    };
  }, [token]);

  async function handleModeChange(mode: string) {
    setTransportMode(mode);
    if (!data || !token) return;
    try {
      const r = await fanpassFetch("/mobility/recalculate", token, {
        method: "POST",
        body: JSON.stringify({ gate_id: data.gate_id, transport_mode: mode }),
        signal: AbortSignal.timeout(3000),
      });
      if (r.ok) setRecalculated(await r.json());
    } catch {
      // Keep the current route if recalculation is unavailable.
    }
  }

  const plan = recalculated?.plan ?? data?.plan ?? fallbackPlan;
  const gateCode = data?.gate_id?.replace("gate-", "").toUpperCase() ?? "C";
  const departure = recalculated?.departure ?? data?.departure ?? "18:45";
  const modes = data?.transport_modes ?? fallbackModes;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
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
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow mb-3">Mode de transport</div>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((mode) => {
            const I = transportIcon(mode.id);
            const a = transportMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`rounded-2xl p-3 text-center transition ${a ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`}
              >
                <I
                  className={`h-5 w-5 mx-auto mb-1 ${a ? "text-primary-glow" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[0.68rem] font-semibold ${a ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label-xs text-primary-glow">{plan.headline}</div>
            <div className="mt-1 font-display text-xl font-semibold">
              {plan.destination_label}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Gate {gateCode} — Votre billet donne accès à cette entrée
            </p>
          </div>
          <span
            className={`label-xs rounded-full px-2 py-1 ${statusClass(plan.crowd_status)}`}
          >
            {statusLabel(plan.crowd_status)}
          </span>
        </div>
        <GateAwareMap plan={plan} gateCode={gateCode} />
      </div>

      <div className="grid gap-3">
        <RC
          icon={transportIcon(transportMode)}
          eyebrow="Partie 1 — Approche"
          title={recalculated?.arrival_point ?? plan.drop_off}
          detail={
            transportMode === "drive"
              ? "Parking recommandé."
              : `Point de dépôt le plus proche de Gate ${gateCode}.`
          }
        />
        <RC
          icon={Navigation}
          eyebrow="Partie 2 — Dernier kilomètre"
          title={recalculated?.final_walk ?? plan.final_walk}
          detail={`Guidage piéton jusqu'au scan QR.`}
        />
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow mb-3">Routes fermées</div>
        <div className="space-y-2">
          {plan.closed_roads.map((r) => (
            <div
              key={r}
              className="flex items-center gap-3 rounded-2xl bg-destructive/10 px-3 py-3 text-sm"
            >
              <AlertTriangle className="h-4 w-4 text-destructive" />
              {r}
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow mb-3">
          Points de contrôle
        </div>
        <div className="space-y-2">
          {plan.checkpoints.map((cp, i) => (
            <div
              key={cp}
              className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary-glow">
                {i + 1}
              </span>
              {cp}
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-3 py-3 text-sm">
            <DoorOpen className="h-4 w-4 text-success" />
            Gate {gateCode} — Scan QR
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-5 text-primary-foreground shadow-elevated">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative text-center">
          <div className="label-xs opacity-80 mb-2">Départ recommandé</div>
          <div className="font-display text-5xl font-bold">{departure}</div>
          <div className="mt-2 text-sm opacity-90">
            Match à {data?.kickoff_time ?? "20:00"} —{" "}
            {plan.estimated_time_min + 9 + plan.gate_wait_min} min
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-2xl bg-white/15 px-2 py-2">
              <div className="font-semibold">{plan.estimated_time_min} min</div>
              <div className="opacity-75">Trajet</div>
            </div>
            <div className="rounded-2xl bg-white/15 px-2 py-2">
              <div className="font-semibold">9 min</div>
              <div className="opacity-75">Marche</div>
            </div>
            <div className="rounded-2xl bg-white/15 px-2 py-2">
              <div className="font-semibold">{plan.gate_wait_min} min</div>
              <div className="opacity-75">Attente</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="label-xs px-1 text-muted-foreground">
          Alertes temps réel
        </div>
        {alerts.map((a) => (
          <AC key={a.id} alert={a} />
        ))}
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-success/15">
            <RefreshCw className="h-6 w-6 text-success" />
          </div>
          <div>
            <div className="label-xs text-success">Retour après match</div>
            <div className="mt-1 text-sm font-semibold">{plan.return_plan}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Sortie conseillée par Gate {gateCode}.
            </p>
          </div>
        </div>
      </div>
      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">Porte alternative</div>
        <div className="mt-2 text-sm font-semibold">
          {plan.alternative_gate}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Utilisez cette gate si Gate {gateCode} dépasse 15 min.
        </p>
      </div>
      {guidanceStarted && (
        <div className="glass rounded-3xl p-5 ring-1 ring-success/20">
          <div className="label-xs text-success">Guidage actif</div>
          <div className="mt-1 text-sm font-semibold">
            Direction {plan.destination_label}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Suivez le point de depot recommande, puis le corridor pieton final
            vers Gate {gateCode}.
          </p>
        </div>
      )}
      <button
        onClick={() => setGuidanceStarted(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-primary-foreground glow-primary"
      >
        <ArrowRight className="h-4 w-4" />{" "}
        {guidanceStarted
          ? `Guidage vers Gate ${gateCode}`
          : `Demarrer vers Gate ${gateCode}`}
      </button>
    </div>
  );
}

function RC({
  icon: I,
  eyebrow,
  title,
  detail,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15">
          <I className="h-6 w-6 text-primary-glow" />
        </div>
        <div>
          <div className="label-xs text-primary-glow">{eyebrow}</div>
          <div className="mt-1 text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
      </div>
    </div>
  );
}
function AC({ alert }: { alert: Alert }) {
  const tc =
    alert.severity === "critical"
      ? "bg-destructive/15 text-destructive"
      : alert.severity === "warning"
        ? "bg-primary/15 text-primary-glow"
        : "bg-success/15 text-success";
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${tc}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">{alert.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {alert.detail}
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  Accessibility,
  AlertTriangle,
  Bell,
  DoorOpen,
  HeartPulse,
  Info,
  Navigation,
  ShieldCheck,
  ShoppingBag,
  Users,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { QRTicket } from "@/components/fanpass/billet/QRTicket";
import type { GateStatus } from "@/lib/types";

type GateInfo = {
  id: string;
  zone: string;
  status: GateStatus;
  wait: number;
  role: string;
  note: string;
};

const STADIUM_GATES: GateInfo[] = [
  {
    id: "Gate A",
    zone: "Sud-Ouest",
    status: "fluide",
    wait: 4,
    role: "Famille / PMR",
    note: "Accès ascenseurs et poussettes.",
  },
  {
    id: "Gate B",
    zone: "Sud",
    status: "fluide",
    wait: 6,
    role: "Famille / tribune Menara",
    note: "Meilleur accès pour bloc B.",
  },
  {
    id: "Gate C",
    zone: "Nord",
    status: "charge",
    wait: 8,
    role: "VIP / tribune Atlas",
    note: "Votre gate recommandée.",
  },
  {
    id: "Gate D",
    zone: "Nord-Est",
    status: "fluide",
    wait: 5,
    role: "Alternative Gate C",
    note: "Redirection conseillée si Gate C dépasse 15 min.",
  },
  {
    id: "Gate E",
    zone: "Est",
    status: "sature",
    wait: 18,
    role: "Supporters visiteurs",
    note: "Flux dense, contrôle renforcé.",
  },
  {
    id: "Gate F",
    zone: "Ouest",
    status: "ferme",
    wait: 0,
    role: "Logistique",
    note: "Fermée temporairement pour sécurité.",
  },
];

function getGateInfo(gateId: string) {
  return STADIUM_GATES.find((gate) => gate.id === gateId) ?? STADIUM_GATES[2];
}

function getAlternativeGate(activeGate: GateInfo) {
  if (activeGate.status === "ferme" || activeGate.status === "sature") {
    return (
      STADIUM_GATES.find((gate) => gate.status === "fluide") ?? STADIUM_GATES[3]
    );
  }
  if (activeGate.id === "Gate C") return STADIUM_GATES[3];
  return (
    STADIUM_GATES.find(
      (gate) => gate.id !== activeGate.id && gate.status === "fluide",
    ) ?? STADIUM_GATES[3]
  );
}

function statusLabel(status: GateStatus) {
  if (status === "fluide") return "Fluide";
  if (status === "charge") return "Chargé";
  if (status === "sature") return "Saturé";
  return "Fermé";
}

function statusClass(status: GateStatus) {
  if (status === "fluide") return "bg-success/20 text-success";
  if (status === "charge") return "bg-primary/20 text-primary-glow";
  if (status === "sature") return "bg-destructive/20 text-destructive";
  return "bg-white/10 text-muted-foreground";
}

export function GateSection() {
  const ticket = useActiveTicket();
  const [showQr, setShowQr] = useState(false);

  const activeGate = useMemo(() => getGateInfo(ticket.gate), [ticket.gate]);
  const alternativeGate = useMemo(
    () => getAlternativeGate(activeGate),
    [activeGate],
  );

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label-xs text-primary-glow">Gate recommandée</div>
            <div className="mt-1 font-display text-xl font-semibold">
              {activeGate.id} - {activeGate.zone}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {ticket.venue} - {ticket.gate}
            </p>
          </div>
          <span
            className={`label-xs rounded-full px-2 py-1 ${statusClass(activeGate.status)}`}
          >
            {statusLabel(activeGate.status)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <HeroStat label="Attente" value={`${activeGate.wait} min`} />
          <HeroStat label="État" value={statusLabel(activeGate.status)} />
          <HeroStat label="Zone" value={activeGate.zone} />
        </div>

        <StadiumMap
          activeGateId={activeGate.id}
          alternativeGateId={alternativeGate.id}
        />
      </div>

      <div className="space-y-2">
        <div className="label-xs px-1 text-muted-foreground">
          État des gates
        </div>
        {STADIUM_GATES.map((gate) => (
          <GateRow
            key={gate.id}
            gate={gate}
            active={gate.id === activeGate.id}
            alternative={gate.id === alternativeGate.id}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ServiceCard
          icon={Utensils}
          title="Food zone"
          detail="120 m après Gate C"
        />
        <ServiceCard
          icon={HeartPulse}
          title="Secours"
          detail="Poste médical Nord"
        />
        <ServiceCard
          icon={ShoppingBag}
          title="Merch"
          detail="Retrait express"
        />
        <ServiceCard
          icon={Accessibility}
          title="PMR / famille"
          detail="Accès assisté Gate A/B"
        />
      </div>

      <div className="space-y-3">
        <div className="label-xs px-1 text-muted-foreground">
          Notifications d'accès
        </div>
        <AccessNotice
          icon={Bell}
          tone="info"
          title="Préparez votre QR"
          detail="Le contrôle ouvre 2h avant le coup d'envoi. Luminosité écran maximale au scan."
        />
        <AccessNotice
          icon={AlertTriangle}
          tone="warning"
          title="Gate E saturée"
          detail="Les supporters visiteurs sont redirigés vers Gate F si le temps d'attente dépasse 20 min."
        />
        <AccessNotice
          icon={ShieldCheck}
          tone="success"
          title="Consignes sécurité"
          detail="Sac cabine uniquement, bouteilles fermées autorisées, objets encombrants interdits."
        />
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow">Profil d'accès</div>
        <div className="mt-3 grid gap-2">
          <ProfileLine
            icon={Users}
            label="Supporters visiteurs"
            value="Orientation vers Gate E/F"
          />
          <ProfileLine
            icon={Accessibility}
            label="PMR"
            value="Assistance disponible Gate A"
          />
          <ProfileLine
            icon={Info}
            label="VIP / famille"
            value="Couloir rapide selon billet"
          />
        </div>
      </div>

      <button
        onClick={() => setShowQr(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-primary-foreground glow-primary transition hover:scale-[1.01]"
      >
        Ouvrir mon QR à {activeGate.id}
        <Navigation className="h-4 w-4" />
      </button>

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 px-3 pb-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-background p-5 shadow-elevated">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="label-xs text-primary-glow">
                  QR d'acces stade
                </div>
                <div className="mt-1 font-display text-xl font-semibold">
                  {ticket.title}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activeGate.id} - {ticket.venue}
                </p>
              </div>
              <button
                onClick={() => setShowQr(false)}
                className="rounded-full bg-white/5 p-2 text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5">
              <QRTicket seed={ticket.title.length * 2030} sizeClassName="w-44" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 px-2 py-3">
      <div className="font-display text-lg font-semibold">{value}</div>
      <div className="label-xs opacity-75 text-muted-foreground">{label}</div>
    </div>
  );
}

function StadiumMap({
  activeGateId,
  alternativeGateId,
}: {
  activeGateId: string;
  alternativeGateId: string;
}) {
  const gatePoints = [
    { id: "Gate A", x: 85, y: 160 },
    { id: "Gate B", x: 150, y: 176 },
    { id: "Gate C", x: 215, y: 160 },
    { id: "Gate D", x: 235, y: 80 },
    { id: "Gate E", x: 150, y: 44 },
    { id: "Gate F", x: 65, y: 80 },
  ];

  return (
    <div className="relative mt-4 h-56 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a1a33] to-[#102a55]">
      <svg viewBox="0 0 300 220" className="absolute inset-0 h-full w-full">
        <ellipse
          cx="150"
          cy="110"
          rx="82"
          ry="62"
          fill="#1A6FE8"
          opacity="0.24"
        />
        <ellipse
          cx="150"
          cy="110"
          rx="52"
          ry="34"
          fill="#1A6FE8"
          opacity="0.32"
        />
        <rect x="118" y="89" width="64" height="42" rx="12" fill="#1A6FE8" />
        <text
          x="150"
          y="114"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="700"
        >
          STADE
        </text>

        <circle cx="214" cy="160" r="28" fill="#73B9FF" opacity="0.11" />
        <circle cx="235" cy="80" r="22" fill="#00C48C" opacity="0.11" />
        <path
          d="M38,198 C74,184 114,176 150,176 S198,174 215,160"
          stroke="#73B9FF"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="7 7"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-28"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>

        {gatePoints.map((gate) => {
          const active = gate.id === activeGateId;
          const alternative = gate.id === alternativeGateId;
          const gateInfo = getGateInfo(gate.id);
          const color =
            gateInfo.status === "ferme"
              ? "#94A3B8"
              : gateInfo.status === "sature"
                ? "#EF4444"
                : active
                  ? "#73B9FF"
                  : alternative
                    ? "#00C48C"
                    : "#1A6FE8";

          return (
            <g key={gate.id}>
              <circle cx={gate.x} cy={gate.y} r={active ? 11 : 8} fill={color}>
                {active && (
                  <animate
                    attributeName="r"
                    values="11;15;11"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <text
                x={gate.x}
                y={gate.y - 14}
                textAnchor="middle"
                fill="white"
                fontSize="8"
                fontWeight="700"
              >
                {gate.id.replace("Gate ", "")}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="glass absolute bottom-3 left-3 rounded-lg px-2 py-1 text-xs">
        Vous
      </div>
      <div className="absolute bottom-3 right-3 rounded-lg bg-primary/20 px-2 py-1 text-xs text-primary-glow">
        Gate active
      </div>
    </div>
  );
}

function GateRow({
  gate,
  active,
  alternative,
}: {
  gate: GateInfo;
  active: boolean;
  alternative: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        active ? "bg-primary/15 ring-1 ring-primary/40" : "glass"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">
            {gate.id}{" "}
            {active ? "- votre entrée" : alternative ? "- alternative" : ""}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {gate.zone} - {gate.role}
          </div>
        </div>
        <div className="text-right">
          <span
            className={`label-xs rounded-full px-2 py-1 ${statusClass(gate.status)}`}
          >
            {statusLabel(gate.status)}
          </span>
          <div className="mt-1 text-xs text-muted-foreground">
            {gate.status === "ferme" ? "Indispo" : `${gate.wait} min`}
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{gate.note}</div>
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15">
          <Icon className="h-5 w-5 text-primary-glow" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
      </div>
    </div>
  );
}

function AccessNotice({
  icon: Icon,
  tone,
  title,
  detail,
}: {
  icon: LucideIcon;
  tone: "info" | "warning" | "success";
  title: string;
  detail: string;
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/15 text-success"
      : tone === "warning"
        ? "bg-destructive/15 text-destructive"
        : "bg-primary/15 text-primary-glow";

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
      </div>
    </div>
  );
}

function ProfileLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-glow" />
        <span>{label}</span>
      </div>
      <span className="text-right text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

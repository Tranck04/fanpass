import {
  BadgeCheck,
  CalendarDays,
  Clock,
  Languages,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { MetaBadge } from "@/components/fanpass/shared/MetaBadge";
import { fanpassFetch } from "@/lib/fanpass-api";
import type { ActiveTicket } from "@/lib/types";

const JOINED_GROUPS_STORAGE_KEY = "fanpass:joinedGroups:v1";

type FanGroup = {
  id: string;
  name: string;
  team: string;
  language: string;
  city: string;
  match: string;
  profiles: string[];
  size: number;
  capacity: number;
  meet_point: string;
  meet_time: string;
  destination: string;
  event_rec: string;
  mood: string;
  safety: string;
  route: string;
  gate: string;
  verified: boolean;
  ambiance: string;
  score: number;
};

const FALLBACK_GROUPS: FanGroup[] = [
  {
    id: "atlas-fr",
    name: "Atlas Gate C",
    team: "Maroc",
    language: "FR",
    city: "Casablanca",
    match: "Maroc vs Espagne",
    profiles: ["solo", "local", "group"],
    size: 42,
    capacity: 60,
    meet_point: "Casa Port - sortie tram",
    meet_time: "17:25",
    destination: "Grand Stade Hassan II - Gate C",
    event_rec: "Meet-up Supporters Atlas",
    mood: "Intense",
    safety: "Guide FanPass présent, corridor sécurisé.",
    route: "Départ groupe vers drop-off Nord.",
    gate: "gate-c",
    verified: true,
    ambiance: "festive",
    score: 92,
  },
  {
    id: "morocco-en",
    name: "Morocco Welcome Crew",
    team: "Maroc",
    language: "EN",
    city: "Casablanca",
    match: "Maroc vs Espagne",
    profiles: ["solo", "tourist", "calm"],
    size: 27,
    capacity: 40,
    meet_point: "Marina Casablanca",
    meet_time: "17:00",
    destination: "Casablanca Corniche",
    event_rec: "Casablanca Corniche",
    mood: "Social",
    safety: "Point facile, support EN/FR.",
    route: "Fan zone avant match.",
    gate: "gate-c",
    verified: true,
    ambiance: "tourisme",
    score: 85,
  },
  {
    id: "family-rabat",
    name: "Family Ocean Route",
    team: "France",
    language: "FR",
    city: "Rabat",
    match: "France vs Bresil",
    profiles: ["family", "tourist", "calm"],
    size: 18,
    capacity: 36,
    meet_point: "Bouregreg Marina",
    meet_time: "15:45",
    destination: "Rabat Ocean Stage",
    event_rec: "Rabat Ocean Stage",
    mood: "Famille",
    safety: "Zone assise, assistance enfants.",
    route: "Parking Marina.",
    gate: "gate-e",
    verified: true,
    ambiance: "famille",
    score: 78,
  },
  {
    id: "brasil-es",
    name: "Brasil Watch Party ES",
    team: "Bresil",
    language: "ES",
    city: "Rabat",
    match: "France vs Bresil",
    profiles: ["solo", "group", "tourist"],
    size: 31,
    capacity: 55,
    meet_point: "Place Al Barid",
    meet_time: "15:30",
    destination: "Meet-up Supporters Atlas",
    event_rec: "Meet-up Supporters Atlas",
    mood: "Social",
    safety: "Groupe temporaire modéré.",
    route: "Départ collectif vers Gate E.",
    gate: "gate-e",
    verified: true,
    ambiance: "sociale",
    score: 71,
  },
  {
    id: "espana-calm",
    name: "Espana Calm Entry",
    team: "Espagne",
    language: "ES",
    city: "Casablanca",
    match: "Maroc vs Espagne",
    profiles: ["family", "tourist", "calm"],
    size: 21,
    capacity: 48,
    meet_point: "Drop-off Anfa Nord",
    meet_time: "18:05",
    destination: "Grand Stade Hassan II - Gate D",
    event_rec: "Lancement Maillot Maroc",
    mood: "Calme",
    safety: "Chemin moins dense.",
    route: "Marche via périmètre Ouest.",
    gate: "gate-c",
    verified: true,
    ambiance: "calme",
    score: 65,
  },
  {
    id: "neutral-marrakech",
    name: "Global Fans Marrakech",
    team: "Neutre",
    language: "EN",
    city: "Marrakech",
    match: "Argentine vs Allemagne",
    profiles: ["tourist", "solo", "group"],
    size: 34,
    capacity: 52,
    meet_point: "Menara Mall",
    meet_time: "17:40",
    destination: "Marrakech Medina Live",
    event_rec: "Marrakech Medina Live",
    mood: "Social",
    safety: "Brief culturel et assistance.",
    route: "Drop-off Menara.",
    gate: "gate-b",
    verified: false,
    ambiance: "tourisme",
    score: 58,
  },
];

type MatchingTab =
  | "tous"
  | "equipe"
  | "langue"
  | "ambiance"
  | "gate"
  | "postmatch";

const TABS: { id: MatchingTab; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "equipe", label: "Équipe" },
  { id: "langue", label: "Langue" },
  { id: "ambiance", label: "Ambiance" },
  { id: "gate", label: "Gate" },
  { id: "postmatch", label: "Post-match" },
];

function moodClass(mood: string) {
  if (mood === "Intense") return "bg-destructive/20 text-destructive";
  if (mood === "Famille") return "bg-success/20 text-success";
  if (mood === "Calme") return "bg-primary/15 text-primary-glow";
  return "bg-primary/20 text-primary-glow";
}

function readJoinedIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOINED_GROUPS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function GroupesSection() {
  const { token } = useAuth();
  const ticket = useActiveTicket();
  const [groups, setGroups] = useState<FanGroup[]>(FALLBACK_GROUPS);
  const [tab, setTab] = useState<MatchingTab>("tous");
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setJoinedIds(readJoinedIds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(
      JOINED_GROUPS_STORAGE_KEY,
      JSON.stringify(joinedIds),
    );
  }, [hydrated, joinedIds]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => setLoading(false), 4000);
    (async () => {
      try {
        const res = await fanpassFetch("/community/groups", token, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) setGroups(await res.json());
      } catch {
        // Keep fallback groups if the API is unavailable.
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();
    return () => clearTimeout(t);
  }, [token]);

  const filtered = useMemo(() => {
    if (tab === "tous") return groups;
    if (tab === "equipe")
      return groups.filter(
        (g) => g.team === (ticket.title?.includes("Maroc") ? "Maroc" : g.team),
      );
    if (tab === "langue") return groups.filter((g) => g.language === "FR");
    if (tab === "ambiance")
      return groups.filter(
        (g) => g.ambiance === "festive" || g.ambiance === "sociale",
      );
    if (tab === "gate") return groups.filter((g) => g.gate === "gate-c");
    if (tab === "postmatch") return groups.slice(0, 3);
    return groups;
  }, [groups, tab, ticket]);

  const bestMatch =
    filtered.length > 0
      ? filtered.reduce((a, b) => (a.score > b.score ? a : b))
      : null;

  async function toggleJoin(id: string) {
    setJoinedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    );
    if (!token || joinedIds.includes(id)) return;
    try {
      await fanpassFetch(`/community/groups/join/${id}`, token, {
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Local join remains visible if the demo API is offline.
    }
  }

  if (showCreate)
    return (
      <CreateGroupModal
        ticket={ticket}
        onClose={() => setShowCreate(false)}
        onCreated={(group) => {
          setGroups((current) => [group, ...current]);
          setJoinedIds((current) => [group.id, ...current]);
        }}
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
      {/* Context */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15">
            <BadgeCheck className="h-5 w-5 text-primary-glow" />
          </div>
          <div>
            <div className="label-xs text-primary-glow">Contexte</div>
            <div className="mt-1 font-display text-lg font-semibold">
              {ticket.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {ticket.venue} · {ticket.date} · {ticket.gate}
            </p>
          </div>
        </div>
      </div>

      {/* Matching type tabs */}
      <div className="grid grid-cols-3 rounded-2xl bg-white/5 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-1 py-2 text-[0.68rem] font-semibold transition sm:text-xs ${tab === t.id ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Best match */}
      {bestMatch && (
        <div className="glass rounded-3xl p-5 ring-1 ring-success/20">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-success" />
            <span className="label-xs text-success">
              Meilleure correspondance
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-xl font-semibold">
                {bestMatch.name}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {bestMatch.match} · {bestMatch.city}
              </p>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
              <div className="text-center">
                <div className="font-display text-lg font-semibold">
                  {bestMatch.score}%
                </div>
                <div className="label-xs">fit</div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetaBadge icon={MapPin} label={bestMatch.meet_point} />
            <MetaBadge icon={Clock} label={`Départ ${bestMatch.meet_time}`} />
            <MetaBadge icon={Languages} label={bestMatch.language} />
            <MetaBadge
              icon={Users}
              label={`${bestMatch.size}/${bestMatch.capacity} fans`}
            />
          </div>
        </div>
      )}

      {/* Matching type description */}
      {tab !== "tous" && (
        <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary-glow">
          {tab === "equipe" &&
            "🎯 Groupes qui supportent la même équipe que vous. Ambiance garantie."}
          {tab === "langue" &&
            "🗣️ Groupes francophones pour échanger facilement avant, pendant et après le match."}
          {tab === "ambiance" &&
            "🎉 Groupes festifs et sociaux pour vivre le match à fond."}
          {tab === "gate" &&
            "🚪 Groupes qui vont vers la même gate que vous. Trajet collectif sécurisé."}
          {tab === "postmatch" &&
            "🌙 Continuez l'expérience après le match : retours groupés, fan zones nocturnes."}
        </div>
      )}

      {/* Group list */}
      <div className="space-y-3">
        {filtered.map((g) => (
          <GroupCard
            key={g.id}
            group={g}
            joined={joinedIds.includes(g.id)}
            onJoin={() => toggleJoin(g.id)}
          />
        ))}
      </div>

      {/* Create group button */}
      <button
        onClick={() => setShowCreate(true)}
        className="w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-4 text-sm text-muted-foreground hover:bg-white/10 transition flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Créer un groupe
      </button>

      {/* Post-match recommendations */}
      <div className="glass rounded-3xl p-5">
        <div className="label-xs text-primary-glow mb-3">Après le match</div>
        <div className="space-y-2">
          {[
            {
              icon: Users,
              title: "After-match Casa Port",
              detail: "Retour collectif vers centre-ville.",
            },
            {
              icon: Sparkles,
              title: "Fan Zone nocturne",
              detail: "Corniche ouverte jusqu'à 01:00 avec DJ.",
            },
            {
              icon: ShieldCheck,
              title: "Navette retour",
              detail: "Départ groupé 22:45 depuis Gate C.",
            },
          ].map((r) => (
            <div
              key={r.title}
              className="flex items-start gap-3 rounded-2xl bg-white/5 p-4"
            >
              <r.icon className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" />
              <div>
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {r.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupCard({
  group,
  joined,
  onJoin,
}: {
  group: FanGroup;
  joined: boolean;
  onJoin: () => void;
}) {
  const fill = Math.round((group.size / group.capacity) * 100);
  return (
    <article
      className={`rounded-3xl p-5 transition ${joined ? "bg-success/10 ring-1 ring-success/30" : "glass"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`label-xs rounded-full px-2 py-1 ${moodClass(group.mood)}`}
            >
              {group.mood}
            </span>
            <span className="label-xs rounded-full bg-white/5 px-2 py-1 text-muted-foreground">
              {group.team} · {group.language}
            </span>
            {group.verified && (
              <span className="label-xs rounded-full bg-success/15 px-2 py-1 text-success flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" /> Vérifié
              </span>
            )}
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold">
            {group.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{group.match}</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
          <div className="text-center">
            <div className="font-display text-lg font-semibold">
              {group.score}%
            </div>
            <div className="label-xs">fit</div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <MetaBadge icon={MapPin} label={group.meet_point} />
        <MetaBadge icon={CalendarDays} label={group.meet_time} />
        <MetaBadge icon={Navigation} label={group.destination} />
        <MetaBadge icon={Sparkles} label={group.event_rec} />
      </div>
      <div className="mt-4 rounded-2xl bg-white/5 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Capacité</span>
          <span className="font-semibold">
            {group.size}/{group.capacity}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${fill}%` }}
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <IL icon={ShieldCheck} text={group.safety} />
        <IL icon={Navigation} text={group.route} />
        <IL icon={Users} text={`Profils: ${group.profiles.join(", ")}`} />
        <IL
          icon={MapPin}
          text={`Gate: ${group.gate.replace("gate-", "").toUpperCase()}`}
        />
      </div>
      <button
        onClick={onJoin}
        className={`mt-4 w-full rounded-2xl py-3 text-xs font-medium transition ${joined ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground glow-primary"}`}
      >
        {joined ? "✓ Groupe rejoint" : "Rejoindre"}
      </button>
    </article>
  );
}
function IL({ icon: I, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground">
      <I className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-glow" />
      <span>{text}</span>
    </div>
  );
}

function CreateGroupModal({
  ticket,
  onClose,
  onCreated,
}: {
  ticket: ActiveTicket;
  onClose: () => void;
  onCreated: (group: FanGroup) => void;
}) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("Maroc");
  const [language, setLanguage] = useState("FR");
  const [ambiance, setAmbiance] = useState("sociale");
  const [meetPoint, setMeetPoint] = useState("");
  const [meetTime, setMeetTime] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [created, setCreated] = useState(false);

  function handleCreate() {
    if (!name || !meetPoint || !meetTime) return;
    onCreated({
      id: `custom-${Date.now()}`,
      name,
      team,
      language,
      city: ticket.city,
      match: ticket.title,
      profiles: ["group"],
      size: 1,
      capacity: Math.max(2, Number(capacity) || 50),
      meet_point: meetPoint,
      meet_time: meetTime,
      destination: `${ticket.venue} - ${ticket.gate}`,
      event_rec: "Recommandation FanPass",
      mood: ambiance === "calme" ? "Calme" : "Social",
      safety: "Groupe cree par un fan, verification en attente.",
      route: `Depart collectif vers ${ticket.gate}.`,
      gate: ticket.gate.toLowerCase().replace(" ", "-"),
      verified: false,
      ambiance,
      score: 70,
    });
    setCreated(true);
    setTimeout(onClose, 1500);
  }

  if (created)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-20 w-20 rounded-full bg-success/15 grid place-items-center">
          <BadgeCheck className="h-10 w-10 text-success" />
        </div>
        <h2 className="font-display text-xl font-semibold">Groupe créé !</h2>
        <p className="text-sm text-muted-foreground">
          Votre groupe "{name}" est en attente de vérification.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Annuler
          </button>
          <span className="text-sm font-semibold">Créer un groupe</span>
          <button
            onClick={handleCreate}
            disabled={!name || !meetPoint || !meetTime}
            className="text-sm font-semibold text-primary-glow disabled:opacity-30"
          >
            Créer
          </button>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-md px-5 pt-6 pb-8 space-y-5">
        <div>
          <label className="label-xs text-muted-foreground block mb-2">
            Nom du groupe
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Atlas Gate C"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Équipe
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option>Maroc</option>
              <option>France</option>
              <option>Bresil</option>
              <option>Espagne</option>
              <option>Neutre</option>
            </select>
          </div>
          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Langue
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option>FR</option>
              <option>EN</option>
              <option>ES</option>
              <option>AR</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label-xs text-muted-foreground block mb-2">
            Ambiance
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1">
            {["festive", "calme", "familiale", "sociale", "tourisme"].map(
              (a) => (
                <button
                  key={a}
                  onClick={() => setAmbiance(a)}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold ${ambiance === a ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {a}
                </button>
              ),
            )}
          </div>
        </div>
        <div>
          <label className="label-xs text-muted-foreground block mb-2">
            Point de rendez-vous
          </label>
          <input
            value={meetPoint}
            onChange={(e) => setMeetPoint(e.target.value)}
            placeholder="Ex: Casa Port - sortie tram"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Heure de rendez-vous
            </label>
            <input
              value={meetTime}
              onChange={(e) => setMeetTime(e.target.value)}
              placeholder="17:25"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="label-xs text-muted-foreground block mb-2">
              Capacité max
            </label>
            <input
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="50"
              type="number"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div className="rounded-2xl bg-primary/10 p-4 text-xs text-muted-foreground">
          Votre groupe sera soumis à vérification avant d'apparaître dans les
          recommandations.
        </div>
      </main>
    </div>
  );
}

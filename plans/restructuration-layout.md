# Plan de restructuration du layout FanPass

## Objectif

Restructurer la navigation et le regroupement des vues pour passer d'une navigation plate à 7+ onglets vers une architecture hiérarchique à 4 onglets principaux, plus intuitive et orientée parcours utilisateur.

---

## 1. Architecture cible

### BottomNav : 7 → 4 onglets

```
┌──────────┬──────────┬──────────────┬──────────┐
│    🎫    │    🗺️    │      👥      │    ⋯    │
│  Billet  │ Parcours │  Communauté  │   Plus   │
└──────────┴──────────┴──────────────┴──────────┘
```

### Rôle de chaque onglet

| Onglet         | Icône      | Contenu                   | Sous-navigation                                 |
| -------------- | ---------- | ------------------------- | ----------------------------------------------- |
| **Billet**     | `Ticket`   | Wallet, achat, QR code    | Segments existants (Wallet/Matchs/Zones/Events) |
| **Parcours**   | `MapPin`   | Itinéraire + Gate         | Mini-onglets : Itinéraire \| Gate               |
| **Communauté** | `Users`    | Groupes fans + Événements | Mini-onglets : Groupes \| Événements            |
| **Plus**       | `Ellipsis` | Merch, Aide, Partenaires  | Grille d'accès (hub visuel)                     |

### Type de sous-navigation choisi

- **Parcours** : mini-onglets horizontaux — le flux est séquentiel (d'abord l'itinéraire, puis la gate)
- **Communauté** : mini-onglets horizontaux — 2 vues de poids similaire liées logiquement
- **Plus** : grille de 3 cartes d'accès — services indépendants sans ordre naturel

---

## 2. Nouvelle structure de fichiers

```
src/components/fanpass/
  ├── app/
  │   ├── AppShell.tsx              ← NOUVEAU : logique d'onglets, extraite de app.tsx
  │   ├── BottomNav.tsx             ← MODIFIÉ : 4 onglets au lieu de 7
  │   └── TopBar.tsx                ← NOUVEAU : extrait de app.tsx
  │
  ├── billet/
  │   ├── TicketView.tsx            ← DÉPLACÉ, quasi inchangé
  │   └── QRTicket.tsx              ← DÉPLACÉ, inchangé
  │
  ├── parcours/
  │   ├── ParcoursView.tsx          ← NOUVEAU : conteneur avec mini-onglets
  │   ├── ItineraireSection.tsx     ← ADAPTÉ de RouteView.tsx
  │   └── GateSection.tsx           ← ADAPTÉ de GateView.tsx
  │
  ├── communaute/
  │   ├── CommunauteView.tsx        ← NOUVEAU : conteneur avec mini-onglets
  │   ├── GroupesSection.tsx        ← ADAPTÉ de MatchView.tsx
  │   └── EvenementsSection.tsx     ← ADAPTÉ de ZonesView.tsx
  │
  ├── plus/
  │   ├── PlusView.tsx              ← NOUVEAU : hub avec grille d'accès
  │   ├── MerchSection.tsx          ← ADAPTÉ de MerchView.tsx
  │   ├── SafetySection.tsx         ← ADAPTÉ de SafetyView.tsx
  │   └── PartnersSection.tsx       ← ADAPTÉ de PartnerServicesView.tsx
  │
  └── shared/                       ← NOUVEAU : composants extraits
      ├── SectionTitle.tsx          ← inchangé, juste déplacé
      ├── HeroBanner.tsx            ← EXTRAIT : pattern répété dans chaque vue
      ├── HeroStat.tsx              ← EXTRAIT : pattern répété
      ├── QuickAction.tsx           ← EXTRAIT : pattern répété
      ├── FilterBar.tsx             ← EXTRAIT : SegmentButton + FilterButton
      ├── MetaBadge.tsx             ← EXTRAIT : EventMeta, MatchFact, MiniFact
      └── Logo.tsx                  ← inchangé, juste déplacé
```

---

## 3. Types refondus

### Suppression de l'ancien type `Tab`

```typescript
// AVANT (dans TicketView.tsx) — À SUPPRIMER
export type Tab =
  | "ticket"
  | "route"
  | "gate"
  | "match"
  | "zones"
  | "merch"
  | "safety"
  | "partners";
```

### Nouveaux types dans un fichier `src/lib/types.ts`

```typescript
// Types de navigation principale
export type PrimaryTab = "billet" | "parcours" | "communaute" | "plus";

// Sous-types pour Parcours
export type ParcoursSubTab = "itineraire" | "gate";

// Sous-types pour Communauté
export type CommunauteSubTab = "groupes" | "evenements";

// Sous-types pour Plus
export type PlusSection = "merch" | "safety" | "partners";
```

---

## 4. Modifications détaillées par fichier

### 4.1 `src/routes/app.tsx`

**Action** : Simplifier drastiquement.

```tsx
// AVANT : ~70 lignes avec logique de tabs
// APRÈS : ~10 lignes
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/fanpass/app/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "FanPass App - Billetterie 2030" },
      { name: "description", content: "..." },
    ],
  }),
  component: AppShell,
});
```

### 4.2 `src/components/fanpass/app/AppShell.tsx` (NOUVEAU)

```tsx
// Extrait de l'ancien app.tsx
// Gère l'état primaryTab et le rendu conditionnel des vues
function AppShell() {
  const [tab, setTab] = useState<PrimaryTab>("billet");

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 mx-auto w-full max-w-md px-5 pb-28 pt-4">
        <div key={tab} className="animate-float-up">
          {tab === "billet" && <TicketView onNav={setTab} />}
          {tab === "parcours" && <ParcoursView />}
          {tab === "communaute" && <CommunauteView />}
          {tab === "plus" && <PlusView onNav={setTab} />}
        </div>
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
```

### 4.3 `src/components/fanpass/app/BottomNav.tsx` (REFONTE)

7 items → 4 items :

```typescript
const items: { id: PrimaryTab; icon: LucideIcon; label: string }[] = [
  { id: "billet", icon: Ticket, label: "Billet" },
  { id: "parcours", icon: MapPin, label: "Parcours" },
  { id: "communaute", icon: Users, label: "Communauté" },
  { id: "plus", icon: Ellipsis, label: "Plus" },
];
```

### 4.4 `src/components/fanpass/parcours/ParcoursView.tsx` (NOUVEAU)

Conteneur avec mini-onglets :

```tsx
function ParcoursView() {
  const [subTab, setSubTab] = useState<ParcoursSubTab>("itineraire");

  return (
    <div className="space-y-5">
      {/* Mini-onglets horizontaux */}
      <div className="grid grid-cols-2 rounded-2xl bg-white/5 p-1">
        <SubTabButton
          active={subTab === "itineraire"}
          onClick={() => setSubTab("itineraire")}
        >
          Itinéraire
        </SubTabButton>
        <SubTabButton
          active={subTab === "gate"}
          onClick={() => setSubTab("gate")}
        >
          Gate
        </SubTabButton>
      </div>

      {subTab === "itineraire" ? <ItineraireSection /> : <GateSection />}
    </div>
  );
}
```

### 4.5 `src/components/fanpass/communaute/CommunauteView.tsx` (NOUVEAU)

Même pattern que ParcoursView mais avec `CommunauteSubTab`.

### 4.6 `src/components/fanpass/plus/PlusView.tsx` (NOUVEAU)

Hub avec grille de 3 cartes d'accès + rendu conditionnel :

```tsx
function PlusView({ onNav }: { onNav: (tab: PrimaryTab) => void }) {
  const [section, setSection] = useState<PlusSection | null>(null);

  if (section === "merch")
    return <MerchSection onBack={() => setSection(null)} />;
  if (section === "safety")
    return <SafetySection onBack={() => setSection(null)} />;
  if (section === "partners")
    return <PartnersSection onBack={() => setSection(null)} />;

  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Services" title="Plus de services" />
      <div className="grid gap-3">
        <ServiceHubCard
          icon={ShoppingBag}
          label="Boutique"
          onClick={() => setSection("merch")}
        />
        <ServiceHubCard
          icon={LifeBuoy}
          label="Aide & Sécurité"
          onClick={() => setSection("safety")}
        />
        <ServiceHubCard
          icon={Handshake}
          label="Partenaires"
          onClick={() => setSection("partners")}
        />
      </div>
    </div>
  );
}
```

### 4.7 Sections adaptées (ItineraireSection, GateSection, etc.)

**Règle** : chaque section adaptée :

- Supprime les `QuickAction` qui renvoyaient vers d'autres vues (puisqu'elles sont maintenant dans le même onglet ou accessibles via le BottomNav)
- Supprime le `SectionTitle` (le conteneur parent le gère)
- Supprime la duplication de `readActiveTicket()` → à extraire dans un hook `useActiveTicket()`
- Ne garde que les `QuickAction` qui pointent vers des sous-sections du même onglet

### 4.8 Composants partagés à extraire (`shared/`)

| Composant      | Provenance                                                                                                    | Occurrences |
| -------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| `HeroBanner`   | Pattern dans les 8 vues (gradient + stats + icône)                                                            | 8×          |
| `HeroStat`     | Défini dans TicketView, RouteView, GateView, MatchView, ZonesView, MerchView, SafetyView, PartnerServicesView | 8×          |
| `QuickAction`  | Défini dans TicketView, MatchView, MerchView, SafetyView                                                      | 4×          |
| `FilterBar`    | SegmentButton dans TicketView, FilterButton dans ZonesView, MerchView, PartnerServicesView                    | 4×          |
| `MetaBadge`    | EventMeta, MatchFact, Meta, MiniFact — tous similaires                                                        | 6×          |
| `SectionTitle` | Déjà un composant séparé                                                                                      | 1×          |
| `Logo`         | Déjà un composant séparé                                                                                      | 1×          |

---

## 5. État local → Hook partagé

Extraire la lecture du ticket actif dans un hook réutilisable :

```typescript
// src/hooks/useActiveTicket.ts
function useActiveTicket() {
  const [ticket, setTicket] = useState<ActiveTicket>(DEFAULT_TICKET);

  useEffect(() => {
    setTicket(readActiveTicket());
  }, []);

  return ticket;
}
```

Cela supprime ~10 blocs `useEffect` + `readActiveTicket()` dupliqués dans chaque vue.

---

## 6. Ordre d'exécution des tâches

| #   | Tâche                                                                                           | Dépendance |
| --- | ----------------------------------------------------------------------------------------------- | ---------- |
| 1   | Créer `src/lib/types.ts` avec les nouveaux types                                                | -          |
| 2   | Créer `src/hooks/useActiveTicket.ts`                                                            | -          |
| 3   | Créer `src/components/fanpass/shared/` avec tous les composants extraits                        | 1          |
| 4   | Créer `ParcoursView.tsx` + adapter `ItineraireSection.tsx` + `GateSection.tsx`                  | 2, 3       |
| 5   | Créer `CommunauteView.tsx` + adapter `GroupesSection.tsx` + `EvenementsSection.tsx`             | 2, 3       |
| 6   | Créer `PlusView.tsx` + adapter `MerchSection.tsx` + `SafetySection.tsx` + `PartnersSection.tsx` | 2, 3       |
| 7   | Déplacer `TicketView.tsx` + `QRTicket.tsx` dans `billet/`                                       | 1, 2       |
| 8   | Créer `AppShell.tsx` + `TopBar.tsx` + refondre `BottomNav.tsx`                                  | 4, 5, 6, 7 |
| 9   | Simplifier `src/routes/app.tsx`                                                                 | 8          |
| 10  | Supprimer les anciens fichiers                                                                  | 9          |
| 11  | Vérifier que tout compile et que la landing page fonctionne                                     | 10         |

---

## 7. Ce qui ne change pas

- La landing page (`/` → `src/routes/index.tsx`) reste inchangée
- Le design system (couleurs, typographie, glass morphism) reste inchangé
- Les données mockées restent en l'état
- `QRTicket.tsx` et `Logo.tsx` sont juste déplacés, pas modifiés
- Tous les composants `src/components/ui/` restent inchangés
- `src/styles.css`, `vite.config.ts`, `package.json` restent inchangés

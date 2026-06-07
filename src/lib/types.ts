// Types de navigation FanPass

// ─── Onglets principaux (BottomNav) ───
export type PrimaryTab = "billet" | "parcours" | "communaute" | "plus";

// ─── Sous-navigation ───
export type ParcoursSubTab = "itineraire" | "gate";
export type CommunauteSubTab = "groupes" | "evenements";
export type PlusSection = "merch" | "safety" | "partners";

// ─── Ticket actif (lu depuis localStorage) ───
export type ActiveTicket = {
  title: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  gate: string;
};

// ─── Types métier (utilisés par les vues) ───
export type TicketEventType = "match" | "fan_zone" | "event";
export type TicketSegment = "wallet" | "matches" | "zones" | "events";
export type TicketStatus = "valid" | "used" | "locked";

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  currency: "MAD";
  benefits: string[];
};

export type TicketAccess = {
  gate: string;
  accessZone: string;
  tribune: string;
  seatHint: string;
  accessControl: string;
  rules: string[];
};

export type TicketEvent = {
  id: string;
  type: TicketEventType;
  title: string;
  subtitle: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  density: "Calme" | "Moderee" | "Forte" | "Vibrante";
  description: string;
  access: TicketAccess;
  tiers: TicketTier[];
};

export type PurchasedTicket = {
  id: string;
  apiId?: string;
  eventId: string;
  eventType: TicketEventType;
  title: string;
  subtitle: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  tierName: string;
  quantity: number;
  total: number;
  currency: "MAD";
  qrSeed: number;
  purchasedAt: string;
  status: TicketStatus;
  gate: string;
  accessZone: string;
  tribune: string;
  seat: string;
  accessControl: string;
  accessRules: string[];
  securityCode: string;
  qrRaw?: string;
};

// ─── Types pour les filtres / catégories ───
export type Density = "Calme" | "Moderee" | "Forte" | "Vibrante";
export type CrowdStatus = "Fluide" | "Charge" | "Sature";
export type GateStatus = "fluide" | "charge" | "sature" | "ferme";
export type SafetyLevel = "Calme" | "Controle" | "Dense";
export type AlertSeverity = "info" | "warning" | "critical";
export type EventCategory =
  | "official"
  | "watch"
  | "sponsor"
  | "club"
  | "family";
export type MerchCategory =
  | "official"
  | "club"
  | "souvenir"
  | "local"
  | "sponsor"
  | "post2030";
export type PartnerCategory =
  | "mobility"
  | "stay"
  | "food"
  | "tourism"
  | "experience"
  | "premium";
export type PickupType = "stadium" | "fan_zone" | "event";

// ─── Types pour les groupes de fans ───
export type FanProfile =
  | "solo"
  | "family"
  | "tourist"
  | "local"
  | "group"
  | "calm";
export type TeamPreference =
  | "Maroc"
  | "France"
  | "Bresil"
  | "Espagne"
  | "Neutre";
export type LanguagePreference = "FR" | "EN" | "ES" | "AR";

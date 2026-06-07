import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Check,
  ChevronRight,
  Globe,
  IdCard,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Ticket,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/fanpass/shared/Logo";

type Step = "view" | "edit_info" | "verify_id";

export function ProfileView({ onClose }: { onClose: () => void }) {
  const { avatarInitials, fanIdStatus, logout, deleteAccount, refreshProfile } =
    useAuth();
  const [step, setStep] = useState<Step>("view");
  const [editing, setEditing] = useState(false);

  if (step === "edit_info") {
    return (
      <ProfileEdit
        onSave={() => {
          setStep("view");
          refreshProfile();
        }}
        onCancel={() => setStep("view")}
      />
    );
  }

  if (step === "verify_id") {
    return (
      <FanIdVerification
        onDone={() => {
          setStep("view");
          refreshProfile();
        }}
        onCancel={() => setStep("view")}
      />
    );
  }

  return (
    <ProfileMain
      avatarInitials={avatarInitials}
      fanIdStatus={fanIdStatus}
      onEdit={() => setStep("edit_info")}
      onVerify={() => setStep("verify_id")}
      onLogout={() => {
        logout();
        onClose();
      }}
      onDelete={async () => {
        await deleteAccount();
        onClose();
      }}
      onClose={onClose}
    />
  );
}

function ProfileMain({
  avatarInitials,
  fanIdStatus,
  onEdit,
  onVerify,
  onLogout,
  onDelete,
  onClose,
}: {
  avatarInitials: string;
  fanIdStatus: string;
  onEdit: () => void;
  onVerify: () => void;
  onLogout: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const verified = fanIdStatus === "verified";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
          <Logo />
          <div className="w-8" />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 pb-8 pt-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-primary to-primary-glow grid place-items-center text-3xl font-bold shadow-elevated">
              {avatarInitials}
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-success p-1.5 border-2 border-background">
              {verified ? (
                <BadgeCheck className="h-5 w-5 text-success-foreground" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-primary-glow" />
              )}
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold">Mon Profil</h1>
          </div>
        </div>

        {/* FanID Badge */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  verified
                    ? "bg-success/15 text-success"
                    : "bg-primary/15 text-primary-glow"
                }`}
              >
                <IdCard className="h-6 w-6" />
              </div>
              <div>
                <div className="label-xs text-primary-glow">Fan ID</div>
                <div className="font-display text-lg font-semibold">
                  {verified ? "Vérifié" : "En attente"}
                </div>
              </div>
            </div>
            {!verified && (
              <button
                onClick={onVerify}
                className="rounded-2xl bg-primary px-4 py-3 text-xs font-medium text-primary-foreground glow-primary"
              >
                Vérifier maintenant
              </button>
            )}
            {verified && (
              <span className="label-xs rounded-full bg-success/20 px-2 py-1 text-success">
                Actif
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="glass rounded-3xl p-5 space-y-3">
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary-glow" />
              <span className="text-sm font-semibold">
                Modifier mes informations
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          {!verified && (
            <button
              onClick={onVerify}
              className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary-glow" />
                <span className="text-sm font-semibold">Créer mon Fan ID</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Avantages FanID */}
        <div className="glass rounded-3xl p-5">
          <div className="label-xs text-primary-glow">
            Pourquoi créer son Fan ID ?
          </div>
          <div className="mt-4 space-y-3">
            {[
              { icon: Ticket, label: "Billetterie rapide" },
              { icon: Users, label: "Matching intelligent" },
              { icon: ShieldCheck, label: "Sécurité renforcée" },
              { icon: BadgeCheck, label: "Accès prioritaires" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm"
              >
                <item.icon className="h-4 w-4 text-primary-glow" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full rounded-2xl bg-destructive/15 text-destructive py-4 text-sm font-medium hover:bg-destructive/25 transition"
        >
          Se déconnecter
        </button>

        {/* Delete account */}
        <button
          onClick={() => {
            if (
              confirm(
                "Supprimer définitivement votre compte ? Cette action est irréversible.",
              )
            )
              onDelete();
          }}
          className="w-full rounded-2xl bg-white/5 text-muted-foreground py-3 text-xs font-medium hover:bg-destructive/10 hover:text-destructive transition"
        >
          Supprimer mon compte
        </button>
      </main>
    </div>
  );
}

function ProfileEdit({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    nationality: "",
    language: "fr",
    supported_team: "Maroc",
    fan_profile: "solo",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile(form);
      onSave();
    } catch {
      // keep form open on error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Annuler
          </button>
          <span className="text-sm font-semibold">Modifier le profil</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-semibold text-primary-glow hover:text-primary transition disabled:opacity-50"
          >
            {saving ? "..." : "Enregistrer"}
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 pb-8 pt-6 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Prénom"
              value={form.first_name}
              onChange={(v) => setForm((f) => ({ ...f, first_name: v }))}
            />
            <Field
              label="Nom"
              value={form.last_name}
              onChange={(v) => setForm((f) => ({ ...f, last_name: v }))}
            />
          </div>
          <Field
            label="Téléphone"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <Field
            label="Nationalité"
            value={form.nationality}
            onChange={(v) => setForm((f) => ({ ...f, nationality: v }))}
          />
        </div>

        <div className="glass rounded-3xl p-5 space-y-4">
          <div>
            <div className="label-xs text-primary-glow mb-3">
              Langue préférée
            </div>
            <div className="grid grid-cols-4 gap-1 rounded-2xl bg-white/5 p-1">
              {(["fr", "en", "es", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setForm((f) => ({ ...f, language: lang }))}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                    form.language === lang
                      ? "bg-primary text-primary-foreground shadow-elevated"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label-xs text-primary-glow mb-3">
              Équipe supportée
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1">
              {["Maroc", "France", "Bresil", "Espagne", "Neutre"].map(
                (team) => (
                  <button
                    key={team}
                    onClick={() =>
                      setForm((f) => ({ ...f, supported_team: team }))
                    }
                    className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                      form.supported_team === team
                        ? "bg-primary text-primary-foreground shadow-elevated"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {team}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <div className="label-xs text-primary-glow mb-3">Profil fan</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "solo" as const, label: "Solo" },
              { id: "family" as const, label: "Famille" },
              { id: "tourist" as const, label: "Touriste" },
              { id: "local" as const, label: "Local" },
              { id: "group" as const, label: "Groupe" },
              { id: "calm" as const, label: "Calme" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setForm((f) => ({ ...f, fan_profile: p.id }))}
                className={`rounded-2xl p-3 text-left transition ${
                  form.fan_profile === p.id
                    ? "bg-primary/15 ring-1 ring-primary/40"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="text-sm font-semibold">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function FanIdVerification({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const { verifyFanId } = useAuth();
  const [docType, setDocType] = useState<
    "passport" | "id_card" | "residence_permit"
  >("passport");
  const [docNumber, setDocNumber] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!docNumber || !agreeTerms) return;
    setLoading(true);
    try {
      await verifyFanId(docType, docNumber);
      setSubmitted(true);
      setTimeout(onDone, 800);
    } catch {
      // error handled by auth context
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Annuler
          </button>
          <span className="text-sm font-semibold">Création Fan ID</span>
          <div className="w-14" />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-5 pb-8 pt-6 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-5 text-primary-foreground shadow-elevated">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative text-center">
            <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-white/15 mb-4">
              <IdCard className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-semibold">
              Votre Fan ID
            </h2>
            <p className="mt-2 text-sm opacity-90">
              Le Fan ID est obligatoire pour accéder aux stades et fan zones
              officielles de la Coupe du Monde 2030.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              {[
                { label: "Statut", value: submitted ? "Vérifié" : "En cours" },
                {
                  label: "Type",
                  value:
                    docType === "passport"
                      ? "Passeport"
                      : docType === "id_card"
                        ? "CIN"
                        : "Séjour",
                },
                { label: "Étape", value: "1/1" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/15 px-2 py-3"
                >
                  <div className="truncate font-display text-lg font-semibold">
                    {s.value}
                  </div>
                  <div className="label-xs opacity-75">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <div className="label-xs text-primary-glow mb-4">
            Type de document
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "passport" as const, label: "Passeport" },
              { id: "id_card" as const, label: "Carte d'identité" },
              { id: "residence_permit" as const, label: "Titre de séjour" },
            ].map((doc) => (
              <button
                key={doc.id}
                onClick={() => setDocType(doc.id)}
                className={`rounded-2xl p-3 text-center transition ${docType === doc.id ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`}
              >
                <div className="label-xs text-primary-glow">{doc.label}</div>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="label-xs text-muted-foreground block mb-2">
              Numéro du document
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="Ex: AB1234567"
              maxLength={20}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15">
              <Camera className="h-6 w-6 text-primary-glow" />
            </div>
            <div>
              <div className="text-sm font-semibold">Photo du document</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Prenez une photo claire de votre pièce d'identité.
              </div>
            </div>
          </div>
          <button className="mt-4 w-full rounded-2xl border border-dashed border-white/15 bg-white/5 py-6 text-sm text-muted-foreground hover:bg-white/10 transition flex flex-col items-center gap-2">
            <Camera className="h-6 w-6" />
            <span>Scanner le document</span>
          </button>
        </div>

        <label className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-primary"
          />
          <span className="text-xs text-muted-foreground">
            Je certifie que les informations fournies sont exactes et j'accepte
            les conditions d'utilisation du Fan ID.
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!docNumber || !agreeTerms || loading || submitted}
          className={`w-full rounded-2xl py-4 text-sm font-medium transition ${
            submitted
              ? "bg-success text-success-foreground"
              : docNumber && agreeTerms
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-white/10 text-muted-foreground cursor-not-allowed"
          }`}
        >
          {submitted ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" /> Fan ID vérifié !
            </span>
          ) : loading ? (
            "Vérification..."
          ) : (
            "Créer mon Fan ID"
          )}
        </button>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-xs text-muted-foreground block mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
      />
    </div>
  );
}

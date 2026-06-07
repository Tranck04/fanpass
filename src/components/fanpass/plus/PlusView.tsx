import { useState } from "react";
import { Ellipsis, ShoppingBag, LifeBuoy, Handshake } from "lucide-react";
import type { PlusSection } from "@/lib/types";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { HeroBanner } from "@/components/fanpass/shared/HeroBanner";
import { MerchSection } from "./MerchSection";
import { SafetySection } from "./SafetySection";
import { PartnersSection } from "./PartnersSection";

export function PlusView() {
  const ticket = useActiveTicket();
  const [section, setSection] = useState<PlusSection | null>(null);

  if (section === "merch")
    return <MerchSection onBack={() => setSection(null)} />;
  if (section === "safety")
    return <SafetySection onBack={() => setSection(null)} />;
  if (section === "partners")
    return <PartnersSection onBack={() => setSection(null)} />;

  return (
    <div className="space-y-5">
      <HeroBanner
        icon={Ellipsis}
        eyebrow="Services"
        title="Plus de services"
        subtitle="Boutique, aide, sécurité et partenaires autour de votre parcours fan."
        stats={[
          { label: "Ville", value: ticket.city },
          { label: "Gate", value: ticket.gate.replace("Gate ", "") },
          { label: "Match", value: ticket.time },
        ]}
      />

      <div className="grid gap-3">
        <ServiceHubCard
          icon={ShoppingBag}
          title="Boutique"
          detail="Produits officiels, clubs, sponsors et artisans avec retrait au stade."
          tag="Merch"
          onClick={() => setSection("merch")}
        />
        <ServiceHubCard
          icon={LifeBuoy}
          title="Aide & Sécurité"
          detail="Urgences, contacts, lieux utiles et alertes officielles."
          tag="Support"
          onClick={() => setSection("safety")}
        />
        <ServiceHubCard
          icon={Handshake}
          title="Partenaires"
          detail="VTC, hôtels, restaurants et packs premium connectés au billet."
          tag="Services"
          onClick={() => setSection("partners")}
        />
      </div>
    </div>
  );
}

function ServiceHubCard({
  icon: Icon,
  title,
  detail,
  tag,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  tag: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass w-full rounded-3xl p-5 text-left transition hover:bg-white/5"
    >
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15">
          <Icon className="h-6 w-6 text-primary-glow" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="label-xs text-primary-glow">{tag}</span>
          </div>
          <div className="mt-1 font-display text-lg font-semibold">{title}</div>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
    </button>
  );
}

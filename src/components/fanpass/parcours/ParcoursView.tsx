import { useState } from "react";
import { MapPin } from "lucide-react";
import type { ParcoursSubTab } from "@/lib/types";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { HeroBanner } from "@/components/fanpass/shared/HeroBanner";
import { FilterBar } from "@/components/fanpass/shared/FilterBar";
import { ItineraireSection } from "./ItineraireSection";
import { GateSection } from "./GateSection";

const SUB_TABS: { id: ParcoursSubTab; label: string }[] = [
  { id: "itineraire", label: "Itinéraire" },
  { id: "gate", label: "Gate" },
];

export function ParcoursView() {
  const [subTab, setSubTab] = useState<ParcoursSubTab>("itineraire");
  const ticket = useActiveTicket();

  return (
    <div className="space-y-5">
      <HeroBanner
        icon={MapPin}
        eyebrow="Parcours stade"
        title={ticket.title}
        subtitle={`FANPASS vous guide vers ${ticket.gate}.`}
        stats={[
          { label: "Ville", value: ticket.city },
          { label: "Gate", value: ticket.gate.replace("Gate ", "") },
          { label: "Stade", value: ticket.venue },
        ]}
      />

      <FilterBar items={SUB_TABS} activeId={subTab} onChange={setSubTab} />

      {subTab === "itineraire" ? <ItineraireSection /> : <GateSection />}
    </div>
  );
}

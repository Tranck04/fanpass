import { useState } from "react";
import { Users } from "lucide-react";
import type { CommunauteSubTab } from "@/lib/types";
import { useActiveTicket } from "@/hooks/useActiveTicket";
import { HeroBanner } from "@/components/fanpass/shared/HeroBanner";
import { FilterBar } from "@/components/fanpass/shared/FilterBar";
import { GroupesSection } from "./GroupesSection";
import { EvenementsSection } from "./EvenementsSection";

const SUB_TABS: { id: CommunauteSubTab; label: string }[] = [
  { id: "groupes", label: "Groupes" },
  { id: "evenements", label: "Événements" },
];

export function CommunauteView() {
  const [subTab, setSubTab] = useState<CommunauteSubTab>("groupes");
  const ticket = useActiveTicket();

  return (
    <div className="space-y-5">
      <HeroBanner
        icon={Users}
        eyebrow="Fan Communities"
        title="Matching utile"
        subtitle="FANPASS connecte les supporters par équipe, langue, profil et point de rencontre."
        stats={[
          { label: "Match", value: ticket.time },
          { label: "Ville", value: ticket.city },
          { label: "Gate", value: ticket.gate.replace("Gate ", "") },
        ]}
      />

      <FilterBar items={SUB_TABS} activeId={subTab} onChange={setSubTab} />

      {subTab === "groupes" ? <GroupesSection /> : <EvenementsSection />}
    </div>
  );
}

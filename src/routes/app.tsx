import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/fanpass/app/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "FanPass App - Billetterie 2030" },
      {
        name: "description",
        content:
          "Votre billetterie matchs et fan zones pour la Coupe du Monde 2030 au Maroc.",
      },
    ],
  }),
  component: AppShell,
});

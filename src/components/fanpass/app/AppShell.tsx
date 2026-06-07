import { useState, useEffect } from "react";
import type { PrimaryTab } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { TicketView } from "@/components/fanpass/billet/TicketView";
import { ParcoursView } from "@/components/fanpass/parcours/ParcoursView";
import { CommunauteView } from "@/components/fanpass/communaute/CommunauteView";
import { PlusView } from "@/components/fanpass/plus/PlusView";
import { ProfileView } from "@/components/fanpass/profile/ProfileView";
import { LoginView } from "@/components/fanpass/auth/LoginView";
import { RegisterView } from "@/components/fanpass/auth/RegisterView";

export function AppShell() {
  const { token, isLoading } = useAuth();
  const [tab, setTab] = useState<PrimaryTab>("billet");
  const [showProfile, setShowProfile] = useState(false);
  const [authScreen, setAuthScreen] = useState<"login" | "register">("login");
  const [mounted, setMounted] = useState(false);

  // Évite le mismatch d'hydratation SSR : on ne décide qu'après le montage client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pendant l'hydratation, on affiche un état neutre identique serveur/client
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 glass border-b border-white/5">
          <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
            <div className="h-6 w-16 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-6 w-20 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-white/5 rounded-full animate-pulse" />
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-md px-5 pb-28 pt-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 space-y-3">
              <div className="h-4 w-2/3 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-full bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-4/5 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </main>
        <nav className="fixed bottom-0 inset-x-0 z-40 pb-4 pt-2 px-3">
          <div className="mx-auto max-w-md glass rounded-2xl px-2 py-5 flex items-center justify-between shadow-elevated">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div className="h-5 w-5 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-3 w-8 bg-white/5 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  // Auth gate: show login/register if not authenticated
  if (!token) {
    if (authScreen === "register") {
      return (
        <RegisterView
          onBack={() => setAuthScreen("login")}
          onSwitchToLogin={() => setAuthScreen("login")}
        />
      );
    }
    return (
      <LoginView
        onBack={() => {}}
        onSwitchToRegister={() => setAuthScreen("register")}
      />
    );
  }

  if (showProfile) {
    return <ProfileView onClose={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar onProfileClick={() => setShowProfile(true)} />
      <main className="flex-1 mx-auto w-full max-w-md px-5 pb-28 pt-4">
        <div key={tab} className="animate-float-up">
          {tab === "billet" && <TicketView onNav={setTab} />}
          {tab === "parcours" && <ParcoursView />}
          {tab === "communaute" && <CommunauteView />}
          {tab === "plus" && <PlusView />}
        </div>
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

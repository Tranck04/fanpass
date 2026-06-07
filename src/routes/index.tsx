import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/stadium-hero.jpg";
import { Logo } from "@/components/fanpass/shared/Logo";
import { QRTicket } from "@/components/fanpass/billet/QRTicket";
import type { ReactNode } from "react";
import {
  Ticket,
  MapPin,
  DoorOpen,
  Users,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Clock,
  Zap,
  ShieldCheck,
  Activity,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FanPass - Billetterie Coupe du Monde 2030 au Maroc" },
      {
        name: "description",
        content:
          "L'expérience fan intelligente pour acheter vos billets de matchs, fan zones et vivre le match-day au Maroc.",
      },
      { property: "og:title", content: "FanPass - Coupe du Monde 2030 Maroc" },
      {
        property: "og:description",
        content:
          "Billetterie matchs, fan zones et expérience fan intelligente.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen text-foreground">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <AppPreview />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">
              Features
            </a>
            <a href="#app" className="hover:text-foreground transition">
              App
            </a>
            <a href="#stadium" className="hover:text-foreground transition">
              Stadium
            </a>
          </nav>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-glow transition glow-primary"
          >
            Connexion <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-32 md:pb-40">
        <div className="max-w-3xl animate-float-up">
          <div className="label-xs inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-primary-glow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Coupe du Monde 2030 · Maroc
          </div>

          <h1 className="mt-6 font-display text-5xl md:text-7xl font-700 leading-[1.05] tracking-tight">
            Votre match <span className="text-gradient">commence</span>
            <br />
            avant le stade.
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
            Billets de matchs, pass fan zones, itinéraire en temps réel et
            navigation jusqu'à votre gate. Tout ce qu'il faut pour vivre le
            Maroc 2030 — sans friction.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground glow-primary hover:scale-[1.02] active:scale-100 transition"
            >
              <Ticket className="h-5 w-5" /> Connexion / Inscription
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3.5 text-base font-medium hover:bg-white/5 transition"
            >
              Découvrir
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "12s", l: "Entrée moyenne" },
              { v: "-78%", l: "File d'attente" },
              { v: "4.9", l: "Note fans" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl md:text-3xl font-semibold">
                  {s.v}
                </div>
                <div className="label-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    {
      icon: Clock,
      title: "Files interminables",
      desc: "45 min avant le coup d'envoi, encore dehors.",
    },
    {
      icon: MapPin,
      title: "Confusion totale",
      desc: "Quelle porte ? Quel transport ? Quelle zone ?",
    },
    {
      icon: Activity,
      title: "Stress maximum",
      desc: "Foule, bruit, perte de billet papier.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <div className="label-xs text-primary-glow">Le problème</div>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
          Aller au stade ne devrait pas être
          <br />
          une épreuve.
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="glass rounded-2xl p-6 hover:translate-y-[-2px] transition"
          >
            <it.icon className="h-6 w-6 text-destructive" />
            <h3 className="mt-4 font-display text-lg font-semibold">
              {it.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="glass rounded-3xl p-8 md:p-14 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="grid md:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="label-xs text-primary-glow">La solution</div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
              Un seul pass.
              <br />
              Toute l'expérience.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              FanPass guide chaque fan en temps réel, du métro à son siège — et
              bien au-delà du sifflet final.
            </p>
            <div className="mt-6 flex gap-3">
              <Badge icon={ShieldCheck}>Sans contact</Badge>
              <Badge icon={Zap}>Temps réel</Badge>
              <Badge icon={Sparkles}>IA prédictive</Badge>
            </div>
          </div>
          <div className="relative grid place-items-center">
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-72 w-72 rounded-full border border-primary/20 animate-pulse-ring" />
            </div>
            <QRTicket />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs">
      <Icon className="h-3.5 w-3.5 text-primary-glow" /> {children}
    </span>
  );
}

function Features() {
  const features = [
    {
      icon: Ticket,
      title: "Billetterie",
      desc: "Matchs et fan zones dans un wallet QR.",
      color: "from-primary to-primary-glow",
    },
    {
      icon: MapPin,
      title: "Itinéraire intelligent",
      desc: "Transport optimal, foule en temps réel.",
      color: "from-primary-glow to-success",
    },
    {
      icon: DoorOpen,
      title: "Gate Navigator",
      desc: "Guidage progressif jusqu'à votre porte.",
      color: "from-primary to-success",
    },
    {
      icon: Users,
      title: "Smart Matching",
      desc: "Rencontrez des fans qui partagent vos couleurs.",
      color: "from-primary-glow to-primary",
    },
    {
      icon: Sparkles,
      title: "Fan Zones",
      desc: "Ambiance, densité, activités — d'un coup d'œil.",
      color: "from-success to-primary-glow",
    },
    {
      icon: ShoppingBag,
      title: "Merch",
      desc: "Boutique intégrée, retrait express.",
      color: "from-primary to-primary-glow",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="label-xs text-primary-glow">Features</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Pensé pour chaque moment
            <br />
            du match-day.
          </h2>
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="glass group relative overflow-hidden rounded-2xl p-6 hover:translate-y-[-3px] transition"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${f.color} opacity-10 blur-2xl group-hover:opacity-25 transition`}
            />
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} glow-primary`}
            >
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AppPreview() {
  return (
    <section id="app" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="label-xs text-primary-glow">L'app</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            Une interface
            <br />
            digne du futur du stade.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Dark-mode dominant, micro-interactions fluides, navigation pensée
            pour le mobile. Creez votre compte fan pour tester l'app complete.
          </p>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground glow-primary hover:scale-[1.02] transition"
          >
            Créer un compte <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[280px] aspect-[9/19] rounded-[3rem] glass p-3 shadow-elevated">
      <div className="relative h-full w-full rounded-[2.4rem] bg-background overflow-hidden border border-white/5">
        <div className="absolute top-0 inset-x-0 h-6 grid place-items-center">
          <div className="h-1 w-16 rounded-full bg-white/20 mt-2" />
        </div>
        <div className="pt-10 px-5">
          <div className="label-xs text-muted-foreground">Billetterie 2030</div>
          <div className="font-display text-lg font-semibold mt-1">
            Maroc vs Espagne
          </div>
          <div className="text-xs text-muted-foreground">
            Grand Stade Hassan II · 20:00 · Porte C
          </div>
          <div className="mt-4 scale-90 origin-top">
            <QRTicket seed={203014} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {["Tribune", "Rang", "Siège"].map((l, i) => (
              <div key={l} className="rounded-lg bg-white/5 p-2">
                <div className="label-xs text-muted-foreground">{l}</div>
                <div className="text-sm font-semibold">
                  {["B", "12", "47"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <section id="stadium" className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl glass p-10 md:p-16 text-center">
        <div className="absolute inset-0 -z-10 opacity-40">
          <img
            src={heroImg}
            alt=""
            loading="lazy"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 to-background/90" />
        <h2 className="font-display text-3xl md:text-6xl font-semibold tracking-tight max-w-3xl mx-auto">
          Le stade devient <span className="text-gradient">intelligent.</span>
        </h2>
        <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
          Rejoignez la prochaine génération de supporters. Plus rapide, plus
          humain, plus connecté.
        </p>
        <Link
          to="/app"
          className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-medium text-primary-foreground glow-primary hover:scale-[1.02] transition"
        >
          <Ticket className="h-5 w-5" /> Rejoindre FanPass
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-10 border-t border-white/5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Logo />
        <div className="text-xs text-muted-foreground">
          © 2030 FanPass — Smart Stadium Experience
        </div>
      </div>
    </footer>
  );
}

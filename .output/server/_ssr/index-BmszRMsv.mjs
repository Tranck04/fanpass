import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo, Q as QRTicket } from "./QRTicket-DCYi4q8Y.mjs";
import { J as ArrowRight, T as Ticket, _ as Clock, h as MapPin, aj as Activity, l as ShieldCheck, ak as Zap, a0 as Sparkles, D as DoorOpen, b as Users, g as ShoppingBag } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const heroImg = "/assets/stadium-hero-LHPVA9f_.jpg";
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Problem, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Solution, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppPreview, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalCTA, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex items-center justify-between rounded-2xl px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", className: "hover:text-foreground transition", children: "Features" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#app", className: "hover:text-foreground transition", children: "App" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#stadium", className: "hover:text-foreground transition", children: "Stadium" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-glow transition glow-primary", children: [
      "Connexion ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
    ] })
  ] }) }) });
}
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "", width: 1920, height: 1080, className: "h-full w-full object-cover opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-32 md:pb-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl animate-float-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-xs inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-primary-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-pulse-ring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })
        ] }),
        "Coupe du Monde 2030 · Maroc"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-display text-5xl md:text-7xl font-700 leading-[1.05] tracking-tight", children: [
        "Votre match ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "commence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "avant le stade."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-base md:text-lg text-muted-foreground", children: "Billets de matchs, pass fan zones, itinéraire en temps réel et navigation jusqu'à votre gate. Tout ce qu'il faut pour vivre le Maroc 2030 — sans friction." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground glow-primary hover:scale-[1.02] active:scale-100 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-5 w-5" }),
          " Connexion / Inscription",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", className: "inline-flex items-center gap-2 rounded-2xl glass px-6 py-3.5 text-base font-medium hover:bg-white/5 transition", children: "Découvrir" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid grid-cols-3 gap-6 max-w-md", children: [{
        v: "12s",
        l: "Entrée moyenne"
      }, {
        v: "-78%",
        l: "File d'attente"
      }, {
        v: "4.9",
        l: "Note fans"
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl md:text-3xl font-semibold", children: s.v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground mt-1", children: s.l })
      ] }, s.l)) })
    ] }) })
  ] });
}
function Problem() {
  const items = [{
    icon: Clock,
    title: "Files interminables",
    desc: "45 min avant le coup d'envoi, encore dehors."
  }, {
    icon: MapPin,
    title: "Confusion totale",
    desc: "Quelle porte ? Quel transport ? Quelle zone ?"
  }, {
    icon: Activity,
    title: "Stress maximum",
    desc: "Foule, bruit, perte de billet papier."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Le problème" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight", children: [
        "Aller au stade ne devrait pas être",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "une épreuve."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 md:grid-cols-3", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 hover:translate-y-[-2px] transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "h-6 w-6 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-lg font-semibold", children: it.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: it.desc })
    ] }, it.title)) })
  ] });
}
function Solution() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8 md:p-14 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/30 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10 items-center relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "La solution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight", children: [
          "Un seul pass.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Toute l'expérience."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-muted-foreground max-w-md", children: "FanPass guide chaque fan en temps réel, du métro à son siège — et bien au-delà du sifflet final." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: ShieldCheck, children: "Sans contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: Zap, children: "Temps réel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: Sparkles, children: "IA prédictive" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid place-items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 w-72 rounded-full border border-primary/20 animate-pulse-ring" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QRTicket, {})
      ] })
    ] })
  ] }) });
}
function Badge({
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary-glow" }),
    " ",
    children
  ] });
}
function Features() {
  const features = [{
    icon: Ticket,
    title: "Billetterie",
    desc: "Matchs et fan zones dans un wallet QR.",
    color: "from-primary to-primary-glow"
  }, {
    icon: MapPin,
    title: "Itinéraire intelligent",
    desc: "Transport optimal, foule en temps réel.",
    color: "from-primary-glow to-success"
  }, {
    icon: DoorOpen,
    title: "Gate Navigator",
    desc: "Guidage progressif jusqu'à votre porte.",
    color: "from-primary to-success"
  }, {
    icon: Users,
    title: "Smart Matching",
    desc: "Rencontrez des fans qui partagent vos couleurs.",
    color: "from-primary-glow to-primary"
  }, {
    icon: Sparkles,
    title: "Fan Zones",
    desc: "Ambiance, densité, activités — d'un coup d'œil.",
    color: "from-success to-primary-glow"
  }, {
    icon: ShoppingBag,
    title: "Merch",
    desc: "Boutique intégrée, retrait express.",
    color: "from-primary to-primary-glow"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "features", className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between flex-wrap gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Features" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight", children: [
        "Pensé pour chaque moment",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "du match-day."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass group relative overflow-hidden rounded-2xl p-6 hover:translate-y-[-3px] transition", style: {
      animationDelay: `${i * 60}ms`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${f.color} opacity-10 blur-2xl group-hover:opacity-25 transition` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} glow-primary`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-6 w-6 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-xl font-semibold", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: f.desc })
    ] }, f.title)) })
  ] });
}
function AppPreview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "app", className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "L'app" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight", children: [
        "Une interface",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "digne du futur du stade."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-muted-foreground max-w-md", children: "Dark-mode dominant, micro-interactions fluides, navigation pensée pour le mobile. Creez votre compte fan pour tester l'app complete." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground glow-primary hover:scale-[1.02] transition", children: [
        "Créer un compte ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/20 blur-3xl rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneMock, {})
    ] })
  ] }) });
}
function PhoneMock() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto w-[280px] aspect-[9/19] rounded-[3rem] glass p-3 shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full w-full rounded-[2.4rem] bg-background overflow-hidden border border-white/5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-6 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-16 rounded-full bg-white/20 mt-2" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-10 px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: "Billetterie 2030" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold mt-1", children: "Maroc vs Espagne" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Grand Stade Hassan II · 20:00 · Porte C" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 scale-90 origin-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRTicket, { seed: 203014 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: ["Tribune", "Rang", "Siège"].map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-white/5 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: l }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: ["B", "12", "47"][i] })
      ] }, l)) })
    ] })
  ] }) });
}
function FinalCTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "stadium", className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl glass p-10 md:p-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "", loading: "lazy", width: 1920, height: 1080, className: "h-full w-full object-cover" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-background/60 to-background/90" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl md:text-6xl font-semibold tracking-tight max-w-3xl mx-auto", children: [
      "Le stade devient ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "intelligent." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-muted-foreground max-w-xl mx-auto", children: "Rejoignez la prochaine génération de supporters. Plus rapide, plus humain, plus connecté." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "mt-10 inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-medium text-primary-foreground glow-primary hover:scale-[1.02] transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-5 w-5" }),
      " Rejoindre FanPass"
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mx-auto max-w-7xl px-6 py-10 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "© 2030 FanPass — Smart Stadium Experience" })
  ] }) });
}
export {
  Landing as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, f as fanpassFetch } from "./router-BZ0fmM3X.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo, Q as QRTicket } from "./QRTicket-DCYi4q8Y.mjs";
import { A as ArrowLeft, U as UserPlus, a as User, M as Mail, L as LockKeyhole, G as Globe, S as Star, b as Users, c as LogIn, E as EyeOff, d as Eye, W as WalletCards, e as Upload, T as Ticket, f as ScanLine, N as Navigation, D as DoorOpen, g as ShoppingBag, h as MapPin, i as Ellipsis, j as LifeBuoy, H as Handshake, I as IdCard, C as Camera, k as Check, B as BadgeCheck, l as ShieldCheck, m as ChevronRight, n as Hash, Q as QrCode, F as FileText, o as CircleX, p as ShieldAlert, q as TriangleAlert, r as CircleCheck, s as Search, t as Gift, u as FingerprintPattern, v as CalendarDays, X, w as Minus, P as Plus, x as ChevronLeft, y as Send, z as Copy, R as RefreshCw, J as ArrowRight, K as Utensils, O as HeartPulse, V as Accessibility, Y as Bell, Z as Info, _ as Clock, $ as Languages, a0 as Sparkles, a1 as Flame, a2 as BadgePercent, a3 as ShoppingCart, a4 as Siren, a5 as Phone, a6 as UserRoundSearch, a7 as BadgeQuestionMark, a8 as FileExclamationPoint, a9 as TramFront, aa as Bus, ab as Car, ac as Trophy, ad as Truck, ae as Hospital, af as Pill, ag as CircleQuestionMark, ah as Hotel, ai as Crown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function TopBar({ onProfileClick }) {
  const { avatarInitials } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/",
        className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Retour"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onProfileClick,
        className: "h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-xs font-semibold hover:scale-105 transition",
        title: "Mon profil",
        children: avatarInitials
      }
    )
  ] }) });
}
function BottomNav({
  tab,
  setTab
}) {
  const items = [
    { id: "billet", icon: Ticket, label: "Billet" },
    { id: "parcours", icon: MapPin, label: "Parcours" },
    { id: "communaute", icon: Users, label: "Communauté" },
    { id: "plus", icon: Ellipsis, label: "Plus" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-40 pb-4 pt-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md glass rounded-2xl px-2 py-2 flex items-center justify-between shadow-elevated", children: items.map((it) => {
    const active = tab === it.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setTab(it.id),
        className: `relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
        children: [
          active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary rounded-xl glow-primary -z-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: `h-5 w-5 relative z-10` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs relative z-10", children: it.label })
        ]
      },
      it.id
    );
  }) }) });
}
function SectionTitle({
  eyebrow,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold mt-1", children: title })
  ] });
}
function ImportTicketView({
  onBack,
  onImported
}) {
  const { token } = useAuth();
  const [tab, setTab] = reactExports.useState("ref");
  const [reference, setReference] = reactExports.useState("");
  const [qrData, setQrData] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  async function handleImport() {
    setError("");
    setLoading(true);
    try {
      const body = tab === "ref" ? { type: "ref", reference } : { type: "qr", qr_data: qrData };
      const res = await fanpassFetch("/tickets/import", token, {
        method: "POST",
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur d'import");
      }
      setSuccess(true);
      setTimeout(() => {
        onImported();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-success/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-10 w-10 text-success" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Billet importé !" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Redirection vers votre wallet..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onBack,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Retour"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-8 pb-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-primary-glow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Importer un billet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Billet acheté ailleurs ? Importez-le dans votre wallet FanPass." })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 rounded-2xl bg-white/5 p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setTab("ref"),
            className: `rounded-xl px-2 py-3 text-xs font-semibold transition flex items-center justify-center gap-2 ${tab === "ref" ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4" }),
              " Référence"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setTab("qr"),
            className: `rounded-xl px-2 py-3 text-xs font-semibold transition flex items-center justify-center gap-2 ${tab === "qr" ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4" }),
              " QR Code"
            ]
          }
        )
      ] }),
      tab === "ref" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-primary-glow" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Référence de billet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Saisissez la référence reçue par email ou sur votre billet officiel." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: reference,
            onChange: (e) => setReference(e.target.value),
            placeholder: "Ex: WC2030-MAR-ESP-A0042",
            className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-6 w-6 text-primary-glow" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Scanner un QR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Collez les données du QR code scanné depuis votre billet officiel." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: qrData,
            onChange: (e) => setQrData(e.target.value),
            placeholder: "Collez les données du QR ici...",
            rows: 3,
            className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setError(
              "Scan camera non branche dans ce prototype : collez les donnees du QR."
            ),
            className: "w-full rounded-2xl border border-dashed border-white/15 bg-white/5 py-8 text-sm text-muted-foreground hover:bg-white/10 transition flex flex-col items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-8 w-8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scanner avec la caméra" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleImport,
          disabled: loading || (tab === "ref" ? !reference : !qrData),
          className: "w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "Importation..." : "Importer le billet"
        }
      )
    ] })
  ] });
}
function AcceptTransferView({
  onBack,
  onAccepted
}) {
  const { token } = useAuth();
  const [code, setCode] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  async function handleAccept() {
    setError("");
    setLoading(true);
    try {
      const res = await fanpassFetch(
        `/tickets/transfer/accept/${code.toUpperCase()}`,
        token,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Code invalide");
      }
      setSuccess(true);
      setTimeout(onAccepted, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-success/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-10 w-10 text-success" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Billet reçu !" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Le billet a été ajouté à votre wallet." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onBack,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Retour"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-12 pb-8 flex flex-col justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-success/15 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-8 w-8 text-success" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Accepter un billet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Quelqu'un vous a transféré un billet ? Saisissez le code reçu." })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm mb-4", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block", children: "Code de transfert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: code,
            onChange: (e) => setCode(e.target.value.toUpperCase()),
            placeholder: "ABCD1234",
            maxLength: 8,
            className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-center font-mono text-2xl tracking-[0.3em] placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/40 uppercase"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAccept,
          disabled: loading || code.length < 8,
          className: "mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "Vérification..." : "Accepter le billet"
        }
      )
    ] })
  ] });
}
function ScanView({ onBack }) {
  const { token } = useAuth();
  const [qrInput, setQrInput] = reactExports.useState("");
  const [gateId, setGateId] = reactExports.useState("gate-c");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  async function handleScan() {
    setLoading(true);
    try {
      const res = await fanpassFetch("/scan/validate", token, {
        method: "POST",
        body: JSON.stringify({
          qr_raw: qrInput,
          gate_id: gateId,
          device_id: "demo-scanner"
        })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        result: "invalid_ticket",
        message: "Erreur réseau",
        ticket_id: null,
        gate_id: gateId,
        scanned_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } finally {
      setLoading(false);
    }
  }
  const resultIcon = {
    access_granted: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-success" }),
    wrong_gate: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-primary-glow" }),
    already_used: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-12 w-12 text-destructive" }),
    invalid_ticket: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-12 w-12 text-destructive" }),
    ticket_cancelled: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-12 w-12 text-destructive" })
  }[result?.result ?? ""] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-12 w-12 text-muted-foreground" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onBack,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Retour"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-8 pb-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-8 w-8 text-primary-glow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Scan billet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Simulation du scanner à l'entrée du stade." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "QR Payload (coller)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: qrInput,
              onChange: (e) => setQrInput(e.target.value),
              placeholder: '{"ticket_id":"...","fan_id":"...","gate_code":"C",...}',
              rows: 3,
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Gate ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: gateId,
              onChange: (e) => setGateId(e.target.value),
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gate-c", children: "Gate C - Nord" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gate-e", children: "Gate E - Est" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gate-b", children: "Gate B - Sud" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleScan,
          disabled: loading || !qrInput,
          className: "w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4" }),
            loading ? "Scan en cours..." : "Scanner le billet"
          ]
        }
      ),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-3xl p-6 text-center ${result.result === "access_granted" ? "bg-success/10 ring-1 ring-success/30" : result.result === "wrong_gate" ? "bg-primary/10 ring-1 ring-primary/30" : "bg-destructive/10 ring-1 ring-destructive/30"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center mb-3", children: resultIcon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: result.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "Résultat :",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: result.result })
              ] }),
              result.ticket_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "Ticket : ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: result.ticket_id })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "Scanné à :",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(result.scanned_at).toLocaleTimeString("fr-FR") })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function TransferModal({
  ticketId,
  ticketTitle,
  onClose
}) {
  const { token } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  async function handleTransfer() {
    setError("");
    setLoading(true);
    try {
      const res = await fanpassFetch(`/tickets/${ticketId}/transfer`, token, {
        method: "POST",
        body: JSON.stringify({ to_email: email })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur de transfert");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }
  function copyCode() {
    if (result) {
      navigator.clipboard.writeText(result.transfer_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-background/80 px-3 pb-3 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border border-white/10 bg-background p-5 shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Transférer un billet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-lg font-semibold", children: ticketTitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "rounded-full bg-white/5 p-2 text-muted-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm", children: error }),
    !result ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Email du destinataire" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "danielle@email.com",
              className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl bg-primary/10 p-4 text-xs text-muted-foreground", children: "Le destinataire recevra un code de transfert valable 24h. Il devra avoir un compte FanPass pour accepter le billet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleTransfer,
          disabled: loading || !email,
          className: "mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "Transfert..." : "Envoyer le billet"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-success/15 p-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-success font-semibold mb-2", children: "✅ Transfert initié" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-3", children: "Communiquez ce code au destinataire :" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold tracking-[0.2em] text-foreground", children: result.transfer_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: copyCode,
            className: "mt-3 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-xs font-medium",
            children: [
              copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
              copied ? "Copié !" : "Copier le code"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "w-full rounded-2xl bg-white/5 py-3 text-sm font-medium",
          children: "Fermer"
        }
      )
    ] })
  ] }) });
}
const STORAGE_KEY = "fanpass:purchasedTickets:v1";
const MATCH_EVENTS = [
  {
    id: "match-mar-esp-opening",
    type: "match",
    title: "Maroc vs Espagne",
    subtitle: "Match d'ouverture",
    city: "Casablanca",
    venue: "Grand Stade Hassan II",
    date: "14 juin 2030",
    time: "20:00",
    density: "Forte",
    description: "Le premier grand soir de la Coupe du Monde 2030 au Maroc.",
    access: {
      gate: "Gate C",
      accessZone: "Perimetre Nord",
      tribune: "Tribune Atlas",
      seatHint: "Rang 12 - Siege 47",
      accessControl: "Scan QR + controle identite aleatoire",
      rules: [
        "Arrivee conseillee 18:30",
        "Sac cabine uniquement",
        "Gate C dediee VIP"
      ]
    },
    tiers: [
      {
        id: "standard",
        name: "Standard",
        price: 950,
        currency: "MAD",
        benefits: [
          "Siege assigne",
          "QR mobile securise",
          "Itineraire gate-aware"
        ]
      },
      {
        id: "premium",
        name: "Fan Premium",
        price: 1800,
        currency: "MAD",
        benefits: ["Meilleure vue", "Acces rapide", "Pack souvenir"]
      },
      {
        id: "vip",
        name: "Atlas VIP",
        price: 3200,
        currency: "MAD",
        benefits: ["Lounge avant-match", "Gate prioritaire", "Merch inclus"]
      }
    ]
  },
  {
    id: "match-fra-bra-group",
    type: "match",
    title: "France vs Bresil",
    subtitle: "Phase de groupes",
    city: "Rabat",
    venue: "Stade Prince Moulay Abdellah",
    date: "18 juin 2030",
    time: "18:00",
    density: "Vibrante",
    description: "Un choc international dans une atmosphere de grande affiche.",
    access: {
      gate: "Gate E",
      accessZone: "Perimetre Est",
      tribune: "Tribune Ocean",
      seatHint: "Bloc E4 - Rang 8",
      accessControl: "QR dynamique + validation anti-copie",
      rules: [
        "Arrivee conseillee 16:45",
        "Passeport recommande",
        "Entree supporters visiteurs"
      ]
    },
    tiers: [
      {
        id: "standard",
        name: "Standard",
        price: 820,
        currency: "MAD",
        benefits: ["Siege assigne", "QR mobile securise", "Fan route"]
      },
      {
        id: "club",
        name: "Club Fan",
        price: 1550,
        currency: "MAD",
        benefits: ["Zone centrale", "Entree dediee", "Boisson incluse"]
      }
    ]
  },
  {
    id: "match-arg-ger-quarter",
    type: "match",
    title: "Argentine vs Allemagne",
    subtitle: "Quart de finale",
    city: "Marrakech",
    venue: "Stade de Marrakech",
    date: "4 juillet 2030",
    time: "21:00",
    density: "Forte",
    description: "Un quart de finale premium dans la ville rouge.",
    access: {
      gate: "Gate B",
      accessZone: "Perimetre Sud",
      tribune: "Tribune Menara",
      seatHint: "Bloc B2 - Rang 14",
      accessControl: "QR unique + controle billet nominatif",
      rules: [
        "Arrivee conseillee 19:15",
        "Hydratation autorisee",
        "Acces famille a proximite"
      ]
    },
    tiers: [
      {
        id: "standard",
        name: "Standard",
        price: 1100,
        currency: "MAD",
        benefits: ["Siege assigne", "QR mobile securise", "Guidage porte"]
      },
      {
        id: "premium",
        name: "Premium",
        price: 2100,
        currency: "MAD",
        benefits: ["Tribune basse", "Acces rapide", "Fan kit"]
      }
    ]
  }
];
const FAN_ZONE_EVENTS = [
  {
    id: "zone-casa-corniche",
    type: "fan_zone",
    title: "Casablanca Corniche",
    subtitle: "Ecran geant, DJ live, street food",
    city: "Casablanca",
    venue: "Corniche Ain Diab",
    date: "14 juin 2030",
    time: "16:00 - 01:00",
    density: "Vibrante",
    description: "Fan zone oceanique liee au match d'ouverture.",
    access: {
      gate: "Entree A",
      accessZone: "Zone Atlantique",
      tribune: "Standing Fan Zone",
      seatHint: "Acces libre controle",
      accessControl: "QR fan zone + controle capacite",
      rules: [
        "Entree possible des 16:00",
        "Sortie definitive apres scan",
        "Capacite limitee"
      ]
    },
    tiers: [
      {
        id: "evening",
        name: "Pass Soiree",
        price: 220,
        currency: "MAD",
        benefits: ["Acces fan zone", "Animations live", "QR mobile securise"]
      },
      {
        id: "lounge",
        name: "Lounge Atlantique",
        price: 640,
        currency: "MAD",
        benefits: ["Zone lounge", "File rapide", "Credit food inclus"]
      }
    ]
  },
  {
    id: "zone-marrakech-medina",
    type: "fan_zone",
    title: "Marrakech Medina Live",
    subtitle: "Concerts, artisans, gastronomie",
    city: "Marrakech",
    venue: "Esplanade Menara",
    date: "4 juillet 2030",
    time: "15:00 - 00:30",
    density: "Forte",
    description: "Experience football et culture marocaine avant le quart de finale.",
    access: {
      gate: "Entree Medina",
      accessZone: "Village Culture",
      tribune: "Zone Scene",
      seatHint: "Acces debout",
      accessControl: "QR dynamique + jauge evenement",
      rules: [
        "Arrivee conseillee 17:00",
        "Objets encombrants interdits",
        "Re-scan necessaire apres sortie"
      ]
    },
    tiers: [
      {
        id: "access",
        name: "Pass Culture",
        price: 180,
        currency: "MAD",
        benefits: ["Acces scene", "Village artisans", "QR mobile securise"]
      },
      {
        id: "gold",
        name: "Pass Gold",
        price: 520,
        currency: "MAD",
        benefits: [
          "Vue scene premium",
          "Entree prioritaire",
          "Degustation incluse"
        ]
      }
    ]
  },
  {
    id: "zone-rabat-ocean",
    type: "fan_zone",
    title: "Rabat Ocean Stage",
    subtitle: "Families, food court, live stats",
    city: "Rabat",
    venue: "Bouregreg Fan Park",
    date: "18 juin 2030",
    time: "14:00 - 23:30",
    density: "Moderee",
    description: "Fan zone fluide pour familles et supporters internationaux.",
    access: {
      gate: "Entree Family",
      accessZone: "Zone Bouregreg",
      tribune: "Espace Famille",
      seatHint: "Zone assise non assignee",
      accessControl: "QR mobile + controle age famille",
      rules: [
        "Acces enfant accompagne",
        "Bracelet remis au scan",
        "Sortie possible avant 20:00"
      ]
    },
    tiers: [
      {
        id: "day",
        name: "Pass Journee",
        price: 160,
        currency: "MAD",
        benefits: ["Acces complet", "Live stats", "QR mobile securise"]
      },
      {
        id: "family",
        name: "Pass Confort",
        price: 480,
        currency: "MAD",
        benefits: ["Zone assise", "Entree rapide", "Pack boisson"]
      }
    ]
  }
];
const FOOTBALL_EVENTS = [
  {
    id: "event-jersey-launch",
    type: "event",
    title: "Lancement Maillot Maroc 2030",
    subtitle: "Showcase officiel et precommande",
    city: "Casablanca",
    venue: "FanPass Arena Pop-up",
    date: "13 juin 2030",
    time: "19:00 - 22:00",
    density: "Moderee",
    description: "Evenement officiel autour du maillot et des souvenirs Maroc 2030.",
    access: {
      gate: "Entree Pop-up",
      accessZone: "Showroom Officiel",
      tribune: "Zone Partenaire",
      seatHint: "Creneau 19:00",
      accessControl: "QR evenement + slot horaire",
      rules: [
        "Acces sur creneau",
        "Precommande nominative",
        "Retrait possible sur place"
      ]
    },
    tiers: [
      {
        id: "access",
        name: "Pass Decouverte",
        price: 120,
        currency: "MAD",
        benefits: ["Acces showcase", "Photo booth", "QR mobile securise"]
      },
      {
        id: "collector",
        name: "Pass Collector",
        price: 450,
        currency: "MAD",
        benefits: [
          "Acces prioritaire",
          "Echarpe collector",
          "Reduction boutique"
        ]
      }
    ]
  },
  {
    id: "event-supporters-meetup",
    type: "event",
    title: "Meet-up Supporters Atlas",
    subtitle: "Point de rencontre avant stade",
    city: "Rabat",
    venue: "Place Al Barid",
    date: "18 juin 2030",
    time: "15:30 - 17:00",
    density: "Calme",
    description: "Groupe temporaire pour aller au stade avec des fans de la meme equipe.",
    access: {
      gate: "Check-in FanPass",
      accessZone: "Point de rencontre",
      tribune: "Groupe Atlas",
      seatHint: "Depart groupe 17:00",
      accessControl: "QR check-in + bracelet groupe",
      rules: [
        "Arrivee 15 min avant depart",
        "Langues FR/EN",
        "Guide FanPass present"
      ]
    },
    tiers: [
      {
        id: "group",
        name: "Pass Groupe",
        price: 90,
        currency: "MAD",
        benefits: ["Guide vers stade", "Point rencontre", "QR mobile securise"]
      }
    ]
  }
];
const ALL_EVENTS = [...MATCH_EVENTS, ...FAN_ZONE_EVENTS, ...FOOTBALL_EVENTS];
const INITIAL_TICKET = {
  id: "initial-mar-esp-vip",
  eventId: "match-mar-esp-opening",
  eventType: "match",
  title: "Maroc vs Espagne",
  subtitle: "Match d'ouverture",
  city: "Casablanca",
  venue: "Grand Stade Hassan II",
  date: "14 juin 2030",
  time: "20:00",
  tierName: "Atlas VIP",
  quantity: 1,
  total: 3200,
  currency: "MAD",
  qrSeed: 203014,
  purchasedAt: "2030-06-14T12:00:00.000Z",
  status: "valid",
  gate: "Gate C",
  accessZone: "Perimetre Nord",
  tribune: "Tribune Atlas",
  seat: "Rang 12 - Siege 47",
  accessControl: "Scan QR + controle identite aleatoire",
  accessRules: [
    "Arrivee conseillee 18:30",
    "Sac cabine uniquement",
    "Gate C dediee VIP"
  ],
  securityCode: "FP-2030-C-ATLAS"
};
function formatMoney(amount, currency) {
  return `${amount.toLocaleString("fr-MA")} ${currency}`;
}
function getEventLabel(type) {
  if (type === "match") return "Match";
  if (type === "fan_zone") return "Fan Zone";
  return "Event";
}
function getStatusLabel(status) {
  if (status === "used") return "Utilise";
  if (status === "locked") return "Bloque";
  return "Valide";
}
function densityClass(density) {
  if (density === "Forte") return "bg-destructive/20 text-destructive";
  if (density === "Vibrante") return "bg-primary/20 text-primary-glow";
  if (density === "Moderee") return "bg-primary/15 text-primary-glow";
  return "bg-success/20 text-success";
}
function createTicketId(event) {
  return `${event.id}-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
}
function createQrSeed(event) {
  const eventSeed = Array.from(event.id).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  );
  return (eventSeed * 97 + Date.now()) % 233280;
}
function createSecurityCode(event, tier) {
  return `FP-${event.type.toUpperCase()}-${event.id.slice(-5).toUpperCase()}-${tier.id.toUpperCase()}`;
}
function findEvent(eventId) {
  return ALL_EVENTS.find((event) => event.id === eventId);
}
function formatGate$1(gate) {
  if (!gate) return INITIAL_TICKET.gate;
  if (gate.startsWith("Gate ")) return gate;
  if (gate.startsWith("gate-"))
    return `Gate ${gate.replace("gate-", "").toUpperCase()}`;
  return gate;
}
function statusFromApi(status) {
  if (status === "scanned") return "used";
  if (status === "cancelled" || status === "expired" || status === "transferred") {
    return "locked";
  }
  return "valid";
}
function seedFromString(value) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}
function mapApiEvent(event) {
  const fallback = findEvent(event.id) ?? MATCH_EVENTS[0];
  const access = event.access ?? {};
  return {
    id: event.id,
    type: event.type,
    title: event.title,
    subtitle: event.subtitle ?? fallback.subtitle,
    city: event.city ?? fallback.city,
    venue: event.venue ?? fallback.venue,
    date: event.date ?? fallback.date,
    time: event.time ?? fallback.time,
    density: event.density ?? fallback.density,
    description: event.description ?? fallback.description,
    access: {
      gate: access.gate ?? fallback.access.gate,
      accessZone: access.accessZone ?? fallback.access.accessZone,
      tribune: access.tribune ?? fallback.access.tribune,
      seatHint: access.seatHint ?? fallback.access.seatHint,
      accessControl: access.accessControl ?? fallback.access.accessControl,
      rules: access.rules ?? fallback.access.rules
    },
    tiers: event.tiers?.map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price_mad ?? tier.price ?? 0,
      currency: "MAD",
      benefits: tier.benefits ?? []
    })) ?? fallback.tiers
  };
}
function mapApiTicket$1(ticket) {
  const eventId = ticket.event_id ?? ticket.match_id ?? "api-ticket";
  const gate = formatGate$1(ticket.gate ?? ticket.gate_id);
  const seat = ticket.seat_label ?? [ticket.seat_section, ticket.seat_row, ticket.seat_number].filter(Boolean).join(" - ") ?? INITIAL_TICKET.seat;
  return {
    ...INITIAL_TICKET,
    id: ticket.id,
    apiId: ticket.id,
    eventId,
    eventType: ticket.event_type ?? (ticket.event_id ? "event" : "match"),
    title: ticket.title ?? INITIAL_TICKET.title,
    subtitle: ticket.subtitle ?? INITIAL_TICKET.subtitle,
    city: ticket.city ?? INITIAL_TICKET.city,
    venue: ticket.venue ?? INITIAL_TICKET.venue,
    date: ticket.date ?? INITIAL_TICKET.date,
    time: ticket.time ?? INITIAL_TICKET.time,
    tierName: ticket.tier_name ?? INITIAL_TICKET.tierName,
    quantity: ticket.quantity ?? 1,
    total: ticket.total_mad ?? ticket.price_mad ?? INITIAL_TICKET.total,
    qrSeed: ticket.qr_seed ?? seedFromString(ticket.id),
    purchasedAt: ticket.purchased_at ?? (/* @__PURE__ */ new Date()).toISOString(),
    status: statusFromApi(ticket.status),
    gate,
    accessZone: ticket.access_zone ?? INITIAL_TICKET.accessZone,
    tribune: ticket.tribune ?? INITIAL_TICKET.tribune,
    seat,
    accessControl: ticket.access_control ?? INITIAL_TICKET.accessControl,
    accessRules: ticket.access_rules ?? INITIAL_TICKET.accessRules,
    securityCode: ticket.security_code ?? INITIAL_TICKET.securityCode,
    qrRaw: ticket.qr_raw
  };
}
function normalizeStoredTicket(ticket) {
  const event = ticket.eventId ? findEvent(ticket.eventId) : void 0;
  const fallbackAccess = event?.access ?? MATCH_EVENTS[0].access;
  return {
    ...INITIAL_TICKET,
    ...ticket,
    eventType: ticket.eventType ?? event?.type ?? INITIAL_TICKET.eventType,
    gate: ticket.gate ?? fallbackAccess.gate,
    accessZone: ticket.accessZone ?? fallbackAccess.accessZone,
    tribune: ticket.tribune ?? fallbackAccess.tribune,
    seat: ticket.seat ?? fallbackAccess.seatHint,
    accessControl: ticket.accessControl ?? fallbackAccess.accessControl,
    accessRules: ticket.accessRules ?? fallbackAccess.rules,
    status: ticket.status ?? "valid",
    securityCode: ticket.securityCode ?? "FP-LEGACY-SECURE"
  };
}
function readStoredTickets() {
  if (typeof window === "undefined") return [INITIAL_TICKET];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [INITIAL_TICKET];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [INITIAL_TICKET];
    return parsed.map((ticket) => normalizeStoredTicket(ticket));
  } catch {
    return [INITIAL_TICKET];
  }
}
function TicketView({ onNav }) {
  const { token } = useAuth();
  const [segment, setSegment] = reactExports.useState("wallet");
  const [tickets, setTickets] = reactExports.useState([INITIAL_TICKET]);
  const [catalogEvents, setCatalogEvents] = reactExports.useState(ALL_EVENTS);
  const [hydrated, setHydrated] = reactExports.useState(false);
  const [activeTicketId, setActiveTicketId] = reactExports.useState(INITIAL_TICKET.id);
  const [checkoutEvent, setCheckoutEvent] = reactExports.useState(null);
  const [selectedTierId, setSelectedTierId] = reactExports.useState("");
  const [quantity, setQuantity] = reactExports.useState(1);
  const [showImport, setShowImport] = reactExports.useState(false);
  const [showScan, setShowScan] = reactExports.useState(false);
  const [showAcceptTransfer, setShowAcceptTransfer] = reactExports.useState(false);
  const [transferTicket, setTransferTicket] = reactExports.useState(
    null
  );
  const loadRemoteWallet = reactExports.useCallback(async () => {
    if (!token) return false;
    try {
      const response = await fanpassFetch("/tickets", token, {
        signal: AbortSignal.timeout(4e3)
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return false;
      const apiTickets = data.map((ticket) => mapApiTicket$1(ticket));
      setTickets(apiTickets);
      setActiveTicketId(apiTickets[0]?.id ?? INITIAL_TICKET.id);
      return true;
    } catch {
      return false;
    }
  }, [token]);
  reactExports.useEffect(() => {
    const storedTickets = readStoredTickets();
    setTickets(storedTickets);
    setActiveTicketId(storedTickets[0]?.id ?? INITIAL_TICKET.id);
    setHydrated(true);
    void loadRemoteWallet();
  }, [loadRemoteWallet]);
  reactExports.useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fanpassFetch("/tickets/events", token, {
          signal: AbortSignal.timeout(4e3)
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogEvents(data.map((event) => mapApiEvent(event)));
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);
  reactExports.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [hydrated, tickets]);
  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId) ?? tickets[0] ?? INITIAL_TICKET;
  const visibleEvents = segment === "zones" ? catalogEvents.filter((event) => event.type === "fan_zone") : segment === "events" ? catalogEvents.filter((event) => event.type === "event") : catalogEvents.filter((event) => event.type === "match");
  const selectedTier = checkoutEvent?.tiers.find((tier) => tier.id === selectedTierId) ?? checkoutEvent?.tiers[0];
  const total = selectedTier ? selectedTier.price * quantity : 0;
  const walletStats = reactExports.useMemo(() => {
    const matchCount = tickets.filter(
      (ticket) => ticket.eventType === "match"
    ).length;
    const zoneCount = tickets.filter(
      (ticket) => ticket.eventType === "fan_zone"
    ).length;
    const eventCount = tickets.filter(
      (ticket) => ticket.eventType === "event"
    ).length;
    return { eventCount, matchCount, zoneCount };
  }, [tickets]);
  function openCheckout(event) {
    setCheckoutEvent(event);
    setSelectedTierId(event.tiers[0]?.id ?? "");
    setQuantity(1);
  }
  function addPurchasedTicket(purchasedTicket) {
    setTickets((currentTickets) => [purchasedTicket, ...currentTickets]);
    setActiveTicketId(purchasedTicket.id);
    setSegment("wallet");
    setCheckoutEvent(null);
  }
  function createLocalPurchase(event, tier) {
    const localTotal = tier.price * quantity;
    return {
      id: createTicketId(event),
      eventId: event.id,
      eventType: event.type,
      title: event.title,
      subtitle: event.subtitle,
      city: event.city,
      venue: event.venue,
      date: event.date,
      time: event.time,
      tierName: tier.name,
      quantity,
      total: localTotal,
      currency: tier.currency,
      qrSeed: createQrSeed(event),
      purchasedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "valid",
      gate: event.access.gate,
      accessZone: event.access.accessZone,
      tribune: event.access.tribune,
      seat: event.access.seatHint,
      accessControl: event.access.accessControl,
      accessRules: event.access.rules,
      securityCode: createSecurityCode(event, tier)
    };
  }
  async function confirmCheckout() {
    if (!checkoutEvent || !selectedTier) return;
    if (token) {
      try {
        const response = await fanpassFetch("/tickets/purchase", token, {
          method: "POST",
          body: JSON.stringify({
            event_id: checkoutEvent.id,
            tier_id: selectedTier.id,
            gate_id: checkoutEvent.access.gate.toLowerCase().replace(" ", "-"),
            quantity
          })
        });
        if (response.ok) {
          const apiTicket = mapApiTicket$1(await response.json());
          addPurchasedTicket(apiTicket);
          return;
        }
      } catch {
      }
    }
    addPurchasedTicket(createLocalPurchase(checkoutEvent, selectedTier));
  }
  const navigate = (tab) => onNav?.(tab);
  if (showImport) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImportTicketView,
      {
        onBack: () => setShowImport(false),
        onImported: () => {
          setShowImport(false);
          void loadRemoteWallet();
        }
      }
    );
  }
  if (showScan) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ScanView, { onBack: () => setShowScan(false) });
  }
  if (showAcceptTransfer) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AcceptTransferView,
      {
        onBack: () => setShowAcceptTransfer(false),
        onAccepted: () => {
          setShowAcceptTransfer(false);
          void loadRemoteWallet();
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { eyebrow: "Smart Ticketing", title: "Billets sécurisés" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-5 text-primary-foreground shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-80", children: "Coupe du Monde 2030 - Maroc" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-semibold", children: "Le billet pilote le parcours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm opacity-90", children: "QR unique, anti-fraude, contrôle d'accès et gate associée dans un seul wallet." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white/15 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletCards, { className: "h-6 w-6" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-5 grid grid-cols-4 gap-2 text-center text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Billets", value: tickets.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Matchs", value: walletStats.matchCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Zones", value: walletStats.zoneCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Events", value: walletStats.eventCount })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 rounded-2xl bg-white/5 p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SegmentButton,
        {
          active: segment === "wallet",
          label: "Wallet",
          onClick: () => setSegment("wallet")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SegmentButton,
        {
          active: segment === "matches",
          label: "Matchs",
          onClick: () => setSegment("matches")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SegmentButton,
        {
          active: segment === "zones",
          label: "Zones",
          onClick: () => setSegment("zones")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SegmentButton,
        {
          active: segment === "events",
          label: "Events",
          onClick: () => setSegment("events")
        }
      )
    ] }),
    segment === "wallet" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      WalletView,
      {
        activeTicket,
        tickets,
        onSelectTicket: setActiveTicketId,
        onOpenMatches: () => setSegment("matches"),
        onOpenZones: () => setSegment("zones"),
        onOpenEvents: () => setSegment("events"),
        onTransferTicket: setTransferTicket
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(CatalogView, { events: visibleEvents, onCheckout: openCheckout }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: Upload,
          label: "Importer un billet",
          onClick: () => setShowImport(true)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: Ticket,
          label: "Recevoir transfert",
          onClick: () => setShowAcceptTransfer(true)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: ScanLine,
          label: "Scanner demo",
          onClick: () => setShowScan(true)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: Navigation,
          label: "Vers ma gate",
          onClick: () => navigate("parcours")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: DoorOpen,
          label: "Accès stade",
          onClick: () => navigate("parcours")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: Users,
          label: "Matching",
          onClick: () => navigate("communaute")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickAction,
        {
          icon: ShoppingBag,
          label: "Merch lié",
          onClick: () => navigate("plus")
        }
      )
    ] }),
    checkoutEvent && selectedTier && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckoutModal,
      {
        event: checkoutEvent,
        selectedTier,
        selectedTierId,
        quantity,
        total,
        onClose: () => setCheckoutEvent(null),
        onSelectTier: setSelectedTierId,
        onQuantityChange: setQuantity,
        onConfirm: confirmCheckout
      }
    ),
    transferTicket && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransferModal,
      {
        ticketId: transferTicket.apiId ?? transferTicket.id,
        ticketTitle: transferTicket.title,
        onClose: () => setTransferTicket(null)
      }
    )
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/15 px-2 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-75", children: label })
  ] });
}
function SegmentButton({
  active,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: `rounded-xl px-1 py-2 text-[0.68rem] font-semibold transition sm:text-xs ${active ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
      children: label
    }
  );
}
function WalletView({
  activeTicket,
  tickets,
  onSelectTicket,
  onOpenMatches,
  onOpenZones,
  onOpenEvents,
  onTransferTicket
}) {
  function copySignedQr() {
    if (!activeTicket.qrRaw || typeof navigator === "undefined") return;
    void navigator.clipboard.writeText(activeTicket.qrRaw);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: getEventLabel(activeTicket.eventType) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: activeTicket.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: activeTicket.subtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success", children: getStatusLabel(activeTicket.status) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-[1fr_auto] items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TicketFact, { label: "Lieu", value: activeTicket.venue }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TicketFact,
            {
              label: "Date",
              value: `${activeTicket.date} - ${activeTicket.time}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TicketFact, { label: "Gate associée", value: activeTicket.gate }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TicketFact, { label: "Zone / Tribune", value: activeTicket.tribune }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TicketFact, { label: "Place / accès", value: activeTicket.seat })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QRTicket, { seed: activeTicket.qrSeed, sizeClassName: "w-32" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityPill, { icon: FingerprintPattern, label: "QR unique" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityPill, { icon: LockKeyhole, label: "Anti-copie actif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityPill, { icon: ScanLine, label: "Contrôle gate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityPill, { icon: ShieldCheck, label: "Billet sécurisé" })
      ] }),
      (activeTicket.qrRaw || activeTicket.apiId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
        activeTicket.qrRaw && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: copySignedQr,
            className: "rounded-2xl bg-white/5 px-3 py-3 text-xs font-medium",
            children: "Copier QR signe"
          }
        ),
        activeTicket.apiId && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onTransferTicket(activeTicket),
            className: "rounded-2xl bg-primary px-3 py-3 text-xs font-medium text-primary-foreground glow-primary",
            children: "Transferer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl bg-white/5 px-4 py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Contrôle d'accès" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right font-semibold", children: activeTicket.accessControl })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Code sécurité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold", children: activeTicket.securityCode })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: "Règles liées au billet" }),
        activeTicket.accessRules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 shrink-0 text-success" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rule })
            ]
          },
          rule
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onOpenMatches,
          className: "rounded-2xl bg-primary px-3 py-3 text-xs font-medium text-primary-foreground glow-primary",
          children: "Match"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onOpenZones,
          className: "glass rounded-2xl px-3 py-3 text-xs font-medium",
          children: "Fan zone"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onOpenEvents,
          className: "glass rounded-2xl px-3 py-3 text-xs font-medium",
          children: "Event"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs px-1 text-muted-foreground", children: "Tous mes billets sécurisés" }),
      tickets.map((ticket) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onSelectTicket(ticket.id),
          className: `w-full rounded-2xl p-4 text-left transition ${activeTicket.id === ticket.id ? "bg-primary/15 ring-1 ring-primary/40" : "glass hover:bg-white/5"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: ticket.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
                ticket.gate,
                " - ",
                ticket.date
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: getEventLabel(ticket.eventType) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
                "x",
                ticket.quantity
              ] })
            ] })
          ] })
        },
        ticket.id
      ))
    ] })
  ] });
}
function TicketFact({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 font-medium", children: value })
  ] });
}
function SecurityPill({
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-primary-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: label })
  ] });
}
function CatalogView({
  events,
  onCheckout
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: events.map((event) => {
    const minPrice = Math.min(...event.tiers.map((tier) => tier.price));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: getEventLabel(event.type) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-xl font-semibold", children: event.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: event.subtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `label-xs rounded-full px-2 py-1 ${densityClass(event.density)}`,
            children: event.density
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: event.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(EventMeta, { icon: MapPin, label: event.venue }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EventMeta,
          {
            icon: CalendarDays,
            label: `${event.date} - ${event.time}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(EventMeta, { icon: DoorOpen, label: event.access.gate }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EventMeta,
          {
            icon: ShieldCheck,
            label: event.access.accessControl
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: "À partir de" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: formatMoney(minPrice, "MAD") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onCheckout(event),
            className: "inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground glow-primary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-4 w-4" }),
              "Acheter"
            ]
          }
        )
      ] })
    ] }, event.id);
  }) });
}
function EventMeta({ icon: Icon, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-primary-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 text-xs text-muted-foreground", children: label })
  ] });
}
function CheckoutModal({
  event,
  selectedTier,
  selectedTierId,
  quantity,
  total,
  onClose,
  onSelectTier,
  onQuantityChange,
  onConfirm
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-background/80 px-3 pb-3 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border border-white/10 bg-background p-5 shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-xs text-primary-glow", children: [
          "Achat ",
          getEventLabel(event.type).toLowerCase()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-xl font-semibold", children: event.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          event.city,
          " - ",
          event.date,
          " - ",
          event.time
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "rounded-full bg-white/5 p-2 text-muted-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl bg-primary/10 p-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold text-primary-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
        "Billet sécurisé FanPass"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-muted-foreground", children: [
        "QR unique, anti-copie actif et accès associé à ",
        event.access.gate,
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: "Catégorie" }),
      event.tiers.map((tier) => {
        const selected = tier.id === selectedTierId;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onSelectTier(tier.id),
            className: `w-full rounded-2xl p-4 text-left transition ${selected ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: tier.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: tier.benefits.join(" - ") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right text-sm font-semibold", children: formatMoney(tier.price, tier.currency) })
            ] })
          },
          tier.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: "Quantité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Maximum 4 billets" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onQuantityChange(Math.max(1, quantity - 1)),
            className: "grid h-9 w-9 place-items-center rounded-full bg-white/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 text-center font-display text-lg font-semibold", children: quantity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onQuantityChange(Math.min(4, quantity + 1)),
            className: "grid h-9 w-9 place-items-center rounded-full bg-white/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl bg-primary/15 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          selectedTier.name,
          " x",
          quantity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatMoney(total, selectedTier.currency) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-primary-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
        "Le QR et les règles d'accès seront ajoutés au wallet."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-[auto_1fr_auto] gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onConfirm,
          className: "rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground glow-primary",
          children: "Confirmer l'achat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center rounded-2xl bg-white/5 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }) })
    ] })
  ] }) });
}
function QuickAction({
  icon: Icon,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: "glass flex items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-white/5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-glow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-muted-foreground", children: "Ouvrir" })
        ] })
      ]
    }
  );
}
const TICKETS_STORAGE_KEY = "fanpass:purchasedTickets:v1";
const DEFAULT_TICKET = {
  title: "Maroc vs Espagne",
  city: "Casablanca",
  venue: "Grand Stade Hassan II",
  date: "14 juin 2030",
  time: "20:00",
  gate: "Gate C"
};
function formatGate(gate) {
  if (!gate) return DEFAULT_TICKET.gate;
  if (gate.startsWith("Gate ")) return gate;
  if (gate.startsWith("gate-"))
    return `Gate ${gate.replace("gate-", "").toUpperCase()}`;
  return gate;
}
function mapApiTicket(ticket) {
  return {
    title: ticket.title ?? ticket.ticket_title ?? DEFAULT_TICKET.title,
    city: ticket.city ?? DEFAULT_TICKET.city,
    venue: ticket.venue ?? DEFAULT_TICKET.venue,
    date: ticket.date ?? DEFAULT_TICKET.date,
    time: ticket.time ?? DEFAULT_TICKET.time,
    gate: formatGate(ticket.gate ?? ticket.gate_id)
  };
}
function readActiveTicket() {
  if (typeof window === "undefined") return DEFAULT_TICKET;
  try {
    const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) return DEFAULT_TICKET;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed[0]) return DEFAULT_TICKET;
    return {
      ...DEFAULT_TICKET,
      title: parsed[0].title ?? DEFAULT_TICKET.title,
      city: parsed[0].city ?? DEFAULT_TICKET.city,
      venue: parsed[0].venue ?? DEFAULT_TICKET.venue,
      date: parsed[0].date ?? DEFAULT_TICKET.date,
      time: parsed[0].time ?? DEFAULT_TICKET.time,
      gate: parsed[0].gate ?? DEFAULT_TICKET.gate
    };
  } catch {
    return DEFAULT_TICKET;
  }
}
function useActiveTicket() {
  const { token } = useAuth();
  const [ticket, setTicket] = reactExports.useState(DEFAULT_TICKET);
  reactExports.useEffect(() => {
    setTicket(readActiveTicket());
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fanpassFetch("/tickets", token, {
          signal: AbortSignal.timeout(3e3)
        });
        if (!response.ok) return;
        const tickets = await response.json();
        if (!cancelled && Array.isArray(tickets) && tickets[0]) {
          setTicket(mapApiTicket(tickets[0]));
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);
  return ticket;
}
function HeroBanner({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  stats,
  gradient = "from-primary via-primary to-primary-glow"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 text-primary-foreground shadow-elevated`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-80", children: eyebrow }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-2xl font-semibold", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm opacity-90", children: subtitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-5 grid grid-cols-3 gap-2 text-center text-sm", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/15 px-2 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-display text-lg font-semibold", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-75", children: s.label })
        ] }, s.label)) })
      ]
    }
  );
}
function FilterBar({
  items,
  activeId,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid rounded-2xl bg-white/5 p-1",
      style: { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` },
      children: items.map((it) => {
        const active = it.id === activeId;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onChange(it.id),
            className: `rounded-xl px-1 py-2 text-[0.68rem] font-semibold transition sm:text-xs ${active ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
            children: it.label
          },
          it.id
        );
      })
    }
  );
}
const GateAwareMap = reactExports.lazy(
  () => import("./GateAwareMap-D66ostTx.mjs").then((m) => ({ default: m.GateAwareMap }))
);
function transportIcon(id) {
  if (id === "tram") return TramFront;
  if (id === "bus") return Bus;
  if (id === "drive" || id === "taxi") return Car;
  if (id === "group") return Users;
  return Navigation;
}
function statusClass$1(s) {
  if (s === "high" || s === "Sature")
    return "bg-destructive/20 text-destructive";
  if (s === "medium" || s === "Charge")
    return "bg-primary/20 text-primary-glow";
  if (s === "closed" || s === "Ferme")
    return "bg-white/10 text-muted-foreground";
  return "bg-success/20 text-success";
}
function statusLabel$2(s) {
  if (s === "high") return "Saturé";
  if (s === "medium") return "Chargé";
  if (s === "closed") return "Fermé";
  return "Fluide";
}
const fallbackPlan = {
  gate_id: "gate-c",
  headline: "Route optimisée vers Gate C",
  destination_label: "Entrée Nord — Gate C",
  estimated_time_min: 24,
  departure_time: "18:30",
  gate_wait_min: 8,
  crowd_status: "medium",
  recommended_mode: "Tramway T2",
  drop_off: "Drop-off Boulevard des Sports Nord",
  parking: "Parking P3 Nord, 420 places",
  final_walk: "650 m via corridor bleu",
  alternative_gate: "Gate D",
  return_plan: "Navette Nord 22:45",
  closed_roads: ["Avenue des Stades"],
  checkpoints: ["Checkpoint Alpha (300m)"],
  coordinates: { lat: 33.5731, lon: -7.6698 },
  dropoff_coords: { lat: 33.581, lon: -7.665 }
};
const fallbackModes = [
  { id: "taxi", label: "Taxi/VTC", icon: "Car" },
  { id: "tram", label: "Tramway", icon: "Train" },
  { id: "bus", label: "Navette", icon: "Bus" },
  { id: "drive", label: "Voiture", icon: "Car" },
  { id: "walk", label: "Marche", icon: "Walk" },
  { id: "group", label: "Groupe", icon: "Users" }
];
function ItineraireSection() {
  const { token } = useAuth();
  const [data, setData] = reactExports.useState(null);
  const [transportMode, setTransportMode] = reactExports.useState("taxi");
  const [recalculated, setRecalculated] = reactExports.useState(
    null
  );
  const [alerts, setAlerts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [guidanceStarted, setGuidanceStarted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 4e3);
    if (!token) {
      setLoading(false);
      return () => clearTimeout(timeout);
    }
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4e3);
    (async () => {
      try {
        const [mr, ar] = await Promise.all([
          fanpassFetch("/mobility/gate-plan", token, {
            signal: controller.signal
          }),
          fanpassFetch("/mobility/alerts", token, {
            signal: controller.signal
          })
        ]);
        if (mr.ok) setData(await mr.json());
        if (ar.ok) setAlerts(await ar.json());
      } catch {
      } finally {
        clearTimeout(t);
        clearTimeout(timeout);
        setLoading(false);
      }
    })();
    return () => {
      clearTimeout(t);
      clearTimeout(timeout);
    };
  }, [token]);
  async function handleModeChange(mode) {
    setTransportMode(mode);
    if (!data || !token) return;
    try {
      const r = await fanpassFetch("/mobility/recalculate", token, {
        method: "POST",
        body: JSON.stringify({ gate_id: data.gate_id, transport_mode: mode }),
        signal: AbortSignal.timeout(3e3)
      });
      if (r.ok) setRecalculated(await r.json());
    } catch {
    }
  }
  const plan = recalculated?.plan ?? data?.plan ?? fallbackPlan;
  const gateCode = data?.gate_id?.replace("gate-", "").toUpperCase() ?? "C";
  const departure = recalculated?.departure ?? data?.departure ?? "18:45";
  const modes = data?.transport_modes ?? fallbackModes;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass rounded-3xl p-6 animate-pulse space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 bg-white/5 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-white/5 rounded-lg" })
        ]
      },
      i
    )) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Mode de transport" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: modes.map((mode) => {
        const I = transportIcon(mode.id);
        const a = transportMode === mode.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleModeChange(mode.id),
            className: `rounded-2xl p-3 text-center transition ${a ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                I,
                {
                  className: `h-5 w-5 mx-auto mb-1 ${a ? "text-primary-glow" : "text-muted-foreground"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[0.68rem] font-semibold ${a ? "text-foreground" : "text-muted-foreground"}`,
                  children: mode.label
                }
              )
            ]
          },
          mode.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: plan.headline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: plan.destination_label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Gate ",
            gateCode,
            " — Votre billet donne accès à cette entrée"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `label-xs rounded-full px-2 py-1 ${statusClass$1(plan.crowd_status)}`,
            children: statusLabel$2(plan.crowd_status)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        reactExports.Suspense,
        {
          fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-80 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Chargement de la carte..." }) }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(GateAwareMap, { plan, gateCode })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RC,
        {
          icon: transportIcon(transportMode),
          eyebrow: "Partie 1 — Approche",
          title: recalculated?.arrival_point ?? plan.drop_off,
          detail: transportMode === "drive" ? "Parking recommandé." : `Point de dépôt le plus proche de Gate ${gateCode}.`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RC,
        {
          icon: Navigation,
          eyebrow: "Partie 2 — Dernier kilomètre",
          title: recalculated?.final_walk ?? plan.final_walk,
          detail: `Guidage piéton jusqu'au scan QR.`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Routes fermées" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: plan.closed_roads.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 rounded-2xl bg-destructive/10 px-3 py-3 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
            r
          ]
        },
        r
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Points de contrôle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        plan.checkpoints.map((cp, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary-glow", children: i + 1 }),
              cp
            ]
          },
          cp
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-success/10 px-3 py-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DoorOpen, { className: "h-4 w-4 text-success" }),
          "Gate ",
          gateCode,
          " — Scan QR"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-5 text-primary-foreground shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-80 mb-2", children: "Départ recommandé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl font-bold", children: departure }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm opacity-90", children: [
          "Match à ",
          data?.kickoff_time ?? "20:00",
          " —",
          " ",
          plan.estimated_time_min + 9 + plan.gate_wait_min,
          " min"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/15 px-2 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
              plan.estimated_time_min,
              " min"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-75", children: "Trajet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/15 px-2 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "9 min" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-75", children: "Marche" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/15 px-2 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
              plan.gate_wait_min,
              " min"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-75", children: "Attente" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs px-1 text-muted-foreground", children: "Alertes temps réel" }),
      alerts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AC, { alert: a }, a.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-success/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-6 w-6 text-success" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-success", children: "Retour après match" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold", children: plan.return_plan }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
          "Sortie conseillée par Gate ",
          gateCode,
          "."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Porte alternative" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm font-semibold", children: plan.alternative_gate }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
        "Utilisez cette gate si Gate ",
        gateCode,
        " dépasse 15 min."
      ] })
    ] }),
    guidanceStarted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 ring-1 ring-success/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-success", children: "Guidage actif" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-sm font-semibold", children: [
        "Direction ",
        plan.destination_label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
        "Suivez le point de depot recommande, puis le corridor pieton final vers Gate ",
        gateCode,
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setGuidanceStarted(true),
        className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-primary-foreground glow-primary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" }),
          " ",
          guidanceStarted ? `Guidage vers Gate ${gateCode}` : `Demarrer vers Gate ${gateCode}`
        ]
      }
    )
  ] });
}
function RC({
  icon: I,
  eyebrow,
  title,
  detail
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-6 w-6 text-primary-glow" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: detail })
    ] })
  ] }) });
}
function AC({ alert }) {
  const tc = alert.severity === "critical" ? "bg-destructive/15 text-destructive" : alert.severity === "warning" ? "bg-primary/15 text-primary-glow" : "bg-success/15 text-success";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-9 w-9 place-items-center rounded-xl ${tc}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: alert.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: alert.detail })
    ] })
  ] }) });
}
const STADIUM_GATES = [
  {
    id: "Gate A",
    zone: "Sud-Ouest",
    status: "fluide",
    wait: 4,
    role: "Famille / PMR",
    note: "Accès ascenseurs et poussettes."
  },
  {
    id: "Gate B",
    zone: "Sud",
    status: "fluide",
    wait: 6,
    role: "Famille / tribune Menara",
    note: "Meilleur accès pour bloc B."
  },
  {
    id: "Gate C",
    zone: "Nord",
    status: "charge",
    wait: 8,
    role: "VIP / tribune Atlas",
    note: "Votre gate recommandée."
  },
  {
    id: "Gate D",
    zone: "Nord-Est",
    status: "fluide",
    wait: 5,
    role: "Alternative Gate C",
    note: "Redirection conseillée si Gate C dépasse 15 min."
  },
  {
    id: "Gate E",
    zone: "Est",
    status: "sature",
    wait: 18,
    role: "Supporters visiteurs",
    note: "Flux dense, contrôle renforcé."
  },
  {
    id: "Gate F",
    zone: "Ouest",
    status: "ferme",
    wait: 0,
    role: "Logistique",
    note: "Fermée temporairement pour sécurité."
  }
];
function getGateInfo(gateId) {
  return STADIUM_GATES.find((gate) => gate.id === gateId) ?? STADIUM_GATES[2];
}
function getAlternativeGate(activeGate) {
  if (activeGate.status === "ferme" || activeGate.status === "sature") {
    return STADIUM_GATES.find((gate) => gate.status === "fluide") ?? STADIUM_GATES[3];
  }
  if (activeGate.id === "Gate C") return STADIUM_GATES[3];
  return STADIUM_GATES.find(
    (gate) => gate.id !== activeGate.id && gate.status === "fluide"
  ) ?? STADIUM_GATES[3];
}
function statusLabel$1(status) {
  if (status === "fluide") return "Fluide";
  if (status === "charge") return "Chargé";
  if (status === "sature") return "Saturé";
  return "Fermé";
}
function statusClass(status) {
  if (status === "fluide") return "bg-success/20 text-success";
  if (status === "charge") return "bg-primary/20 text-primary-glow";
  if (status === "sature") return "bg-destructive/20 text-destructive";
  return "bg-white/10 text-muted-foreground";
}
function GateSection() {
  const ticket = useActiveTicket();
  const [showQr, setShowQr] = reactExports.useState(false);
  const activeGate = reactExports.useMemo(() => getGateInfo(ticket.gate), [ticket.gate]);
  const alternativeGate = reactExports.useMemo(
    () => getAlternativeGate(activeGate),
    [activeGate]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Gate recommandée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-display text-xl font-semibold", children: [
            activeGate.id,
            " - ",
            activeGate.zone
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
            ticket.venue,
            " - ",
            ticket.gate
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `label-xs rounded-full px-2 py-1 ${statusClass(activeGate.status)}`,
            children: statusLabel$1(activeGate.status)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HeroStat, { label: "Attente", value: `${activeGate.wait} min` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HeroStat, { label: "État", value: statusLabel$1(activeGate.status) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HeroStat, { label: "Zone", value: activeGate.zone })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StadiumMap,
        {
          activeGateId: activeGate.id,
          alternativeGateId: alternativeGate.id
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs px-1 text-muted-foreground", children: "État des gates" }),
      STADIUM_GATES.map((gate) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        GateRow,
        {
          gate,
          active: gate.id === activeGate.id,
          alternative: gate.id === alternativeGate.id
        },
        gate.id
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceCard,
        {
          icon: Utensils,
          title: "Food zone",
          detail: "120 m après Gate C"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceCard,
        {
          icon: HeartPulse,
          title: "Secours",
          detail: "Poste médical Nord"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceCard,
        {
          icon: ShoppingBag,
          title: "Merch",
          detail: "Retrait express"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceCard,
        {
          icon: Accessibility,
          title: "PMR / famille",
          detail: "Accès assisté Gate A/B"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs px-1 text-muted-foreground", children: "Notifications d'accès" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccessNotice,
        {
          icon: Bell,
          tone: "info",
          title: "Préparez votre QR",
          detail: "Le contrôle ouvre 2h avant le coup d'envoi. Luminosité écran maximale au scan."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccessNotice,
        {
          icon: TriangleAlert,
          tone: "warning",
          title: "Gate E saturée",
          detail: "Les supporters visiteurs sont redirigés vers Gate F si le temps d'attente dépasse 20 min."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccessNotice,
        {
          icon: ShieldCheck,
          tone: "success",
          title: "Consignes sécurité",
          detail: "Sac cabine uniquement, bouteilles fermées autorisées, objets encombrants interdits."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Profil d'accès" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileLine,
          {
            icon: Users,
            label: "Supporters visiteurs",
            value: "Orientation vers Gate E/F"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileLine,
          {
            icon: Accessibility,
            label: "PMR",
            value: "Assistance disponible Gate A"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileLine,
          {
            icon: Info,
            label: "VIP / famille",
            value: "Couloir rapide selon billet"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setShowQr(true),
        className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-primary-foreground glow-primary transition hover:scale-[1.01]",
        children: [
          "Ouvrir mon QR à ",
          activeGate.id,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-4 w-4" })
        ]
      }
    ),
    showQr && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-background/80 px-3 pb-3 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border border-white/10 bg-background p-5 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "QR d'acces stade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: ticket.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            activeGate.id,
            " - ",
            ticket.venue
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowQr(false),
            className: "rounded-full bg-white/5 p-2 text-muted-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        QRTicket,
        {
          seed: ticket.title.length * 2030,
          sizeClassName: "w-44"
        }
      ) })
    ] }) })
  ] });
}
function HeroStat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/5 px-2 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-75 text-muted-foreground", children: label })
  ] });
}
function StadiumMap({
  activeGateId,
  alternativeGateId
}) {
  const gatePoints = [
    { id: "Gate A", x: 85, y: 160 },
    { id: "Gate B", x: 150, y: 176 },
    { id: "Gate C", x: 215, y: 160 },
    { id: "Gate D", x: 235, y: 80 },
    { id: "Gate E", x: 150, y: 44 },
    { id: "Gate F", x: 65, y: 80 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-4 h-56 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a1a33] to-[#102a55]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 300 220", className: "absolute inset-0 h-full w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ellipse",
        {
          cx: "150",
          cy: "110",
          rx: "82",
          ry: "62",
          fill: "#1A6FE8",
          opacity: "0.24"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ellipse",
        {
          cx: "150",
          cy: "110",
          rx: "52",
          ry: "34",
          fill: "#1A6FE8",
          opacity: "0.32"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "118", y: "89", width: "64", height: "42", rx: "12", fill: "#1A6FE8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: "150",
          y: "114",
          textAnchor: "middle",
          fill: "white",
          fontSize: "10",
          fontWeight: "700",
          children: "STADE"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "214", cy: "160", r: "28", fill: "#73B9FF", opacity: "0.11" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "235", cy: "80", r: "22", fill: "#00C48C", opacity: "0.11" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M38,198 C74,184 114,176 150,176 S198,174 215,160",
          stroke: "#73B9FF",
          strokeWidth: "4",
          fill: "none",
          strokeLinecap: "round",
          strokeDasharray: "7 7",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "animate",
            {
              attributeName: "stroke-dashoffset",
              from: "0",
              to: "-28",
              dur: "1.2s",
              repeatCount: "indefinite"
            }
          )
        }
      ),
      gatePoints.map((gate) => {
        const active = gate.id === activeGateId;
        const alternative = gate.id === alternativeGateId;
        const gateInfo = getGateInfo(gate.id);
        const color = gateInfo.status === "ferme" ? "#94A3B8" : gateInfo.status === "sature" ? "#EF4444" : active ? "#73B9FF" : alternative ? "#00C48C" : "#1A6FE8";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: gate.x, cy: gate.y, r: active ? 11 : 8, fill: color, children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "animate",
            {
              attributeName: "r",
              values: "11;15;11",
              dur: "2s",
              repeatCount: "indefinite"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: gate.x,
              y: gate.y - 14,
              textAnchor: "middle",
              fill: "white",
              fontSize: "8",
              fontWeight: "700",
              children: gate.id.replace("Gate ", "")
            }
          )
        ] }, gate.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass absolute bottom-3 left-3 rounded-lg px-2 py-1 text-xs", children: "Vous" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3 rounded-lg bg-primary/20 px-2 py-1 text-xs text-primary-glow", children: "Gate active" })
  ] });
}
function GateRow({
  gate,
  active,
  alternative
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-2xl p-4 ${active ? "bg-primary/15 ring-1 ring-primary/40" : "glass"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
              gate.id,
              " ",
              active ? "- votre entrée" : alternative ? "- alternative" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
              gate.zone,
              " - ",
              gate.role
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `label-xs rounded-full px-2 py-1 ${statusClass(gate.status)}`,
                children: statusLabel$1(gate.status)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: gate.status === "ferme" ? "Indispo" : `${gate.wait} min` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs text-muted-foreground", children: gate.note })
      ]
    }
  );
}
function ServiceCard({
  icon: Icon,
  title,
  detail
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-glow" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: detail })
    ] })
  ] }) });
}
function AccessNotice({
  icon: Icon,
  tone,
  title,
  detail
}) {
  const toneClass = tone === "success" ? "bg-success/15 text-success" : tone === "warning" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary-glow";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: detail })
    ] })
  ] }) });
}
function ProfileLine({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary-glow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right text-xs text-muted-foreground", children: value })
  ] });
}
const SUB_TABS$1 = [
  { id: "itineraire", label: "Itinéraire" },
  { id: "gate", label: "Gate" }
];
function ParcoursView() {
  const [subTab, setSubTab] = reactExports.useState("itineraire");
  const ticket = useActiveTicket();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeroBanner,
      {
        icon: MapPin,
        eyebrow: "Parcours stade",
        title: ticket.title,
        subtitle: `FANPASS vous guide vers ${ticket.gate}.`,
        stats: [
          { label: "Ville", value: ticket.city },
          { label: "Gate", value: ticket.gate.replace("Gate ", "") },
          { label: "Stade", value: ticket.venue }
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { items: SUB_TABS$1, activeId: subTab, onChange: setSubTab }),
    subTab === "itineraire" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ItineraireSection, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(GateSection, {})
  ] });
}
function MetaBadge({
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-primary-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate text-xs text-muted-foreground", children: label })
  ] });
}
const JOINED_GROUPS_STORAGE_KEY = "fanpass:joinedGroups:v1";
const FALLBACK_GROUPS = [
  {
    id: "atlas-fr",
    name: "Atlas Gate C",
    team: "Maroc",
    language: "FR",
    city: "Casablanca",
    match: "Maroc vs Espagne",
    profiles: ["solo", "local", "group"],
    size: 42,
    capacity: 60,
    meet_point: "Casa Port - sortie tram",
    meet_time: "17:25",
    destination: "Grand Stade Hassan II - Gate C",
    event_rec: "Meet-up Supporters Atlas",
    mood: "Intense",
    safety: "Guide FanPass présent, corridor sécurisé.",
    route: "Départ groupe vers drop-off Nord.",
    gate: "gate-c",
    verified: true,
    ambiance: "festive",
    score: 92
  },
  {
    id: "morocco-en",
    name: "Morocco Welcome Crew",
    team: "Maroc",
    language: "EN",
    city: "Casablanca",
    match: "Maroc vs Espagne",
    profiles: ["solo", "tourist", "calm"],
    size: 27,
    capacity: 40,
    meet_point: "Marina Casablanca",
    meet_time: "17:00",
    destination: "Casablanca Corniche",
    event_rec: "Casablanca Corniche",
    mood: "Social",
    safety: "Point facile, support EN/FR.",
    route: "Fan zone avant match.",
    gate: "gate-c",
    verified: true,
    ambiance: "tourisme",
    score: 85
  },
  {
    id: "family-rabat",
    name: "Family Ocean Route",
    team: "France",
    language: "FR",
    city: "Rabat",
    match: "France vs Bresil",
    profiles: ["family", "tourist", "calm"],
    size: 18,
    capacity: 36,
    meet_point: "Bouregreg Marina",
    meet_time: "15:45",
    destination: "Rabat Ocean Stage",
    event_rec: "Rabat Ocean Stage",
    mood: "Famille",
    safety: "Zone assise, assistance enfants.",
    route: "Parking Marina.",
    gate: "gate-e",
    verified: true,
    ambiance: "famille",
    score: 78
  },
  {
    id: "brasil-es",
    name: "Brasil Watch Party ES",
    team: "Bresil",
    language: "ES",
    city: "Rabat",
    match: "France vs Bresil",
    profiles: ["solo", "group", "tourist"],
    size: 31,
    capacity: 55,
    meet_point: "Place Al Barid",
    meet_time: "15:30",
    destination: "Meet-up Supporters Atlas",
    event_rec: "Meet-up Supporters Atlas",
    mood: "Social",
    safety: "Groupe temporaire modéré.",
    route: "Départ collectif vers Gate E.",
    gate: "gate-e",
    verified: true,
    ambiance: "sociale",
    score: 71
  },
  {
    id: "espana-calm",
    name: "Espana Calm Entry",
    team: "Espagne",
    language: "ES",
    city: "Casablanca",
    match: "Maroc vs Espagne",
    profiles: ["family", "tourist", "calm"],
    size: 21,
    capacity: 48,
    meet_point: "Drop-off Anfa Nord",
    meet_time: "18:05",
    destination: "Grand Stade Hassan II - Gate D",
    event_rec: "Lancement Maillot Maroc",
    mood: "Calme",
    safety: "Chemin moins dense.",
    route: "Marche via périmètre Ouest.",
    gate: "gate-c",
    verified: true,
    ambiance: "calme",
    score: 65
  },
  {
    id: "neutral-marrakech",
    name: "Global Fans Marrakech",
    team: "Neutre",
    language: "EN",
    city: "Marrakech",
    match: "Argentine vs Allemagne",
    profiles: ["tourist", "solo", "group"],
    size: 34,
    capacity: 52,
    meet_point: "Menara Mall",
    meet_time: "17:40",
    destination: "Marrakech Medina Live",
    event_rec: "Marrakech Medina Live",
    mood: "Social",
    safety: "Brief culturel et assistance.",
    route: "Drop-off Menara.",
    gate: "gate-b",
    verified: false,
    ambiance: "tourisme",
    score: 58
  }
];
const TABS = [
  { id: "tous", label: "Tous" },
  { id: "equipe", label: "Équipe" },
  { id: "langue", label: "Langue" },
  { id: "ambiance", label: "Ambiance" },
  { id: "gate", label: "Gate" },
  { id: "postmatch", label: "Post-match" }
];
function moodClass(mood) {
  if (mood === "Intense") return "bg-destructive/20 text-destructive";
  if (mood === "Famille") return "bg-success/20 text-success";
  if (mood === "Calme") return "bg-primary/15 text-primary-glow";
  return "bg-primary/20 text-primary-glow";
}
function readJoinedIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOINED_GROUPS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}
function GroupesSection() {
  const { token } = useAuth();
  const ticket = useActiveTicket();
  const [groups, setGroups] = reactExports.useState(FALLBACK_GROUPS);
  const [tab, setTab] = reactExports.useState("tous");
  const [joinedIds, setJoinedIds] = reactExports.useState([]);
  const [hydrated, setHydrated] = reactExports.useState(false);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setJoinedIds(readJoinedIds());
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(
      JOINED_GROUPS_STORAGE_KEY,
      JSON.stringify(joinedIds)
    );
  }, [hydrated, joinedIds]);
  reactExports.useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => setLoading(false), 4e3);
    (async () => {
      try {
        const res = await fanpassFetch("/community/groups", token, {
          signal: AbortSignal.timeout(4e3)
        });
        if (res.ok) setGroups(await res.json());
      } catch {
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();
    return () => clearTimeout(t);
  }, [token]);
  const filtered = reactExports.useMemo(() => {
    if (tab === "tous") return groups;
    if (tab === "equipe")
      return groups.filter(
        (g) => g.team === (ticket.title?.includes("Maroc") ? "Maroc" : g.team)
      );
    if (tab === "langue") return groups.filter((g) => g.language === "FR");
    if (tab === "ambiance")
      return groups.filter(
        (g) => g.ambiance === "festive" || g.ambiance === "sociale"
      );
    if (tab === "gate") return groups.filter((g) => g.gate === "gate-c");
    if (tab === "postmatch") return groups.slice(0, 3);
    return groups;
  }, [groups, tab, ticket]);
  const bestMatch = filtered.length > 0 ? filtered.reduce((a, b) => a.score > b.score ? a : b) : null;
  async function toggleJoin(id) {
    setJoinedIds(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    );
    if (!token || joinedIds.includes(id)) return;
    try {
      await fanpassFetch(`/community/groups/join/${id}`, token, {
        signal: AbortSignal.timeout(3e3)
      });
    } catch {
    }
  }
  if (showCreate)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateGroupModal,
      {
        ticket,
        onClose: () => setShowCreate(false),
        onCreated: (group) => {
          setGroups((current) => [group, ...current]);
          setJoinedIds((current) => [group.id, ...current]);
        }
      }
    );
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass rounded-3xl p-6 animate-pulse space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 bg-white/5 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-white/5 rounded-lg" })
        ]
      },
      i
    )) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-5 w-5 text-primary-glow" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Contexte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: ticket.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          ticket.venue,
          " · ",
          ticket.date,
          " · ",
          ticket.gate
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 rounded-2xl bg-white/5 p-1", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTab(t.id),
        className: `rounded-xl px-1 py-2 text-[0.68rem] font-semibold transition sm:text-xs ${tab === t.id ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
        children: t.label
      },
      t.id
    )) }),
    bestMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 ring-1 ring-success/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs text-success", children: "Meilleure correspondance" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold", children: bestMatch.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            bestMatch.match,
            " · ",
            bestMatch.city
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-semibold", children: [
            bestMatch.score,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs", children: "fit" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: MapPin, label: bestMatch.meet_point }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Clock, label: `Départ ${bestMatch.meet_time}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Languages, label: bestMatch.language }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MetaBadge,
          {
            icon: Users,
            label: `${bestMatch.size}/${bestMatch.capacity} fans`
          }
        )
      ] })
    ] }),
    tab !== "tous" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary-glow", children: [
      tab === "equipe" && "🎯 Groupes qui supportent la même équipe que vous. Ambiance garantie.",
      tab === "langue" && "🗣️ Groupes francophones pour échanger facilement avant, pendant et après le match.",
      tab === "ambiance" && "🎉 Groupes festifs et sociaux pour vivre le match à fond.",
      tab === "gate" && "🚪 Groupes qui vont vers la même gate que vous. Trajet collectif sécurisé.",
      tab === "postmatch" && "🌙 Continuez l'expérience après le match : retours groupés, fan zones nocturnes."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupCard,
      {
        group: g,
        joined: joinedIds.includes(g.id),
        onJoin: () => toggleJoin(g.id)
      },
      g.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setShowCreate(true),
        className: "w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-4 text-sm text-muted-foreground hover:bg-white/10 transition flex items-center justify-center gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Créer un groupe"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Après le match" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
        {
          icon: Users,
          title: "After-match Casa Port",
          detail: "Retour collectif vers centre-ville."
        },
        {
          icon: Sparkles,
          title: "Fan Zone nocturne",
          detail: "Corniche ouverte jusqu'à 01:00 avec DJ."
        },
        {
          icon: ShieldCheck,
          title: "Navette retour",
          detail: "Départ groupé 22:45 depuis Gate C."
        }
      ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 rounded-2xl bg-white/5 p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "h-4 w-4 mt-0.5 text-primary-glow shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: r.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: r.detail })
            ] })
          ]
        },
        r.title
      )) })
    ] })
  ] });
}
function GroupCard({
  group,
  joined,
  onJoin
}) {
  const fill = Math.round(group.size / group.capacity * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: `rounded-3xl p-5 transition ${joined ? "bg-success/10 ring-1 ring-success/30" : "glass"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `label-xs rounded-full px-2 py-1 ${moodClass(group.mood)}`,
                  children: group.mood
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-xs rounded-full bg-white/5 px-2 py-1 text-muted-foreground", children: [
                group.team,
                " · ",
                group.language
              ] }),
              group.verified && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-xs rounded-full bg-success/15 px-2 py-1 text-success flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3" }),
                " Vérifié"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-lg font-semibold", children: group.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: group.match })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-semibold", children: [
              group.score,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs", children: "fit" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: MapPin, label: group.meet_point }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: CalendarDays, label: group.meet_time }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Navigation, label: group.destination }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Sparkles, label: group.event_rec })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl bg-white/5 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Capacité" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
              group.size,
              "/",
              group.capacity
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary",
              style: { width: `${fill}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IL, { icon: ShieldCheck, text: group.safety }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IL, { icon: Navigation, text: group.route }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IL, { icon: Users, text: `Profils: ${group.profiles.join(", ")}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IL,
            {
              icon: MapPin,
              text: `Gate: ${group.gate.replace("gate-", "").toUpperCase()}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onJoin,
            className: `mt-4 w-full rounded-2xl py-3 text-xs font-medium transition ${joined ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground glow-primary"}`,
            children: joined ? "✓ Groupe rejoint" : "Rejoindre"
          }
        )
      ]
    }
  );
}
function IL({ icon: I, text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text })
  ] });
}
function CreateGroupModal({
  ticket,
  onClose,
  onCreated
}) {
  const [name, setName] = reactExports.useState("");
  const [team, setTeam] = reactExports.useState("Maroc");
  const [language, setLanguage] = reactExports.useState("FR");
  const [ambiance, setAmbiance] = reactExports.useState("sociale");
  const [meetPoint, setMeetPoint] = reactExports.useState("");
  const [meetTime, setMeetTime] = reactExports.useState("");
  const [capacity, setCapacity] = reactExports.useState("50");
  const [created, setCreated] = reactExports.useState(false);
  function handleCreate() {
    if (!name || !meetPoint || !meetTime) return;
    onCreated({
      id: `custom-${Date.now()}`,
      name,
      team,
      language,
      city: ticket.city,
      match: ticket.title,
      profiles: ["group"],
      size: 1,
      capacity: Math.max(2, Number(capacity) || 50),
      meet_point: meetPoint,
      meet_time: meetTime,
      destination: `${ticket.venue} - ${ticket.gate}`,
      event_rec: "Recommandation FanPass",
      mood: ambiance === "calme" ? "Calme" : "Social",
      safety: "Groupe cree par un fan, verification en attente.",
      route: `Depart collectif vers ${ticket.gate}.`,
      gate: ticket.gate.toLowerCase().replace(" ", "-"),
      verified: false,
      ambiance,
      score: 70
    });
    setCreated(true);
    setTimeout(onClose, 1500);
  }
  if (created)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-success/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-10 w-10 text-success" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Groupe créé !" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        'Votre groupe "',
        name,
        '" est en attente de vérification.'
      ] })
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-sm text-muted-foreground hover:text-foreground",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Créer un groupe" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleCreate,
          disabled: !name || !meetPoint || !meetTime,
          className: "text-sm font-semibold text-primary-glow disabled:opacity-30",
          children: "Créer"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-6 pb-8 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Nom du groupe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Ex: Atlas Gate C",
            className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Équipe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: team,
              onChange: (e) => setTeam(e.target.value),
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Maroc" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "France" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Bresil" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Espagne" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Neutre" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Langue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: language,
              onChange: (e) => setLanguage(e.target.value),
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "FR" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "EN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "ES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AR" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Ambiance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1", children: ["festive", "calme", "familiale", "sociale", "tourisme"].map(
          (a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setAmbiance(a),
              className: `rounded-xl px-2 py-2 text-xs font-semibold ${ambiance === a ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
              children: a
            },
            a
          )
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Point de rendez-vous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: meetPoint,
            onChange: (e) => setMeetPoint(e.target.value),
            placeholder: "Ex: Casa Port - sortie tram",
            className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Heure de rendez-vous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: meetTime,
              onChange: (e) => setMeetTime(e.target.value),
              placeholder: "17:25",
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Capacité max" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: capacity,
              onChange: (e) => setCapacity(e.target.value),
              placeholder: "50",
              type: "number",
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-primary/10 p-4 text-xs text-muted-foreground", children: "Votre groupe sera soumis à vérification avant d'apparaître dans les recommandations." })
    ] })
  ] });
}
const RESERVATIONS_STORAGE_KEY = "fanpass:eventReservations:v1";
const FALLBACK_EVENTS = [
  {
    id: "casa-corniche",
    category: "fan_zone",
    title: "Casablanca Corniche",
    subtitle: "Fan zone officielle",
    city: "Casablanca",
    venue: "Corniche Ain Diab",
    date: "14 juin 2030",
    time: "16:00 - 01:00",
    price: "Gratuit (réservation)",
    capacity: 82,
    safety: "Dense",
    is_official: true,
    verified: true,
    description: "Écran géant, DJ live, food court et zone sponsors.",
    program: [
      "16:00 ouverture",
      "18:30 show supporters",
      "22:15 DJ post-match"
    ],
    partners: ["ONMT", "Maroc Telecom", "Coca-Cola"],
    merch: "Écharpe Maroc 2030",
    route: "Tram Casa Port + navette Corniche",
    team: "Maroc",
    ambiance: "festive",
    languages: ["FR", "AR", "EN"],
    linked_match: "Maroc vs Espagne"
  },
  {
    id: "marrakech-medina",
    category: "fan_zone",
    title: "Marrakech Medina Live",
    subtitle: "Football, concerts et artisans",
    city: "Marrakech",
    venue: "Esplanade Menara",
    date: "4 juillet 2030",
    time: "15:00 - 00:30",
    price: "À partir de 180 MAD",
    capacity: 68,
    safety: "Controle",
    is_official: true,
    verified: true,
    description: "Fan zone mêlant football mondial et culture marocaine.",
    program: [
      "15:00 village artisans",
      "18:00 concert Gnawa",
      "23:00 after match"
    ],
    partners: ["Visit Marrakech", "Royal Air Maroc"],
    merch: "Pack souvenir Menara",
    route: "Drop-off Menara",
    team: "Neutre",
    ambiance: "culturelle",
    languages: ["FR", "EN", "AR"],
    linked_match: "Argentine vs Allemagne"
  },
  {
    id: "rabat-ocean",
    category: "watch_party",
    title: "Rabat Ocean Stage",
    subtitle: "Familles, food court",
    city: "Rabat",
    venue: "Bouregreg Fan Park",
    date: "18 juin 2030",
    time: "14:00 - 23:30",
    price: "160 MAD",
    capacity: 46,
    safety: "Calme",
    is_official: false,
    verified: true,
    description: "Zone assise, stats live et animations enfants.",
    program: ["14:00 ouverture", "17:30 quiz", "20:15 highlights"],
    partners: ["Bouregreg Marina", "Decathlon"],
    merch: "Maillot enfant",
    route: "Parking Marina + entrée Family",
    team: "Neutre",
    ambiance: "famille",
    languages: ["FR", "AR"],
    linked_match: "France vs Bresil"
  },
  {
    id: "jersey-launch",
    category: "club_event",
    title: "Lancement Maillot Maroc 2030",
    subtitle: "Showcase officiel",
    city: "Casablanca",
    venue: "FanPass Arena Pop-up",
    date: "13 juin 2030",
    time: "19:00 - 22:00",
    price: "120 MAD",
    capacity: 54,
    safety: "Controle",
    is_official: true,
    verified: true,
    description: "Révélation maillot, rencontre légendes, précommande.",
    program: ["19:00 reveal", "20:00 légendes", "21:00 précommande"],
    partners: ["FRMF", "Puma"],
    merch: "-15% précommande",
    route: "Taxi/VTC partenaire",
    team: "Maroc",
    ambiance: "premium",
    languages: ["FR", "AR"],
    linked_match: "Maroc vs Espagne"
  },
  {
    id: "sponsor-skills",
    category: "sponsor",
    title: "Skills Challenge Atlas",
    subtitle: "Mini-tournoi sponsor",
    city: "Casablanca",
    venue: "Village Sponsors Nord",
    date: "14 juin 2030",
    time: "12:00 - 18:30",
    price: "Pass requis",
    capacity: 61,
    safety: "Controle",
    is_official: false,
    verified: true,
    description: "Défis football et lots partenaires.",
    program: ["12:00 inscriptions", "14:00 tournoi", "17:30 lots"],
    partners: ["Adidas", "Orange", "CAF"],
    merch: "Ballon collector",
    route: "Corridor Nord",
    team: "Neutre",
    ambiance: "festive",
    languages: ["FR", "EN", "AR"],
    linked_match: "Maroc vs Espagne"
  },
  {
    id: "supporters-meetup",
    category: "community",
    title: "Meet-up Supporters Atlas",
    subtitle: "Point de rencontre",
    city: "Rabat",
    venue: "Place Al Barid",
    date: "18 juin 2030",
    time: "15:30 - 17:00",
    price: "Gratuit",
    capacity: 38,
    safety: "Calme",
    is_official: false,
    verified: false,
    description: "Groupe temporaire vers le stade.",
    program: ["15:30 check-in", "16:15 chants", "17:00 départ"],
    partners: ["Tram Rabat"],
    merch: "Badge offert",
    route: "Départ collectif Gate E",
    team: "Neutre",
    ambiance: "sociale",
    languages: ["FR", "EN"],
    linked_match: "France vs Bresil"
  }
];
const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "fan_zone", label: "Fan Zones" },
  { id: "watch_party", label: "Watch" },
  { id: "sponsor", label: "Sponsors" },
  { id: "club_event", label: "Club" },
  { id: "community", label: "Communauté" }
];
function catIcon(c) {
  if (c === "fan_zone") return Sparkles;
  if (c === "watch_party") return Users;
  if (c === "sponsor") return Trophy;
  if (c === "club_event") return ShoppingBag;
  return CircleCheck;
}
function catLabel(c) {
  if (c === "fan_zone") return "Fan zone officielle";
  if (c === "watch_party") return "Watch party";
  if (c === "sponsor") return "Activation sponsor";
  if (c === "club_event") return "Club & merch";
  return "Communauté";
}
function safetyClass(s) {
  if (s === "Dense") return "bg-destructive/20 text-destructive";
  if (s === "Controle") return "bg-primary/20 text-primary-glow";
  return "bg-success/20 text-success";
}
function readReservedIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}
function EvenementsSection() {
  const { token } = useAuth();
  const ticket = useActiveTicket();
  const [events, setEvents] = reactExports.useState(FALLBACK_EVENTS);
  const [category, setCategory] = reactExports.useState("all");
  const [selectedId, setSelectedId] = reactExports.useState(FALLBACK_EVENTS[0].id);
  const [reservedIds, setReservedIds] = reactExports.useState([]);
  const [hydrated, setHydrated] = reactExports.useState(false);
  const [routePreview, setRoutePreview] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setReservedIds(readReservedIds());
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(
      RESERVATIONS_STORAGE_KEY,
      JSON.stringify(reservedIds)
    );
  }, [hydrated, reservedIds]);
  reactExports.useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => setLoading(false), 4e3);
    (async () => {
      try {
        const r = await fanpassFetch("/events", token, {
          signal: AbortSignal.timeout(4e3)
        });
        if (r.ok) setEvents(await r.json());
      } catch {
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();
    return () => clearTimeout(t);
  }, [token]);
  const filtered = reactExports.useMemo(
    () => category === "all" ? events : events.filter((e) => e.category === category),
    [events, category]
  );
  const selected = filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? FALLBACK_EVENTS[0];
  async function reserve(id) {
    setReservedIds((prev) => prev.includes(id) ? prev : [...prev, id]);
    if (!token) return;
    try {
      await fanpassFetch(`/events/${id}/reserve`, token, {
        signal: AbortSignal.timeout(3e3)
      });
    } catch {
    }
  }
  function openRoute(event) {
    setRoutePreview({
      eventId: event.id,
      title: event.title,
      detail: `${event.route} depuis ${ticket.city}. Arrivee : ${event.venue}.`
    });
  }
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass rounded-3xl p-6 animate-pulse space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 bg-white/5 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-white/5 rounded-lg" })
        ]
      },
      i
    )) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterBar,
      {
        items: CATEGORIES,
        activeId: category,
        onChange: setCategory
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs text-primary-glow", children: catLabel(selected.category) }),
            selected.is_official && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-xs rounded-full bg-success/15 px-2 py-1 text-success flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3" }),
              " Officiel"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: selected.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            selected.subtitle,
            " · ",
            selected.city
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `label-xs rounded-full px-2 py-1 ${safetyClass(selected.safety)}`,
            children: selected.safety
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: selected.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: MapPin, label: selected.venue }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MetaBadge,
          {
            icon: CalendarDays,
            label: `${selected.date} · ${selected.time}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Ticket, label: selected.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Flame, label: `Capacité ${selected.capacity}%` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-1.5 overflow-hidden rounded-full bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full bg-gradient-to-r from-success via-primary-glow to-destructive",
          style: { width: `${selected.capacity}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => reserve(selected.id),
            className: `rounded-2xl py-3 text-xs font-medium transition ${reservedIds.includes(selected.id) ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground glow-primary"}`,
            children: reservedIds.includes(selected.id) ? "✓ Réservé" : "Réserver"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => openRoute(selected),
            className: "glass rounded-2xl py-3 text-xs font-medium",
            children: "Itinéraire"
          }
        )
      ] })
    ] }),
    routePreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 ring-1 ring-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Itineraire event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: routePreview.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: routePreview.detail }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setRoutePreview(null),
          className: "mt-4 rounded-2xl bg-white/5 px-4 py-2 text-xs font-medium",
          children: "Fermer"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((e) => {
      const I = catIcon(e.category);
      const sel = e.id === selected.id;
      const linked = e.linked_match === ticket.title;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "article",
        {
          className: `rounded-3xl p-5 transition ${sel ? "bg-primary/15 ring-1 ring-primary/40" : "glass"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSelectedId(e.id),
              className: "w-full text-left",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-5 w-5 text-primary-glow" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: catLabel(e.category) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-lg font-semibold", children: e.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: e.subtitle })
                    ] })
                  ] }),
                  linked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs rounded-full bg-success/20 px-2 py-1 text-success", children: "Lié au billet" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: e.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: MapPin, label: e.venue }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MetaBadge,
                    {
                      icon: CalendarDays,
                      label: `${e.date} · ${e.time}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Ticket, label: e.price }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Users, label: e.partners.join(", ") })
                ] })
              ]
            }
          )
        },
        e.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-xs text-primary-glow", children: [
        "Programme · ",
        selected.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: selected.program.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary-glow" }),
            s
          ]
        },
        s
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IC,
        {
          icon: ShieldCheck,
          title: "Sécurité",
          detail: `${selected.safety} · jauge ${selected.capacity}%`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IC, { icon: ShoppingBag, title: "Merch", detail: selected.merch }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IC, { icon: Navigation, title: "Accès", detail: selected.route }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IC,
        {
          icon: Star,
          title: "Langues",
          detail: selected.languages.join(", ")
        }
      )
    ] })
  ] });
}
function IC({
  icon: I,
  title,
  detail
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-5 w-5 text-primary-glow" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: detail })
    ] })
  ] }) });
}
const SUB_TABS = [
  { id: "groupes", label: "Groupes" },
  { id: "evenements", label: "Événements" }
];
function CommunauteView() {
  const [subTab, setSubTab] = reactExports.useState("groupes");
  const ticket = useActiveTicket();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeroBanner,
      {
        icon: Users,
        eyebrow: "Fan Communities",
        title: "Matching utile",
        subtitle: "FANPASS connecte les supporters par équipe, langue, profil et point de rencontre.",
        stats: [
          { label: "Match", value: ticket.time },
          { label: "Ville", value: ticket.city },
          { label: "Gate", value: ticket.gate.replace("Gate ", "") }
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { items: SUB_TABS, activeId: subTab, onChange: setSubTab }),
    subTab === "groupes" ? /* @__PURE__ */ jsxRuntimeExports.jsx(GroupesSection, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(EvenementsSection, {})
  ] });
}
const PICKUPS$1 = {
  stadium: "Stade",
  fan_zone: "Fan zone",
  event: "Event"
};
function fmt$1(n) {
  return `${n.toLocaleString("fr-MA")} MAD`;
}
function PanierView({
  items,
  pickup,
  onChangePickup,
  onChangeQty,
  onBack,
  onOrderComplete
}) {
  const { token } = useAuth();
  const [order, setOrder] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  async function confirmOrder() {
    if (items.length === 0) return;
    setError("");
    setLoading(true);
    try {
      const payload = items.map((c) => ({
        id: c.id,
        qty: c.qty
      }));
      const r = await fanpassFetch("/merch/order", token, {
        method: "POST",
        body: JSON.stringify({ items: payload, pickup })
      });
      if (!r.ok) {
        const data = await r.json().catch(() => null);
        throw new Error(data?.detail ?? "Commande impossible");
      }
      setOrder(await r.json());
      onOrderComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur reseau");
    } finally {
      setLoading(false);
    }
  }
  if (order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onBack,
            className: "text-sm text-muted-foreground hover:text-foreground",
            children: "← Boutique"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Confirmation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-10 pb-8 flex flex-col items-center justify-center text-center space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-success/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-10 w-10 text-success" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: "Commande confirmée !" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: order.order_id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 w-full text-center space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-8 w-8 text-primary-glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg font-semibold", children: order.qr_code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Retrait : ",
            order.pickup_location
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-primary-glow font-semibold", children: [
            "Disponible à partir de ",
            order.available_at
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onBack,
            className: "w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary",
            children: "Retour à la boutique"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onBack,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Boutique"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Mon panier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        count,
        " article",
        count > 1 ? "s" : ""
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-6 pb-8 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Mode de retrait" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1", children: Object.entries(PICKUPS$1).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onChangePickup(k),
            className: `rounded-xl px-2 py-3 text-xs font-semibold transition ${pickup === k ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
            children: v
          },
          k
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-primary-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
          " Retrait proche de votre gate — Stand Merch C2"
        ] })
      ] }),
      items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Votre panier est vide" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onBack,
            className: "mt-4 rounded-2xl bg-white/5 px-6 py-3 text-sm",
            children: "Parcourir la boutique"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-16 w-16 rounded-2xl shrink-0",
            style: {
              background: `linear-gradient(135deg, ${item.visual.from}, ${item.visual.to})`
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white", children: item.visual.label }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            fmt$1(item.price),
            " / unité"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => onChangeQty(item.id, item.qty - 1),
                className: "grid h-8 w-8 place-items-center rounded-full bg-white/10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center text-sm font-semibold", children: item.qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => onChangeQty(item.id, item.qty + 1),
                className: "grid h-8 w-8 place-items-center rounded-full bg-white/10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold text-primary-glow", children: fmt$1(item.price * item.qty) }) })
      ] }) }, item.id)) }),
      items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-destructive/15 px-4 py-3 text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sous-total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fmt$1(subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Retrait" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success", children: "Gratuit" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-white/5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold text-primary-glow", children: fmt$1(subtotal) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: confirmOrder,
            disabled: loading,
            className: "w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50",
            children: loading ? "Confirmation..." : `Commander · ${fmt$1(subtotal)}`
          }
        )
      ] })
    ] })
  ] });
}
const FALLBACK_PRODUCTS = [
  {
    id: "maroc-home",
    name: "Maillot Maroc 2030 Home",
    category: "official",
    team: "Maroc",
    match_tag: "Maroc vs Espagne",
    price: 790,
    rating: 4.9,
    stock: 84,
    badge: "Officiel",
    promo: "15% avec billet Gate C",
    pickup: ["stadium", "fan_zone", "event"],
    visual: { label: "MAR", from: "#C8102E", to: "#006233" }
  },
  {
    id: "scarf-opening",
    name: "Écharpe Maroc vs Espagne",
    category: "souvenir",
    team: "Maroc",
    match_tag: "Maroc vs Espagne",
    price: 220,
    rating: 4.8,
    stock: 62,
    badge: "Match-day",
    promo: "Retrait express",
    pickup: ["stadium", "fan_zone"],
    visual: { label: "M/E", from: "#D92332", to: "#0D1F3C" }
  },
  {
    id: "corniche-pack",
    name: "Pack Casablanca Corniche",
    category: "sponsor",
    team: "FanPass",
    event_tag: "Casablanca Corniche",
    price: 360,
    rating: 4.7,
    stock: 51,
    badge: "Sponsor",
    promo: "Boisson + badge + tote",
    pickup: ["fan_zone"],
    visual: { label: "CFC", from: "#1A6FE8", to: "#00C48C" }
  },
  {
    id: "cap-gate-c",
    name: "Casquette Atlas Gate C",
    category: "official",
    team: "Maroc",
    match_tag: "Maroc vs Espagne",
    price: 280,
    rating: 4.6,
    stock: 39,
    badge: "Gate C",
    promo: "Retrait Nord",
    pickup: ["stadium"],
    visual: { label: "GC", from: "#0D1F3C", to: "#1A6FE8" }
  },
  {
    id: "wydad-heritage",
    name: "Wydad Heritage 2031",
    category: "club",
    team: "Wydad AC",
    price: 640,
    rating: 4.8,
    stock: 44,
    badge: "Club",
    promo: "Précommande club",
    pickup: ["event", "stadium"],
    visual: { label: "WAC", from: "#B80F1C", to: "#F6F6F6" }
  },
  {
    id: "raja-drop",
    name: "Raja Streetwear Drop",
    category: "club",
    team: "Raja CA",
    price: 590,
    rating: 4.7,
    stock: 37,
    badge: "Club",
    promo: "Drop limité",
    pickup: ["event", "fan_zone"],
    visual: { label: "RCA", from: "#00843D", to: "#111827" }
  },
  {
    id: "babouche",
    name: "Babouche Supporter",
    category: "local",
    team: "Artisans Maroc",
    price: 310,
    rating: 4.9,
    stock: 29,
    badge: "Local",
    promo: "Fait main",
    pickup: ["event", "fan_zone"],
    visual: { label: "ART", from: "#C17C2C", to: "#006D77" }
  },
  {
    id: "ceramic-mug",
    name: "Mug Céramique 2030",
    category: "local",
    team: "Safialab",
    price: 180,
    rating: 4.5,
    stock: 73,
    badge: "Souvenir",
    promo: "Offre duo",
    pickup: ["fan_zone", "event"],
    visual: { label: "2030", from: "#FFFFFF", to: "#1A6FE8" }
  }
];
const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "match", label: "Mon match" },
  { id: "official", label: "Officiel" },
  { id: "club", label: "Clubs" },
  { id: "local", label: "Local" },
  { id: "sponsor", label: "Sponsor" }
];
const PICKUPS = {
  stadium: "Stade",
  fan_zone: "Fan zone",
  event: "Event"
};
function fmt(n) {
  return `${n.toLocaleString("fr-MA")} MAD`;
}
function MerchSection({ onBack }) {
  const { token } = useAuth();
  const ticket = useActiveTicket();
  const [products, setProducts] = reactExports.useState(FALLBACK_PRODUCTS);
  const [filter, setFilter] = reactExports.useState("all");
  const [cart, setCart] = reactExports.useState([]);
  const [pickup, setPickup] = reactExports.useState("stadium");
  const [showCart, setShowCart] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const t = setTimeout(() => setLoading(false), 4e3);
    (async () => {
      try {
        const r = await fanpassFetch(`/merch?filter=${filter}`, token, {
          signal: AbortSignal.timeout(4e3)
        });
        if (r.ok) {
          const d = await r.json();
          setProducts(d.products);
        }
      } catch {
      } finally {
        clearTimeout(t);
        setLoading(false);
      }
    })();
    return () => clearTimeout(t);
  }, [token, filter]);
  const filtered = reactExports.useMemo(() => {
    if (filter === "all") return products;
    if (filter === "match")
      return products.filter(
        (p) => p.match_tag === ticket.title || p.team === "Maroc"
      );
    return products.filter((p) => p.category === filter);
  }, [products, filter, ticket]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  function addToCart(p) {
    if (!p.pickup.includes(pickup)) setPickup(p.pickup[0]);
    setCart((prev) => {
      const ex = prev.find((x) => x.id === p.id);
      if (ex)
        return prev.map(
          (x) => x.id === p.id ? { ...x, qty: Math.min(9, x.qty + 1) } : x
        );
      return [
        ...prev,
        { id: p.id, name: p.name, price: p.price, qty: 1, visual: p.visual }
      ];
    });
  }
  function changeQty(id, q) {
    setCart(
      (prev) => prev.map(
        (x) => x.id === id ? { ...x, qty: Math.max(0, Math.min(9, q)) } : x
      ).filter((x) => x.qty > 0)
    );
  }
  if (showCart)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanierView,
      {
        items: cart,
        pickup,
        onChangePickup: setPickup,
        onChangeQty: changeQty,
        onBack: () => setShowCart(false),
        onOrderComplete: () => setCart([])
      }
    );
  if (loading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass rounded-3xl p-6 animate-pulse space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 bg-white/5 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-white/5 rounded-lg" })
        ]
      },
      i
    )) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onBack,
          className: "text-sm text-muted-foreground hover:text-foreground",
          children: "← Retour"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Merchandising" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Boutique fan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgePercent, { className: "h-5 w-5 text-primary-glow" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Recommandé pour vous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: ticket.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "Produits liés à votre match · ",
          ticket.gate
        ] })
      ] })
    ] }) }),
    cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setShowCart(true),
        className: "w-full glass rounded-3xl p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5 text-primary-glow" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
                cartCount,
                " article",
                cartCount > 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: fmt(cart.reduce((s, i) => s + i.price * i.qty, 0)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs text-primary-glow", children: "Voir le panier →" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { items: FILTERS, activeId: filter, onChange: setFilter }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "glass rounded-3xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr] gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-20 rounded-2xl shrink-0 relative overflow-hidden",
            style: {
              background: `linear-gradient(135deg, ${p.visual.from}, ${p.visual.to})`
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-black/20 px-2 py-1 text-xs font-bold text-white", children: p.visual.label }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs text-primary-glow", children: p.badge }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-base font-semibold leading-tight", children: p.name })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold text-primary-glow", children: fmt(p.price) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-primary-glow text-primary-glow" }),
                p.rating,
                " · ",
                p.team
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => addToCart(p),
                className: "rounded-2xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground glow-primary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 inline mr-1" }),
                  "Ajouter"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-2xl bg-white/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgePercent, { className: "h-4 w-4 text-primary-glow" }),
          p.promo
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: p.pickup.map((pk) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "rounded-full bg-primary/10 px-2 py-1 text-[0.65rem] font-semibold text-primary-glow",
            children: PICKUPS[pk]
          },
          pk
        )) })
      ] })
    ] }, p.id)) })
  ] });
}
const REQUESTS_STORAGE_KEY = "fanpass:safetyRequests:v1";
const PLACES = [
  {
    id: "casa-hospital-anfa",
    type: "hospital",
    name: "Poste médical Anfa",
    city: "Casablanca",
    distance: "850 m",
    eta: "7 min",
    open: "24/7",
    detail: "Premiers soins et orientation ambulance stade."
  },
  {
    id: "casa-pharmacy-corniche",
    type: "pharmacy",
    name: "Pharmacie Corniche",
    city: "Casablanca",
    distance: "1.2 km",
    eta: "10 min",
    open: "Jusqu'à 01:00",
    detail: "Médicaments courants, hydratation, pansements."
  },
  {
    id: "casa-police-nord",
    type: "police",
    name: "Point police Nord",
    city: "Casablanca",
    distance: "300 m",
    eta: "3 min",
    open: "Match-day",
    detail: "Perte, vol, incident ou aide d'urgence."
  },
  {
    id: "casa-tourism-desk",
    type: "tourism",
    name: "Assistance touristique",
    city: "Casablanca",
    distance: "Gate C",
    eta: "2 min",
    open: "12:00 - 01:00",
    detail: "Support EN/FR/ES, passeport perdu, orientation ville."
  },
  {
    id: "rabat-hospital-souissi",
    type: "hospital",
    name: "Clinique Souissi Support",
    city: "Rabat",
    distance: "1.8 km",
    eta: "12 min",
    open: "24/7",
    detail: "Urgences légères et transfert médical."
  },
  {
    id: "rabat-police-bouregreg",
    type: "police",
    name: "Police Bouregreg",
    city: "Rabat",
    distance: "650 m",
    eta: "6 min",
    open: "Match-day",
    detail: "Assistance supporters visiteurs et objets perdus."
  },
  {
    id: "marrakech-medical-menara",
    type: "hospital",
    name: "Poste médical Menara",
    city: "Marrakech",
    distance: "950 m",
    eta: "8 min",
    open: "24/7",
    detail: "Hydratation, premiers soins, transfert ambulance."
  },
  {
    id: "marrakech-tourism-menara",
    type: "tourism",
    name: "Desk tourisme Menara",
    city: "Marrakech",
    distance: "Fan zone",
    eta: "4 min",
    open: "14:00 - 00:30",
    detail: "Aide hôtel, transport retour, traduction."
  }
];
const CONTACTS = [
  {
    id: "sos",
    title: "Urgence supporter",
    value: "SOS FanPass",
    detail: "Alerte staff stade + position gate",
    icon: Siren,
    tone: "critical"
  },
  {
    id: "police",
    title: "Police",
    value: "19",
    detail: "Incident, vol, foule dangereuse",
    icon: ShieldAlert,
    tone: "info"
  },
  {
    id: "ambulance",
    title: "Ambulance",
    value: "15",
    detail: "Malaise, blessure, urgence médicale",
    icon: HeartPulse,
    tone: "critical"
  },
  {
    id: "tourism",
    title: "Assistance touristique",
    value: "ONMT Desk",
    detail: "Langues, perte documents, orientation",
    icon: Languages,
    tone: "success"
  }
];
const ALERTS = [
  {
    id: "gate-e-saturated",
    severity: "warning",
    time: "18:12",
    title: "Gate E chargée",
    detail: "Supporters visiteurs redirigés vers corridor Est secondaire."
  },
  {
    id: "route-nord-closed",
    severity: "critical",
    time: "18:20",
    title: "Route Nord fermée",
    detail: "Utilisez le drop-off Anfa Nord puis marche sécurisée."
  },
  {
    id: "tourism-desk-open",
    severity: "info",
    time: "14:00",
    title: "Desk touristique ouvert",
    detail: "Assistance FR/EN/ES disponible près de Gate C."
  }
];
const ASSISTANCE_ACTIONS = [
  {
    type: "ticket",
    title: "Problème billet",
    detail: "QR bloqué, achat manquant, gate incorrecte",
    icon: Ticket
  },
  {
    type: "lost",
    title: "Objet perdu",
    detail: "Passeport, téléphone, sac ou souvenir",
    icon: UserRoundSearch
  },
  {
    type: "medical",
    title: "Malaise léger",
    detail: "Orientation vers poste médical proche",
    icon: HeartPulse
  },
  {
    type: "tourism",
    title: "Aide touriste",
    detail: "Langue, transport, hôtel, documents",
    icon: BadgeQuestionMark
  },
  {
    type: "incident",
    title: "Signaler incident",
    detail: "Foule, comportement dangereux, sécurité",
    icon: FileExclamationPoint
  }
];
function readRequests() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => typeof r?.id === "string");
  } catch {
    return [];
  }
}
function createRequest(type, ticket) {
  return {
    id: `safety-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    type,
    title: ASSISTANCE_ACTIONS.find((a) => a.type === type)?.title ?? "Assistance supporter",
    city: ticket.city,
    gate: ticket.gate,
    ticketTitle: ticket.title,
    status: type === "emergency" ? "triage" : "open",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function placeIcon(type) {
  if (type === "hospital") return Hospital;
  if (type === "pharmacy") return Pill;
  if (type === "police") return ShieldAlert;
  return CircleQuestionMark;
}
function placeLabel(type) {
  if (type === "hospital") return "Hôpital";
  if (type === "pharmacy") return "Pharmacie";
  if (type === "police") return "Police";
  return "Tourisme";
}
function severityClass(s) {
  if (s === "critical") return "bg-destructive/20 text-destructive";
  if (s === "warning") return "bg-primary/20 text-primary-glow";
  return "bg-success/20 text-success";
}
function contactClass(tone) {
  if (tone === "critical") return "bg-destructive text-destructive-foreground";
  if (tone === "success") return "bg-success text-success-foreground";
  return "bg-primary text-primary-foreground";
}
function statusLabel(status) {
  if (status === "triage") return "Prioritaire";
  if (status === "resolved") return "Résolue";
  return "Ouverte";
}
function SafetySection({ onBack }) {
  const ticket = useActiveTicket();
  const [requests, setRequests] = reactExports.useState([]);
  const [hydrated, setHydrated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setRequests(readRequests());
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  }, [hydrated, requests]);
  const nearbyPlaces = reactExports.useMemo(() => {
    const cityPlaces = PLACES.filter((p) => p.city === ticket.city);
    return cityPlaces.length > 0 ? cityPlaces : PLACES.slice(0, 4);
  }, [ticket.city]);
  const latestRequest = requests[0];
  function submitRequest(type) {
    setRequests((c) => [createRequest(type, ticket), ...c]);
  }
  function resolveLatestRequest() {
    setRequests(
      (c) => c.map((r, i) => i === 0 ? { ...r, status: "resolved" } : r)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onBack,
          className: "text-sm text-muted-foreground hover:text-foreground",
          children: "← Retour"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Safety & Assistance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Aide supporter" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Contexte actif" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: ticket.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
        ticket.venue,
        " - ",
        ticket.date,
        " - ",
        ticket.time
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => submitRequest("emergency"),
        className: "w-full rounded-3xl bg-destructive p-5 text-left text-destructive-foreground shadow-elevated transition hover:scale-[1.01]",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-white/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Siren, { className: "h-7 w-7" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold", children: "Bouton aide urgent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm opacity-90", children: "Alerte staff avec ville, gate et billet actif." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 shrink-0" })
        ] })
      }
    ),
    latestRequest && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Demande active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: latestRequest.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            latestRequest.ticketTitle,
            " - ",
            latestRequest.gate,
            " -",
            " ",
            statusLabel(latestRequest.status)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success", children: statusLabel(latestRequest.status) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: resolveLatestRequest,
          className: "mt-4 w-full rounded-2xl bg-white/5 py-3 text-sm font-medium flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
            " Marquer comme résolue"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: CONTACTS.map((contact) => {
      const Icon = contact.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => submitRequest(contact.id === "sos" ? "emergency" : "incident"),
          className: `rounded-3xl p-4 text-left shadow-elevated ${contactClass(contact.tone)}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 opacity-80" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm font-semibold", children: contact.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: contact.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs opacity-80", children: contact.detail })
          ]
        },
        contact.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Assistance rapide" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: "Que se passe-t-il ?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: ASSISTANCE_ACTIONS.map((action) => {
        const Icon = action.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => submitRequest(action.type),
            className: "rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-glow" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: action.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: action.detail })
              ] })
            ] })
          },
          action.type
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs px-1 text-muted-foreground", children: "Lieux utiles proches" }),
      nearbyPlaces.map((place) => {
        const Icon = placeIcon(place.type);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "glass rounded-3xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-glow" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: placeLabel(place.type) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: place.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: place.detail })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-2xl bg-white/5 px-2 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0 text-primary-glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate text-muted-foreground", children: place.distance })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-2xl bg-white/5 px-2 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 shrink-0 text-primary-glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate text-muted-foreground", children: place.eta })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-2xl bg-white/5 px-2 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 shrink-0 text-primary-glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate text-muted-foreground", children: place.open })
            ] })
          ] })
        ] }, place.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Alertes officielles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: ALERTS.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `grid h-9 w-9 shrink-0 place-items-center rounded-xl ${severityClass(alert.severity)}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: alert.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs text-muted-foreground", children: alert.time })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: alert.detail })
        ] })
      ] }) }, alert.id)) })
    ] })
  ] });
}
const BOOKINGS_STORAGE_KEY = "fanpass:partnerBookings:v1";
const SERVICES = [
  {
    id: "casa-vtc-gate-c",
    category: "mobility",
    name: "VTC Gate C Drop-off",
    partner: "Taxi Vert Partner",
    city: "Casablanca",
    journeyStep: "to_gate",
    price: "À partir de 95 MAD",
    rating: 4.8,
    eta: "8 min",
    distance: "Drop-off Nord",
    matchTag: "Maroc vs Espagne",
    gateTag: "Gate C",
    benefit: "Point de dépôt validé par le périmètre sécurité.",
    detail: "Trajet court vers le drop-off Nord puis marche finale Gate C.",
    restrictions: ["Pas de dépôt devant gate", "Prix fixe avant coup d'envoi"],
    pickupHint: "Prise en charge hôtel ou fan zone"
  },
  {
    id: "casa-hotel-fanpass",
    category: "stay",
    name: "Hotel Fan Shuttle Casa",
    partner: "Atlas Hospitality",
    city: "Casablanca",
    journeyStep: "pre_match",
    price: "Pack 1 nuit",
    rating: 4.6,
    eta: "Navette 17:40",
    distance: "4.2 km stade",
    matchTag: "Maroc vs Espagne",
    benefit: "Navette officielle incluse vers Gate C.",
    detail: "Hébergement partenaire avec horaire navette calé sur le billet.",
    restrictions: ["Offre match-day uniquement", "Confirmation hôtel externe"],
    pickupHint: "Lobby partenaire"
  },
  {
    id: "corniche-food-table",
    category: "food",
    name: "Table supporter Corniche",
    partner: "Casa Food Court",
    city: "Casablanca",
    journeyStep: "fan_zone",
    price: "Menu 160 MAD",
    rating: 4.7,
    eta: "Créneau 16:30",
    distance: "Fan zone",
    linkedEvent: "Casablanca Corniche",
    benefit: "Menu rapide avant navette stade.",
    detail: "Restauration partenaire connectée à la fan zone officielle.",
    restrictions: ["Créneau de 45 min", "Retrait via QR FanPass"],
    pickupHint: "Comptoir food court A"
  },
  {
    id: "casa-tour-halfday",
    category: "tourism",
    name: "Mini tour Casablanca",
    partner: "Visit Morocco",
    city: "Casablanca",
    journeyStep: "pre_match",
    price: "290 MAD",
    rating: 4.5,
    eta: "Départ 11:00",
    distance: "Retour fan zone",
    matchTag: "Maroc vs Espagne",
    benefit: "Retour garanti avant ouverture fan zone.",
    detail: "Tour court pour supporters internationaux le jour du match.",
    restrictions: ["Bagage cabine uniquement", "Langues FR/EN/ES"],
    pickupHint: "Place Mohammed V"
  },
  {
    id: "fan-experience-atlas",
    category: "experience",
    name: "Atlas Fan Experience Pack",
    partner: "Fan Embassy",
    city: "Casablanca",
    journeyStep: "to_gate",
    price: "420 MAD",
    rating: 4.9,
    eta: "Départ 17:25",
    distance: "Casa Port",
    matchTag: "Maroc vs Espagne",
    gateTag: "Gate C",
    benefit: "Guide groupe + chant supporters + route Gate C.",
    detail: "Pack temporaire pour rejoindre le stade avec un groupe encadré.",
    restrictions: ["Groupe limité à 60 fans", "Arrivée 15 min avant départ"],
    pickupHint: "Casa Port - sortie tram"
  },
  {
    id: "premium-lounge-atlas",
    category: "premium",
    name: "Lounge Atlas Upgrade",
    partner: "FRMF Premium",
    city: "Casablanca",
    journeyStep: "pre_match",
    price: "Sur invitation",
    rating: 4.9,
    eta: "Ouverture 17:30",
    distance: "Tribune Atlas",
    matchTag: "Maroc vs Espagne",
    gateTag: "Gate C",
    benefit: "Accueil premium lié au billet et retrait merch.",
    detail: "Service premium connecté au billet, pas une vente libre.",
    restrictions: ["Éligibilité selon billet", "Contrôle identité"],
    pickupHint: "Gate C - desk premium"
  },
  {
    id: "rabat-family-restaurant",
    category: "food",
    name: "Family Dinner Bouregreg",
    partner: "Marina Rabat",
    city: "Rabat",
    journeyStep: "fan_zone",
    price: "Menu famille 390 MAD",
    rating: 4.6,
    eta: "Créneau 14:30",
    distance: "Bouregreg Fan Park",
    matchTag: "France vs Bresil",
    benefit: "Table proche fan zone famille.",
    detail: "Restauration avant match pour familles et supporters calmes.",
    restrictions: ["Réservation 4 personnes max", "Arrivée avant 15:00"],
    pickupHint: "Marina - entrée Family"
  },
  {
    id: "rabat-vtc-return",
    category: "mobility",
    name: "Retour VTC Supporters",
    partner: "Rabat Mobility",
    city: "Rabat",
    journeyStep: "post_match",
    price: "Prix bloqué 120 MAD",
    rating: 4.4,
    eta: "Après 21:30",
    distance: "Zone Est",
    matchTag: "France vs Bresil",
    gateTag: "Gate E",
    benefit: "Retour après match depuis zone officielle.",
    detail: "Service de retour uniquement depuis les zones autorisées.",
    restrictions: ["Pas de prise en charge hors périmètre", "Créneau variable"],
    pickupHint: "Zone Est VTC"
  },
  {
    id: "marrakech-culture-pack",
    category: "tourism",
    name: "Menara Culture Pack",
    partner: "Visit Marrakech",
    city: "Marrakech",
    journeyStep: "fan_zone",
    price: "250 MAD",
    rating: 4.8,
    eta: "Départ 15:00",
    distance: "Esplanade Menara",
    matchTag: "Argentine vs Allemagne",
    linkedEvent: "Marrakech Medina Live",
    benefit: "Culture locale puis fan zone officielle.",
    detail: "Pack court lié au quart de finale et à la fan zone Menara.",
    restrictions: ["Retour avant 18:00", "Guide FR/EN"],
    pickupHint: "Desk Menara"
  }
];
const FILTER_ITEMS = [
  { id: "all", label: "Tous" },
  { id: "mobility", label: "VTC" },
  { id: "stay", label: "Hôtel" },
  { id: "food", label: "Food" },
  { id: "tourism", label: "Tour" },
  { id: "experience", label: "Packs" }
];
function readBookings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((b) => typeof b?.id === "string");
  } catch {
    return [];
  }
}
function categoryLabel(c) {
  if (c === "mobility") return "Transport";
  if (c === "stay") return "Hébergement";
  if (c === "food") return "Restaurant";
  if (c === "tourism") return "Tourisme";
  if (c === "experience") return "Fan pack";
  return "Premium";
}
function categoryIcon(c) {
  if (c === "mobility") return Car;
  if (c === "stay") return Hotel;
  if (c === "food") return Utensils;
  if (c === "tourism") return MapPin;
  if (c === "experience") return Sparkles;
  return Crown;
}
function journeyLabel(step) {
  if (step === "pre_match") return "Avant match";
  if (step === "to_gate") return "Vers gate";
  if (step === "post_match") return "Retour";
  return "Fan zone";
}
function createBooking(service, ticket) {
  return {
    id: `partner-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    city: service.city,
    ticketTitle: ticket.title,
    gate: ticket.gate,
    status: service.category === "premium" ? "ready" : "reserved",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function PartnersSection({ onBack }) {
  const ticket = useActiveTicket();
  const [filter, setFilter] = reactExports.useState("all");
  const [bookings, setBookings] = reactExports.useState([]);
  const [selectedId, setSelectedId] = reactExports.useState(SERVICES[0].id);
  const [hydrated, setHydrated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setBookings(readBookings());
    const best = SERVICES.find(
      (s) => s.matchTag === ticket.title || s.gateTag === ticket.gate
    ) ?? SERVICES[0];
    setSelectedId(best.id);
    setHydrated(true);
  }, [ticket.gate, ticket.title]);
  reactExports.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings, hydrated]);
  const visibleServices = reactExports.useMemo(() => {
    const filtered = filter === "all" ? SERVICES : SERVICES.filter((s) => s.category === filter);
    return [...filtered].sort((a, b) => {
      const aFit = Number(a.matchTag === ticket.title) + Number(a.gateTag === ticket.gate);
      const bFit = Number(b.matchTag === ticket.title) + Number(b.gateTag === ticket.gate);
      return bFit - aFit;
    });
  }, [filter, ticket.gate, ticket.title]);
  const selectedService = visibleServices.find((s) => s.id === selectedId) ?? visibleServices[0] ?? SERVICES[0];
  SERVICES.filter((s) => s.city === ticket.city);
  const latestBooking = bookings[0];
  function reserve(service) {
    setSelectedId(service.id);
    setBookings((c) => [createBooking(service, ticket), ...c]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onBack,
          className: "text-sm text-muted-foreground hover:text-foreground",
          children: "← Retour"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Partner Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Services fan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Handshake, { className: "h-5 w-5 text-primary-glow" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Contexte fan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: ticket.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          ticket.venue,
          " - ",
          ticket.date,
          " - ",
          ticket.gate
        ] })
      ] })
    ] }) }),
    latestBooking && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Réservation active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: latestBooking.serviceName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          categoryLabel(latestBooking.category),
          " -",
          " ",
          latestBooking.ticketTitle
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success", children: latestBooking.status === "ready" ? "Prêt" : "Réservé" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { items: FILTER_ITEMS, activeId: filter, onChange: setFilter }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Service sélectionné" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-semibold", children: selectedService.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: selectedService.detail }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: MapPin, label: selectedService.distance }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Clock, label: selectedService.eta }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MetaBadge,
          {
            icon: CalendarDays,
            label: journeyLabel(selectedService.journeyStep)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: BadgePercent, label: selectedService.price })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl bg-white/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary-glow" }),
          " Connecté au parcours fan"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: selectedService.benefit })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: visibleServices.map((service) => {
      const Icon = categoryIcon(service.category);
      const linked = service.matchTag === ticket.title || service.gateTag === ticket.gate || service.city === ticket.city;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: `rounded-3xl p-5 transition ${service.id === selectedId ? "bg-primary/15 ring-1 ring-primary/40" : "glass"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setSelectedId(service.id),
                className: "w-full text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-glow" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-xs text-primary-glow", children: [
                          categoryLabel(service.category),
                          " -",
                          " ",
                          journeyLabel(service.journeyStep)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-lg font-semibold", children: service.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: service.partner })
                      ] })
                    ] }),
                    linked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs rounded-full bg-success/20 px-2 py-1 text-success", children: "Lié" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: service.benefit }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: MapPin, label: service.pickupHint }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: Clock, label: service.eta }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MetaBadge,
                      {
                        icon: Star,
                        label: `${service.rating.toFixed(1)} partenaire`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MetaBadge, { icon: BadgePercent, label: service.price })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => reserve(service),
                className: "mt-4 w-full rounded-2xl bg-primary py-3 text-xs font-medium text-primary-foreground glow-primary",
                children: "Réserver"
              }
            )
          ]
        },
        service.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Limites du service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: selectedService.restrictions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-3 text-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 shrink-0 text-success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r })
          ]
        },
        r
      )) })
    ] })
  ] });
}
function PlusView() {
  const ticket = useActiveTicket();
  const [section, setSection] = reactExports.useState(null);
  if (section === "merch")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MerchSection, { onBack: () => setSection(null) });
  if (section === "safety")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SafetySection, { onBack: () => setSection(null) });
  if (section === "partners")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PartnersSection, { onBack: () => setSection(null) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeroBanner,
      {
        icon: Ellipsis,
        eyebrow: "Services",
        title: "Plus de services",
        subtitle: "Boutique, aide, sécurité et partenaires autour de votre parcours fan.",
        stats: [
          { label: "Ville", value: ticket.city },
          { label: "Gate", value: ticket.gate.replace("Gate ", "") },
          { label: "Match", value: ticket.time }
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceHubCard,
        {
          icon: ShoppingBag,
          title: "Boutique",
          detail: "Produits officiels, clubs, sponsors et artisans avec retrait au stade.",
          tag: "Merch",
          onClick: () => setSection("merch")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceHubCard,
        {
          icon: LifeBuoy,
          title: "Aide & Sécurité",
          detail: "Urgences, contacts, lieux utiles et alertes officielles.",
          tag: "Support",
          onClick: () => setSection("safety")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceHubCard,
        {
          icon: Handshake,
          title: "Partenaires",
          detail: "VTC, hôtels, restaurants et packs premium connectés au billet.",
          tag: "Services",
          onClick: () => setSection("partners")
        }
      )
    ] })
  ] });
}
function ServiceHubCard({
  icon: Icon,
  title,
  detail,
  tag,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: "glass w-full rounded-3xl p-5 text-left transition hover:bg-white/5",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary-glow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs text-primary-glow", children: tag }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: detail })
        ] })
      ] })
    }
  );
}
function ProfileView({ onClose }) {
  const { avatarInitials, fanIdStatus, logout, deleteAccount, refreshProfile } = useAuth();
  const [step, setStep] = reactExports.useState("view");
  const [editing, setEditing] = reactExports.useState(false);
  if (step === "edit_info") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfileEdit,
      {
        onSave: () => {
          setStep("view");
          refreshProfile();
        },
        onCancel: () => setStep("view")
      }
    );
  }
  if (step === "verify_id") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FanIdVerification,
      {
        onDone: () => {
          setStep("view");
          refreshProfile();
        },
        onCancel: () => setStep("view")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ProfileMain,
    {
      avatarInitials,
      fanIdStatus,
      onEdit: () => setStep("edit_info"),
      onVerify: () => setStep("verify_id"),
      onLogout: () => {
        logout();
        onClose();
      },
      onDelete: async () => {
        await deleteAccount();
        onClose();
      },
      onClose
    }
  );
}
function ProfileMain({
  avatarInitials,
  fanIdStatus,
  onEdit,
  onVerify,
  onLogout,
  onDelete,
  onClose
}) {
  const verified = fanIdStatus === "verified";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onClose,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Retour"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pb-8 pt-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-gradient-to-br from-primary via-primary to-primary-glow grid place-items-center text-3xl font-bold shadow-elevated", children: avatarInitials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 rounded-full bg-success p-1.5 border-2 border-background", children: verified ? /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-5 w-5 text-success-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary-glow" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Mon Profil" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `grid h-12 w-12 place-items-center rounded-2xl ${verified ? "bg-success/15 text-success" : "bg-primary/15 text-primary-glow"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Fan ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: verified ? "Vérifié" : "En attente" })
          ] })
        ] }),
        !verified && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onVerify,
            className: "rounded-2xl bg-primary px-4 py-3 text-xs font-medium text-primary-foreground glow-primary",
            children: "Vérifier maintenant"
          }
        ),
        verified && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-xs rounded-full bg-success/20 px-2 py-1 text-success", children: "Actif" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onEdit,
            className: "w-full flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-primary-glow" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Modifier mes informations" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
            ]
          }
        ),
        !verified && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onVerify,
            className: "w-full flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary-glow" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Créer mon Fan ID" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: "Pourquoi créer son Fan ID ?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: [
          { icon: Ticket, label: "Billetterie rapide" },
          { icon: Users, label: "Matching intelligent" },
          { icon: ShieldCheck, label: "Sécurité renforcée" },
          { icon: BadgeCheck, label: "Accès prioritaires" }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4 text-primary-glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
            ]
          },
          item.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onLogout,
          className: "w-full rounded-2xl bg-destructive/15 text-destructive py-4 text-sm font-medium hover:bg-destructive/25 transition",
          children: "Se déconnecter"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            if (confirm(
              "Supprimer définitivement votre compte ? Cette action est irréversible."
            ))
              onDelete();
          },
          className: "w-full rounded-2xl bg-white/5 text-muted-foreground py-3 text-xs font-medium hover:bg-destructive/10 hover:text-destructive transition",
          children: "Supprimer mon compte"
        }
      )
    ] })
  ] });
}
function ProfileEdit({
  onSave,
  onCancel
}) {
  const { updateProfile } = useAuth();
  const [form, setForm] = reactExports.useState({
    first_name: "",
    last_name: "",
    phone: "",
    nationality: "",
    language: "fr",
    supported_team: "Maroc",
    fan_profile: "solo"
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile(form);
      onSave();
    } catch {
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onCancel,
          className: "text-sm text-muted-foreground hover:text-foreground transition",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Modifier le profil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSave,
          disabled: saving,
          className: "text-sm font-semibold text-primary-glow hover:text-primary transition disabled:opacity-50",
          children: saving ? "..." : "Enregistrer"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pb-8 pt-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Prénom",
              value: form.first_name,
              onChange: (v) => setForm((f) => ({ ...f, first_name: v }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Nom",
              value: form.last_name,
              onChange: (v) => setForm((f) => ({ ...f, last_name: v }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Téléphone",
            value: form.phone,
            onChange: (v) => setForm((f) => ({ ...f, phone: v }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Nationalité",
            value: form.nationality,
            onChange: (v) => setForm((f) => ({ ...f, nationality: v }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Langue préférée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1 rounded-2xl bg-white/5 p-1", children: ["fr", "en", "es", "ar"].map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setForm((f) => ({ ...f, language: lang })),
              className: `rounded-xl px-2 py-2 text-xs font-semibold transition ${form.language === lang ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
              children: lang.toUpperCase()
            },
            lang
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Équipe supportée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1", children: ["Maroc", "France", "Bresil", "Espagne", "Neutre"].map(
            (team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setForm((f) => ({ ...f, supported_team: team })),
                className: `rounded-xl px-2 py-2 text-xs font-semibold transition ${form.supported_team === team ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
                children: team
              },
              team
            )
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-3", children: "Profil fan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
          { id: "solo", label: "Solo" },
          { id: "family", label: "Famille" },
          { id: "tourist", label: "Touriste" },
          { id: "local", label: "Local" },
          { id: "group", label: "Groupe" },
          { id: "calm", label: "Calme" }
        ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setForm((f) => ({ ...f, fan_profile: p.id })),
            className: `rounded-2xl p-3 text-left transition ${form.fan_profile === p.id ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.label })
          },
          p.id
        )) })
      ] })
    ] })
  ] });
}
function FanIdVerification({
  onDone,
  onCancel
}) {
  const { verifyFanId } = useAuth();
  const [docType, setDocType] = reactExports.useState("passport");
  const [docNumber, setDocNumber] = reactExports.useState("");
  const [agreeTerms, setAgreeTerms] = reactExports.useState(false);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  async function handleSubmit() {
    if (!docNumber || !agreeTerms) return;
    setLoading(true);
    try {
      await verifyFanId(docType, docNumber);
      setSubmitted(true);
      setTimeout(onDone, 800);
    } catch {
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onCancel,
          className: "text-sm text-muted-foreground hover:text-foreground transition",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Création Fan ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pb-8 pt-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-5 text-primary-foreground shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-white/15 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "h-8 w-8" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: "Votre Fan ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm opacity-90", children: "Le Fan ID est obligatoire pour accéder aux stades et fan zones officielles de la Coupe du Monde 2030." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center text-sm", children: [
            { label: "Statut", value: submitted ? "Vérifié" : "En cours" },
            {
              label: "Type",
              value: docType === "passport" ? "Passeport" : docType === "id_card" ? "CIN" : "Séjour"
            },
            { label: "Étape", value: "1/1" }
          ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl bg-white/15 px-2 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-display text-lg font-semibold", children: s.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs opacity-75", children: s.label })
              ]
            },
            s.label
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow mb-4", children: "Type de document" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
          { id: "passport", label: "Passeport" },
          { id: "id_card", label: "Carte d'identité" },
          { id: "residence_permit", label: "Titre de séjour" }
        ].map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setDocType(doc.id),
            className: `rounded-2xl p-3 text-center transition ${docType === doc.id ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label-xs text-primary-glow", children: doc.label })
          },
          doc.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Numéro du document" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: docNumber,
              onChange: (e) => setDocNumber(e.target.value),
              placeholder: "Ex: AB1234567",
              maxLength: 20,
              className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-primary-glow" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Photo du document" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Prenez une photo claire de votre pièce d'identité." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mt-4 w-full rounded-2xl border border-dashed border-white/15 bg-white/5 py-6 text-sm text-muted-foreground hover:bg-white/10 transition flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scanner le document" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-3 rounded-2xl bg-white/5 p-4 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: agreeTerms,
            onChange: (e) => setAgreeTerms(e.target.checked),
            className: "mt-0.5 h-4 w-4 rounded accent-primary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Je certifie que les informations fournies sont exactes et j'accepte les conditions d'utilisation du Fan ID." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSubmit,
          disabled: !docNumber || !agreeTerms || loading || submitted,
          className: `w-full rounded-2xl py-4 text-sm font-medium transition ${submitted ? "bg-success text-success-foreground" : docNumber && agreeTerms ? "bg-primary text-primary-foreground glow-primary" : "bg-white/10 text-muted-foreground cursor-not-allowed"}`,
          children: submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
            " Fan ID vérifié !"
          ] }) : loading ? "Vérification..." : "Créer mon Fan ID"
        }
      )
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
      }
    )
  ] });
}
function LoginView({
  onBack,
  onSwitchToRegister
}) {
  const { login } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onBack,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Retour"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-12 pb-8 flex flex-col justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-8 w-8 text-primary-glow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold", children: "Connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Connectez-vous à votre compte FanPass" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "votre@email.com",
                required: true,
                className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: showPassword ? "text" : "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "••••••••",
                required: true,
                className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-12 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed",
            children: loading ? "Connexion..." : "Se connecter"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Pas encore de compte ?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onSwitchToRegister,
            className: "text-primary-glow hover:underline font-medium",
            children: "S'inscrire"
          }
        )
      ] })
    ] })
  ] });
}
const TEAMS = ["Maroc", "France", "Bresil", "Espagne", "Neutre"];
const PROFILES = [
  { id: "solo", label: "Solo" },
  { id: "family", label: "Famille" },
  { id: "tourist", label: "Touriste" },
  { id: "local", label: "Local" },
  { id: "group", label: "Groupe" },
  { id: "calm", label: "Calme" }
];
function RegisterView({
  onBack,
  onSwitchToLogin
}) {
  const { register } = useAuth();
  const [step, setStep] = reactExports.useState(1);
  const [form, setForm] = reactExports.useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    nationality: "",
    language: "fr",
    supported_team: "Maroc",
    fan_profile: "solo"
  });
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: step === 2 ? () => setStep(1) : onBack,
          className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " ",
            step === 2 ? "Retour" : "Retour"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        step,
        "/2"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pt-8 pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/15 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-8 w-8 text-primary-glow" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold", children: "Inscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: step === 1 ? "Créez votre compte FanPass" : "Personnalisez votre profil supporter" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-destructive/15 text-destructive px-4 py-3 text-sm", children: error }),
        step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Prénom" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: form.first_name,
                    onChange: (e) => update("first_name", e.target.value),
                    required: true,
                    className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Nom" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: form.last_name,
                  onChange: (e) => update("last_name", e.target.value),
                  required: true,
                  className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  value: form.email,
                  onChange: (e) => update("email", e.target.value),
                  required: true,
                  className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Mot de passe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "password",
                  value: form.password,
                  onChange: (e) => update("password", e.target.value),
                  required: true,
                  minLength: 6,
                  className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Téléphone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "tel",
                value: form.phone,
                onChange: (e) => update("phone", e.target.value),
                placeholder: "+212 6 12 34 56 78",
                className: "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-xs text-muted-foreground block mb-2", children: "Nationalité" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: form.nationality,
                  onChange: (e) => update("nationality", e.target.value),
                  placeholder: "Marocaine",
                  className: "w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                }
              )
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-5 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-xs text-primary-glow mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "inline h-3 w-3 mr-1" }),
              "Équipe supportée"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1", children: TEAMS.map((team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => update("supported_team", team),
                className: `rounded-xl px-2 py-2 text-xs font-semibold transition ${form.supported_team === team ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground hover:text-foreground"}`,
                children: team
              },
              team
            )) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label-xs text-primary-glow mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "inline h-3 w-3 mr-1" }),
              "Profil fan"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: PROFILES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => update("fan_profile", p.id),
                className: `rounded-2xl p-3 text-left transition ${form.fan_profile === p.id ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/5 hover:bg-white/10"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.label })
              },
              p.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full rounded-2xl bg-primary py-4 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed",
            children: loading ? "Inscription..." : step === 1 ? "Continuer" : "Créer mon compte"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Déjà un compte ?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onSwitchToLogin,
            className: "text-primary-glow hover:underline font-medium",
            children: "Se connecter"
          }
        )
      ] })
    ] })
  ] });
}
function AppShell() {
  const { token, isLoading } = useAuth();
  const [tab, setTab] = reactExports.useState("billet");
  const [showProfile, setShowProfile] = reactExports.useState(false);
  const [authScreen, setAuthScreen] = reactExports.useState("login");
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-5 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-16 bg-white/5 rounded-lg animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-20 bg-white/5 rounded-lg animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 bg-white/5 rounded-full animate-pulse" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pb-28 pt-4 space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 bg-white/5 rounded-lg animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-white/5 rounded-lg animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-4/5 bg-white/5 rounded-lg animate-pulse" })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-40 pb-4 pt-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md glass rounded-2xl px-2 py-5 flex items-center justify-between shadow-elevated", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex-1 flex flex-col items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 bg-white/5 rounded-lg animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-8 bg-white/5 rounded-lg animate-pulse" })
          ]
        },
        i
      )) }) })
    ] });
  }
  if (!token) {
    if (authScreen === "register") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        RegisterView,
        {
          onBack: () => setAuthScreen("login"),
          onSwitchToLogin: () => setAuthScreen("login")
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LoginView,
      {
        onBack: () => {
        },
        onSwitchToRegister: () => setAuthScreen("register")
      }
    );
  }
  if (showProfile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileView, { onClose: () => setShowProfile(false) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { onProfileClick: () => setShowProfile(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 mx-auto w-full max-w-md px-5 pb-28 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-float-up", children: [
      tab === "billet" && /* @__PURE__ */ jsxRuntimeExports.jsx(TicketView, { onNav: setTab }),
      tab === "parcours" && /* @__PURE__ */ jsxRuntimeExports.jsx(ParcoursView, {}),
      tab === "communaute" && /* @__PURE__ */ jsxRuntimeExports.jsx(CommunauteView, {}),
      tab === "plus" && /* @__PURE__ */ jsxRuntimeExports.jsx(PlusView, {})
    ] }, tab) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { tab, setTab })
  ] });
}
const SplitComponent = AppShell;
export {
  SplitComponent as component
};

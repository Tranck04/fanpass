import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function Logo({ className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-sm bg-background rotate-45" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-semibold tracking-tight text-lg", children: [
      "Fan",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-glow", children: "Pass" })
    ] })
  ] });
}
function QRTicket({
  seed = 49297,
  sizeClassName = "w-48"
}) {
  const cells = Array.from({ length: 169 }, (_, i) => {
    const value = (i * 9301 + seed) % 233280;
    return value / 233280 > 0.5;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `relative mx-auto aspect-square ${sizeClassName} rounded-2xl bg-white p-3 shadow-elevated`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid h-full w-full grid-cols-13 gap-[2px]",
            style: { gridTemplateColumns: "repeat(13, 1fr)" },
            children: cells.map((on, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: on ? "bg-[#0D1F3C] rounded-[2px]" : "bg-transparent"
              },
              i
            ))
          }
        ),
        ["top-2 left-2", "top-2 right-2", "bottom-2 left-2"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute ${p} h-8 w-8 border-[3px] border-[#0D1F3C] rounded-md bg-white`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-1 bg-[#0D1F3C] rounded-sm" })
          },
          p
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-3 overflow-hidden rounded-lg pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-primary/40 to-transparent animate-scan" }) })
      ]
    }
  );
}
export {
  Logo as L,
  QRTicket as Q
};

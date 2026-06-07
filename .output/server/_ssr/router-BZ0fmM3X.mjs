import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
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
const DEFAULT_PROD_API_BASE = "https://fanpass-api.onrender.com/api";
const DEFAULT_LOCAL_API_BASE = "http://localhost:8000/api";
function resolveApiBase() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
    return isLocal ? DEFAULT_LOCAL_API_BASE : DEFAULT_PROD_API_BASE;
  }
  return DEFAULT_LOCAL_API_BASE;
}
const API_BASE = resolveApiBase();
async function fanpassFetch(path, token, options = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
}
const STORAGE_KEY = "fanpass:auth:v1";
const AuthContext = reactExports.createContext(null);
function readStoredAuth() {
  if (typeof window === "undefined")
    return {
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: true
    };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        token: null,
        fanId: null,
        avatarInitials: "YA",
        fanIdStatus: "pending",
        isLoading: false
      };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token ?? null,
      fanId: parsed.fanId ?? null,
      avatarInitials: parsed.avatarInitials ?? "YA",
      fanIdStatus: parsed.fanIdStatus ?? "pending",
      isLoading: false
    };
  } catch {
    return {
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: false
    };
  }
}
function saveAuth(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      token: state.token,
      fanId: state.fanId,
      avatarInitials: state.avatarInitials,
      fanIdStatus: state.fanIdStatus
    })
  );
}
async function apiFetch(path, options = {}, token) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers || {}
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erreur réseau" }));
    throw new Error(err.detail || "Erreur réseau");
  }
  return res.json();
}
function AuthProvider({ children }) {
  const [state, setState] = reactExports.useState(readStoredAuth);
  reactExports.useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);
  reactExports.useEffect(() => {
    saveAuth(state);
  }, [state]);
  const login = reactExports.useCallback(async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    setState({
      token: data.access_token,
      fanId: data.fan_id,
      avatarInitials: data.avatar_initials,
      fanIdStatus: data.fan_id_status,
      isLoading: false
    });
  }, []);
  const register = reactExports.useCallback(async (regData) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(regData)
    });
    setState({
      token: data.access_token,
      fanId: data.fan_id,
      avatarInitials: data.avatar_initials,
      fanIdStatus: data.fan_id_status,
      isLoading: false
    });
  }, []);
  const logout = reactExports.useCallback(() => {
    setState({
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: false
    });
  }, []);
  const refreshProfile = reactExports.useCallback(async () => {
    if (!state.token) return;
    try {
      const data = await apiFetch("/auth/me", {}, state.token);
      setState((prev) => ({
        ...prev,
        avatarInitials: data.avatar_initials,
        fanIdStatus: data.fan_id_status
      }));
    } catch {
    }
  }, [state.token]);
  const updateProfile = reactExports.useCallback(
    async (profileData) => {
      if (!state.token) throw new Error("Non connecté");
      const data = await apiFetch(
        "/auth/me",
        {
          method: "PUT",
          body: JSON.stringify(profileData)
        },
        state.token
      );
      setState((prev) => ({ ...prev, avatarInitials: data.avatar_initials }));
    },
    [state.token]
  );
  const verifyFanId = reactExports.useCallback(
    async (docType, docNumber) => {
      if (!state.token) throw new Error("Non connecté");
      await apiFetch(
        "/auth/fanid/verify",
        {
          method: "POST",
          body: JSON.stringify({
            document_type: docType,
            document_number: docNumber
          })
        },
        state.token
      );
      setState((prev) => ({ ...prev, fanIdStatus: "verified" }));
    },
    [state.token]
  );
  const deleteAccount = reactExports.useCallback(async () => {
    if (!state.token) return;
    await apiFetch("/auth/me", { method: "DELETE" }, state.token);
    setState({
      token: null,
      fanId: null,
      avatarInitials: "YA",
      fanIdStatus: "pending",
      isLoading: false
    });
  }, [state.token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: {
        ...state,
        login,
        register,
        deleteAccount,
        logout,
        refreshProfile,
        updateProfile,
        verifyFanId
      },
      children
    }
  );
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const appCss = "/assets/styles-B-Etngqb.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$2 = createRootRouteWithContext()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "FanPass — Votre match commence avant le stade" },
        {
          name: "description",
          content: "FanPass : l'expérience fan intelligente pour les stades. Billet digital, itinéraire temps réel, gate navigator, fan zones et plus."
        },
        { property: "og:title", content: "FanPass — Smart Stadium Experience" },
        {
          property: "og:description",
          content: "Votre match commence avant le stade."
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" }
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
        },
        { rel: "stylesheet", href: appCss }
      ]
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent
  }
);
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$2.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$1 = () => import("./app-D5mbq5I-.mjs");
const Route$1 = createFileRoute("/app")({
  head: () => ({
    meta: [{
      title: "FanPass App - Billetterie 2030"
    }, {
      name: "description",
      content: "Votre billetterie matchs et fan zones pour la Coupe du Monde 2030 au Maroc."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BmszRMsv.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "FanPass - Billetterie Coupe du Monde 2030 au Maroc"
    }, {
      name: "description",
      content: "L'expérience fan intelligente pour acheter vos billets de matchs, fan zones et vivre le match-day au Maroc."
    }, {
      property: "og:title",
      content: "FanPass - Coupe du Monde 2030 Maroc"
    }, {
      property: "og:description",
      content: "Billetterie matchs, fan zones et expérience fan intelligente."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AppRoute = Route$1.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$2
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  AppRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  fanpassFetch as f,
  router as r,
  useAuth as u
};

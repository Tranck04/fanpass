const DEFAULT_PROD_API_BASE = "https://fanpass-api.onrender.com/api";
const DEFAULT_LOCAL_API_BASE = "http://localhost:8000/api";

function resolveApiBase() {
  const configured = import.meta.env.VITE_FANPASS_API_BASE;
  if (configured) return configured.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local");

    return isLocal ? DEFAULT_LOCAL_API_BASE : DEFAULT_PROD_API_BASE;
  }

  return DEFAULT_LOCAL_API_BASE;
}

export const API_BASE = resolveApiBase();

export async function fanpassFetch(
  path: string,
  token?: string | null,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
}

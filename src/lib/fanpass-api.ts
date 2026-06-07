export const API_BASE =
  import.meta.env.VITE_FANPASS_API_BASE ?? "http://localhost:8000/api";

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

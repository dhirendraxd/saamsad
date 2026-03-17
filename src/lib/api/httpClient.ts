const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Keep a stable base URL contract so mock adapters can be swapped for real APIs later.
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");

function buildUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isApiConfigured() {
  return API_BASE_URL.length > 0;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

function buildHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: init?.credentials ?? "include",
    headers: buildHeaders(init),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

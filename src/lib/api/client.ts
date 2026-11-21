/**
 * Thin fetch wrapper for the car-sale-backend REST API.
 *
 * - Base URL from NEXT_PUBLIC_API_URL (defaults to the local Nest server).
 * - Attaches the admin JWT (set by the auth slice) as a Bearer token.
 * - Normalises Nest error bodies `{ statusCode, message, error }` into `ApiError`.
 * - Calls the registered unauthorized handler on 401 so the store can log out.
 */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

type QueryValue = string | number | boolean | string[] | null | undefined;
export type Query = Record<string, QueryValue>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
  /** Send the stored JWT. Default true (harmless on public routes). */
  auth?: boolean;
}

// ── Auth token + 401 handling (wired up by the store) ─────────────────────
let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler;
}

// ── Core request ──────────────────────────────────────────────────────────
function buildUrl(path: string, query?: Query) {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        if (value.length) url.searchParams.set(key, value.join(","));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal, auth = true } = options;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";
  const sentToken = auth ? authToken : null;
  if (sentToken) headers.Authorization = `Bearer ${sentToken}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
  } catch (err) {
    if ((err as Error)?.name === "AbortError") throw err;
    throw new ApiError(0, "Cannot reach the server. Please check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const raw = (data as { message?: string | string[] } | undefined)?.message;
    const message = Array.isArray(raw)
      ? raw.join(". ")
      : raw || res.statusText || `Request failed (${res.status})`;

    // Only treat 401 as "session expired" when we actually sent a token.
    if (res.status === 401 && sentToken) unauthorizedHandler?.();
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, query?: Query, opts?: Omit<RequestOptions, "method" | "query">) =>
    apiRequest<T>(path, { ...opts, method: "GET", query }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T = void>(path: string, opts?: Omit<RequestOptions, "method">) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};

/** Fetches every page of a paginated endpoint (backend caps `limit` at 100). */
export async function fetchAllPages<T>(
  path: string,
  query: Query = {},
  opts?: { signal?: AbortSignal },
): Promise<T[]> {
  const limit = 100;
  const first = await api.get<Paginated<T>>(path, { ...query, page: 1, limit }, opts);
  const items = [...first.data];
  for (let page = 2; page <= first.meta.totalPages; page++) {
    const next = await api.get<Paginated<T>>(path, { ...query, page, limit }, opts);
    items.push(...next.data);
  }
  return items;
}

// ── Helpers ───────────────────────────────────────────────────────────────
export function errorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** The API returns `null` for empty optional columns; the frontend types use `undefined`. */
export function withoutNulls<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null)) as T;
}

/** Drops `undefined` and empty-string values (for create payloads). */
export function compact<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""),
  ) as Partial<T>;
}

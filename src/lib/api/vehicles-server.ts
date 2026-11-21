"use cache";

/**
 * Server-side vehicle reads for Server Components (e.g. /vehicles/[id]).
 * Cached with Cache Components so pages can be prerendered and revalidated;
 * results refresh every few minutes, so admin edits show up shortly after saving.
 */
import { cacheLife, cacheTag } from "next/cache";
import { toVehicle } from "@/redux/vehicles/vehiclesApi";
import type { Vehicle } from "@/redux/vehicles/vehiclesTypes";
import { API_URL as PUBLIC_API_URL, type Paginated } from "./client";

/** Server can use an internal URL (e.g. a Docker service name); falls back to the public one. */
const API_URL = (process.env.API_URL ?? PUBLIC_API_URL).replace(/\/+$/, "");

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // API unreachable (e.g. during a build without the backend running).
    return null;
  }
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  cacheLife("minutes");
  cacheTag("vehicles", `vehicle-${id}`);
  const raw = await getJson<Vehicle>(`/vehicles/${encodeURIComponent(id)}`);
  return raw ? toVehicle(raw) : null;
}

export async function getSimilarVehicles(id: string): Promise<Vehicle[]> {
  cacheLife("minutes");
  cacheTag("vehicles", `vehicle-${id}`);
  const raw = await getJson<Vehicle[]>(`/vehicles/${encodeURIComponent(id)}/similar`);
  return (raw ?? []).map(toVehicle);
}

/** IDs to prerender at build time — the featured cars plus the newest stock. */
export async function getPrerenderVehicleIds(limit = 12): Promise<string[]> {
  cacheLife("hours");
  cacheTag("vehicles");
  const [featured, newest] = await Promise.all([
    getJson<Vehicle[]>(`/vehicles/featured?limit=${limit}`),
    getJson<Paginated<Vehicle>>(`/vehicles?sortBy=newest&limit=${limit}`),
  ]);
  const ids = [...(featured ?? []), ...(newest?.data ?? [])].map((v) => v.id);
  return [...new Set(ids)].slice(0, limit);
}

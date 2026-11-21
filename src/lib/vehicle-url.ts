import type { Vehicle } from "@/redux/vehicles/vehiclesTypes";

/** Matches a bare UUID — the old /vehicles/{id} URL format. */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Canonical public URL path for a vehicle: /vehicles/{seo-slug}
 * (e.g. /vehicles/2023-mercedes-benz-e-class-e300-amg-line-premium-8bdd2864).
 * Falls back to the id for records that don't have a slug yet; the proxy then
 * 308-redirects that to the slug URL.
 */
export function vehiclePath(v: Pick<Vehicle, "id" | "slug">): string {
  return `/vehicles/${encodeURIComponent(v.slug || v.id)}`;
}

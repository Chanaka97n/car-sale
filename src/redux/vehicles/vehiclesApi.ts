import {
  api,
  fetchAllPages,
  withoutNulls,
  type Paginated,
  type Query,
} from "@/lib/api/client";
import type { Vehicle, VehicleFilters, VehicleInput } from "./vehiclesTypes";
import { initialFilters } from "./vehiclesTypes";

/** API rows have `null` for empty columns and extra timestamps; normalise to the frontend type. */
export function toVehicle(raw: Vehicle & { createdAt?: string; updatedAt?: string }): Vehicle {
  const v = withoutNulls(raw);
  const images = v.images?.length ? v.images : v.image ? [v.image] : [];
  return { ...v, images, image: v.image || images[0] || "" };
}

/** Maps the vehicles-page filter state to GET /vehicles query params. */
export function filtersToQuery(filters: VehicleFilters, page: number, limit: number): Query {
  const [minPrice, maxPrice] = filters.priceRange;
  return {
    search: filters.search.trim() || undefined,
    make: filters.make || undefined,
    // Only send price bounds the user actually moved, so cars above the slider max still show.
    minPrice: minPrice !== initialFilters.priceRange[0] ? minPrice : undefined,
    maxPrice: maxPrice !== initialFilters.priceRange[1] ? maxPrice : undefined,
    yearFrom: filters.yearFrom || undefined,
    yearTo: filters.yearTo || undefined,
    fuelTypes: filters.fuelTypes,
    transmissions: filters.transmissions,
    bodyTypes: filters.bodyTypes,
    sortBy: filters.sortBy,
    page,
    limit,
  };
}

/** Server-managed fields; the API rejects unknown properties on create/update. */
const READ_ONLY_FIELDS = new Set(["id", "image", "createdAt", "updatedAt"]);

/** Strips fields the API doesn't accept on create/update. */
function toBody(input: Partial<VehicleInput> & { id?: string }, { clearEmpty = false } = {}) {
  // On update, `undefined` means "cleared in the form" → send null so the column is emptied.
  return Object.fromEntries(
    Object.entries(input)
      .filter(([k]) => !READ_ONLY_FIELDS.has(k))
      .map(([k, v]) => [k, v === undefined && clearEmpty ? null : v])
      .filter(([, v]) => v !== undefined && !(typeof v === "number" && Number.isNaN(v))),
  );
}

type ApiVehicle = Vehicle & { createdAt?: string; updatedAt?: string };

/**
 * Backend: modules/vehicles/vehicles.controller.ts (public)
 *          modules/vehicles/admin-vehicles.controller.ts (admin)
 *          modules/uploads/uploads.controller.ts (images)
 */
export const vehiclesApi = {
  // ── Public ────────────────────────────────────────
  list: async (query: Query, signal?: AbortSignal) => {
    const res = await api.get<Paginated<ApiVehicle>>("/vehicles", query, { auth: false, signal });
    return { ...res, data: res.data.map(toVehicle) };
  },

  listAll: async (query: Query = {}) =>
    (await fetchAllPages<ApiVehicle>("/vehicles", { sortBy: "newest", ...query })).map(toVehicle),

  featured: async (limit = 6) =>
    (await api.get<ApiVehicle[]>("/vehicles/featured", { limit }, { auth: false })).map(toVehicle),

  get: async (id: string) => toVehicle(await api.get<ApiVehicle>(`/vehicles/${id}`, undefined, { auth: false })),

  similar: async (id: string) =>
    (await api.get<ApiVehicle[]>(`/vehicles/${id}/similar`, undefined, { auth: false })).map(toVehicle),

  // ── Admin ─────────────────────────────────────────
  adminList: async (query: Query) => {
    const res = await api.get<Paginated<ApiVehicle>>("/admin/vehicles", query);
    return { ...res, data: res.data.map(toVehicle) };
  },

  adminGet: async (id: string) => toVehicle(await api.get<ApiVehicle>(`/admin/vehicles/${id}`)),

  create: async (input: VehicleInput) =>
    toVehicle(await api.post<ApiVehicle>("/admin/vehicles", toBody(input))),

  update: async (id: string, input: Partial<VehicleInput>) =>
    toVehicle(await api.patch<ApiVehicle>(`/admin/vehicles/${id}`, toBody(input, { clearEmpty: true }))),

  remove: (id: string) => api.delete(`/admin/vehicles/${id}`),

  setFeatured: async (id: string, featured: boolean) =>
    toVehicle(await api.patch<ApiVehicle>(`/admin/vehicles/${id}/featured/${featured}`)),

  setStatus: async (id: string, status: "sold" | "unsold") =>
    toVehicle(await api.patch<ApiVehicle>(`/admin/vehicles/${id}/status/${status}`)),

  /** POST /admin/uploads/images (multipart, field `files`) → public URLs. */
  uploadImages: async (files: Blob[]) => {
    const form = new FormData();
    files.forEach((file, i) => {
      const name = file instanceof File ? file.name : `image-${i}.${file.type.split("/")[1] ?? "jpg"}`;
      form.append("files", file, name);
    });
    return (await api.post<{ urls: string[] }>("/admin/uploads/images", form)).urls;
  },
};

/**
 * The vehicle form keeps newly picked images as base64 `data:` URLs.
 * Upload those in one request and swap in the returned URLs, preserving order.
 */
export async function uploadPendingImages(images: string[] = []): Promise<string[]> {
  const pending = images.filter((src) => src.startsWith("data:"));
  if (!pending.length) return images;

  const blobs = await Promise.all(pending.map((src) => fetch(src).then((r) => r.blob())));
  const urls = await vehiclesApi.uploadImages(blobs);
  const replacements = new Map(pending.map((src, i) => [src, urls[i]]));
  return images.map((src) => replacements.get(src) ?? src);
}

import { errorMessage, type Paginated } from "@/lib/api/client";
import { createAppAsyncThunk } from "../createAppAsyncThunk";
import {
  filtersToFacetsQuery,
  listingQueries,
  priceSliderMax,
  uploadPendingImages,
  vehiclesApi,
} from "./vehiclesApi";
import type { Vehicle, VehicleFacets, VehicleInput } from "./vehiclesTypes";

// ── Public ──────────────────────────────────────────────────────────────

/**
 * GET /vehicles — one page of the public listing using the current filters,
 * sort and page from state. Dispatch again whenever filters or page change.
 */
export interface FetchVehiclesResult extends Paginated<Vehicle> {
  facets?: VehicleFacets;
  listKey: string;
  facetsKey: string;
}

/**
 * GET /vehicles — one page of the public listing for the current filters/sort/page.
 *
 * Optimised for the filter UI:
 * - sidebar facets ride along in the SAME request (`includeFacets`) and only when
 *   the filters changed (paging/sorting reuses the facets already shown);
 * - skipped entirely if the identical query is already shown or in flight;
 * - recently seen queries are answered from an in-memory cache;
 * - pass `{ force: true }` to bypass the skip (e.g. a "Try again" button).
 */
export const fetchVehicles = createAppAsyncThunk<FetchVehiclesResult, { force?: boolean } | void>(
  "vehicles/fetchPage",
  async (arg, { getState, signal, rejectWithValue }) => {
    const state = getState().vehicles;
    const { listQuery, listKey, facetsKey } = listingQueries(state);
    const force = !!(arg && arg.force);
    const withFacets = force || facetsKey !== state.facetsKey || !state.facets;
    try {
      const res = await vehiclesApi.search(listQuery, { withFacets, fresh: force, signal });
      return { ...res, listKey, facetsKey };
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not load vehicles"));
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg && arg.force) return true;
      const state = getState().vehicles;
      const { listKey } = listingQueries(state);
      if (listKey === state.inFlightKey) return false;
      return !(listKey === state.listKey && state.status === "succeeded");
    },
  },
);

/**
 * GET /vehicles/facets — price/year bounds and per-option counts for the
 * current filters. Dispatch alongside `fetchVehicles` when filters change.
 */
export const fetchVehicleFacets = createAppAsyncThunk<VehicleFacets, void>(
  "vehicles/fetchFacets",
  async (_, { getState, signal, rejectWithValue }) => {
    const { filters, facets } = getState().vehicles;
    try {
      return await vehiclesApi.facets(filtersToFacetsQuery(filters, priceSliderMax(facets)), signal);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/**
 * Every vehicle (all pages) into `allVehicles`. Skips if already loaded/loading;
 * pass `{ force: true }` to refetch.
 */
export const fetchAllVehicles = createAppAsyncThunk<Vehicle[], { force?: boolean } | void>(
  "vehicles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await vehiclesApi.listAll();
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not load vehicles"));
    }
  },
  {
    condition: (arg, { getState }) => {
      const { allStatus } = getState().vehicles;
      if (allStatus === "loading") return false;
      return !!(arg && arg.force) || allStatus !== "succeeded";
    },
  },
);

/**
 * GET /vehicles/featured — topped up with the newest stock when fewer than
 * `limit` cars are flagged as featured, so the home page grid is always full.
 */
export const fetchFeaturedVehicles = createAppAsyncThunk<Vehicle[], number | void>(
  "vehicles/fetchFeatured",
  async (limit = 6, { rejectWithValue }) => {
    const max = limit || 6;
    try {
      const featured = await vehiclesApi.featured(max);
      if (featured.length >= max) return featured;
      const newest = await vehiclesApi.list({ sortBy: "newest", vehicleStatus: "unsold", limit: max });
      const ids = new Set(featured.map((v) => v.id));
      return [...featured, ...newest.data.filter((v) => !ids.has(v.id))].slice(0, max);
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not load featured vehicles"));
    }
  },
);

/** GET /vehicles/:id */
export const fetchVehicleById = createAppAsyncThunk<Vehicle, string>(
  "vehicles/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await vehiclesApi.get(id);
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Vehicle not found"));
    }
  },
);

/** GET /vehicles/:id/similar */
export const fetchSimilarVehicles = createAppAsyncThunk<Vehicle[], string>(
  "vehicles/fetchSimilar",
  async (id, { rejectWithValue }) => {
    try {
      return await vehiclesApi.similar(id);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

// ── Admin ───────────────────────────────────────────────────────────────

/** POST /admin/uploads/images — returns public URLs for the given files. */
export const uploadVehicleImages = createAppAsyncThunk<string[], Blob[]>(
  "vehicles/uploadImages",
  async (files, { rejectWithValue }) => {
    try {
      return await vehiclesApi.uploadImages(files);
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Image upload failed"));
    }
  },
);

/** POST /admin/vehicles (uploads any base64 images first). */
export const addVehicle = createAppAsyncThunk<Vehicle, VehicleInput>(
  "vehicles/add",
  async (input, { rejectWithValue }) => {
    try {
      const images = await uploadPendingImages(input.images);
      return await vehiclesApi.create({ ...input, images });
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not add vehicle"));
    }
  },
);

/** PATCH /admin/vehicles/:id (uploads any base64 images first). */
export const updateVehicle = createAppAsyncThunk<Vehicle, Vehicle | (VehicleInput & { id: string })>(
  "vehicles/update",
  async ({ id, ...input }, { rejectWithValue }) => {
    try {
      const images = await uploadPendingImages(input.images);
      return await vehiclesApi.update(id, { ...input, images });
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not update vehicle"));
    }
  },
);

/** DELETE /admin/vehicles/:id */
export const deleteVehicle = createAppAsyncThunk<string, string>(
  "vehicles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await vehiclesApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(errorMessage(err, "Could not delete vehicle"));
    }
  },
);

/** PATCH /admin/vehicles/:id/featured/:featured */
export const setVehicleFeatured = createAppAsyncThunk<Vehicle, { id: string; featured: boolean }>(
  "vehicles/setFeatured",
  async ({ id, featured }, { rejectWithValue }) => {
    try {
      return await vehiclesApi.setFeatured(id, featured);
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/** PATCH /admin/vehicles/:id/status/:status */
export const setVehicleStatus = createAppAsyncThunk<
  Vehicle,
  { id: string; status: "sold" | "unsold" }
>("vehicles/setStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await vehiclesApi.setStatus(id, status);
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

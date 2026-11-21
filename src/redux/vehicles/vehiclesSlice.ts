import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import {
  addVehicle,
  deleteVehicle,
  fetchAllVehicles,
  fetchFeaturedVehicles,
  fetchSimilarVehicles,
  fetchVehicleById,
  fetchVehicleFacets,
  fetchVehicles,
  setVehicleFeatured,
  setVehicleStatus,
  updateVehicle,
} from "./vehiclesThunks";
import { listingQueries } from "./vehiclesApi";
import type { Vehicle, VehicleFilters, VehiclesState } from "./vehiclesTypes";
import { initialFilters } from "./vehiclesTypes";

const initialState: VehiclesState = {
  allVehicles: [],
  allStatus: "idle",
  allError: null,

  filteredVehicles: [],
  filters: initialFilters,
  currentPage: 1,
  pageSize: 9,
  totalPages: 1,
  totalCount: 0,
  status: "idle",
  error: null,

  facets: null,
  facetsStatus: "idle",

  listKey: null,
  facetsKey: null,
  inFlightKey: null,

  featured: [],
  featuredStatus: "idle",

  selectedVehicle: null,
  similarVehicles: [],
  selectedStatus: "idle",

  mutationStatus: "idle",
  mutationError: null,
};

/** Filter changes reset to page 1; the page component refetches on change. */
function filtersChanged(state: VehiclesState) {
  state.currentPage = 1;
}

function toggle(list: string[], value: string) {
  const idx = list.indexOf(value);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(value);
}

/** Stock changed — the next listing fetch must hit the API (results and facets). */
function staleListing(state: VehiclesState) {
  state.listKey = null;
  state.facetsKey = null;
}

/** Apply a saved vehicle to every cached list that contains it. */
function replaceEverywhere(state: VehiclesState, vehicle: Vehicle) {
  for (const list of [state.allVehicles, state.filteredVehicles, state.featured, state.similarVehicles]) {
    const idx = list.findIndex((v) => v.id === vehicle.id);
    if (idx !== -1) list[idx] = vehicle;
  }
  if (state.selectedVehicle?.id === vehicle.id) state.selectedVehicle = vehicle;
}

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      filtersChanged(state);
    },
    setMake(state, action: PayloadAction<string>) {
      state.filters.make = action.payload;
      filtersChanged(state);
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.filters.priceRange = action.payload;
      filtersChanged(state);
    },
    setYearFrom(state, action: PayloadAction<string>) {
      state.filters.yearFrom = action.payload;
      filtersChanged(state);
    },
    setYearTo(state, action: PayloadAction<string>) {
      state.filters.yearTo = action.payload;
      filtersChanged(state);
    },
    toggleFuelType(state, action: PayloadAction<string>) {
      toggle(state.filters.fuelTypes, action.payload);
      filtersChanged(state);
    },
    toggleTransmission(state, action: PayloadAction<string>) {
      toggle(state.filters.transmissions, action.payload);
      filtersChanged(state);
    },
    toggleBodyType(state, action: PayloadAction<string>) {
      toggle(state.filters.bodyTypes, action.payload);
      filtersChanged(state);
    },
    setSortBy(state, action: PayloadAction<VehicleFilters["sortBy"]>) {
      state.filters.sortBy = action.payload;
      filtersChanged(state);
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = Math.max(1, Math.min(action.payload, state.totalPages));
    },
    setFiltersFromParams(
      state,
      action: PayloadAction<Partial<VehicleFilters> & { page?: number }>,
    ) {
      const { page, ...filterOverrides } = action.payload;
      state.filters = { ...initialFilters, ...filterOverrides };
      // Total pages isn't known until the API responds, so only clamp the lower bound.
      state.currentPage = page ? Math.max(1, page) : 1;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      filtersChanged(state);
    },
    clearVehiclesError(state) {
      state.error = null;
      state.allError = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Public listing page
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.inFlightKey = listingQueries(state).listKey;
      })
      .addCase(fetchVehicles.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.inFlightKey = null;
        state.listKey = payload.listKey;
        state.filteredVehicles = payload.data;
        state.totalCount = payload.meta.total;
        state.totalPages = payload.meta.totalPages;
        if (payload.facets) {
          state.facets = payload.facets;
          state.facetsKey = payload.facetsKey;
          state.facetsStatus = "succeeded";
        }
        if (state.currentPage > payload.meta.totalPages) state.currentPage = payload.meta.totalPages;
      })
      .addCase(fetchVehicles.rejected, (state, { payload, meta }) => {
        state.inFlightKey = null;
        if (meta.aborted) return; // superseded by a newer request
        state.status = "failed";
        state.error = payload ?? "Could not load vehicles";
      })

      // Filter sidebar facets
      .addCase(fetchVehicleFacets.pending, (state) => {
        state.facetsStatus = "loading";
      })
      .addCase(fetchVehicleFacets.fulfilled, (state, { payload }) => {
        state.facetsStatus = "succeeded";
        state.facets = payload;
      })
      .addCase(fetchVehicleFacets.rejected, (state, { meta }) => {
        if (!meta.aborted) state.facetsStatus = "failed";
      })

      // Full inventory
      .addCase(fetchAllVehicles.pending, (state) => {
        state.allStatus = "loading";
        state.allError = null;
      })
      .addCase(fetchAllVehicles.fulfilled, (state, { payload }) => {
        state.allStatus = "succeeded";
        state.allVehicles = payload;
      })
      .addCase(fetchAllVehicles.rejected, (state, { payload }) => {
        state.allStatus = "failed";
        state.allError = payload ?? "Could not load vehicles";
      })

      // Featured
      .addCase(fetchFeaturedVehicles.pending, (state) => {
        state.featuredStatus = "loading";
      })
      .addCase(fetchFeaturedVehicles.fulfilled, (state, { payload }) => {
        state.featuredStatus = "succeeded";
        state.featured = payload;
      })
      .addCase(fetchFeaturedVehicles.rejected, (state) => {
        state.featuredStatus = "failed";
      })

      // Single vehicle + similar
      .addCase(fetchVehicleById.pending, (state) => {
        state.selectedStatus = "loading";
      })
      .addCase(fetchVehicleById.fulfilled, (state, { payload }) => {
        state.selectedStatus = "succeeded";
        state.selectedVehicle = payload;
      })
      .addCase(fetchVehicleById.rejected, (state) => {
        state.selectedStatus = "failed";
        state.selectedVehicle = null;
      })
      .addCase(fetchSimilarVehicles.fulfilled, (state, { payload }) => {
        state.similarVehicles = payload;
      })

      // Admin mutations
      .addCase(addVehicle.fulfilled, (state, { payload }) => {
        state.mutationStatus = "succeeded";
        staleListing(state);
        state.allVehicles.unshift(payload);
      })
      .addCase(deleteVehicle.fulfilled, (state, { payload: id }) => {
        state.mutationStatus = "succeeded";
        staleListing(state);
        state.allVehicles = state.allVehicles.filter((v) => v.id !== id);
        state.filteredVehicles = state.filteredVehicles.filter((v) => v.id !== id);
        state.featured = state.featured.filter((v) => v.id !== id);
      })
      .addMatcher(
        isAnyOf(updateVehicle.fulfilled, setVehicleFeatured.fulfilled, setVehicleStatus.fulfilled),
        (state, { payload }) => {
          state.mutationStatus = "succeeded";
          staleListing(state);
          replaceEverywhere(state, payload);
        },
      )
      .addMatcher(
        isAnyOf(
          addVehicle.pending,
          updateVehicle.pending,
          deleteVehicle.pending,
          setVehicleFeatured.pending,
          setVehicleStatus.pending,
        ),
        (state) => {
          state.mutationStatus = "loading";
          state.mutationError = null;
        },
      )
      .addMatcher(
        isAnyOf(
          addVehicle.rejected,
          updateVehicle.rejected,
          deleteVehicle.rejected,
          setVehicleFeatured.rejected,
          setVehicleStatus.rejected,
        ),
        (state, { payload }) => {
          state.mutationStatus = "failed";
          state.mutationError = payload ?? "Request failed";
        },
      );
  },
});

export const {
  setSearch,
  setMake,
  setPriceRange,
  setYearFrom,
  setYearTo,
  toggleFuelType,
  toggleTransmission,
  toggleBodyType,
  setSortBy,
  setPage,
  setFiltersFromParams,
  resetFilters,
  clearVehiclesError,
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;

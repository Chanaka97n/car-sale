import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockVehicles } from "./vehiclesMockData";
import { fetchVehicles } from "./vehiclesThunks";
import type { Vehicle, VehicleFilters, VehiclesState } from "./vehiclesTypes";
import { initialFilters } from "./vehiclesTypes";

function applyFiltersAndSort(
  vehicles: Vehicle[],
  filters: VehicleFilters,
): Vehicle[] {
  let result = [...vehicles];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.variant.toLowerCase().includes(q),
    );
  }

  if (filters.make) {
    result = result.filter(
      (v) => v.make.toLowerCase() === filters.make.toLowerCase(),
    );
  }

  result = result.filter(
    (v) =>
      v.price >= filters.priceRange[0] && v.price <= filters.priceRange[1],
  );

  if (filters.yearFrom) {
    result = result.filter((v) => v.year >= parseInt(filters.yearFrom));
  }
  if (filters.yearTo) {
    result = result.filter((v) => v.year <= parseInt(filters.yearTo));
  }

  if (filters.fuelTypes.length > 0) {
    result = result.filter((v) => filters.fuelTypes.includes(v.fuelType));
  }

  if (filters.transmissions.length > 0) {
    result = result.filter((v) =>
      filters.transmissions.includes(v.transmission),
    );
  }

  if (filters.bodyTypes.length > 0) {
    result = result.filter((v) => filters.bodyTypes.includes(v.bodyType));
  }

  switch (filters.sortBy) {
    case "newest":
      result.sort((a, b) => b.year - a.year);
      break;
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "mileage":
      result.sort((a, b) => a.mileage - b.mileage);
      break;
  }

  return result;
}

function refilter(state: VehiclesState) {
  state.currentPage = 1;
  state.filteredVehicles = applyFiltersAndSort(
    state.allVehicles,
    state.filters,
  );
  state.totalPages = Math.ceil(
    state.filteredVehicles.length / state.pageSize,
  );
}

const initialFiltered = applyFiltersAndSort(mockVehicles, initialFilters);

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    allVehicles: mockVehicles,
    filteredVehicles: initialFiltered,
    filters: initialFilters,
    currentPage: 1,
    pageSize: 9,
    totalPages: Math.ceil(initialFiltered.length / 9),
    status: "idle",
  } as VehiclesState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      refilter(state);
    },
    setMake(state, action: PayloadAction<string>) {
      state.filters.make = action.payload;
      refilter(state);
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.filters.priceRange = action.payload;
      refilter(state);
    },
    setYearFrom(state, action: PayloadAction<string>) {
      state.filters.yearFrom = action.payload;
      refilter(state);
    },
    setYearTo(state, action: PayloadAction<string>) {
      state.filters.yearTo = action.payload;
      refilter(state);
    },
    toggleFuelType(state, action: PayloadAction<string>) {
      const idx = state.filters.fuelTypes.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.fuelTypes.splice(idx, 1);
      } else {
        state.filters.fuelTypes.push(action.payload);
      }
      refilter(state);
    },
    toggleTransmission(state, action: PayloadAction<string>) {
      const idx = state.filters.transmissions.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.transmissions.splice(idx, 1);
      } else {
        state.filters.transmissions.push(action.payload);
      }
      refilter(state);
    },
    toggleBodyType(state, action: PayloadAction<string>) {
      const idx = state.filters.bodyTypes.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.bodyTypes.splice(idx, 1);
      } else {
        state.filters.bodyTypes.push(action.payload);
      }
      refilter(state);
    },
    setSortBy(state, action: PayloadAction<VehicleFilters["sortBy"]>) {
      state.filters.sortBy = action.payload;
      refilter(state);
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = Math.max(
        1,
        Math.min(action.payload, state.totalPages),
      );
    },
    setFiltersFromParams(state, action: PayloadAction<Partial<VehicleFilters> & { page?: number }>) {
      const { page, ...filterOverrides } = action.payload;
      state.filters = { ...initialFilters, ...filterOverrides };
      state.filteredVehicles = applyFiltersAndSort(
        state.allVehicles,
        state.filters,
      );
      state.totalPages = Math.ceil(
        state.filteredVehicles.length / state.pageSize,
      );
      state.currentPage = page
        ? Math.max(1, Math.min(page, state.totalPages))
        : 1;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      refilter(state);
    },
    addVehicle(state, action: PayloadAction<Omit<Vehicle, "id">>) {
      const newVehicle: Vehicle = {
        ...action.payload,
        id: String(Date.now()),
      };
      state.allVehicles.push(newVehicle);
      refilter(state);
    },
    updateVehicle(state, action: PayloadAction<Vehicle>) {
      const idx = state.allVehicles.findIndex((v) => v.id === action.payload.id);
      if (idx !== -1) {
        state.allVehicles[idx] = action.payload;
        refilter(state);
      }
    },
    deleteVehicle(state, action: PayloadAction<string>) {
      state.allVehicles = state.allVehicles.filter((v) => v.id !== action.payload);
      refilter(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allVehicles = action.payload;
        state.filteredVehicles = applyFiltersAndSort(
          action.payload,
          state.filters,
        );
        state.totalPages = Math.ceil(
          state.filteredVehicles.length / state.pageSize,
        );
      })
      .addCase(fetchVehicles.rejected, (state) => {
        state.status = "failed";
      });
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
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;

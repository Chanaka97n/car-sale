import type { RootState } from "../store";
import { priceSliderMax } from "./vehiclesApi";

export const selectVehicleFacets = (state: RootState) => state.vehicles.facets;
/** Top of the price slider, derived from the most expensive car in stock. */
export const selectPriceSliderMax = (state: RootState) => priceSliderMax(state.vehicles.facets);

export const selectFilters = (state: RootState) => state.vehicles.filters;
/** Current page of public results, already filtered/sorted/paginated by the API. */
export const selectFilteredVehicles = (state: RootState) => state.vehicles.filteredVehicles;
export const selectPaginatedVehicles = selectFilteredVehicles;
export const selectCurrentPage = (state: RootState) => state.vehicles.currentPage;
export const selectPageSize = (state: RootState) => state.vehicles.pageSize;
export const selectTotalPages = (state: RootState) => state.vehicles.totalPages;
export const selectTotalCount = (state: RootState) => state.vehicles.totalCount;
export const selectStatus = (state: RootState) => state.vehicles.status;
export const selectVehiclesError = (state: RootState) => state.vehicles.error;

export const selectAllVehicles = (state: RootState) => state.vehicles.allVehicles;
export const selectAllVehiclesStatus = (state: RootState) => state.vehicles.allStatus;

export const selectFeaturedVehicles = (state: RootState) => state.vehicles.featured;
export const selectFeaturedStatus = (state: RootState) => state.vehicles.featuredStatus;

export const selectSelectedVehicle = (state: RootState) => state.vehicles.selectedVehicle;
export const selectSimilarVehicles = (state: RootState) => state.vehicles.similarVehicles;

export const selectVehicleMutationStatus = (state: RootState) => state.vehicles.mutationStatus;
export const selectVehicleMutationError = (state: RootState) => state.vehicles.mutationError;

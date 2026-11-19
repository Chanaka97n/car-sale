import type { RootState } from "../store";

export const selectFilters = (state: RootState) => state.vehicles.filters;
export const selectFilteredVehicles = (state: RootState) =>
  state.vehicles.filteredVehicles;
export const selectCurrentPage = (state: RootState) =>
  state.vehicles.currentPage;
export const selectPageSize = (state: RootState) => state.vehicles.pageSize;
export const selectTotalPages = (state: RootState) =>
  state.vehicles.totalPages;
export const selectStatus = (state: RootState) => state.vehicles.status;
export const selectTotalCount = (state: RootState) =>
  state.vehicles.filteredVehicles.length;

export const selectPaginatedVehicles = (state: RootState) => {
  const { filteredVehicles, currentPage, pageSize } = state.vehicles;
  const start = (currentPage - 1) * pageSize;
  return filteredVehicles.slice(start, start + pageSize);
};

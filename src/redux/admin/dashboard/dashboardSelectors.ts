import type { RootState } from "../../store";

export const selectDashboard = (state: RootState) => state.dashboard.overview;
export const selectDashboardStatus = (state: RootState) => state.dashboard.status;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

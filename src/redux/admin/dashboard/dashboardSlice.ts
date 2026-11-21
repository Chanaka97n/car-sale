import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
import { fetchDashboard } from "./dashboardThunks";
import type { DashboardState } from "./dashboardTypes";

const initialState: DashboardState = {
  overview: null,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.overview = payload;
      })
      .addCase(fetchDashboard.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Could not load dashboard";
      });
  },
});

export default dashboardSlice.reducer;

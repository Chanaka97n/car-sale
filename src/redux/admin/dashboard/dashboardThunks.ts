import { errorMessage } from "@/lib/api/client";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { dashboardApi } from "./dashboardApi";
import type { DashboardOverview } from "./dashboardTypes";

/** GET /admin/dashboard — always refetches (stats change with every edit). */
export const fetchDashboard = createAppAsyncThunk<DashboardOverview, void>(
  "dashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getOverview();
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
  { condition: (_, { getState }) => getState().dashboard.status !== "loading" },
);

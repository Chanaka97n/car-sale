import { api } from "@/lib/api/client";
import type { DashboardOverview } from "./dashboardTypes";

/** Backend: modules/dashboard/dashboard.controller.ts */
export const dashboardApi = {
  getOverview: () => api.get<DashboardOverview>("/admin/dashboard"),
};

import type { RequestStatus } from "../../createAppAsyncThunk";
import type { EnquiryType } from "../enquiries/enquiriesTypes";

export interface CountByName {
  name: string;
  count: number;
}

/** GET /admin/dashboard — car-sale-backend/src/modules/dashboard/dashboard.service.ts */
export interface DashboardOverview {
  vehicles: {
    total: number;
    stockValue: number;
    avgPrice: number;
    featured: number;
    sold: number;
    byMake: CountByName[];
    byFuelType: CountByName[];
    byBodyType: CountByName[];
  };
  users: { active: number; total: number };
  enquiries: {
    total: number;
    new: number;
    byType: { type: EnquiryType; total: number; new: number }[];
  };
}

export interface DashboardState {
  overview: DashboardOverview | null;
  status: RequestStatus;
  error: string | null;
}

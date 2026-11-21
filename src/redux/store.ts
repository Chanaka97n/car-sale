import { configureStore } from "@reduxjs/toolkit";
import { onUnauthorized } from "@/lib/api/client";
import { vehiclesReducer } from "./vehicles/vehiclesIndex";
import { authReducer, logout } from "./admin/auth/authIndex";
import { usersReducer } from "./admin/users/usersIndex";
import { settingsReducer } from "./admin/settings/settingsIndex";
import { enquiriesReducer } from "./admin/enquiries/enquiriesIndex";
import { dashboardReducer } from "./admin/dashboard/dashboardIndex";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    auth: authReducer,
    users: usersReducer,
    settings: settingsReducer,
    enquiries: enquiriesReducer,
    dashboard: dashboardReducer,
  },
});

// An expired or revoked JWT (any 401 on an authenticated request) ends the admin session.
onUnauthorized(() => store.dispatch(logout()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

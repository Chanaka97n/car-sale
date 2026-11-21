import { configureStore } from "@reduxjs/toolkit";
import { vehiclesReducer } from "./vehicles/vehiclesIndex";
import { authReducer } from "./admin/auth/authIndex";
import { usersReducer } from "./admin/users/usersIndex";
import { settingsReducer } from "./admin/settings/settingsIndex";
import { enquiriesReducer } from "./admin/enquiries/enquiriesIndex";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    auth: authReducer,
    users: usersReducer,
    settings: settingsReducer,
    enquiries: enquiriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

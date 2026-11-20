import { configureStore } from "@reduxjs/toolkit";
import { vehiclesReducer } from "./vehicles/vehiclesIndex";
import { authReducer } from "./admin/auth/authIndex";
import { usersReducer } from "./admin/users/usersIndex";
import { settingsReducer } from "./admin/settings/settingsIndex";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    auth: authReducer,
    users: usersReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

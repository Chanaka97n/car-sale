import { configureStore } from "@reduxjs/toolkit";
import { vehiclesReducer } from "./vehicles/vehiclesIndex";
import { authReducer } from "./auth/authIndex";
import { usersReducer } from "./users/usersIndex";
import { settingsReducer } from "./settings/settingsIndex";

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

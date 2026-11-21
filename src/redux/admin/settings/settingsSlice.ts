import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { RequestStatus } from "../../createAppAsyncThunk";
import { MAKES, BODY_TYPES, FUEL_TYPES } from "../../vehicles/vehiclesTypes";
import { addOption, fetchSettings, removeOption, reorderOption } from "./settingsThunks";

export type SettingsListKey = "makes" | "bodyTypes" | "fuelTypes" | "transmissions";
export type SettingsLists = Record<SettingsListKey, string[]>;

export interface SettingsState extends SettingsLists {
  status: RequestStatus;
  error: string | null;
  /** Last admin mutation (add / remove / reorder). */
  mutationStatus: RequestStatus;
  mutationError: string | null;
}

/** Shown until GET /settings resolves, so dropdowns are never empty on first paint. */
const initialState: SettingsState = {
  makes: [...MAKES],
  bodyTypes: [...BODY_TYPES],
  fuelTypes: [...FUEL_TYPES],
  transmissions: ["Automatic", "Manual"],
  status: "idle",
  error: null,
  mutationStatus: "idle",
  mutationError: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettingsError(state) {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.makes = payload.makes;
        state.bodyTypes = payload.bodyTypes;
        state.fuelTypes = payload.fuelTypes;
        state.transmissions = payload.transmissions;
      })
      .addCase(fetchSettings.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Could not load settings";
      })
      .addMatcher(isAnyOf(addOption.pending, removeOption.pending, reorderOption.pending), (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addMatcher(
        isAnyOf(addOption.fulfilled, removeOption.fulfilled, reorderOption.fulfilled),
        (state, { payload }) => {
          state.mutationStatus = "succeeded";
          state[payload.list] = payload.values;
        },
      )
      .addMatcher(
        isAnyOf(addOption.rejected, removeOption.rejected, reorderOption.rejected),
        (state, { payload }) => {
          state.mutationStatus = "failed";
          state.mutationError = payload ?? "Could not update settings";
        },
      );
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;

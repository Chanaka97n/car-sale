import type { RootState } from "../../store";

export const selectSettings = (state: RootState) => state.settings;
export const selectMakes = (state: RootState) => state.settings.makes;
export const selectBodyTypes = (state: RootState) => state.settings.bodyTypes;
export const selectFuelTypes = (state: RootState) => state.settings.fuelTypes;
export const selectTransmissions = (state: RootState) => state.settings.transmissions;
export const selectConditions = (state: RootState) => state.settings.conditions;
export const selectDrivetrains = (state: RootState) => state.settings.drivetrains;
export const selectSettingsStatus = (state: RootState) => state.settings.status;
/** Load error or last mutation error, whichever is set. */
export const selectSettingsError = (state: RootState) =>
  state.settings.mutationError ?? state.settings.error;

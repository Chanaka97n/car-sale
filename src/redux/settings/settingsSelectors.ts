import type { RootState } from "../store";

export const selectSettings = (state: RootState) => state.settings;
export const selectMakes = (state: RootState) => state.settings.makes;
export const selectBodyTypes = (state: RootState) => state.settings.bodyTypes;
export const selectFuelTypes = (state: RootState) => state.settings.fuelTypes;
export const selectTransmissions = (state: RootState) => state.settings.transmissions;

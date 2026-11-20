export { default as settingsReducer, addOption, removeOption, reorderOption } from "./settingsSlice";
export type { SettingsState } from "./settingsSlice";
export {
  selectSettings,
  selectMakes,
  selectBodyTypes,
  selectFuelTypes,
  selectTransmissions,
} from "./settingsSelectors";

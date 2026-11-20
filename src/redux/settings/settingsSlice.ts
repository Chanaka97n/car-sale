import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MAKES, BODY_TYPES, FUEL_TYPES } from "../vehicles/vehiclesTypes";

const STORAGE_KEY = "apex_admin_settings";

export interface SettingsState {
  makes: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
}

const defaults: SettingsState = {
  makes: [...MAKES],
  bodyTypes: [...BODY_TYPES],
  fuelTypes: [...FUEL_TYPES],
  transmissions: ["Automatic", "Manual"],
};

function loadSettings(): SettingsState {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {}
  return defaults;
}

function persistSettings(state: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

type ListKey = "makes" | "bodyTypes" | "fuelTypes" | "transmissions";

const settingsSlice = createSlice({
  name: "settings",
  initialState: loadSettings,
  reducers: {
    addOption(state, action: PayloadAction<{ list: ListKey; value: string }>) {
      const { list, value } = action.payload;
      const trimmed = value.trim();
      if (trimmed && !state[list].includes(trimmed)) {
        state[list].push(trimmed);
        persistSettings(state);
      }
    },
    removeOption(state, action: PayloadAction<{ list: ListKey; value: string }>) {
      const { list, value } = action.payload;
      state[list] = state[list].filter((item) => item !== value);
      persistSettings(state);
    },
    reorderOption(state, action: PayloadAction<{ list: ListKey; from: number; to: number }>) {
      const { list, from, to } = action.payload;
      const arr = state[list];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      persistSettings(state);
    },
  },
});

export const { addOption, removeOption, reorderOption } = settingsSlice.actions;
export default settingsSlice.reducer;

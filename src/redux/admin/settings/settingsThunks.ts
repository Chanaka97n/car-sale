import { errorMessage } from "@/lib/api/client";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { settingsApi } from "./settingsApi";
import type { SettingsListKey, SettingsLists } from "./settingsSlice";

interface ListResult {
  list: SettingsListKey;
  values: string[];
}

/**
 * GET /settings — the dropdown lists used across the site.
 * Skips the request if the lists are already loaded or loading; pass `{ force: true }` to refetch.
 */
export const fetchSettings = createAppAsyncThunk<SettingsLists, { force?: boolean } | void>(
  "settings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsApi.getAll();
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
  {
    condition: (arg, { getState }) => {
      const { status } = getState().settings;
      if (status === "loading") return false;
      return !!(arg && arg.force) || status !== "succeeded";
    },
  },
);

/** POST /admin/settings/:list */
export const addOption = createAppAsyncThunk<ListResult, { list: SettingsListKey; value: string }>(
  "settings/addOption",
  async ({ list, value }, { rejectWithValue }) => {
    try {
      return { list, values: await settingsApi.addOption(list, value.trim()) };
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  },
);

/** DELETE /admin/settings/:list/:value */
export const removeOption = createAppAsyncThunk<
  ListResult,
  { list: SettingsListKey; value: string }
>("settings/removeOption", async ({ list, value }, { rejectWithValue }) => {
  try {
    return { list, values: await settingsApi.removeOption(list, value) };
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

/** PATCH /admin/settings/:list/reorder */
export const reorderOption = createAppAsyncThunk<
  ListResult,
  { list: SettingsListKey; from: number; to: number }
>("settings/reorderOption", async ({ list, from, to }, { rejectWithValue }) => {
  try {
    return { list, values: await settingsApi.reorderOption(list, from, to) };
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

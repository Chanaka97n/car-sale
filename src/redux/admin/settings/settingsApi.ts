import { api } from "@/lib/api/client";
import type { SettingsListKey, SettingsLists } from "./settingsSlice";

/**
 * Backend: modules/settings/settings.controller.ts (public GET)
 *          modules/settings/admin-settings.controller.ts (admin mutations).
 * Every admin mutation returns the updated list.
 */
export const settingsApi = {
  getAll: () => api.get<SettingsLists>("/settings", undefined, { auth: false }),

  getList: (list: SettingsListKey) =>
    api.get<string[]>(`/settings/${list}`, undefined, { auth: false }),

  addOption: (list: SettingsListKey, value: string) =>
    api.post<string[]>(`/admin/settings/${list}`, { value }),

  removeOption: (list: SettingsListKey, value: string) =>
    api.delete<string[]>(`/admin/settings/${list}/${encodeURIComponent(value)}`),

  reorderOption: (list: SettingsListKey, from: number, to: number) =>
    api.patch<string[]>(`/admin/settings/${list}/reorder`, { from, to }),
};

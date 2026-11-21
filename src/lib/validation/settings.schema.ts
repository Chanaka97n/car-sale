import * as yup from "yup";
import { requiredText } from "./common";

/**
 * Admin › Settings "add option" inputs — backend: AddOptionDto.
 * Pass the current list as resolver context `{ existing: string[] }` to reject duplicates.
 */
export const settingOptionSchema = yup.object({
  value: requiredText("Value", 60).test(
    "unique",
    "This option already exists",
    (value, ctx) => {
      const existing: string[] = ctx.options.context?.existing ?? [];
      return !value || !existing.some((e) => e.toLowerCase() === value.toLowerCase());
    },
  ),
});

export type SettingOptionFormValues = yup.InferType<typeof settingOptionSchema>;

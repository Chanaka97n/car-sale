"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { FieldError, fieldAria } from "@/components/forms/form-errors";
import { settingOptionSchema, type SettingOptionFormValues } from "@/lib/validation";
import {
  selectSettings,
  selectSettingsError,
  fetchSettings,
  addOption,
  removeOption,
  clearSettingsError,
} from "@/redux/admin/settings/settingsIndex";
import { AdminAlert } from "@/components/admin/admin-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Plus, X, Car, Fuel, Truck, Cog, ShieldCheck, Route } from "lucide-react";
import type { SettingsListKey } from "@/redux/admin/settings/settingsIndex";

type ListKey = SettingsListKey;

/** Every dropdown in the Add/Edit Vehicle modal is managed here. */
const sections: { key: ListKey; label: string; icon: typeof Car; placeholder: string }[] = [
  { key: "makes", label: "Vehicle Makes", icon: Car, placeholder: "e.g. Toyota" },
  { key: "fuelTypes", label: "Fuel Types", icon: Fuel, placeholder: "e.g. Hydrogen" },
  { key: "bodyTypes", label: "Body Types", icon: Truck, placeholder: "e.g. Pickup" },
  { key: "transmissions", label: "Transmissions", icon: Cog, placeholder: "e.g. CVT" },
  { key: "conditions", label: "Conditions", icon: ShieldCheck, placeholder: "e.g. Ex-Demo" },
  { key: "drivetrains", label: "Drivetrains", icon: Route, placeholder: "e.g. xDrive AWD" },
];

/**
 * One "add option" form per list — validated by `settingOptionSchema`
 * (required, ≤ 60 chars, not already in this list).
 */
function AddOptionForm({
  list,
  label,
  placeholder,
  existing,
}: {
  list: ListKey;
  label: string;
  placeholder: string;
  existing: string[];
}) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SettingOptionFormValues, { existing: string[] }>({
    resolver: yupResolver(settingOptionSchema),
    defaultValues: { value: "" },
    context: { existing },
  });
  const id = `add-${list}`;
  const message = errors.value?.message ?? errors.root?.server?.message;

  const onSubmit = handleSubmit(async ({ value }) => {
    try {
      await dispatch(addOption({ list, value })).unwrap();
      reset({ value: "" });
    } catch (err) {
      // Shown under this input instead of the page-level banner.
      dispatch(clearSettingsError());
      setError("root.server", { message: String(err) });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mb-4">
      <div className="flex gap-2">
        <Input
          id={id}
          aria-label={`New ${label.toLowerCase()} option`}
          placeholder={placeholder}
          {...register("value")}
          {...fieldAria(id, message)}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 flex-1"
        />
        <Button
          type="submit"
          size="default"
          disabled={isSubmitting}
          className="btn-gradient shrink-0 gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </Button>
      </div>
      <FieldError id={`${id}-error`} message={message} />
    </form>
  );
}

export default function AdminSettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const error = useAppSelector(selectSettingsError);

  useEffect(() => {
    dispatch(fetchSettings({ force: true }));
  }, [dispatch]);

  const handleRemove = (list: ListKey, value: string) => {
    dispatch(removeOption({ list, value }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white uppercase flex items-center gap-3">
          <Settings className="w-6 h-6 text-orange" />
          Settings
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage dropdown options used across the vehicle forms
        </p>
      </div>

      {error && (
        <AdminAlert onDismiss={() => dispatch(clearSettingsError())}>{error}</AdminAlert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.key}
            className="bg-surface rounded-xl border border-white/5 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-orange" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">{section.label}</h2>
                <p className="text-xs text-zinc-500">{settings[section.key].length} items</p>
              </div>
            </div>

            <div className="p-4">
              <AddOptionForm
                list={section.key}
                label={section.label}
                placeholder={section.placeholder}
                existing={settings[section.key]}
              />

              <div className="flex flex-wrap gap-2">
                {settings[section.key].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
                  >
                    {item}
                    <button
                      onClick={() => handleRemove(section.key, item)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {settings[section.key].length === 0 && (
                  <p className="text-xs text-zinc-600 italic">No items added</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

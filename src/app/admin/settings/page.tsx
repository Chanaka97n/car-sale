"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectSettings,
  addOption,
  removeOption,
} from "@/redux/admin/settings/settingsIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, X, Car, Fuel, Truck, Cog } from "lucide-react";

type ListKey = "makes" | "bodyTypes" | "fuelTypes" | "transmissions";

const sections: { key: ListKey; label: string; icon: typeof Car; placeholder: string }[] = [
  { key: "makes", label: "Vehicle Makes", icon: Car, placeholder: "e.g. Toyota" },
  { key: "fuelTypes", label: "Fuel Types", icon: Fuel, placeholder: "e.g. Hydrogen" },
  { key: "bodyTypes", label: "Body Types", icon: Truck, placeholder: "e.g. Pickup" },
  { key: "transmissions", label: "Transmissions", icon: Cog, placeholder: "e.g. CVT" },
];

export default function AdminSettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [inputs, setInputs] = useState<Record<ListKey, string>>({
    makes: "",
    bodyTypes: "",
    fuelTypes: "",
    transmissions: "",
  });

  const handleAdd = (list: ListKey) => {
    const value = inputs[list].trim();
    if (!value) return;
    dispatch(addOption({ list, value }));
    setInputs((p) => ({ ...p, [list]: "" }));
  };

  const handleRemove = (list: ListKey, value: string) => {
    dispatch(removeOption({ list, value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, list: ListKey) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(list);
    }
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
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder={section.placeholder}
                  value={inputs[section.key]}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, [section.key]: e.target.value }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, section.key)}
                  className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 flex-1"
                />
                <Button
                  onClick={() => handleAdd(section.key)}
                  size="default"
                  className="btn-gradient shrink-0 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>

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

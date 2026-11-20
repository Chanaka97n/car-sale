"use client";

import { useRef, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  selectMakes,
  selectBodyTypes,
  selectFuelTypes,
  selectTransmissions,
} from "@/redux/admin/settings/settingsIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star, Trash2, Upload } from "lucide-react";
import type { Vehicle } from "@/redux/vehicles/vehiclesIndex";

export type VehicleForm = {
  make: string;
  model: string;
  variant: string;
  year: string;
  mileage: string;
  price: string;
  monthlyPrice: string;
  fuelType: string;
  transmission: string;
  horsepower: string;
  bodyType: string;
  images: string[];
  featured: boolean;
};

export const emptyVehicleForm: VehicleForm = {
  make: "",
  model: "",
  variant: "",
  year: "",
  mileage: "",
  price: "",
  monthlyPrice: "",
  fuelType: "Petrol",
  transmission: "Automatic",
  horsepower: "",
  bodyType: "",
  images: [],
  featured: false,
};

export function formToVehicle(form: VehicleForm): Omit<Vehicle, "id"> {
  return {
    make: form.make,
    model: form.model,
    variant: form.variant,
    year: Number(form.year),
    mileage: Number(form.mileage),
    price: Number(form.price),
    monthlyPrice: Number(form.monthlyPrice),
    fuelType: form.fuelType as Vehicle["fuelType"],
    transmission: form.transmission as Vehicle["transmission"],
    horsepower: Number(form.horsepower),
    bodyType: form.bodyType,
    image: form.images[0] ?? "",
    images: form.images,
    featured: form.featured,
  };
}

export function vehicleToForm(v: Vehicle): VehicleForm {
  const imgs = v.images?.length ? v.images : v.image ? [v.image] : [];
  return {
    make: v.make,
    model: v.model,
    variant: v.variant,
    year: String(v.year),
    mileage: String(v.mileage),
    price: String(v.price),
    monthlyPrice: String(v.monthlyPrice),
    fuelType: v.fuelType,
    transmission: v.transmission,
    horsepower: String(v.horsepower),
    bodyType: v.bodyType,
    images: imgs,
    featured: v.featured ?? false,
  };
}

interface VehicleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: VehicleForm;
  setForm: React.Dispatch<React.SetStateAction<VehicleForm>>;
  onSubmit: () => void;
  mode: "add" | "edit";
}

export function VehicleFormModal({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  mode,
}: VehicleFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-surface border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === "add" ? "Add New Vehicle" : "Edit Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new vehicle to the inventory."
              : "Update vehicle details."}
          </DialogDescription>
        </DialogHeader>
        <VehicleFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-zinc-300"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} className="btn-gradient">
            {mode === "add" ? "Add Vehicle" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VehicleFormFields({
  form,
  setForm,
}: {
  form: VehicleForm;
  setForm: React.Dispatch<React.SetStateAction<VehicleForm>>;
}) {
  const makes = useAppSelector(selectMakes);
  const bodyTypes = useAppSelector(selectBodyTypes);
  const fuelTypes = useAppSelector(selectFuelTypes);
  const transmissions = useAppSelector(selectTransmissions);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setForm((p) =>
            p.images.includes(dataUrl)
              ? p
              : { ...p, images: [...p.images, dataUrl] }
          );
        };
        reader.readAsDataURL(file);
      });
    },
    [setForm]
  );

  const removeImage = (url: string) => {
    setForm((p) => ({ ...p, images: p.images.filter((i) => i !== url) }));
  };

  const setMainImage = (url: string) => {
    setForm((p) => ({
      ...p,
      images: [url, ...p.images.filter((i) => i !== url)],
    }));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
      {/* Left — Form fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Make</Label>
            <Select
              value={form.make}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, make: val ?? "" }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Model</Label>
            <Input
              placeholder="e.g. 3 Series"
              value={form.model}
              onChange={(e) =>
                setForm((p) => ({ ...p, model: e.target.value }))
              }
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300">Variant</Label>
          <Input
            placeholder="e.g. 330i M Sport"
            value={form.variant}
            onChange={(e) =>
              setForm((p) => ({ ...p, variant: e.target.value }))
            }
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label className="text-zinc-300">Year</Label>
            <Input
              type="number"
              placeholder="2024"
              value={form.year}
              onChange={(e) =>
                setForm((p) => ({ ...p, year: e.target.value }))
              }
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Price (£)</Label>
            <Input
              type="number"
              placeholder="35000"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Monthly (£)</Label>
            <Input
              type="number"
              placeholder="600"
              value={form.monthlyPrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, monthlyPrice: e.target.value }))
              }
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Mileage</Label>
            <Input
              type="number"
              placeholder="15000"
              value={form.mileage}
              onChange={(e) =>
                setForm((p) => ({ ...p, mileage: e.target.value }))
              }
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Horsepower</Label>
            <Input
              type="number"
              placeholder="250"
              value={form.horsepower}
              onChange={(e) =>
                setForm((p) => ({ ...p, horsepower: e.target.value }))
              }
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label className="text-zinc-300">Fuel Type</Label>
            <Select
              value={form.fuelType}
              onValueChange={(val) =>
                val && setForm((p) => ({ ...p, fuelType: val }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {fuelTypes.map((ft) => (
                  <SelectItem key={ft} value={ft}>
                    {ft}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Transmission</Label>
            <Select
              value={form.transmission}
              onValueChange={(val) =>
                val && setForm((p) => ({ ...p, transmission: val }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {transmissions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Body Type</Label>
            <Select
              value={form.bodyType}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, bodyType: val ?? "" }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {bodyTypes.map((bt) => (
                  <SelectItem key={bt} value={bt}>
                    {bt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.featured}
            onCheckedChange={(checked) =>
              setForm((p) => ({ ...p, featured: checked === true }))
            }
            className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
          />
          <Label className="text-zinc-300 cursor-pointer">
            Featured vehicle
          </Label>
        </div>
      </div>

      {/* Right — Image picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-300">Vehicle Images</Label>
          {form.images.length > 0 && (
            <span className="text-xs text-zinc-500">
              {form.images.length} image
              {form.images.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {form.images.length > 0 ? (
          <div className="space-y-2">
            <div className="group relative rounded-lg overflow-hidden border-2 border-orange/50 aspect-video bg-white/5">
              <img
                src={form.images[0]}
                alt="Main vehicle image"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-orange text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                Main
              </span>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeImage(form.images[0])}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {form.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {form.images.slice(1).map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-md overflow-hidden border border-white/10 aspect-video bg-white/5"
                  >
                    <img
                      src={url}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setMainImage(url)}
                        className="text-white hover:bg-white/20"
                        title="Set as main"
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeImage(url)}
                        className="text-red-400 hover:bg-red-500/20"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-white/10 text-zinc-300 hover:bg-white/5 gap-2"
            >
              <Upload className="w-4 h-4" />
              Add More Images
            </Button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-orange/30 rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">
              Click to browse or drag & drop
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              PNG, JPG, WEBP up to 10MB each
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

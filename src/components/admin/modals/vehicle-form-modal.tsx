"use client";

import { useRef, useCallback, useState } from "react";
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
import { Star, Trash2, Upload, X } from "lucide-react";
import type { Vehicle } from "@/redux/vehicles/vehiclesIndex";

export type VehicleForm = {
  make: string;
  model: string;
  variant: string;
  year: string;
  mileage: string;
  price: string;
  salePrice: string;
  monthlyPrice: string;
  fuelType: string;
  transmission: string;
  horsepower: string;
  bodyType: string;
  images: string[];
  featured: boolean;
  stockNumber: string;
  vinNumber: string;
  trim: string;
  condition: string;
  engineSize: string;
  drivetrain: string;
  fuelEconomy: string;
  exteriorColor: string;
  interiorColor: string;
  taxLabel: string;
  brochureUrl: string;
  videoUrl: string;
  vehicleStatus: "sold" | "unsold";
  enableRequestPrice: boolean;
  vehicleOverview: string;
  featuresAndOptions: string;
  technicalSpecs: string;
  generalInfo: string;
  vehicleLocation: string;
};

export const emptyVehicleForm: VehicleForm = {
  make: "",
  model: "",
  variant: "",
  year: "",
  mileage: "",
  price: "",
  salePrice: "",
  monthlyPrice: "",
  fuelType: "Petrol",
  transmission: "Automatic",
  horsepower: "",
  bodyType: "",
  images: [],
  featured: false,
  stockNumber: "",
  vinNumber: "",
  trim: "",
  condition: "",
  engineSize: "",
  drivetrain: "",
  fuelEconomy: "",
  exteriorColor: "",
  interiorColor: "",
  taxLabel: "",
  brochureUrl: "",
  videoUrl: "",
  vehicleStatus: "unsold",
  enableRequestPrice: false,
  vehicleOverview: "",
  featuresAndOptions: "",
  technicalSpecs: "",
  generalInfo: "",
  vehicleLocation: "",
};

export function formToVehicle(form: VehicleForm): Omit<Vehicle, "id"> {
  return {
    make: form.make,
    model: form.model,
    variant: form.variant,
    year: Number(form.year),
    mileage: Number(form.mileage),
    price: Number(form.price),
    salePrice: form.salePrice ? Number(form.salePrice) : undefined,
    monthlyPrice: Number(form.monthlyPrice),
    fuelType: form.fuelType as Vehicle["fuelType"],
    transmission: form.transmission as Vehicle["transmission"],
    horsepower: Number(form.horsepower),
    bodyType: form.bodyType,
    image: form.images[0] ?? "",
    images: form.images,
    featured: form.featured,
    stockNumber: form.stockNumber || undefined,
    vinNumber: form.vinNumber || undefined,
    trim: form.trim || undefined,
    condition: form.condition || undefined,
    engineSize: form.engineSize || undefined,
    drivetrain: form.drivetrain || undefined,
    fuelEconomy: form.fuelEconomy || undefined,
    exteriorColor: form.exteriorColor || undefined,
    interiorColor: form.interiorColor || undefined,
    taxLabel: form.taxLabel || undefined,
    brochureUrl: form.brochureUrl || undefined,
    videoUrl: form.videoUrl || undefined,
    vehicleStatus: form.vehicleStatus,
    enableRequestPrice: form.enableRequestPrice,
    vehicleOverview: form.vehicleOverview || undefined,
    featuresAndOptions: form.featuresAndOptions || undefined,
    technicalSpecs: form.technicalSpecs || undefined,
    generalInfo: form.generalInfo || undefined,
    vehicleLocation: form.vehicleLocation || undefined,
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
    salePrice: v.salePrice ? String(v.salePrice) : "",
    monthlyPrice: String(v.monthlyPrice),
    fuelType: v.fuelType,
    transmission: v.transmission,
    horsepower: String(v.horsepower),
    bodyType: v.bodyType,
    images: imgs,
    featured: v.featured ?? false,
    stockNumber: v.stockNumber ?? "",
    vinNumber: v.vinNumber ?? "",
    trim: v.trim ?? "",
    condition: v.condition ?? "",
    engineSize: v.engineSize ?? "",
    drivetrain: v.drivetrain ?? "",
    fuelEconomy: v.fuelEconomy ?? "",
    exteriorColor: v.exteriorColor ?? "",
    interiorColor: v.interiorColor ?? "",
    taxLabel: v.taxLabel ?? "",
    brochureUrl: v.brochureUrl ?? "",
    videoUrl: v.videoUrl ?? "",
    vehicleStatus: v.vehicleStatus ?? "unsold",
    enableRequestPrice: v.enableRequestPrice ?? false,
    vehicleOverview: v.vehicleOverview ?? "",
    featuresAndOptions: v.featuresAndOptions ?? "",
    technicalSpecs: v.technicalSpecs ?? "",
    generalInfo: v.generalInfo ?? "",
    vehicleLocation: v.vehicleLocation ?? "",
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

const TABS = [
  { id: "attributes", label: "Attributes" },
  { id: "images", label: "Vehicle Images" },
  { id: "price", label: "Vehicle Price" },
  { id: "tax", label: "Tax Label" },
  { id: "fuel", label: "Fuel Efficiency" },
  { id: "brochure", label: "Brochure Upload" },
  { id: "video", label: "Video" },
  { id: "status", label: "Vehicle Status" },
  { id: "tabs", label: "Vehicle Tabs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function VehicleFormModal({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  mode,
}: VehicleFormModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("attributes");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-surface border-white/10 max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-white text-lg">
            {mode === "add" ? "Add New Vehicle" : "Edit Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new vehicle to the inventory."
              : "Update vehicle details."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left sidebar tabs */}
          <nav className="w-48 shrink-0 border-r border-white/10 overflow-y-auto py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-orange bg-orange/10 border-r-2 border-orange font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right content area */}
          <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(90vh - 180px)" }}>
            <TabContent activeTab={activeTab} form={form} setForm={setForm} />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-white/10">
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

function TabContent({
  activeTab,
  form,
  setForm,
}: {
  activeTab: TabId;
  form: VehicleForm;
  setForm: React.Dispatch<React.SetStateAction<VehicleForm>>;
}) {
  switch (activeTab) {
    case "attributes":
      return <AttributesTab form={form} setForm={setForm} />;
    case "images":
      return <ImagesTab form={form} setForm={setForm} />;
    case "price":
      return <PriceTab form={form} setForm={setForm} />;
    case "tax":
      return <TaxLabelTab form={form} setForm={setForm} />;
    case "fuel":
      return <FuelEfficiencyTab form={form} setForm={setForm} />;
    case "brochure":
      return <BrochureTab form={form} setForm={setForm} />;
    case "video":
      return <VideoTab form={form} setForm={setForm} />;
    case "status":
      return <StatusTab form={form} setForm={setForm} />;
    case "tabs":
      return <VehicleTabsTab form={form} setForm={setForm} />;
  }
}

type TabProps = {
  form: VehicleForm;
  setForm: React.Dispatch<React.SetStateAction<VehicleForm>>;
};

function AttributesTab({ form, setForm }: TabProps) {
  const makes = useAppSelector(selectMakes);
  const bodyTypes = useAppSelector(selectBodyTypes);
  const fuelTypes = useAppSelector(selectFuelTypes);
  const transmissions = useAppSelector(selectTransmissions);

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Core Attributes</h3>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Year">
          <Input
            type="number"
            placeholder="2024"
            value={form.year}
            onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
        <Field label="Make">
          <Select value={form.make} onValueChange={(val) => setForm((p) => ({ ...p, make: val ?? "" }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              {makes.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Model">
          <Input
            placeholder="e.g. 3 Series"
            value={form.model}
            onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
        <Field label="Stock Number">
          <Input
            placeholder="e.g. STK-001"
            value={form.stockNumber}
            onChange={(e) => setForm((p) => ({ ...p, stockNumber: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
      </div>

      <Field label="VIN Number">
        <Input
          placeholder="Enter VIN number"
          value={form.vinNumber}
          onChange={(e) => setForm((p) => ({ ...p, vinNumber: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
        />
        <p className="text-xs text-zinc-500 mt-1">
          We recommend that you provide VIN Number. VIN Number is used as a unique entity in import process.
        </p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Trim">
          <Input
            placeholder="e.g. M Sport"
            value={form.trim}
            onChange={(e) => setForm((p) => ({ ...p, trim: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
        <Field label="Variant">
          <Input
            placeholder="e.g. 330i M Sport"
            value={form.variant}
            onChange={(e) => setForm((p) => ({ ...p, variant: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Condition">
          <Select value={form.condition} onValueChange={(val) => setForm((p) => ({ ...p, condition: val ?? "" }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Transmission">
          <Select value={form.transmission} onValueChange={(val) => val && setForm((p) => ({ ...p, transmission: val }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              {transmissions.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Engine">
          <Input
            placeholder="e.g. 2.0L Turbo"
            value={form.engineSize}
            onChange={(e) => setForm((p) => ({ ...p, engineSize: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
        <Field label="Drivetrain">
          <Select value={form.drivetrain} onValueChange={(val) => setForm((p) => ({ ...p, drivetrain: val ?? "" }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="FWD">FWD</SelectItem>
              <SelectItem value="RWD">RWD</SelectItem>
              <SelectItem value="AWD">AWD</SelectItem>
              <SelectItem value="4WD">4WD</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Fuel Type">
          <Select value={form.fuelType} onValueChange={(val) => val && setForm((p) => ({ ...p, fuelType: val }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              {fuelTypes.map((ft) => (
                <SelectItem key={ft} value={ft}>{ft}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Body Type">
          <Select value={form.bodyType} onValueChange={(val) => setForm((p) => ({ ...p, bodyType: val ?? "" }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              {bodyTypes.map((bt) => (
                <SelectItem key={bt} value={bt}>{bt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Mileage">
          <Input
            type="number"
            placeholder="15000"
            value={form.mileage}
            onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
        <Field label="Exterior Color">
          <Input
            placeholder="e.g. Mineral White"
            value={form.exteriorColor}
            onChange={(e) => setForm((p) => ({ ...p, exteriorColor: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
        <Field label="Interior Color">
          <Input
            placeholder="e.g. Black Leather"
            value={form.interiorColor}
            onChange={(e) => setForm((p) => ({ ...p, interiorColor: e.target.value }))}
            className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
          />
        </Field>
      </div>

      <Field label="Horsepower">
        <Input
          type="number"
          placeholder="250"
          value={form.horsepower}
          onChange={(e) => setForm((p) => ({ ...p, horsepower: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-[200px]"
        />
      </Field>

      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          checked={form.featured}
          onCheckedChange={(checked) => setForm((p) => ({ ...p, featured: checked === true }))}
          className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
        />
        <Label className="text-zinc-300 cursor-pointer">Featured vehicle</Label>
      </div>
    </div>
  );
}

function ImagesTab({ form, setForm }: TabProps) {
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
            p.images.includes(dataUrl) ? p : { ...p, images: [...p.images, dataUrl] }
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
    setForm((p) => ({ ...p, images: [url, ...p.images.filter((i) => i !== url)] }));
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
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Gallery Images</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />

        {form.images.length > 0 ? (
          <div className="space-y-4">
            <div className="group relative rounded-lg overflow-hidden border-2 border-orange/50 aspect-video bg-white/5 max-w-lg">
              <img src={form.images[0]} alt="Main vehicle image" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-orange text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                Main
              </span>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeImage(form.images[0])} className="text-red-400 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {form.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {form.images.slice(1).map((url, idx) => (
                  <div key={idx} className="group relative rounded-md overflow-hidden border border-white/10 aspect-video bg-white/5">
                    <img src={url} alt="Vehicle" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => setMainImage(url)} className="text-white hover:bg-white/20" title="Set as main">
                        <Star className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeImage(url)} className="text-red-400 hover:bg-red-500/20" title="Remove">
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
              className="border-white/10 text-zinc-300 hover:bg-white/5 gap-2"
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
            className="border-2 border-dashed border-white/10 hover:border-orange/30 rounded-lg p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">Click to browse or drag & drop</p>
            <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WEBP up to 10MB each</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceTab({ form, setForm }: TabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Vehicle Price</h3>

      <Field label="Regular Price (£)">
        <Input
          type="number"
          placeholder="35000"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-sm"
        />
      </Field>

      <Field label="Sale Price (£)">
        <Input
          type="number"
          placeholder="30000"
          value={form.salePrice}
          onChange={(e) => setForm((p) => ({ ...p, salePrice: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-sm"
        />
      </Field>

      <Field label="Monthly Price (£)">
        <Input
          type="number"
          placeholder="600"
          value={form.monthlyPrice}
          onChange={(e) => setForm((p) => ({ ...p, monthlyPrice: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-sm"
        />
      </Field>

      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          checked={form.enableRequestPrice}
          onCheckedChange={(checked) => setForm((p) => ({ ...p, enableRequestPrice: checked === true }))}
          className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
        />
        <Label className="text-zinc-300 cursor-pointer">Enable request price form for this vehicle</Label>
      </div>
    </div>
  );
}

function TaxLabelTab({ form, setForm }: TabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Tax Label</h3>
      <Field label="Tax Label Text">
        <Input
          placeholder="e.g. Tax included, VAT qualifying"
          value={form.taxLabel}
          onChange={(e) => setForm((p) => ({ ...p, taxLabel: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-md"
        />
      </Field>
      <p className="text-xs text-zinc-500">This label will be displayed on the vehicle listing alongside the price.</p>
    </div>
  );
}

function FuelEfficiencyTab({ form, setForm }: TabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Fuel Efficiency</h3>
      <Field label="Fuel Economy">
        <Input
          placeholder="e.g. 45 mpg combined"
          value={form.fuelEconomy}
          onChange={(e) => setForm((p) => ({ ...p, fuelEconomy: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-md"
        />
      </Field>
      <p className="text-xs text-zinc-500">Enter the fuel economy / efficiency rating for this vehicle.</p>
    </div>
  );
}

function BrochureTab({ form, setForm }: TabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Brochure Upload</h3>
      <Field label="Brochure URL">
        <Input
          placeholder="https://example.com/brochure.pdf"
          value={form.brochureUrl}
          onChange={(e) => setForm((p) => ({ ...p, brochureUrl: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-lg"
        />
      </Field>
      <p className="text-xs text-zinc-500">Provide a URL to the vehicle brochure PDF or document.</p>
    </div>
  );
}

function VideoTab({ form, setForm }: TabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Video</h3>
      <Field label="Video URL">
        <Input
          placeholder="https://youtube.com/watch?v=..."
          value={form.videoUrl}
          onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 max-w-lg"
        />
      </Field>
      <p className="text-xs text-zinc-500">Paste a YouTube or Vimeo URL for this vehicle&apos;s video walkthrough.</p>
    </div>
  );
}

function StatusTab({ form, setForm }: TabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Vehicle Status</h3>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="vehicleStatus"
            checked={form.vehicleStatus === "sold"}
            onChange={() => setForm((p) => ({ ...p, vehicleStatus: "sold" }))}
            className="accent-orange w-4 h-4"
          />
          <span className="text-zinc-300 text-sm">Sold</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="vehicleStatus"
            checked={form.vehicleStatus === "unsold"}
            onChange={() => setForm((p) => ({ ...p, vehicleStatus: "unsold" }))}
            className="accent-orange w-4 h-4"
          />
          <span className="text-zinc-300 text-sm">Unsold</span>
        </label>
      </div>
    </div>
  );
}

function VehicleTabsTab({ form, setForm }: TabProps) {
  const [innerTab, setInnerTab] = useState<"overview" | "features" | "specs" | "general" | "location">("overview");

  const innerTabs = [
    { id: "overview" as const, label: "Vehicle Overview" },
    { id: "features" as const, label: "Features & Options" },
    { id: "specs" as const, label: "Technical Specifications" },
    { id: "general" as const, label: "General Information" },
    { id: "location" as const, label: "Vehicle Location" },
  ];

  const fieldMap = {
    overview: { key: "vehicleOverview" as const, placeholder: "Enter vehicle overview description..." },
    features: { key: "featuresAndOptions" as const, placeholder: "List features and options..." },
    specs: { key: "technicalSpecs" as const, placeholder: "Enter technical specifications..." },
    general: { key: "generalInfo" as const, placeholder: "Enter general information..." },
    location: { key: "vehicleLocation" as const, placeholder: "Enter vehicle location details..." },
  };

  const current = fieldMap[innerTab];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Vehicle Tabs</h3>

      <div className="flex gap-1 border-b border-white/10 pb-0">
        {innerTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setInnerTab(tab.id)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
              innerTab === tab.id
                ? "text-orange border-orange"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        <Label className="text-zinc-300 text-sm mb-2 block">{innerTabs.find((t) => t.id === innerTab)?.label}</Label>
        <textarea
          value={form[current.key]}
          onChange={(e) => setForm((p) => ({ ...p, [current.key]: e.target.value }))}
          placeholder={current.placeholder}
          rows={10}
          className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange/50 resize-y"
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-zinc-300 text-sm">{label}</Label>
      {children}
    </div>
  );
}

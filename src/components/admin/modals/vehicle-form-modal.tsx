"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  type FieldErrors,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/redux/hooks";
import {
  selectMakes,
  selectBodyTypes,
  selectFuelTypes,
  selectTransmissions,
  selectConditions,
  selectDrivetrains,
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
import { FieldError, FormError, fieldAria } from "@/components/forms/form-errors";
import { Star, Trash2, Upload } from "lucide-react";
import type { Vehicle } from "@/redux/vehicles/vehiclesIndex";
import {
  toInt,
  vehicleSchema,
  VEHICLE_FIELD_TABS,
  type VehicleFormValues,
  type VehicleSchemaContext,
} from "@/lib/validation";

/** Form values — validated by `vehicleSchema` (src/lib/validation/vehicle.schema.ts). */
export type VehicleForm = VehicleFormValues;

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
    year: toInt(form.year) ?? 0,
    mileage: toInt(form.mileage) ?? 0,
    price: toInt(form.price) ?? 0,
    salePrice: toInt(form.salePrice),
    monthlyPrice: toInt(form.monthlyPrice) ?? 0,
    fuelType: form.fuelType as Vehicle["fuelType"],
    transmission: form.transmission as Vehicle["transmission"],
    horsepower: toInt(form.horsepower) ?? 0,
    bodyType: form.bodyType,
    image: form.images[0] ?? "",
    images: form.images,
    featured: form.featured,
    stockNumber: form.stockNumber || undefined,
    vinNumber: form.vinNumber ? form.vinNumber.toUpperCase() : undefined,
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
    variant: v.variant ?? "",
    year: String(v.year),
    mileage: String(v.mileage),
    price: String(v.price),
    salePrice: v.salePrice ? String(v.salePrice) : "",
    monthlyPrice: v.monthlyPrice ? String(v.monthlyPrice) : "",
    fuelType: v.fuelType,
    transmission: v.transmission,
    horsepower: v.horsepower ? String(v.horsepower) : "",
    bodyType: v.bodyType ?? "",
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
  mode: "add" | "edit";
  /** Values the form is reset to each time the modal opens. */
  initialValues: VehicleForm;
  /** Called with validated values. Throw (or reject) with a message to show it in the form. */
  onSubmit: (values: VehicleForm) => Promise<void>;
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
type FieldName = keyof VehicleForm;

/** Tabs that currently contain at least one invalid field. */
function tabsWithErrors(errors: FieldErrors<VehicleForm>): Set<string> {
  return new Set(
    (Object.keys(errors) as FieldName[])
      .filter((k) => k in VEHICLE_FIELD_TABS)
      .map((k) => VEHICLE_FIELD_TABS[k]),
  );
}

export function VehicleFormModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: VehicleFormModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("attributes");

  // Settings lists → schema context, so choices are validated like the API does.
  const makes = useAppSelector(selectMakes);
  const fuelTypes = useAppSelector(selectFuelTypes);
  const transmissions = useAppSelector(selectTransmissions);
  const bodyTypes = useAppSelector(selectBodyTypes);
  const conditions = useAppSelector(selectConditions);
  const drivetrains = useAppSelector(selectDrivetrains);

  const methods = useForm<VehicleForm, VehicleSchemaContext>({
    resolver: yupResolver(vehicleSchema),
    defaultValues: initialValues,
    context: { makes, fuelTypes, transmissions, bodyTypes, conditions, drivetrains },
    mode: "onTouched",
  });
  const {
    reset,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = methods;

  // Back to the first tab whenever the modal re-opens (adjusted during render,
  // not in an effect, to avoid an extra render pass).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setActiveTab("attributes");
  }

  // Fresh form values every time the modal opens.
  useEffect(() => {
    if (open) reset(initialValues);
  }, [open, initialValues, reset]);

  const submit = handleSubmit(
    async (values) => {
      try {
        await onSubmit(values);
      } catch (err) {
        setError("root.server", { message: String(err) });
      }
    },
    // Invalid: jump to the first tab with an error and focus that field.
    (formErrors) => {
      const first = (Object.keys(formErrors) as FieldName[]).find((k) => k in VEHICLE_FIELD_TABS);
      if (!first) return;
      setActiveTab(VEHICLE_FIELD_TABS[first] as TabId);
      setTimeout(() => {
        try {
          setFocus(first);
        } catch {}
      }, 0);
    },
  );

  const errorTabs = tabsWithErrors(errors);
  const errorCount = Object.keys(errors).filter((k) => k !== "root").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-surface border-white/10 max-h-[90vh] overflow-hidden p-0">
        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex flex-col min-h-0">
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
                    className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-sm transition-colors ${
                      activeTab === tab.id
                        ? "text-orange bg-orange/10 border-r-2 border-orange font-medium"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                    {errorTabs.has(tab.id) && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-red-400"
                        aria-label="has errors"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Right content area */}
              <div
                className="flex-1 overflow-y-auto px-6 py-4"
                style={{ maxHeight: "calc(90vh - 180px)" }}
              >
                <TabContent activeTab={activeTab} />
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-white/10 sm:items-center">
              <div className="mr-auto">
                {errors.root?.server ? (
                  <FormError message={errors.root.server.message} />
                ) : errorCount > 0 ? (
                  <p role="alert" className="text-sm text-red-400">
                    Please fix {errorCount} field{errorCount === 1 ? "" : "s"} marked in red.
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-white/10 text-zinc-300"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="btn-gradient">
                {isSubmitting ? "Saving…" : mode === "add" ? "Add Vehicle" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case "attributes":
      return <AttributesTab />;
    case "images":
      return <ImagesTab />;
    case "price":
      return <PriceTab />;
    case "tax":
      return <TaxLabelTab />;
    case "fuel":
      return <FuelEfficiencyTab />;
    case "brochure":
      return <BrochureTab />;
    case "video":
      return <VideoTab />;
    case "status":
      return <StatusTab />;
    case "tabs":
      return <VehicleTabsTab />;
  }
}

// ── Field building blocks (read errors from the form context) ─────────────

const inputClass = "h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600";

function useFieldError(name: FieldName) {
  const {
    formState: { errors },
  } = useFormContext<VehicleForm>();
  return errors[name]?.message as string | undefined;
}

function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name: FieldName;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  const error = useFieldError(name);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`vf-${name}`} className="text-zinc-300 text-sm">
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
      <FieldError id={`vf-${name}-error`} message={error} />
    </div>
  );
}

function TextField({
  name,
  label,
  placeholder,
  type = "text",
  inputMode,
  className = "",
  hint,
}: {
  name: FieldName;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  hint?: React.ReactNode;
}) {
  const { register } = useFormContext<VehicleForm>();
  const error = useFieldError(name);
  return (
    <Field label={label} name={name} hint={hint}>
      <Input
        id={`vf-${name}`}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        {...register(name)}
        {...fieldAria(`vf-${name}`, error)}
        className={`${inputClass} ${className}`}
      />
    </Field>
  );
}

/** Whole-number field: text input with a numeric keypad (no browser spinners/locale quirks). */
function NumberField(props: Omit<Parameters<typeof TextField>[0], "type" | "inputMode">) {
  return <TextField {...props} inputMode="numeric" />;
}

function SelectField({
  name,
  label,
  options,
  placeholder = "Select",
}: {
  name: FieldName;
  label: string;
  options: readonly string[];
  placeholder?: string;
}) {
  const { control } = useFormContext<VehicleForm>();
  const error = useFieldError(name);
  return (
    <Field label={label} name={name}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={(field.value as string) ?? ""}
            onValueChange={(val) => {
              field.onChange(val ?? "");
              field.onBlur();
            }}
          >
            <SelectTrigger
              id={`vf-${name}`}
              ref={field.ref}
              {...fieldAria(`vf-${name}`, error)}
              className="w-full h-9 bg-white/5 border-white/10 text-white"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}

function CheckboxField({ name, label }: { name: "featured" | "enableRequestPrice"; label: string }) {
  const { control } = useFormContext<VehicleForm>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id={`vf-${name}`}
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
          />
          <Label htmlFor={`vf-${name}`} className="text-zinc-300 cursor-pointer">
            {label}
          </Label>
        </div>
      )}
    />
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────

function AttributesTab() {
  const makes = useAppSelector(selectMakes);
  const bodyTypes = useAppSelector(selectBodyTypes);
  const fuelTypes = useAppSelector(selectFuelTypes);
  const transmissions = useAppSelector(selectTransmissions);
  const conditions = useAppSelector(selectConditions);
  const drivetrains = useAppSelector(selectDrivetrains);

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Core Attributes</h3>

      <div className="grid grid-cols-2 gap-4">
        <NumberField name="year" label="Year *" placeholder="2024" />
        <SelectField name="make" label="Make *" options={makes} placeholder="Select make" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="model" label="Model *" placeholder="e.g. 3 Series" />
        <TextField name="stockNumber" label="Stock Number" placeholder="e.g. STK-001" />
      </div>

      <TextField
        name="vinNumber"
        label="VIN Number"
        placeholder="Enter VIN number"
        className="uppercase"
        hint="We recommend that you provide VIN Number. VIN Number is used as a unique entity in import process."
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField name="trim" label="Trim" placeholder="e.g. M Sport" />
        <TextField name="variant" label="Variant" placeholder="e.g. 330i M Sport" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField name="condition" label="Condition" options={conditions} />
        <SelectField name="transmission" label="Transmission *" options={transmissions} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="engineSize" label="Engine" placeholder="e.g. 2.0L Turbo" />
        <SelectField name="drivetrain" label="Drivetrain" options={drivetrains} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField name="fuelType" label="Fuel Type *" options={fuelTypes} />
        <SelectField name="bodyType" label="Body Type" options={bodyTypes} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <NumberField name="mileage" label="Mileage *" placeholder="15000" />
        <TextField name="exteriorColor" label="Exterior Color" placeholder="e.g. Mineral White" />
        <TextField name="interiorColor" label="Interior Color" placeholder="e.g. Black Leather" />
      </div>

      <div className="max-w-[200px]">
        <NumberField name="horsepower" label="Horsepower" placeholder="250" />
      </div>

      <CheckboxField name="featured" label="Featured vehicle" />
    </div>
  );
}

/** Matches the backend upload filter (uploads.controller.ts). */
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function ImagesTab() {
  const { watch, getValues, setValue, setError, clearErrors } = useFormContext<VehicleForm>();
  const images = watch("images");
  const error = useFieldError("images");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setImages = useCallback(
    (next: string[]) => setValue("images", next, { shouldDirty: true, shouldValidate: true }),
    [setValue],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const rejected: string[] = [];
      Array.from(files).forEach((file) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          rejected.push(`${file.name} (type not supported)`);
          return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          rejected.push(`${file.name} (over 8 MB)`);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const current = getValues("images");
          if (!current.includes(dataUrl)) setImages([...current, dataUrl]);
        };
        reader.readAsDataURL(file);
      });
      if (rejected.length) {
        setError("images", { type: "file", message: `Not added: ${rejected.join(", ")}` });
      } else {
        clearErrors("images");
      }
    },
    [getValues, setImages, setError, clearErrors],
  );

  const removeImage = (url: string) => setImages(getValues("images").filter((i) => i !== url));
  const setMainImage = (url: string) =>
    setImages([url, ...getValues("images").filter((i) => i !== url)]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
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
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {images.length > 0 ? (
          <div className="space-y-4">
            <div className="group relative rounded-lg overflow-hidden border-2 border-orange/50 aspect-video bg-white/5 max-w-lg">
              <img src={images[0]} alt="Main vehicle image" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-orange text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                Main
              </span>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeImage(images[0])} className="text-red-400 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(1).map((url, idx) => (
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
            <p className="text-xs text-zinc-600 mt-1">JPG, PNG, WEBP or AVIF up to 8MB each</p>
          </div>
        )}
        <FieldError message={error} />
      </div>
    </div>
  );
}

function PriceTab() {
  return (
    <div className="space-y-5 max-w-sm">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Vehicle Price</h3>
      <NumberField name="price" label="Regular Price (£) *" placeholder="35000" />
      <NumberField name="salePrice" label="Sale Price (£)" placeholder="30000" />
      <NumberField name="monthlyPrice" label="Monthly Price (£)" placeholder="600" />
      <CheckboxField name="enableRequestPrice" label="Enable request price form for this vehicle" />
    </div>
  );
}

function TaxLabelTab() {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Tax Label</h3>
      <TextField
        name="taxLabel"
        label="Tax Label Text"
        placeholder="e.g. Tax included, VAT qualifying"
        className="max-w-md"
        hint="This label will be displayed on the vehicle listing alongside the price."
      />
    </div>
  );
}

function FuelEfficiencyTab() {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Fuel Efficiency</h3>
      <TextField
        name="fuelEconomy"
        label="Fuel Economy"
        placeholder="e.g. 45 mpg combined"
        className="max-w-md"
        hint="Enter the fuel economy / efficiency rating for this vehicle."
      />
    </div>
  );
}

function BrochureTab() {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Brochure Upload</h3>
      <TextField
        name="brochureUrl"
        label="Brochure URL"
        type="url"
        placeholder="https://example.com/brochure.pdf"
        className="max-w-lg"
        hint="Provide a URL to the vehicle brochure PDF or document."
      />
    </div>
  );
}

function VideoTab() {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Video</h3>
      <TextField
        name="videoUrl"
        label="Video URL"
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        className="max-w-lg"
        hint={<>Paste a YouTube or Vimeo URL for this vehicle&apos;s video walkthrough.</>}
      />
    </div>
  );
}

function StatusTab() {
  const { register } = useFormContext<VehicleForm>();
  const error = useFieldError("vehicleStatus");
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Vehicle Status</h3>
      <div className="flex items-center gap-6" role="radiogroup" aria-label="Vehicle status">
        {(["sold", "unsold"] as const).map((value) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={value}
              {...register("vehicleStatus")}
              className="accent-orange w-4 h-4"
            />
            <span className="text-zinc-300 text-sm capitalize">{value}</span>
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  );
}

function VehicleTabsTab() {
  const { register, formState } = useFormContext<VehicleForm>();
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
  const error = formState.errors[current.key]?.message;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Vehicle Tabs</h3>

      <div className="flex gap-1 border-b border-white/10 pb-0">
        {innerTabs.map((tab) => {
          const hasError = !!formState.errors[fieldMap[tab.id].key];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setInnerTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                innerTab === tab.id
                  ? "text-orange border-orange"
                  : hasError
                    ? "text-red-400 border-transparent"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        <Label htmlFor={`vf-${current.key}`} className="text-zinc-300 text-sm mb-2 block">
          {innerTabs.find((t) => t.id === innerTab)?.label}
        </Label>
        <textarea
          key={current.key}
          id={`vf-${current.key}`}
          {...register(current.key)}
          {...fieldAria(`vf-${current.key}`, error)}
          placeholder={current.placeholder}
          rows={10}
          className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange/50 resize-y aria-invalid:border-red-500/60"
        />
        <FieldError id={`vf-${current.key}-error`} message={error} />
      </div>
    </div>
  );
}

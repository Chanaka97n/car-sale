"use client";

import { useState, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "@/redux/vehicles/vehiclesIndex";
import type { Vehicle } from "@/redux/vehicles/vehiclesIndex";
import {
  selectMakes,
  selectBodyTypes,
  selectFuelTypes,
  selectTransmissions,
} from "@/redux/settings/settingsIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge, getFuelVariant, getTransmissionVariant } from "@/components/admin/status-badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Car, Search, ChevronLeft, ChevronRight, Star, Upload } from "lucide-react";

type VehicleForm = {
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

const emptyForm: VehicleForm = {
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

function formToVehicle(form: VehicleForm): Omit<Vehicle, "id"> {
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

function vehicleToForm(v: Vehicle): VehicleForm {
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

const PAGE_SIZE = 10;

export default function AdminVehiclesPage() {
  const dispatch = useAppDispatch();
  const allVehicles = useAppSelector((s) => s.vehicles.allVehicles);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  const filtered = allVehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.variant.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = () => {
    dispatch(addVehicle(formToVehicle(form)));
    setForm(emptyForm);
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!editingVehicle) return;
    dispatch(updateVehicle({ id: editingVehicle.id, ...formToVehicle(form) }));
    setEditOpen(false);
    setEditingVehicle(null);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    if (!deletingVehicle) return;
    dispatch(deleteVehicle(deletingVehicle.id));
    setDeleteOpen(false);
    setDeletingVehicle(null);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setForm(vehicleToForm(vehicle));
    setEditOpen(true);
  };

  const openDelete = (vehicle: Vehicle) => {
    setDeletingVehicle(vehicle);
    setDeleteOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase flex items-center gap-3">
            <Car className="w-6 h-6 text-orange" />
            Vehicle Management
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {allVehicles.length} vehicles in stock
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: allVehicles.length, color: "text-orange" },
          { label: "Featured", value: allVehicles.filter((v) => v.featured).length, color: "text-emerald-400" },
          { label: "Petrol/Diesel", value: allVehicles.filter((v) => v.fuelType === "Petrol" || v.fuelType === "Diesel").length, color: "text-blue-400" },
          { label: "Electric/Hybrid", value: allVehicles.filter((v) => v.fuelType === "Electric" || v.fuelType === "Hybrid" || v.fuelType === "Plug-in Hybrid").length, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-white/5 p-4">
            <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-white/5">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <Button
            onClick={() => { setForm(emptyForm); setAddOpen(true); }}
            className="btn-gradient gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-400">Vehicle</TableHead>
              <TableHead className="text-zinc-400">Year</TableHead>
              <TableHead className="text-zinc-400">Price</TableHead>
              <TableHead className="text-zinc-400 hidden md:table-cell">Mileage</TableHead>
              <TableHead className="text-zinc-400 hidden lg:table-cell">Fuel</TableHead>
              <TableHead className="text-zinc-400 hidden lg:table-cell">Transmission</TableHead>
              <TableHead className="text-zinc-400 hidden md:table-cell">Featured</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((vehicle) => (
              <TableRow key={vehicle.id} className="border-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-md bg-white/5 overflow-hidden shrink-0">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                        {vehicle.variant}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300">{vehicle.year}</TableCell>
                <TableCell className="text-white font-medium">
                  £{vehicle.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-zinc-400 hidden md:table-cell">
                  {vehicle.mileage.toLocaleString()} mi
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <StatusBadge variant={getFuelVariant(vehicle.fuelType)}>{vehicle.fuelType}</StatusBadge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <StatusBadge variant={getTransmissionVariant(vehicle.transmission)}>{vehicle.transmission}</StatusBadge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {vehicle.featured && (
                    <StatusBadge variant="featured" dot>Featured</StatusBadge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(vehicle)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openDelete(vehicle)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow className="border-white/5">
                <TableCell colSpan={8} className="text-center text-zinc-500 py-8">
                  No vehicles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <p className="text-sm text-zinc-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="border-white/10 text-zinc-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => setPage(p)}
                  className={
                    p === page
                      ? "bg-orange text-white"
                      : "border-white/10 text-zinc-400"
                  }
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="border-white/10 text-zinc-400"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-4xl bg-surface border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Vehicle</DialogTitle>
            <DialogDescription>Add a new vehicle to the inventory.</DialogDescription>
          </DialogHeader>
          <VehicleFormFields form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-white/10 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleAdd} className="btn-gradient">
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-4xl bg-surface border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle details.</DialogDescription>
          </DialogHeader>
          <VehicleFormFields form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-white/10 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleEdit} className="btn-gradient">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {deletingVehicle?.make} {deletingVehicle?.model} {deletingVehicle?.variant}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-white/10 text-zinc-300">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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

  const handleFiles = useCallback((files: FileList | null) => {
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
  }, [setForm]);

  const removeImage = (url: string) => {
    setForm((p) => ({ ...p, images: p.images.filter((i) => i !== url) }));
  };

  const setMainImage = (url: string) => {
    setForm((p) => ({
      ...p,
      images: [url, ...p.images.filter((i) => i !== url)],
    }));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

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
            <Select value={form.make} onValueChange={(val) => setForm((p) => ({ ...p, make: val ?? "" }))}>
              <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Model</Label>
            <Input
              placeholder="e.g. 3 Series"
              value={form.model}
              onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300">Variant</Label>
          <Input
            placeholder="e.g. 330i M Sport"
            value={form.variant}
            onChange={(e) => setForm((p) => ({ ...p, variant: e.target.value }))}
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
              onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Price (£)</Label>
            <Input
              type="number"
              placeholder="35000"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Monthly (£)</Label>
            <Input
              type="number"
              placeholder="600"
              value={form.monthlyPrice}
              onChange={(e) => setForm((p) => ({ ...p, monthlyPrice: e.target.value }))}
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
              onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))}
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Horsepower</Label>
            <Input
              type="number"
              placeholder="250"
              value={form.horsepower}
              onChange={(e) => setForm((p) => ({ ...p, horsepower: e.target.value }))}
              className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label className="text-zinc-300">Fuel Type</Label>
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
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Transmission</Label>
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
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Body Type</Label>
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
          <Label className="text-zinc-300 cursor-pointer">Featured vehicle</Label>
        </div>
      </div>

      {/* Right — Image picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-300">Vehicle Images</Label>
          {form.images.length > 0 && (
            <span className="text-xs text-zinc-500">{form.images.length} image{form.images.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />

        {form.images.length > 0 ? (
          <div className="space-y-2">
            {/* Main image preview */}
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

            {/* Thumbnail grid */}
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

            {/* Add more button */}
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
            <p className="text-sm text-zinc-400 font-medium">Click to browse or drag & drop</p>
            <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WEBP up to 10MB each</p>
          </div>
        )}
      </div>
    </div>
  );
}

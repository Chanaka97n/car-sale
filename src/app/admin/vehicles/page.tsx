"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  fetchAllVehicles,
  selectAllVehicles,
  selectAllVehiclesStatus,
  setVehicleStatus,
} from "@/redux/vehicles/vehiclesIndex";
import { AdminAlert } from "@/components/admin/admin-alert";
import { Switch } from "@/components/ui/switch";
import { SoldOutOverlay } from "@/components/vehicles/sold-out-stamp";
import type { Vehicle } from "@/redux/vehicles/vehiclesIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, getFuelVariant, getTransmissionVariant } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Car, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal";
import {
  VehicleFormModal,
  emptyVehicleForm,
  formToVehicle,
  vehicleToForm,
  type VehicleForm,
} from "@/components/admin/modals/vehicle-form-modal";

const PAGE_SIZE = 10;

export default function AdminVehiclesPage() {
  const dispatch = useAppDispatch();
  const allVehicles = useAppSelector(selectAllVehicles);
  const loadStatus = useAppSelector(selectAllVehiclesStatus);
  const loadError = useAppSelector((s) => s.vehicles.allError);

  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllVehicles({ force: true }));
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  /** What the add/edit modal starts from (validation + state live in react-hook-form). */
  const [initialValues, setInitialValues] = useState<VehicleForm>(emptyVehicleForm);
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

  // Rejections propagate to the modal, which shows them as a form-level error.
  const handleAdd = async (values: VehicleForm) => {
    await dispatch(addVehicle(formToVehicle(values))).unwrap();
    setAddOpen(false);
  };

  const handleEdit = async (values: VehicleForm) => {
    if (!editingVehicle) return;
    await dispatch(updateVehicle({ id: editingVehicle.id, ...formToVehicle(values) })).unwrap();
    setEditOpen(false);
    setEditingVehicle(null);
  };

  const handleDelete = async () => {
    if (!deletingVehicle) return;
    setPageError(null);
    try {
      await dispatch(deleteVehicle(deletingVehicle.id)).unwrap();
    } catch (message) {
      setPageError(String(message));
    }
    setDeleteOpen(false);
    setDeletingVehicle(null);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setInitialValues(vehicleToForm(vehicle));
    setEditOpen(true);
  };

  /** Rows whose sold-out switch is waiting on the API. */
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  /** PATCH /admin/vehicles/:id/status/:status — the store updates every list on success. */
  const toggleSold = async (vehicle: Vehicle, sold: boolean) => {
    setPageError(null);
    setTogglingIds((s) => new Set(s).add(vehicle.id));
    try {
      await dispatch(setVehicleStatus({ id: vehicle.id, status: sold ? "sold" : "unsold" })).unwrap();
    } catch (message) {
      setPageError(`Couldn't update ${vehicle.make} ${vehicle.model}: ${String(message)}`);
    } finally {
      setTogglingIds((s) => {
        const next = new Set(s);
        next.delete(vehicle.id);
        return next;
      });
    }
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: allVehicles.length, color: "text-orange" },
          { label: "Featured", value: allVehicles.filter((v) => v.featured).length, color: "text-emerald-400" },
          { label: "Petrol/Diesel", value: allVehicles.filter((v) => v.fuelType === "Petrol" || v.fuelType === "Diesel").length, color: "text-blue-400" },
          { label: "Electric/Hybrid", value: allVehicles.filter((v) => v.fuelType === "Electric" || v.fuelType === "Hybrid" || v.fuelType === "Plug-in Hybrid").length, color: "text-purple-400" },
          { label: "Sold Out", value: allVehicles.filter((v) => v.vehicleStatus === "sold").length, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-white/5 p-4">
            <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {(pageError || loadError) && (
        <AdminAlert onDismiss={pageError ? () => setPageError(null) : undefined}>
          {pageError ?? loadError}
        </AdminAlert>
      )}

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
            onClick={() => { setInitialValues(emptyVehicleForm); setAddOpen(true); }}
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
              <TableHead className="text-zinc-400">Sold Out</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((vehicle) => {
              const sold = vehicle.vehicleStatus === "sold";
              const toggling = togglingIds.has(vehicle.id);
              return (
              <TableRow key={vehicle.id} className={`border-white/5 ${sold ? "bg-red-500/[0.03]" : ""}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-11 rounded-md bg-white/5 overflow-hidden shrink-0">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className={`w-full h-full object-cover ${sold ? "grayscale-[60%]" : ""}`}
                      />
                      <SoldOutOverlay sold={sold} size="xs" />
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
                <TableCell>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={sold}
                      disabled={toggling}
                      onCheckedChange={(checked) => toggleSold(vehicle, checked)}
                      aria-label={`Mark ${vehicle.make} ${vehicle.model} as sold out`}
                      className="data-checked:bg-red-600"
                    />
                    <span className={`text-xs font-medium ${sold ? "text-red-400" : "text-zinc-500"}`}>
                      {toggling ? "Saving…" : sold ? "Sold out" : "Available"}
                    </span>
                  </label>
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
              );
            })}
            {paginated.length === 0 && (
              <TableRow className="border-white/5">
                <TableCell colSpan={9} className="text-center text-zinc-500 py-8">
                  {loadStatus === "loading" ? "Loading vehicles…" : "No vehicles found"}
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

      <VehicleFormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        initialValues={initialValues}
        onSubmit={handleAdd}
        mode="add"
      />

      <VehicleFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={initialValues}
        onSubmit={handleEdit}
        mode="edit"
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Vehicle"
        itemName={
          deletingVehicle
            ? `${deletingVehicle.make} ${deletingVehicle.model} ${deletingVehicle.variant}`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}

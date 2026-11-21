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
  selectVehicleMutationStatus,
} from "@/redux/vehicles/vehiclesIndex";
import { AdminAlert } from "@/components/admin/admin-alert";
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
  const saving = useAppSelector(selectVehicleMutationStatus) === "loading";

  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllVehicles({ force: true }));
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<VehicleForm>(emptyVehicleForm);
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

  const handleAdd = async () => {
    setFormError(null);
    try {
      await dispatch(addVehicle(formToVehicle(form))).unwrap();
      setForm(emptyVehicleForm);
      setAddOpen(false);
    } catch (message) {
      setFormError(String(message));
    }
  };

  const handleEdit = async () => {
    if (!editingVehicle) return;
    setFormError(null);
    try {
      await dispatch(updateVehicle({ id: editingVehicle.id, ...formToVehicle(form) })).unwrap();
      setEditOpen(false);
      setEditingVehicle(null);
      setForm(emptyVehicleForm);
    } catch (message) {
      setFormError(String(message));
    }
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
    setFormError(null);
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
            onClick={() => { setForm(emptyVehicleForm); setFormError(null); setAddOpen(true); }}
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
        form={form}
        setForm={setForm}
        onSubmit={handleAdd}
        mode="add"
        saving={saving}
        error={formError}
      />

      <VehicleFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        form={form}
        setForm={setForm}
        onSubmit={handleEdit}
        mode="edit"
        saving={saving}
        error={formError}
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

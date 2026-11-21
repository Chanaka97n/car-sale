"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  type Enquiry,
  type EnquiryStatus,
} from "@/redux/admin/enquiries/enquiriesIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal";
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Car,
  Calendar,
  CreditCard,
  ArrowRightLeft,
  HelpCircle,
} from "lucide-react";

const PAGE_SIZE = 10;

const TYPE_CONFIG: Record<
  string,
  { label: string; variant: string; icon: typeof MessageSquare }
> = {
  vehicle: { label: "Vehicle", variant: "info", icon: Car },
  "test-drive": { label: "Test Drive", variant: "featured", icon: Calendar },
  finance: { label: "Finance", variant: "success", icon: CreditCard },
  "part-exchange": {
    label: "Part Exchange",
    variant: "warning",
    icon: ArrowRightLeft,
  },
  general: { label: "General", variant: "default", icon: HelpCircle },
};

const STATUS_VARIANTS: Record<EnquiryStatus, string> = {
  new: "info",
  "in-progress": "warning",
  resolved: "success",
  archived: "default",
};

export default function AdminEnquiriesPage() {
  const dispatch = useAppDispatch();
  const enquiries = useAppSelector(selectEnquiries);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState<Enquiry | null>(null);

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q) ||
      (e.vehicleLabel ?? "").toLowerCase().includes(q);
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const statCounts = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    inProgress: enquiries.filter((e) => e.status === "in-progress").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };

  const handleDelete = () => {
    if (!deletingEnquiry) return;
    dispatch(deleteEnquiry(deletingEnquiry.id));
    setDeletingEnquiry(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-orange" />
            Enquiries
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {enquiries.length} total enquiries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: statCounts.total, color: "text-orange" },
          { label: "New", value: statCounts.new, color: "text-blue-400" },
          {
            label: "In Progress",
            value: statCounts.inProgress,
            color: "text-yellow-400",
          },
          {
            label: "Resolved",
            value: statCounts.resolved,
            color: "text-emerald-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-white/5 p-4"
          >
            <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/5">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(val) => {
              setFilterType(val ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="test-drive">Test Drive</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="part-exchange">Part Exchange</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(val) => {
              setFilterStatus(val ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] h-9 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Type</TableHead>
              <TableHead className="text-zinc-400 hidden md:table-cell">
                Vehicle
              </TableHead>
              <TableHead className="text-zinc-400 hidden lg:table-cell">
                Email
              </TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 hidden md:table-cell">
                Date
              </TableHead>
              <TableHead className="text-zinc-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((enq) => {
              const cfg = TYPE_CONFIG[enq.type] ?? TYPE_CONFIG.general;
              return (
                <TableRow key={enq.id} className="border-white/5">
                  <TableCell>
                    <p className="font-medium text-white text-sm">
                      {enq.firstName} {enq.lastName}
                    </p>
                    <p className="text-xs text-zinc-500">{enq.phone}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={cfg.variant as any}>
                      {cfg.label}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {enq.vehicleLabel ? (
                      <span className="text-sm text-zinc-300 truncate max-w-[180px] block">
                        {enq.vehicleLabel}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-zinc-400 text-sm">
                    {enq.email}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={enq.status}
                      onValueChange={(val) =>
                        dispatch(
                          updateEnquiryStatus({
                            id: enq.id,
                            status: val as EnquiryStatus,
                          })
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px] h-7 text-xs bg-transparent border-white/10">
                        <StatusBadge
                          variant={STATUS_VARIANTS[enq.status] as any}
                          dot
                        >
                          {enq.status}
                        </StatusBadge>
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-white/10">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-500 text-sm">
                    {enq.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewingEnquiry(enq)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeletingEnquiry(enq)}
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
                <TableCell
                  colSpan={7}
                  className="text-center text-zinc-500 py-8"
                >
                  No enquiries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <p className="text-sm text-zinc-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
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
                )
              )}
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

      {/* View Enquiry Modal */}
      <Dialog
        open={!!viewingEnquiry}
        onOpenChange={(open) => !open && setViewingEnquiry(null)}
      >
        {viewingEnquiry && (
          <DialogContent className="sm:max-w-lg bg-surface border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Enquiry Details</DialogTitle>
              <DialogDescription>
                {TYPE_CONFIG[viewingEnquiry.type]?.label ?? "General"} enquiry
                from {viewingEnquiry.firstName} {viewingEnquiry.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <Detail
                  label="Name"
                  value={`${viewingEnquiry.firstName} ${viewingEnquiry.lastName}`}
                />
                <Detail label="Email" value={viewingEnquiry.email} />
                <Detail label="Phone" value={viewingEnquiry.phone} />
                <Detail label="Date" value={viewingEnquiry.createdAt} />
              </div>
              {viewingEnquiry.vehicleLabel && (
                <Detail label="Vehicle" value={viewingEnquiry.vehicleLabel} />
              )}
              {viewingEnquiry.preferredDate && (
                <div className="grid grid-cols-2 gap-4">
                  <Detail
                    label="Preferred Date"
                    value={viewingEnquiry.preferredDate}
                  />
                  <Detail
                    label="Preferred Time"
                    value={viewingEnquiry.preferredTime ?? "—"}
                  />
                </div>
              )}
              <Detail label="Message" value={viewingEnquiry.message} />
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-zinc-500">Status:</span>
                <Select
                  value={viewingEnquiry.status}
                  onValueChange={(val) => {
                    dispatch(
                      updateEnquiryStatus({
                        id: viewingEnquiry.id,
                        status: val as EnquiryStatus,
                      })
                    );
                    setViewingEnquiry({
                      ...viewingEnquiry,
                      status: val as EnquiryStatus,
                    });
                  }}
                >
                  <SelectTrigger className="w-[140px] h-8 bg-white/5 border-white/10 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-white/10">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewingEnquiry(null)}
                className="border-white/10 text-zinc-300"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <DeleteConfirmModal
        open={!!deletingEnquiry}
        onOpenChange={(open) => !open && setDeletingEnquiry(null)}
        title="Delete Enquiry"
        itemName={
          deletingEnquiry
            ? `enquiry from ${deletingEnquiry.firstName} ${deletingEnquiry.lastName}`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm text-zinc-200">{value}</p>
    </div>
  );
}

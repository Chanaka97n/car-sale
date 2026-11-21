"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectUsers,
  selectUsersStatus,
  selectUsersMutationStatus,
  selectTemporaryCredentials,
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  clearTemporaryCredentials,
} from "@/redux/admin/users/usersIndex";
import { AdminAlert } from "@/components/admin/admin-alert";
import type { User } from "@/redux/admin/users/usersIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, getStatusVariant } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Users, Search } from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal";
import { UserFormModal, emptyUserForm, type UserForm } from "@/components/admin/modals/user-form-modal";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loadStatus = useAppSelector(selectUsersStatus);
  const loadError = useAppSelector((s) => s.users.error);
  const saving = useAppSelector(selectUsersMutationStatus) === "loading";
  const tempCredentials = useAppSelector(selectTemporaryCredentials);

  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ force: true }));
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyUserForm);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    setFormError(null);
    try {
      await dispatch(addUser(form)).unwrap();
      setForm(emptyUserForm);
      setAddOpen(false);
    } catch (message) {
      setFormError(String(message));
    }
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    setFormError(null);
    try {
      await dispatch(updateUser({ ...editingUser, ...form })).unwrap();
      setEditOpen(false);
      setEditingUser(null);
      setForm(emptyUserForm);
    } catch (message) {
      setFormError(String(message));
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setPageError(null);
    try {
      await dispatch(deleteUser(deletingUser.id)).unwrap();
    } catch (message) {
      setPageError(String(message));
    }
    setDeleteOpen(false);
    setDeletingUser(null);
  };

  const openEdit = (user: User) => {
    setFormError(null);
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setEditOpen(true);
  };

  const openDelete = (user: User) => {
    setDeletingUser(user);
    setDeleteOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase flex items-center gap-3">
            <Users className="w-6 h-6 text-orange" />
            User Management
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {users.length} total users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: users.length, color: "text-orange" },
          { label: "Active", value: users.filter((u) => u.status === "active").length, color: "text-emerald-400" },
          { label: "Inactive", value: users.filter((u) => u.status === "inactive").length, color: "text-zinc-400" },
          { label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-white/5 p-4">
            <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {tempCredentials && (
        <AdminAlert variant="success" onDismiss={() => dispatch(clearTemporaryCredentials())}>
          User <span className="font-medium text-white">{tempCredentials.email}</span> created.
          Temporary password:{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-white select-all">
            {tempCredentials.password}
          </code>{" "}
          — share it securely; it won&apos;t be shown again.
        </AdminAlert>
      )}

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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <Button
            onClick={() => { setForm(emptyUserForm); setFormError(null); setAddOpen(true); }}
            className="btn-gradient gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Created</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="border-white/5">
                <TableCell className="font-medium text-white">{user.name}</TableCell>
                <TableCell className="text-zinc-400">{user.email}</TableCell>
                <TableCell>
                  <StatusBadge variant={getStatusVariant(user.role)}>
                    {user.role}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge variant={getStatusVariant(user.status)} dot>
                    {user.status}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-zinc-500">{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(user)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openDelete(user)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow className="border-white/5">
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  {loadStatus === "loading" ? "Loading users…" : "No users found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserFormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        form={form}
        setForm={setForm}
        onSubmit={handleAdd}
        mode="add"
        saving={saving}
        error={formError}
      />

      <UserFormModal
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
        title="Delete User"
        itemName={deletingUser?.name}
        onConfirm={handleDelete}
      />
    </div>
  );
}

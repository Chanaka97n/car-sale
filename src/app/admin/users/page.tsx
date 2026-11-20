"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectUsers, addUser, updateUser, deleteUser } from "@/redux/users/usersIndex";
import type { User } from "@/redux/users/usersIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge, getStatusVariant } from "@/components/admin/status-badge";
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
import { Plus, Pencil, Trash2, Users, Search } from "lucide-react";

type UserForm = {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
};

const emptyForm: UserForm = { name: "", email: "", role: "staff", status: "active" };

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    dispatch(addUser(form));
    setForm(emptyForm);
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!editingUser) return;
    dispatch(updateUser({ ...editingUser, ...form }));
    setEditOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    if (!deletingUser) return;
    dispatch(deleteUser(deletingUser.id));
    setDeleteOpen(false);
    setDeletingUser(null);
  };

  const openEdit = (user: User) => {
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
            onClick={() => { setForm(emptyForm); setAddOpen(true); }}
            className="bg-orange hover:bg-orange-dark text-white gap-2 shrink-0"
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
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md bg-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Add New User</DialogTitle>
            <DialogDescription>Create a new user account.</DialogDescription>
          </DialogHeader>
          <UserFormFields form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-white/10 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-orange hover:bg-orange-dark text-white">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md bg-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
            <DialogDescription>Update user details.</DialogDescription>
          </DialogHeader>
          <UserFormFields form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-white/10 text-zinc-300">
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-orange hover:bg-orange-dark text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="text-white font-medium">{deletingUser?.name}</span>? This action cannot be undone.
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

function UserFormFields({
  form,
  setForm,
}: {
  form: UserForm;
  setForm: React.Dispatch<React.SetStateAction<UserForm>>;
}) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label className="text-zinc-300">Name</Label>
        <Input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-zinc-300">Email</Label>
        <Input
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-zinc-300">Role</Label>
          <Select value={form.role} onValueChange={(val) => val && setForm((p) => ({ ...p, role: val as User["role"] }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Status</Label>
          <Select value={form.status} onValueChange={(val) => val && setForm((p) => ({ ...p, status: val as User["status"] }))}>
            <SelectTrigger className="w-full h-9 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

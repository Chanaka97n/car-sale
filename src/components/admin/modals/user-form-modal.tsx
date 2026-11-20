"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { User } from "@/redux/admin/users/usersIndex";

export type UserForm = {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
};

export const emptyUserForm: UserForm = {
  name: "",
  email: "",
  role: "staff",
  status: "active",
};

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UserForm;
  setForm: React.Dispatch<React.SetStateAction<UserForm>>;
  onSubmit: () => void;
  mode: "add" | "edit";
}

export function UserFormModal({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  mode,
}: UserFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === "add" ? "Add New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new user account."
              : "Update user details."}
          </DialogDescription>
        </DialogHeader>
        <UserFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-zinc-300"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} className="btn-gradient">
            {mode === "add" ? "Add User" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
          <Select
            value={form.role}
            onValueChange={(val) =>
              val && setForm((p) => ({ ...p, role: val as User["role"] }))
            }
          >
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
          <Select
            value={form.status}
            onValueChange={(val) =>
              val && setForm((p) => ({ ...p, status: val as User["status"] }))
            }
          >
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

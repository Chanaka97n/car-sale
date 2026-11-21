"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { FieldError, FormError, fieldAria } from "@/components/forms/form-errors";
import { userDefaults, userSchema, type UserFormValues } from "@/lib/validation";

/** Form values — validated by `userSchema` (src/lib/validation/user.schema.ts). */
export type UserForm = UserFormValues;
export const emptyUserForm: UserForm = userDefaults;

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  /** Values the form is reset to each time the modal opens. */
  initialValues: UserForm;
  /** Called with validated values. Throw (or reject) with a message to show it in the form. */
  onSubmit: (values: UserForm) => Promise<void>;
}

const ROLE_LABELS = { admin: "Admin", manager: "Manager", staff: "Staff" } as const;
const STATUS_LABELS = { active: "Active", inactive: "Inactive" } as const;

export function UserFormModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: UserFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: yupResolver(userSchema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) reset(initialValues);
  }, [open, initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      setError("root.server", { message: String(err) });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface border-white/10">
        <form onSubmit={submit} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-white">
              {mode === "add" ? "Add New User" : "Edit User"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add" ? "Create a new user account." : "Update user details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="text-zinc-300">Name</Label>
              <Input
                id="user-name"
                placeholder="Full name"
                autoComplete="name"
                {...register("name")}
                {...fieldAria("user-name", errors.name?.message)}
                className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
              />
              <FieldError id="user-name-error" message={errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email" className="text-zinc-300">Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                {...register("email")}
                {...fieldAria("user-email", errors.email?.message)}
                className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
              />
              <FieldError id="user-email-error" message={errors.email?.message} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-role" className="text-zinc-300">Role</Label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => val && field.onChange(val)}>
                      <SelectTrigger
                        id="user-role"
                        ref={field.ref}
                        {...fieldAria("user-role", errors.role?.message)}
                        className="w-full h-9 bg-white/5 border-white/10 text-white"
                      >
                        <SelectValue>{ROLE_LABELS[field.value]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-white/10">
                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError id="user-role-error" message={errors.role?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-status" className="text-zinc-300">Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => val && field.onChange(val)}>
                      <SelectTrigger
                        id="user-status"
                        ref={field.ref}
                        {...fieldAria("user-status", errors.status?.message)}
                        className="w-full h-9 bg-white/5 border-white/10 text-white"
                      >
                        <SelectValue>{STATUS_LABELS[field.value]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-white/10">
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError id="user-status-error" message={errors.status?.message} />
              </div>
            </div>
          </div>

          {mode === "add" && (
            <p className="text-xs text-zinc-500">
              A temporary password is generated and shown once after the user is created.
            </p>
          )}
          <FormError message={errors.root?.server?.message} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-zinc-300"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-gradient">
              {isSubmitting ? "Saving…" : mode === "add" ? "Add User" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

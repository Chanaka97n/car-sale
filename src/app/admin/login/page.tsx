"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, selectIsAuthenticated } from "@/redux/admin/auth/authIndex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, fieldAria } from "@/components/forms/form-errors";
import { loginDefaults, loginSchema, type LoginFormValues } from "@/lib/validation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await dispatch(login(values)).unwrap();
    } catch (message) {
      setError("root.server", { message: String(message) });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="ASA" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-white uppercase">
            Admin Panel
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in to manage your dealership
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="admin@apexselect.co.uk"
              {...register("email")}
              {...fieldAria("email", errors.email?.message)}
              className="h-10 bg-surface border-white/10 text-white placeholder:text-zinc-600"
            />
            <FieldError id="email-error" message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password")}
              {...fieldAria("password", errors.password?.message)}
              className="h-10 bg-surface border-white/10 text-white placeholder:text-zinc-600"
            />
            <FieldError id="password-error" message={errors.password?.message} />
          </div>

          <FormError message={errors.root?.server?.message} />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 btn-gradient font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-xs text-zinc-600 text-center mt-4">
            Demo: admin@apexselect.co.uk / admin123
          </p>
        </form>
      </div>
    </div>
  );
}

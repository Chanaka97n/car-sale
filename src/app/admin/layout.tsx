"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCurrentUser, selectIsAuthenticated } from "@/redux/admin/auth/authIndex";
import { fetchSettings } from "@/redux/admin/settings/settingsIndex";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Re-validate a persisted session against the API (a 401 logs out), and load
  // the dropdown lists used by the admin forms.
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchCurrentUser());
    dispatch(fetchSettings());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

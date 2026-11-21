"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectUser, logout } from "@/redux/admin/auth/authIndex";
import { fetchEnquiries, selectNewEnquiriesCount } from "@/redux/admin/enquiries/enquiriesIndex";
import type { AuthUser } from "@/redux/admin/auth/authIndex";
import {
  LayoutDashboard,
  Users,
  Car,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { useEffect, useState } from "react";

type Role = AuthUser["role"];

/** `roles` mirrors the backend's @Roles() on each admin controller. */
const navItems: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: boolean;
  roles?: Role[];
}[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare, badge: true },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  { label: "Vehicles", href: "/admin/vehicles", icon: Car },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin", "manager"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const newEnquiries = useAppSelector(selectNewEnquiriesCount);
  const [collapsed, setCollapsed] = useState(false);

  // Loads the enquiry list once so the "new" badge is accurate on every admin page.
  useEffect(() => {
    dispatch(fetchEnquiries());
  }, [dispatch]);

  const visibleNav = navItems.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/admin/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-surface h-full transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="shrink-0">
            <img src="/images/logo.png" alt="ASA" className="h-10 w-auto" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {visibleNav.map((item) => {
          const isActive = pathname === item.href;
          const badgeCount = item.badge ? newEnquiries : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-orange/10 text-orange"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {badgeCount > 0 && (
                <span className={cn(
                  "bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center",
                  collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "w-5 h-5"
                )}>
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

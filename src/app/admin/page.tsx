"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/admin/auth/authIndex";
import { selectUsers } from "@/redux/admin/users/usersIndex";
import { selectEnquiries, selectNewEnquiriesCount } from "@/redux/admin/enquiries/enquiriesIndex";
import Link from "next/link";
import {
  Car,
  Users,
  TrendingUp,
  PoundSterling,
  Fuel,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Settings,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, getFuelVariant } from "@/components/admin/status-badge";

export default function AdminDashboardPage() {
  const user = useAppSelector(selectUser);
  const allVehicles = useAppSelector((s) => s.vehicles.allVehicles);
  const users = useAppSelector(selectUsers);
  const enquiries = useAppSelector(selectEnquiries);
  const newEnquiriesCount = useAppSelector(selectNewEnquiriesCount);

  const totalValue = allVehicles.reduce((sum, v) => sum + v.price, 0);
  const avgPrice = allVehicles.length > 0 ? totalValue / allVehicles.length : 0;
  const featuredCount = allVehicles.filter((v) => v.featured).length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  const fuelBreakdown = allVehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.fuelType] = (acc[v.fuelType] || 0) + 1;
    return acc;
  }, {});

  const makeBreakdown = allVehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + 1;
    return acc;
  }, {});
  const topMakes = Object.entries(makeBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const maxMakeCount = topMakes.length > 0 ? topMakes[0][1] : 1;

  const recentVehicles = [...allVehicles]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5);

  const stats = [
    {
      label: "Total Vehicles",
      value: allVehicles.length,
      icon: Car,
      trend: "+3 this month",
      trendUp: true,
      color: "text-orange",
      bgColor: "bg-orange/10",
      borderColor: "border-orange/20",
    },
    {
      label: "Stock Value",
      value: `£${(totalValue / 1000).toFixed(0)}k`,
      icon: PoundSterling,
      trend: `Avg £${(avgPrice / 1000).toFixed(1)}k`,
      trendUp: true,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: TrendingUp,
      trend: `${allVehicles.length > 0 ? ((featuredCount / allVehicles.length) * 100).toFixed(0) : 0}% of stock`,
      trendUp: true,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Enquiries",
      value: enquiries.length,
      icon: MessageSquare,
      trend: `${newEnquiriesCount} new`,
      trendUp: newEnquiriesCount > 0,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  const fuelIcons: Record<string, typeof Fuel> = {
    Petrol: Fuel,
    Diesel: Fuel,
    Hybrid: Zap,
    "Plug-in Hybrid": Zap,
    Electric: Zap,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Welcome back, {user?.name ?? "Admin"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/vehicles">
            <Button size="default" className="btn-gradient gap-2">
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="default" className="border-white/10 text-zinc-300 hover:bg-white/5 gap-2">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group bg-surface rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl border ${stat.borderColor} ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? "text-emerald-400" : "text-zinc-500"}`}>
                {stat.trendUp ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.trend}
              </div>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory by Make */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Inventory by Make</h2>
                <p className="text-xs text-zinc-500">{Object.keys(makeBreakdown).length} brands in stock</p>
              </div>
            </div>
            <Link href="/admin/vehicles" className="text-xs text-orange hover:text-orange-light transition-colors">
              View all
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {topMakes.map(([make, count]) => (
              <div key={make} className="flex items-center gap-3">
                <span className="text-sm text-zinc-300 w-28 truncate">{make}</span>
                <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-orange/30 to-orange/10 rounded-lg transition-all duration-500"
                    style={{ width: `${(count / maxMakeCount) * 100}%` }}
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-xs font-medium text-zinc-300">
                    {count} vehicle{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 w-10 text-right">
                  {allVehicles.length > 0 ? ((count / allVehicles.length) * 100).toFixed(0) : 0}%
                </span>
              </div>
            ))}
            {topMakes.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">No vehicles in stock</p>
            )}
          </div>
        </div>

        {/* Fuel Type Breakdown */}
        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Fuel Types</h2>
              <p className="text-xs text-zinc-500">Stock distribution</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(fuelBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([fuel, count]) => {
                const FuelIcon = fuelIcons[fuel] || Fuel;
                return (
                  <div key={fuel} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <FuelIcon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-300">{fuel}</p>
                        <p className="text-xs text-zinc-600">{count} vehicle{count !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <StatusBadge variant={getFuelVariant(fuel)}>{fuel}</StatusBadge>
                  </div>
                );
              })}
            {Object.keys(fuelBreakdown).length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Vehicles</h2>
              <p className="text-xs text-zinc-500">Latest additions to inventory</p>
            </div>
          </div>
          <Link href="/admin/vehicles" className="text-xs text-orange hover:text-orange-light transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {recentVehicles.map((v) => (
            <div key={v.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-16 h-11 rounded-lg bg-white/5 overflow-hidden shrink-0">
                {v.image ? (
                  <img src={v.image} alt={v.make} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-zinc-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {v.make} {v.model} {v.variant}
                </p>
                <p className="text-xs text-zinc-500">
                  {v.year} &middot; {v.mileage.toLocaleString()} mi &middot; {v.fuelType}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-white">£{v.price.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">£{v.monthlyPrice}/mo</p>
              </div>
              {v.featured && (
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-orange bg-orange/10 border border-orange/20 px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
          ))}
          {recentVehicles.length === 0 && (
            <div className="px-5 py-8 text-center">
              <Car className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No vehicles in inventory</p>
              <Link href="/admin/vehicles">
                <Button size="default" className="mt-3 btn-gradient gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Vehicle
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/enquiries" className="group bg-surface rounded-xl border border-white/5 hover:border-purple-500/20 p-5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors relative">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              {newEnquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {newEnquiriesCount}
                </span>
              )}
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 ml-auto group-hover:text-purple-400 transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Enquiries</h3>
          <p className="text-xs text-zinc-500 mt-1">View and manage customer enquiries</p>
        </Link>
        <Link href="/admin/vehicles" className="group bg-surface rounded-xl border border-white/5 hover:border-orange/20 p-5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center group-hover:bg-orange/20 transition-colors">
              <Car className="w-5 h-5 text-orange" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 ml-auto group-hover:text-orange transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Manage Vehicles</h3>
          <p className="text-xs text-zinc-500 mt-1">Add, edit, or remove vehicles from stock</p>
        </Link>
        <Link href="/admin/users" className="group bg-surface rounded-xl border border-white/5 hover:border-blue-500/20 p-5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 ml-auto group-hover:text-blue-400 transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Manage Users</h3>
          <p className="text-xs text-zinc-500 mt-1">Control team access and permissions</p>
        </Link>
        <Link href="/admin/settings" className="group bg-surface rounded-xl border border-white/5 hover:border-emerald-500/20 p-5 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 ml-auto group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-white">Settings</h3>
          <p className="text-xs text-zinc-500 mt-1">Configure dropdown options and preferences</p>
        </Link>
      </div>
    </div>
  );
}

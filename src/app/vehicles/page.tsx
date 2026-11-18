"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Fuel,
  Gauge,
  Zap,
  ArrowRight,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { vehicles, makes, bodyTypes, fuelTypes } from "@/lib/data";
import Link from "next/link";

function FilterSidebar({ className = "" }: { className?: string }) {
  const [priceRange, setPriceRange] = useState([5000, 100000]);

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Search */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Search Keywords
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="e.g. BMW 3 Series, SUV"
              className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Make */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Make</h3>
          <Select>
            <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Any Make" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              {makes.map((make) => (
                <SelectItem key={make} value={make.toLowerCase()}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Price Range
          </h3>
          <Slider
            value={priceRange}
            onValueChange={(val) => setPriceRange(Array.isArray(val) ? val : [val])}
            min={0}
            max={150000}
            step={1000}
            className="mb-4"
          />
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>&pound;{priceRange[0].toLocaleString()}</span>
            <span className="text-zinc-600">to</span>
            <span>&pound;{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Year */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Year</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white text-sm">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {[2020, 2021, 2022, 2023, 2024].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white text-sm">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {[2020, 2021, 2022, 2023, 2024].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Fuel Type</h3>
          <div className="space-y-2.5">
            {fuelTypes.map((fuel) => (
              <div key={fuel} className="flex items-center gap-2.5">
                <Checkbox
                  id={fuel}
                  className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                />
                <Label
                  htmlFor={fuel}
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  {fuel}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Transmission
          </h3>
          <div className="space-y-2.5">
            {["Automatic", "Manual"].map((trans) => (
              <div key={trans} className="flex items-center gap-2.5">
                <Checkbox
                  id={trans}
                  className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                />
                <Label
                  htmlFor={trans}
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  {trans}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Body Type */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Body Type</h3>
          <div className="space-y-2.5">
            {bodyTypes.map((type) => (
              <div key={type} className="flex items-center gap-2.5">
                <Checkbox
                  id={type}
                  className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                />
                <Label
                  htmlFor={type}
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-orange uppercase tracking-wider font-medium">
              Premium Used Vehicles
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase text-white mt-2">
              Browse Our <span className="text-gradient">Stock</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-lg">
              A curated selection of quality, hand-picked used vehicles. Find
              your next car with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-orange" />
                    <span className="text-sm font-semibold text-white uppercase">
                      Filter Vehicles
                    </span>
                  </div>
                  <button className="text-xs text-orange hover:text-orange-light transition-colors">
                    Reset All
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-zinc-400">
                    <span className="text-white font-semibold">
                      {vehicles.length}
                    </span>{" "}
                    Vehicles
                  </p>

                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-white/5 gap-2 px-4 py-1.5 text-sm">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-80 bg-background border-r border-white/10 overflow-y-auto"
                    >
                      <div className="pt-8 pb-4">
                        <h2 className="text-lg font-semibold text-white mb-6">
                          Filter Vehicles
                        </h2>
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-3">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-44 rounded-xl bg-white/5 border-white/10 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-white/10">
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="mileage">Lowest Mileage</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="hidden sm:flex items-center rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-orange text-white" : "text-zinc-400 hover:text-white"}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-orange text-white" : "text-zinc-400 hover:text-white"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Vehicle Grid */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {vehicles.map((vehicle, i) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group bg-surface rounded-2xl border border-white/5 overflow-hidden hover:border-orange/20 transition-all duration-500 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`relative overflow-hidden ${viewMode === "list" ? "w-72 shrink-0" : "aspect-[16/10]"}`}
                    >
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-orange hover:border-orange/30 transition-all">
                        <Heart className="w-4 h-4" />
                      </button>
                      <Badge className="absolute top-3 left-3 bg-orange/90 text-white border-0 rounded-full text-xs">
                        {vehicle.year}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1">
                      <h3 className="font-semibold text-white text-lg">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {vehicle.variant}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5" />
                          {vehicle.fuelType}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5" />
                          {vehicle.transmission}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          {vehicle.horsepower} hp
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500 mt-2">
                        {vehicle.mileage.toLocaleString()} miles
                      </p>

                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-xl font-bold text-white">
                            &pound;{vehicle.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-zinc-500">
                            &pound;{vehicle.monthlyPrice}/mo*
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-white/10 text-white hover:bg-white/5 text-xs"
                          >
                            Details
                          </Button>
                          <Link href="/contact">
                            <Button
                              size="sm"
                              className="rounded-full bg-orange hover:bg-orange-dark text-white text-xs gap-1"
                            >
                              Enquire
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      page === 1
                        ? "bg-orange text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-zinc-500 mx-2">...</span>
                <button className="w-10 h-10 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10">
                  33
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

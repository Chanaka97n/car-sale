"use client";

import { Suspense, useEffect, useRef, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Fuel,
  Gauge,
  Zap,
  ArrowRight,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
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
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSearch,
  setMake,
  setPriceRange,
  setYearFrom,
  setYearTo,
  toggleFuelType,
  toggleTransmission,
  toggleBodyType,
  setSortBy,
  setPage,
  setFiltersFromParams,
  resetFilters,
  fetchVehicles,
  selectFilters,
  selectPaginatedVehicles,
  selectCurrentPage,
  selectTotalPages,
  selectTotalCount,
  selectPageSize,
  selectStatus,
  initialFilters,
  MAKES,
  BODY_TYPES,
  FUEL_TYPES,
  type VehicleFilters,
} from "@/redux/vehicles/vehiclesIndex";

// --- Search params helpers ---

function filtersToSearchParams(
  filters: VehicleFilters,
  page: number,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.make) params.set("make", filters.make);
  if (
    filters.priceRange[0] !== initialFilters.priceRange[0] ||
    filters.priceRange[1] !== initialFilters.priceRange[1]
  ) {
    params.set("priceMin", filters.priceRange[0].toString());
    params.set("priceMax", filters.priceRange[1].toString());
  }
  if (filters.yearFrom) params.set("yearFrom", filters.yearFrom);
  if (filters.yearTo) params.set("yearTo", filters.yearTo);
  if (filters.fuelTypes.length > 0)
    params.set("fuel", filters.fuelTypes.join(","));
  if (filters.transmissions.length > 0)
    params.set("transmission", filters.transmissions.join(","));
  if (filters.bodyTypes.length > 0)
    params.set("body", filters.bodyTypes.join(","));
  if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
  if (page > 1) params.set("page", page.toString());

  return params;
}

function searchParamsToFilters(params: URLSearchParams): Partial<VehicleFilters> & { page?: number } {
  const result: Partial<VehicleFilters> & { page?: number } = {};

  const search = params.get("search");
  if (search) result.search = search;

  const make = params.get("make");
  if (make) result.make = make;

  const priceMin = params.get("priceMin");
  const priceMax = params.get("priceMax");
  if (priceMin || priceMax) {
    result.priceRange = [
      priceMin ? parseInt(priceMin) : initialFilters.priceRange[0],
      priceMax ? parseInt(priceMax) : initialFilters.priceRange[1],
    ];
  }

  const yearFrom = params.get("yearFrom");
  if (yearFrom) result.yearFrom = yearFrom;

  const yearTo = params.get("yearTo");
  if (yearTo) result.yearTo = yearTo;

  const fuel = params.get("fuel");
  if (fuel) result.fuelTypes = fuel.split(",");

  const transmission = params.get("transmission");
  if (transmission) result.transmissions = transmission.split(",");

  const body = params.get("body");
  if (body) result.bodyTypes = body.split(",");

  const sort = params.get("sort") as VehicleFilters["sortBy"] | null;
  if (sort) result.sortBy = sort;

  const page = params.get("page");
  if (page) result.page = parseInt(page);

  return result;
}

// --- Filter sidebar ---

function FilterSidebar({ className = "" }: { className?: string }) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

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
              value={filters.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Make */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Make</h3>
          <Select
            value={filters.make || "all"}
            onValueChange={(val) =>
              dispatch(setMake(!val || val === "all" ? "" : val))
            }
          >
            <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Any Make" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-white/10">
              <SelectItem value="all">Any Make</SelectItem>
              {MAKES.map((make) => (
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
            value={filters.priceRange as unknown as number[]}
            onValueChange={(val) =>
              dispatch(
                setPriceRange(
                  Array.isArray(val) ? [val[0], val[1]] : [val, val],
                ),
              )
            }
            min={0}
            max={150000}
            step={1000}
            className="mb-4"
          />
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>&pound;{filters.priceRange[0].toLocaleString()}</span>
            <span className="text-zinc-600">to</span>
            <span>&pound;{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Year */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Year</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={filters.yearFrom || "any"}
              onValueChange={(val) =>
                dispatch(setYearFrom(!val || val === "any" ? "" : val))
              }
            >
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white text-sm">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                <SelectItem value="any">Any</SelectItem>
                {[2020, 2021, 2022, 2023, 2024].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.yearTo || "any"}
              onValueChange={(val) =>
                dispatch(setYearTo(!val || val === "any" ? "" : val))
              }
            >
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white text-sm">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                <SelectItem value="any">Any</SelectItem>
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
            {FUEL_TYPES.map((fuel) => (
              <div key={fuel} className="flex items-center gap-2.5">
                <Checkbox
                  id={`fuel-${fuel}`}
                  checked={filters.fuelTypes.includes(fuel)}
                  onCheckedChange={() => dispatch(toggleFuelType(fuel))}
                  className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                />
                <Label
                  htmlFor={`fuel-${fuel}`}
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
                  id={`trans-${trans}`}
                  checked={filters.transmissions.includes(trans)}
                  onCheckedChange={() => dispatch(toggleTransmission(trans))}
                  className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                />
                <Label
                  htmlFor={`trans-${trans}`}
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
            {BODY_TYPES.map((type) => (
              <div key={type} className="flex items-center gap-2.5">
                <Checkbox
                  id={`body-${type}`}
                  checked={filters.bodyTypes.includes(type)}
                  onCheckedChange={() => dispatch(toggleBodyType(type))}
                  className="border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                />
                <Label
                  htmlFor={`body-${type}`}
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

// --- Main page ---

export default function VehiclesPage() {
  return (
    <Suspense>
      <VehiclesContent />
    </Suspense>
  );
}

function VehiclesContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useAppSelector(selectFilters);
  const vehicles = useAppSelector(selectPaginatedVehicles);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const totalCount = useAppSelector(selectTotalCount);
  const pageSize = useAppSelector(selectPageSize);
  const status = useAppSelector(selectStatus);

  // Hydrate filters from URL on mount
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const parsed = searchParamsToFilters(searchParams);
    if (Object.keys(parsed).length > 0) {
      dispatch(setFiltersFromParams(parsed));
    }
  }, [searchParams, dispatch]);

  // Sync redux state → URL (after hydration)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = filtersToSearchParams(filters, currentPage);
    const qs = params.toString();
    const target = qs ? `/vehicles?${qs}` : "/vehicles";
    router.replace(target, { scroll: false });
  }, [filters, currentPage, router]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVehicles());
    }
  }, [status, dispatch]);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch],
  );

  // Pagination range
  const pageNumbers = (() => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  })();

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endItem = Math.min(currentPage * pageSize, totalCount);

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
                  <button
                    onClick={() => dispatch(resetFilters())}
                    className="text-xs text-orange hover:text-orange-light transition-colors"
                  >
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
                      {totalCount}
                    </span>{" "}
                    Vehicle{totalCount !== 1 ? "s" : ""}
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
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-white">
                            Filter Vehicles
                          </h2>
                          <button
                            onClick={() => dispatch(resetFilters())}
                            className="text-xs text-orange hover:text-orange-light transition-colors"
                          >
                            Reset All
                          </button>
                        </div>
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(val) => {
                      if (val)
                        dispatch(setSortBy(val as VehicleFilters["sortBy"]));
                    }}
                  >
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
              {vehicles.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-zinc-400 text-lg mb-2">
                    No vehicles match your filters
                  </p>
                  <button
                    onClick={() => dispatch(resetFilters())}
                    className="text-orange hover:text-orange-light text-sm font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
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
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className={`relative overflow-hidden block ${viewMode === "list" ? "w-72 shrink-0" : "aspect-[16/10]"}`}
                      >
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-orange/90 text-white border-0 rounded-full text-xs">
                          {vehicle.year}
                        </Badge>
                      </Link>

                      {/* Content */}
                      <div className="p-5 flex-1">
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <h3 className="font-semibold text-white text-lg hover:text-orange transition-colors">
                            {vehicle.make} {vehicle.model}
                          </h3>
                        </Link>
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
                            <Link href={`/vehicles/${vehicle.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-white/10 text-white hover:bg-white/5 text-xs"
                              >
                                Details
                              </Button>
                            </Link>
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
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="flex flex-col items-center gap-4 mt-12"
                >
                  <div className="flex items-center gap-2">
                    {/* Previous */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page numbers */}
                    {pageNumbers.map((page, idx) =>
                      page === "ellipsis" ? (
                        <span
                          key={`e-${idx}`}
                          className="w-10 h-10 flex items-center justify-center text-zinc-500"
                        >
                          &hellip;
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          aria-label={`Page ${page}`}
                          aria-current={
                            page === currentPage ? "page" : undefined
                          }
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            page === currentPage
                              ? "bg-orange text-white shadow-lg shadow-orange/25 scale-110 ring-2 ring-orange/30"
                              : "text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    {/* Next */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Page info */}
                  <p className="text-xs text-zinc-500">
                    Showing {startItem}&ndash;{endItem} of {totalCount} vehicles
                    &middot; Page {currentPage} of {totalPages}
                  </p>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

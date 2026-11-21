export interface Vehicle {
  id: string;
  /** SEO URL segment — link with `vehiclePath(vehicle)` (src/lib/vehicle-url.ts). */
  slug?: string;
  updatedAt?: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  price: number;
  salePrice?: number;
  monthlyPrice: number;
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Plug-in Hybrid" | "Electric";
  transmission: "Automatic" | "Manual";
  horsepower: number;
  bodyType: string;
  image: string;
  images?: string[];
  featured?: boolean;
  stockNumber?: string;
  vinNumber?: string;
  trim?: string;
  condition?: string;
  engineSize?: string;
  drivetrain?: string;
  fuelEconomy?: string;
  exteriorColor?: string;
  interiorColor?: string;
  doors?: number;
  seats?: number;
  topSpeed?: number;
  acceleration?: string;
  co2?: number;
  mpg?: number;
  registration?: string;
  previousOwners?: number;
  serviceHistory?: string;
  features?: string[];
  description?: string;
  taxLabel?: string;
  brochureUrl?: string;
  videoUrl?: string;
  vehicleStatus?: "sold" | "unsold";
  enableRequestPrice?: boolean;
  vehicleOverview?: string;
  featuresAndOptions?: string;
  technicalSpecs?: string;
  generalInfo?: string;
  vehicleLocation?: string;
  reviewStamps?: string[];
  colour?: string;
}

export interface VehicleFilters {
  search: string;
  make: string;
  priceRange: [number, number];
  yearFrom: string;
  yearTo: string;
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  sortBy: "newest" | "price-low" | "price-high" | "mileage";
}

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface FacetCount {
  name: string;
  count: number;
}

/** GET /vehicles/facets — data for the /vehicles filter sidebar. */
export interface VehicleFacets {
  /** Vehicles matching all current filters. */
  total: number;
  /** Bounds of the whole stock (customer price: sale price when set). */
  price: { min: number; max: number };
  year: { min: number | null; max: number | null };
  maxMileage: number;
  /** Per-option counts; each applies every other active filter but not its own. */
  makes: FacetCount[];
  fuelTypes: FacetCount[];
  transmissions: FacetCount[];
  bodyTypes: FacetCount[];
}

/** Create/update payload — `id` comes from the URL, `image` is derived from images[0] server-side. */
export type VehicleInput = Omit<Vehicle, "id" | "image"> & { image?: string };

export interface VehiclesState {
  /** Full inventory — admin pages, dashboard, contact-page vehicle picker. */
  allVehicles: Vehicle[];
  allStatus: RequestStatus;
  allError: string | null;

  /** Current page of the public /vehicles listing (filtered + sorted by the API). */
  filteredVehicles: Vehicle[];
  filters: VehicleFilters;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  status: RequestStatus;
  error: string | null;

  /** Filter sidebar bounds + counts for the current filters. */
  facets: VehicleFacets | null;
  facetsStatus: RequestStatus;

  /** Canonical query of the results currently shown — identical requests are skipped. */
  listKey: string | null;
  /** Canonical filters the current facets belong to — facets refetch only when this changes. */
  facetsKey: string | null;
  /** Query of the request in flight, so a duplicate dispatch doesn't start a second one. */
  inFlightKey: string | null;

  /** Home page featured cars. */
  featured: Vehicle[];
  featuredStatus: RequestStatus;

  /** Single vehicle + similar cars (client-side detail views). */
  selectedVehicle: Vehicle | null;
  similarVehicles: Vehicle[];
  selectedStatus: RequestStatus;

  /** Last admin create / update / delete / toggle. */
  mutationStatus: RequestStatus;
  mutationError: string | null;
}

export const initialFilters: VehicleFilters = {
  search: "",
  make: "",
  priceRange: [0, 150000],
  yearFrom: "",
  yearTo: "",
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  sortBy: "newest",
};

export const MAKES = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Range Rover",
  "Volkswagen",
  "Volvo",
  "Porsche",
  "Jaguar",
  "Land Rover",
  "Tesla",
];

export const BODY_TYPES = [
  "Saloon",
  "SUV",
  "Hatchback",
  "Estate",
  "Coupe",
  "Convertible",
];

export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Plug-in Hybrid",
  "Electric",
];

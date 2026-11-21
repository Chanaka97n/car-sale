export interface Vehicle {
  id: string;
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

export interface VehiclesState {
  allVehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  filters: VehicleFilters;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
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

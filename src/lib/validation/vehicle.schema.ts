import * as yup from "yup";
import {
  optionalInt,
  optionalText,
  optionalUrl,
  requiredInt,
  requiredText,
  toInt,
  VIN_REGEX,
} from "./common";

/**
 * Admin › Vehicles add/edit modal — backend: CreateVehicleDto.
 * Numbers are kept as strings while editing (that's what inputs produce) and
 * validated as whole numbers; `formToVehicle` converts them on submit.
 *
 * Pass resolver context `{ makes, fuelTypes, transmissions, bodyTypes }` (the admin
 * Settings lists) so choices are checked the same way the API checks them.
 */

/**
 * Next model year. Read lazily inside the test (not at module load) — reading the
 * clock while a page prerenders makes Next.js defer that page to the browser.
 */
const maxYear = () => new Date().getFullYear() + 1;

/** Resolver context: the admin Settings lists the API validates against. */
export interface VehicleSchemaContext {
  makes?: string[];
  fuelTypes?: string[];
  transmissions?: string[];
  bodyTypes?: string[];
  conditions?: string[];
  drivetrains?: string[];
}

const inList = (label: string, key: keyof VehicleSchemaContext) =>
  function (this: yup.TestContext, value: string | undefined) {
    const list = (this.options.context as VehicleSchemaContext | undefined)?.[key];
    if (!value || !list) return true;
    return list.includes(value) || this.createError({ message: `${label} is not in Settings` });
  };

export const vehicleSchema = yup.object({
  // ── Attributes tab ──
  year: requiredInt("Year", { min: 1900 }).test("max-year", function (v) {
    const max = maxYear();
    return !v || Number(v.replace(/,/g, "")) <= max || this.createError({ message: `Year must be ${max} or less` });
  }),
  make: requiredText("Make", 60).test("in-settings", "", inList("Make", "makes")),
  model: requiredText("Model", 80),
  variant: optionalText("Variant", 160),
  stockNumber: optionalText("Stock number", 40),
  vinNumber: yup
    .string()
    .trim()
    .default("")
    .test("vin", "VIN must be 11–17 letters or digits", (v) => !v || VIN_REGEX.test(v)),
  trim: optionalText("Trim", 80),
  condition: optionalText("Condition", 40).test("in-settings", "", inList("Condition", "conditions")),
  transmission: requiredText("Transmission", 40).test(
    "in-settings",
    "",
    inList("Transmission", "transmissions"),
  ),
  engineSize: optionalText("Engine", 60),
  drivetrain: optionalText("Drivetrain", 40).test(
    "in-settings",
    "",
    inList("Drivetrain", "drivetrains"),
  ),
  fuelType: requiredText("Fuel type", 40).test("in-settings", "", inList("Fuel type", "fuelTypes")),
  bodyType: optionalText("Body type", 40).test("in-settings", "", inList("Body type", "bodyTypes")),
  mileage: requiredInt("Mileage", { min: 0, max: 2_000_000 }),
  exteriorColor: optionalText("Exterior colour", 80),
  interiorColor: optionalText("Interior colour", 80),
  horsepower: optionalInt("Horsepower", { min: 0, max: 5000 }),
  featured: yup.boolean().default(false),

  // ── Images tab ──
  images: yup.array(yup.string().required()).max(30, "Up to 30 images per vehicle").default([]),

  // ── Price tab ──
  price: requiredInt("Regular price", { min: 0, max: 10_000_000 }),
  salePrice: optionalInt("Sale price", { min: 0, max: 10_000_000 }).test(
    "below-price",
    "Sale price must be lower than the regular price",
    function (v) {
      const sale = toInt(v);
      const price = toInt(this.parent.price);
      return sale === undefined || price === undefined || sale < price;
    },
  ),
  monthlyPrice: optionalInt("Monthly price", { min: 0, max: 100_000 }),
  enableRequestPrice: yup.boolean().default(false),

  // ── Other tabs ──
  taxLabel: optionalText("Tax label", 40),
  fuelEconomy: optionalText("Fuel economy", 60),
  brochureUrl: optionalUrl("Brochure URL"),
  videoUrl: optionalUrl("Video URL"),
  vehicleStatus: yup
    .mixed<"sold" | "unsold">()
    .oneOf(["sold", "unsold"], "Choose a status")
    .default("unsold")
    .required(),
  vehicleOverview: optionalText("Vehicle overview", 20_000),
  featuresAndOptions: optionalText("Features & options", 20_000),
  technicalSpecs: optionalText("Technical specifications", 20_000),
  generalInfo: optionalText("General information", 20_000),
  vehicleLocation: optionalText("Vehicle location", 200),
});

export type VehicleFormValues = yup.InferType<typeof vehicleSchema>;

/** Which modal tab each field lives on — used to jump to the first tab with an error. */
export const VEHICLE_FIELD_TABS: Record<keyof VehicleFormValues, string> = {
  year: "attributes",
  make: "attributes",
  model: "attributes",
  variant: "attributes",
  stockNumber: "attributes",
  vinNumber: "attributes",
  trim: "attributes",
  condition: "attributes",
  transmission: "attributes",
  engineSize: "attributes",
  drivetrain: "attributes",
  fuelType: "attributes",
  bodyType: "attributes",
  mileage: "attributes",
  exteriorColor: "attributes",
  interiorColor: "attributes",
  horsepower: "attributes",
  featured: "attributes",
  images: "images",
  price: "price",
  salePrice: "price",
  monthlyPrice: "price",
  enableRequestPrice: "price",
  taxLabel: "tax",
  fuelEconomy: "fuel",
  brochureUrl: "brochure",
  videoUrl: "video",
  vehicleStatus: "status",
  vehicleOverview: "tabs",
  featuresAndOptions: "tabs",
  technicalSpecs: "tabs",
  generalInfo: "tabs",
  vehicleLocation: "tabs",
};

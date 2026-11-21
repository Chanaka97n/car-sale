import * as yup from "yup";
import {
  email,
  msg,
  optionalInt,
  optionalText,
  phone,
  requiredText,
  todayIso,
  UK_REG_REGEX,
} from "./common";

/** Backend: CreateEnquiryDto */

const message = optionalText("Message", 2000);
const preferredTime = optionalText("Preferred time", 20);

/** YYYY-MM-DD, optional, not in the past. */
const preferredDate = yup
  .string()
  .default("")
  .test("format", "Choose a valid date", (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v))
  .test("future", "Choose today or a future date", (v) => !v || v >= todayIso());

// ── Contact page: Book a Test Drive ───────────────────────────────────────
export const testDriveBookingSchema = yup.object({
  vehicle: yup.string().default(""),
  preferredDate,
  time: preferredTime,
  firstName: requiredText("First name", 80),
  // Marked required (*) on the contact page.
  lastName: requiredText("Last name", 80),
  email: email(),
  phone: phone(),
  message,
  marketing: yup.boolean().default(false),
});
export type TestDriveBookingValues = yup.InferType<typeof testDriveBookingSchema>;
export const testDriveBookingDefaults: TestDriveBookingValues = {
  vehicle: "",
  preferredDate: "",
  time: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  marketing: false,
};

// ── Vehicle detail page: "Enquire about this vehicle" sidebar ─────────────
export const vehicleEnquirySchema = yup.object({
  name: requiredText("Name", 161).test(
    "first-name",
    msg.max("First name", 80),
    (v) => !v || v.trim().split(/\s+/)[0].length <= 80,
  ),
  email: email(),
  phone: phone(),
  message,
});
export type VehicleEnquiryValues = yup.InferType<typeof vehicleEnquirySchema>;
export const vehicleEnquiryDefaults: VehicleEnquiryValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

// ── Vehicle detail page: test-drive modal ─────────────────────────────────
export const testDriveSchema = yup.object({
  firstName: requiredText("First name", 80),
  lastName: optionalText("Last name", 80),
  email: email(),
  phone: phone(),
  preferredDate,
  preferredTime,
  message,
  marketingConsent: yup.boolean().default(false),
});
export type TestDriveValues = yup.InferType<typeof testDriveSchema>;
export const testDriveDefaults: TestDriveValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  marketingConsent: false,
};

// ── Part-exchange page: free valuation ────────────────────────────────────
export const PX_CONDITIONS = ["excellent", "good", "fair", "poor"] as const;

export const partExchangeSchema = yup.object({
  registration: yup
    .string()
    .trim()
    .required(msg.required("Registration number"))
    .test(
      "uk-reg",
      "Enter a valid UK registration, e.g. AB12 CDE",
      (v) => !v || UK_REG_REGEX.test(v.replace(/\s+/g, "").toUpperCase()),
    ),
  mileage: optionalInt("Mileage", { min: 0, max: 999_999 }),
  condition: yup
    .string()
    .default("")
    .test("condition", "Choose a condition", (v) => !v || (PX_CONDITIONS as readonly string[]).includes(v)),
  name: requiredText("Name", 161),
  phone: phone(),
});
export type PartExchangeValues = yup.InferType<typeof partExchangeSchema>;
export const partExchangeDefaults: PartExchangeValues = {
  registration: "",
  mileage: "",
  condition: "",
  name: "",
  phone: "",
};

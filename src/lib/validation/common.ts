import * as yup from "yup";

/**
 * Shared Yup building blocks. Rules mirror the car-sale-backend DTOs
 * (class-validator), so a form that passes here is accepted by the API.
 */

// ── Patterns (same as the backend) ─────────────────────────────────────────

/** Backend: CreateEnquiryDto.phone */
export const PHONE_REGEX = /^[+0-9 ()-]{7,30}$/;
/** UK registration after removing spaces — backend: CreateEnquiryDto.pxRegistration */
export const UK_REG_REGEX = /^[A-Z0-9]{2,8}$/;
/** 11–17 letters/digits — backend: CreateVehicleDto.vinNumber (Length 11..17) */
export const VIN_REGEX = /^[A-Z0-9]{11,17}$/i;

// ── Messages ───────────────────────────────────────────────────────────────

export const msg = {
  required: (label: string) => `${label} is required`,
  max: (label: string, n: number) => `${label} must be ${n} characters or fewer`,
  min: (label: string, n: number) => `${label} must be at least ${n} characters`,
  email: "Enter a valid email address",
  phone: "Enter a valid phone number (digits, spaces, + ( ) -)",
  url: "Enter a valid URL starting with http:// or https://",
  wholeNumber: (label: string) => `${label} must be a whole number`,
  minValue: (label: string, n: number) => `${label} must be at least ${fmt(n)}`,
  maxValue: (label: string, n: number) => `${label} must be ${fmt(n)} or less`,
};

/** Thousands separators only for large values (so years read "1900", not "1,900"). */
function fmt(n: number) {
  return n >= 10_000 ? n.toLocaleString("en-GB") : String(n);
}

// ── Field helpers ──────────────────────────────────────────────────────────

/** Trimmed required text with a max length. */
export const requiredText = (label: string, max: number) =>
  yup.string().trim().required(msg.required(label)).max(max, msg.max(label, max));

/** Trimmed optional text with a max length ('' allowed). */
export const optionalText = (label: string, max: number) =>
  yup.string().trim().max(max, msg.max(label, max)).default("");

export const email = (label = "Email") =>
  yup.string().trim().required(msg.required(label)).email(msg.email).max(255, msg.max(label, 255));

export const optionalEmail = () =>
  yup.string().trim().email(msg.email).max(255, msg.max("Email", 255)).default("");

export const phone = (label = "Phone number") =>
  yup.string().trim().required(msg.required(label)).matches(PHONE_REGEX, msg.phone);

/** Optional http(s) URL ('' allowed). */
export const optionalUrl = (label: string) =>
  yup
    .string()
    .trim()
    .default("")
    .test("url", msg.url, (v) => !v || /^https?:\/\/\S+\.\S+/i.test(v))
    .max(500, msg.max(label, 500));

interface IntOptions {
  min?: number;
  max?: number;
}

/**
 * Number typed into an <input> (kept as a string in the form state).
 * Accepts "45,000" style separators; must be a whole number within range.
 */
function intString(label: string, required: boolean, { min, max }: IntOptions = {}) {
  let schema = yup.string().trim().default("");
  schema = required ? schema.required(msg.required(label)) : schema;
  return schema
    // Sign allowed here so "-5" reports the min rule rather than "not a whole number".
    .test("int", msg.wholeNumber(label), (v) => !v || /^-?\d+$/.test(v.replace(/,/g, "")))
    .test(
      "min",
      msg.minValue(label, min ?? 0),
      (v) => !v || min === undefined || Number(v.replace(/,/g, "")) >= min,
    )
    .test(
      "max",
      msg.maxValue(label, max ?? 0),
      (v) => !v || max === undefined || Number(v.replace(/,/g, "")) <= max,
    );
}

export const requiredInt = (label: string, opts?: IntOptions) => intString(label, true, opts);
export const optionalInt = (label: string, opts?: IntOptions) => intString(label, false, opts);

/** Parses an intString value ('' → undefined). */
export function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Local calendar date as YYYY-MM-DD (avoids the UTC shift of toISOString). */
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

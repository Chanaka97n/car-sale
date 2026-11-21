import type { Vehicle } from "@/redux/vehicles/vehiclesTypes";

/**
 * "Enquire" deep links: `/vehicles/{id}?enquire=<intent>` opens that vehicle's
 * page with the enquiry form pre-filled for this specific ad.
 *
 *   vehicle    → general enquiry about the car (default "Enquire" button)
 *   price      → price request (vehicles with "request price" enabled)
 *   test-drive → opens the test-drive booking modal
 */
export const ENQUIRY_PARAM = "enquire";

export const ENQUIRY_INTENTS = ["vehicle", "price", "test-drive"] as const;
export type EnquiryIntent = (typeof ENQUIRY_INTENTS)[number];

export function parseEnquiryIntent(value: string | null | undefined): EnquiryIntent | null {
  return (ENQUIRY_INTENTS as readonly string[]).includes(value ?? "")
    ? (value as EnquiryIntent)
    : null;
}

/** Which intent a vehicle's main "Enquire" button should use. */
export function defaultIntentFor(vehicle: Pick<Vehicle, "enableRequestPrice">): EnquiryIntent {
  return vehicle.enableRequestPrice ? "price" : "vehicle";
}

/** Link to a vehicle page with the enquiry pre-filled. */
export function vehicleEnquiryHref(vehicleId: string, intent: EnquiryIntent = "vehicle"): string {
  return `/vehicles/${encodeURIComponent(vehicleId)}?${ENQUIRY_PARAM}=${intent}`;
}

type AdFields = Pick<
  Vehicle,
  "year" | "make" | "model" | "variant" | "price" | "salePrice" | "stockNumber" | "registration"
>;

/** e.g. "2023 Mercedes-Benz E-Class E300 AMG Line Premium" */
export function vehicleTitle(v: AdFields): string {
  return [v.year, v.make, v.model, v.variant].filter(Boolean).join(" ");
}

/** e.g. " (Stock STK-001, Reg 2023 (73), listed at £44,990)" — whatever the ad has. */
function adReference(v: AdFields, { withPrice }: { withPrice: boolean }): string {
  const price = v.salePrice || v.price;
  const parts = [
    v.stockNumber && `Stock ${v.stockNumber}`,
    v.registration && `Reg ${v.registration}`,
    withPrice && price > 0 && `listed at £${price.toLocaleString("en-GB")}`,
  ].filter(Boolean);
  return parts.length ? ` (${parts.join(", ")})` : "";
}

/** Pre-filled message for the enquiry form, specific to this ad. */
export function enquiryMessage(v: AdFields, intent: EnquiryIntent): string {
  const title = vehicleTitle(v);
  switch (intent) {
    case "price":
      return `Hi, could you send me your best price for the ${title}${adReference(v, { withPrice: false })}? Thanks.`;
    case "test-drive":
      return `Hi, I'd like to book a test drive in the ${title}${adReference(v, { withPrice: false })}.`;
    case "vehicle":
    default:
      return `Hi, I'm interested in the ${title}${adReference(v, { withPrice: true })}. Is it still available?`;
  }
}

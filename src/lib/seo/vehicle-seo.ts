import type { Metadata } from "next";
import type { Vehicle } from "@/redux/vehicles/vehiclesTypes";
import { vehicleTitle } from "@/lib/enquiry-intent";
import { vehiclePath } from "@/lib/vehicle-url";
import { CURRENCY, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/site";

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

/** What the customer pays: sale price when set. */
export function customerPrice(v: Pick<Vehicle, "price" | "salePrice">): number {
  return v.salePrice || v.price;
}

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** <title>: "2023 Mercedes-Benz E-Class E300 AMG Line Premium – £44,990" (prefixed "SOLD –" when sold). */
export function vehicleSeoTitle(v: Vehicle): string {
  const sold = v.vehicleStatus === "sold";
  const price = customerPrice(v);
  const title = vehicleTitle(v);
  if (sold) return `SOLD – ${title}`;
  return price > 0 && !v.enableRequestPrice ? `${title} – ${gbp(price)}` : title;
}

/**
 * ~155-char meta description with the facts people search on (mileage, fuel,
 * gearbox, price, finance), falling back to the overview text.
 */
export function vehicleSeoDescription(v: Vehicle): string {
  const sold = v.vehicleStatus === "sold";
  const facts = [
    `${v.mileage.toLocaleString("en-GB")} miles`,
    v.fuelType,
    v.transmission,
    v.bodyType,
    v.horsepower ? `${v.horsepower} hp` : null,
    v.exteriorColor || v.colour,
  ].filter(Boolean);
  const price = customerPrice(v);
  const pricePart = sold
    ? "This vehicle has now been sold — browse similar stock"
    : v.enableRequestPrice || !price
      ? "Request our best price"
      : `${gbp(price)}${v.monthlyPrice ? ` or ${gbp(v.monthlyPrice)}/month` : ""}`;
  const base = `Used ${vehicleTitle(v)} for sale: ${facts.join(", ")}. ${pricePart} at ${SITE_NAME}.`;
  const description = base.length > 160 ? `${base.slice(0, 157).replace(/\s+\S*$/, "")}…` : base;
  return description;
}

/** Next.js Metadata for /vehicles/[slug]: canonical (no query params), Open Graph, Twitter. */
export function vehicleMetadata(v: Vehicle): Metadata {
  const title = vehicleSeoTitle(v);
  const description = vehicleSeoDescription(v);
  const url = vehiclePath(v);
  const images = (v.images?.length ? v.images : [v.image]).filter(Boolean).slice(0, 4);

  return {
    title,
    description,
    // ?enquire=… and other params point at the same content — one canonical URL.
    alternates: { canonical: url },
    keywords: [
      `used ${v.make} ${v.model}`,
      `${v.make} ${v.model} for sale`,
      `${v.year} ${v.make} ${v.model}`,
      `used ${v.make}`,
      `${v.bodyType} for sale`,
      `${v.fuelType} ${v.bodyType}`,
    ].filter((k) => !/undefined|null/.test(k)),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url,
      title,
      description,
      images: images.map((src) => ({ url: src, alt: vehicleTitle(v) })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.slice(0, 1),
    },
  };
}

/** schema.org Car + Offer (Google vehicle listing / product rich results). */
export function vehicleJsonLd(v: Vehicle) {
  const url = absoluteUrl(vehiclePath(v));
  const images = (v.images?.length ? v.images : [v.image]).filter(Boolean).map(absoluteUrl);
  const isNew = v.condition?.toLowerCase() === "new";
  const price = customerPrice(v);

  return {
    "@context": "https://schema.org",
    "@type": "Car",
    "@id": `${url}#vehicle`,
    name: vehicleTitle(v),
    url,
    image: images,
    description: v.vehicleOverview || v.description || vehicleSeoDescription(v),
    brand: { "@type": "Brand", name: v.make },
    manufacturer: { "@type": "Organization", name: v.make },
    model: v.model,
    vehicleConfiguration: v.variant || undefined,
    vehicleModelDate: String(v.year),
    bodyType: v.bodyType || undefined,
    fuelType: v.fuelType,
    vehicleTransmission: v.transmission,
    driveWheelConfiguration: v.drivetrain || undefined,
    color: v.exteriorColor || v.colour || undefined,
    vehicleInteriorColor: v.interiorColor || undefined,
    vehicleIdentificationNumber: v.vinNumber || undefined,
    sku: v.stockNumber || undefined,
    numberOfDoors: v.doors || undefined,
    seatingCapacity: v.seats || undefined,
    numberOfPreviousOwners: v.previousOwners ?? undefined,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "SMI" },
    vehicleEngine:
      v.engineSize || v.horsepower
        ? {
            "@type": "EngineSpecification",
            name: v.engineSize || undefined,
            enginePower: v.horsepower
              ? { "@type": "QuantitativeValue", value: v.horsepower, unitCode: "BHP" }
              : undefined,
          }
        : undefined,
    itemCondition: isNew ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    offers:
      price > 0
        ? {
            "@type": "Offer",
            url,
            price,
            priceCurrency: CURRENCY,
            availability:
              v.vehicleStatus === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            itemCondition: isNew
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
            seller: { "@type": "AutoDealer", name: SITE_NAME, url: SITE_URL },
          }
        : undefined,
  };
}

/** Home › Vehicles › {make} › {vehicle} breadcrumb trail. */
export function vehicleBreadcrumbJsonLd(v: Vehicle) {
  const items = [
    { name: "Home", url: SITE_URL },
    { name: "Vehicles", url: absoluteUrl("/vehicles") },
    { name: v.make, url: absoluteUrl(`/vehicles?make=${encodeURIComponent(v.make.toLowerCase())}`) },
    { name: vehicleTitle(v), url: absoluteUrl(vehiclePath(v)) },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Safe to drop into <script type="application/ld+json"> (escapes "<" against injection). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data, (_k, value) => (value === undefined ? undefined : value)).replace(
    /</g,
    "\\u003c",
  );
}

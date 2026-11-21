import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { VehicleDetail } from "@/components/vehicles/vehicle-detail";
import {
  getPrerenderVehicleSlugs,
  getSimilarVehicles,
  getVehicleBySlug,
} from "@/lib/api/vehicles-server";
import {
  jsonLdString,
  vehicleBreadcrumbJsonLd,
  vehicleJsonLd,
  vehicleMetadata,
} from "@/lib/seo/vehicle-seo";
import { vehiclePath } from "@/lib/vehicle-url";

type Params = Promise<{ slug: string }>;

/**
 * SEO URL: /vehicles/{year-make-model-variant-idcode}.
 * Old /vehicles/{uuid} links are 308-redirected to this by src/proxy.ts.
 *
 * Cache Components requires at least one param. Popular cars are prerendered at
 * build; any other slug is rendered on first visit and then cached.
 */
export async function generateStaticParams() {
  const slugs = await getPrerenderVehicleSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "placeholder" }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) {
    return { title: "Vehicle not found", robots: { index: false, follow: true } };
  }
  return vehicleMetadata(vehicle);
}

async function VehicleContent({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  // Renamed vehicle (old slug) → canonical URL.
  if (vehicle.slug && vehicle.slug !== slug) permanentRedirect(vehiclePath(vehicle));

  const related = await getSimilarVehicles(vehicle.id);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(vehicleJsonLd(vehicle)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(vehicleBreadcrumbJsonLd(vehicle)) }}
      />
      <VehicleDetail vehicle={vehicle} related={related} />
    </>
  );
}

function VehicleSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24" aria-busy="true">
      <div className="h-6 w-48 rounded bg-white/5 animate-pulse mb-6" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 aspect-[16/10] rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

export default function VehicleDetailPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<VehicleSkeleton />}>
      <VehicleContent params={params} />
    </Suspense>
  );
}

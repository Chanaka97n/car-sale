import { Suspense } from "react";
import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/vehicles/vehicle-detail";
import {
  getPrerenderVehicleIds,
  getSimilarVehicles,
  getVehicle,
} from "@/lib/api/vehicles-server";

type Params = Promise<{ id: string }>;

/**
 * Cache Components requires at least one param. Popular cars are prerendered at
 * build; any other id is rendered on first visit and then cached.
 */
export async function generateStaticParams() {
  const ids = await getPrerenderVehicleIds();
  return ids.length ? ids.map((id) => ({ id })) : [{ id: "placeholder" }];
}

async function VehicleContent({ params }: { params: Params }) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const related = await getSimilarVehicles(id);
  return <VehicleDetail vehicle={vehicle} related={related} />;
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

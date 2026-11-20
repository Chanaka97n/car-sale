import { notFound } from "next/navigation";
import { vehicles } from "@/lib/data";
import { VehicleDetail } from "@/components/vehicles/vehicle-detail";

export async function generateStaticParams() {
  return vehicles.map((v) => ({ id: v.id }));
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    notFound();
  }

  const related = vehicles
    .filter((v) => v.id !== vehicle.id && v.bodyType === vehicle.bodyType)
    .slice(0, 3);

  return <VehicleDetail vehicle={vehicle} related={related} />;
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Fuel, Gauge, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { vehicles } from "@/lib/data";

function VehicleCard({
  vehicle,
  index,
}: {
  vehicle: (typeof vehicles)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-surface rounded-2xl border border-white/5 overflow-hidden hover:border-orange/20 hover:shadow-2xl hover:shadow-orange/5 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-orange hover:border-orange/30 transition-all">
          <Heart className="w-4 h-4" />
        </button>

        {/* Year Badge */}
        <Badge className="absolute top-3 left-3 bg-orange/90 text-white border-0 rounded-full text-xs">
          {vehicle.year}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white text-lg">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-zinc-500 mt-0.5">{vehicle.variant}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5" />
            {vehicle.fuelType}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            {vehicle.horsepower} hp
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
          <span>{vehicle.mileage.toLocaleString()} miles</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-5 pt-4 border-t border-white/5">
          <div>
            <p className="text-2xl font-bold text-white">
              &pound;{vehicle.price.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              &pound;{vehicle.monthlyPrice.toLocaleString()} /mo*
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/vehicles/${vehicle.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/10 text-white hover:bg-white/5 text-xs"
              >
                View Details
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="sm"
                className="rounded-full btn-gradient text-xs gap-1"
              >
                Enquire
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedVehicles() {
  const featured = vehicles.slice(0, 6);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded-full bg-orange" />
              <span className="text-sm font-medium text-orange uppercase tracking-wider">
                Vehicle Stock
              </span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase text-white">
              Featured <span className="text-gradient">Vehicles</span>
            </h2>
            <p className="mt-3 text-zinc-400 max-w-lg">
              Browse our curated selection of premium used vehicles. Each car is
              carefully inspected and hand-picked.
            </p>
          </div>
          <Link href="/vehicles">
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-white hover:bg-white/5 gap-2"
            >
              View All Stock
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

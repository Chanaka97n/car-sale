"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  Fuel,
  Gauge,
  Zap,
  Calendar,
  Shield,
  CheckCircle2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Car,
  Palette,
  Users,
  Activity,
  Clock,
  Leaf,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { Vehicle } from "@/lib/data";

interface VehicleDetailProps {
  vehicle: Vehicle;
  related: Vehicle[];
}

export function VehicleDetail({ vehicle, related }: VehicleDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const images = vehicle.images || [vehicle.image];

  const specs = [
    { icon: Calendar, label: "Year", value: vehicle.year.toString() },
    {
      icon: Gauge,
      label: "Mileage",
      value: `${vehicle.mileage.toLocaleString()} mi`,
    },
    { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
    { icon: Activity, label: "Transmission", value: vehicle.transmission },
    { icon: Zap, label: "Power", value: `${vehicle.horsepower} hp` },
    { icon: Car, label: "Body Type", value: vehicle.bodyType },
    ...(vehicle.engineSize
      ? [{ icon: Activity, label: "Engine", value: vehicle.engineSize }]
      : []),
    ...(vehicle.drivetrain
      ? [{ icon: Car, label: "Drivetrain", value: vehicle.drivetrain }]
      : []),
    ...(vehicle.doors
      ? [{ icon: Car, label: "Doors", value: vehicle.doors.toString() }]
      : []),
    ...(vehicle.seats
      ? [{ icon: Users, label: "Seats", value: vehicle.seats.toString() }]
      : []),
    ...(vehicle.colour
      ? [{ icon: Palette, label: "Colour", value: vehicle.colour }]
      : []),
    ...(vehicle.topSpeed
      ? [
          {
            icon: Gauge,
            label: "Top Speed",
            value: `${vehicle.topSpeed} mph`,
          },
        ]
      : []),
    ...(vehicle.acceleration
      ? [{ icon: Clock, label: "0-62 mph", value: vehicle.acceleration }]
      : []),
    ...(vehicle.mpg
      ? [{ icon: Fuel, label: "MPG", value: `${vehicle.mpg} mpg` }]
      : []),
    ...(vehicle.co2
      ? [{ icon: Leaf, label: "CO₂", value: `${vehicle.co2} g/km` }]
      : []),
    ...(vehicle.registration
      ? [{ icon: FileText, label: "Registration", value: vehicle.registration }]
      : []),
    ...(vehicle.previousOwners !== undefined
      ? [
          {
            icon: Users,
            label: "Previous Owners",
            value: vehicle.previousOwners.toString(),
          },
        ]
      : []),
    ...(vehicle.serviceHistory
      ? [
          {
            icon: Shield,
            label: "Service History",
            value: vehicle.serviceHistory,
          },
        ]
      : []),
  ];

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white z-10 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
            >
              ✕
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 text-white/60 hover:text-white z-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 text-white/60 hover:text-white z-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={images[selectedImage]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 text-white/50 text-sm">
              {selectedImage + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <section className="pt-24 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-zinc-500"
          >
            <Link
              href="/vehicles"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Vehicles
            </Link>
            <span>/</span>
            <span className="text-zinc-300">
              {vehicle.make} {vehicle.model}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Gallery + Info */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Gallery — 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              {/* Main Image */}
              <div
                className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface border border-white/5 cursor-pointer group"
                onClick={() => setShowFullscreen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={images[selectedImage]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 glass rounded-full px-3 py-1 border border-white/10 text-xs text-white">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === selectedImage
                          ? "border-orange ring-1 ring-orange/30"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info Panel — 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-28 space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="bg-orange/15 text-orange border-orange/20 rounded-full mb-3">
                        {vehicle.year} · {vehicle.mileage.toLocaleString()}{" "}
                        miles
                      </Badge>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {vehicle.make} {vehicle.model}
                      </h1>
                      <p className="text-zinc-400 mt-1">{vehicle.variant}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-orange hover:border-orange/30 transition-all">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                      &pound;{vehicle.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Finance from{" "}
                      <span className="text-orange font-medium">
                        &pound;{vehicle.monthlyPrice.toLocaleString()}/mo
                      </span>
                      *
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Fuel, label: vehicle.fuelType },
                    { icon: Gauge, label: vehicle.transmission },
                    { icon: Zap, label: `${vehicle.horsepower} hp` },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-surface rounded-xl border border-white/5 p-3 text-center"
                    >
                      <spec.icon className="w-4 h-4 text-orange mx-auto mb-1.5" />
                      <p className="text-xs text-zinc-300 font-medium">
                        {spec.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Link href="/contact" className="block">
                    <Button className="w-full bg-orange hover:bg-orange-dark text-white rounded-xl h-12 gap-2 font-semibold shadow-lg shadow-orange/20">
                      <Phone className="w-4 h-4" />
                      Enquire Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 gap-2 h-11"
                      >
                        <Calendar className="w-4 h-4" />
                        Test Drive
                      </Button>
                    </Link>
                    <Link href="/finance">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 gap-2 h-11"
                      >
                        <Activity className="w-4 h-4" />
                        Finance
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 px-4 bg-surface rounded-xl border border-white/5">
                  <Shield className="w-5 h-5 text-orange shrink-0" />
                  <div className="text-xs text-zinc-400">
                    <span className="text-white font-medium">
                      Quality Assured
                    </span>{" "}
                    — Multi-point inspected, full history check, warranty
                    included
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Info */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-10">
              {vehicle.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-orange" />
                    About This Vehicle
                  </h2>
                  <p className="text-zinc-400 leading-relaxed">
                    {vehicle.description}
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-orange" />
                  Specifications
                </h2>
                <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                  {specs.map((spec, i) => (
                    <div
                      key={spec.label + i}
                      className={`flex items-center justify-between px-5 py-3.5 ${
                        i !== specs.length - 1 ? "border-b border-white/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <spec.icon className="w-4 h-4 text-zinc-500" />
                        {spec.label}
                      </div>
                      <span className="text-sm text-white font-medium">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {vehicle.features && vehicle.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-orange" />
                    Features & Equipment
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-surface border border-white/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-orange shrink-0" />
                        <span className="text-sm text-zinc-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar — Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="sticky top-28 bg-surface rounded-2xl border border-white/5 p-6">
                <h3 className="font-semibold text-white mb-1">
                  Interested in this vehicle?
                </h3>
                <p className="text-xs text-zinc-500 mb-5">
                  Fill in your details and we&apos;ll get back to you.
                </p>

                <form className="space-y-4">
                  <div>
                    <Label className="text-xs text-zinc-400 mb-1 block">
                      Full Name *
                    </Label>
                    <Input
                      placeholder="Your name"
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-400 mb-1 block">
                      Email *
                    </Label>
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-400 mb-1 block">
                      Phone *
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Your phone"
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-400 mb-1 block">
                      Message
                    </Label>
                    <Input
                      placeholder={`I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}...`}
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <Button className="w-full bg-orange hover:bg-orange-dark text-white rounded-xl h-11 gap-2 font-semibold shadow-lg shadow-orange/20">
                    <Mail className="w-4 h-4" />
                    Send Enquiry
                  </Button>
                </form>

                <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-orange" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Prefer to call?</p>
                    <p className="text-sm text-white font-medium">
                      +44 (0)161 XXX XXXX
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Vehicles */}
      {related.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between gap-4 mb-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Similar Vehicles
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Other {vehicle.bodyType.toLowerCase()}s you might like
                </p>
              </div>
              <Link href="/vehicles">
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 text-white hover:bg-white/5 gap-2 text-sm"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="group block bg-surface rounded-2xl border border-white/5 overflow-hidden hover:border-orange/20 transition-all duration-500"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={v.image}
                        alt={`${v.make} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-orange/90 text-white border-0 rounded-full text-xs">
                        {v.year}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-white">
                        {v.make} {v.model}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {v.variant}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400">
                        <span>{v.fuelType}</span>
                        <span>·</span>
                        <span>{v.transmission}</span>
                        <span>·</span>
                        <span>{v.mileage.toLocaleString()} mi</span>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-xl font-bold text-white">
                            &pound;{v.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-zinc-500">
                            &pound;{v.monthlyPrice}/mo*
                          </p>
                        </div>
                        <span className="text-xs text-orange font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

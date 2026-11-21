"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import { addEnquiry } from "@/redux/admin/enquiries/enquiriesIndex";
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
  MapPin,
  Download,
  Play,
  Tag,
  Hash,
  Settings,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import type { Vehicle } from "@/lib/data";
import type { AppDispatch } from "@/redux/store";

interface VehicleDetailProps {
  vehicle: Vehicle;
  related: Vehicle[];
}

type InfoTab = "overview" | "features" | "specs" | "general" | "location";

export function VehicleDetail({ vehicle, related }: VehicleDetailProps) {
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<InfoTab>("overview");
  const [showTestDrive, setShowTestDrive] = useState(false);

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
      ? [{ icon: Settings, label: "Engine", value: vehicle.engineSize }]
      : []),
    ...(vehicle.drivetrain
      ? [{ icon: Car, label: "Drivetrain", value: vehicle.drivetrain }]
      : []),
    ...(vehicle.trim
      ? [{ icon: Tag, label: "Trim", value: vehicle.trim }]
      : []),
    ...(vehicle.condition
      ? [{ icon: Shield, label: "Condition", value: vehicle.condition }]
      : []),
    ...(vehicle.stockNumber
      ? [{ icon: Hash, label: "Stock No.", value: vehicle.stockNumber }]
      : []),
    ...(vehicle.vinNumber
      ? [{ icon: FileText, label: "VIN", value: vehicle.vinNumber }]
      : []),
    ...(vehicle.exteriorColor
      ? [{ icon: Palette, label: "Exterior Color", value: vehicle.exteriorColor }]
      : []),
    ...(vehicle.interiorColor
      ? [{ icon: Palette, label: "Interior Color", value: vehicle.interiorColor }]
      : []),
    ...(vehicle.fuelEconomy
      ? [{ icon: Droplets, label: "Fuel Economy", value: vehicle.fuelEconomy }]
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

  const hasTabContent =
    vehicle.vehicleOverview ||
    vehicle.description ||
    vehicle.featuresAndOptions ||
    (vehicle.features && vehicle.features.length > 0) ||
    vehicle.technicalSpecs ||
    vehicle.generalInfo ||
    vehicle.vehicleLocation;

  const infoTabs: { id: InfoTab; label: string; hasContent: boolean }[] = [
    {
      id: "overview",
      label: "Vehicle Overview",
      hasContent: !!(vehicle.vehicleOverview || vehicle.description),
    },
    {
      id: "features",
      label: "Features & Options",
      hasContent: !!(
        vehicle.featuresAndOptions ||
        (vehicle.features && vehicle.features.length > 0)
      ),
    },
    {
      id: "specs",
      label: "Technical Specifications",
      hasContent: !!vehicle.technicalSpecs,
    },
    {
      id: "general",
      label: "General Information",
      hasContent: !!vehicle.generalInfo,
    },
    {
      id: "location",
      label: "Vehicle Location",
      hasContent: !!vehicle.vehicleLocation,
    },
  ];

  const visibleTabs = infoTabs.filter((t) => t.hasContent);

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

                {vehicle.vehicleStatus === "sold" && (
                  <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Sold
                  </div>
                )}

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
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className="bg-orange/15 text-orange border-orange/20 rounded-full">
                          {vehicle.year} · {vehicle.mileage.toLocaleString()}{" "}
                          miles
                        </Badge>
                        {vehicle.condition && (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 rounded-full">
                            {vehicle.condition}
                          </Badge>
                        )}
                        {vehicle.vehicleStatus === "sold" && (
                          <Badge className="bg-red-500/15 text-red-400 border-red-500/20 rounded-full">
                            Sold
                          </Badge>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {vehicle.make} {vehicle.model}
                      </h1>
                      <p className="text-zinc-400 mt-1">
                        {vehicle.variant}
                        {vehicle.trim && ` · ${vehicle.trim}`}
                      </p>
                      {vehicle.stockNumber && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Stock #: {vehicle.stockNumber}
                        </p>
                      )}
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
                    {vehicle.salePrice ? (
                      <div className="flex items-baseline gap-3">
                        <p className="text-3xl sm:text-4xl font-bold text-white">
                          &pound;{vehicle.salePrice.toLocaleString()}
                        </p>
                        <p className="text-lg text-zinc-500 line-through">
                          &pound;{vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-3xl sm:text-4xl font-bold text-white">
                        &pound;{vehicle.price.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-zinc-500">
                        Finance from{" "}
                        <span className="text-orange font-medium">
                          &pound;{vehicle.monthlyPrice.toLocaleString()}/mo
                        </span>
                        *
                      </p>
                      {vehicle.taxLabel && (
                        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                          {vehicle.taxLabel}
                        </span>
                      )}
                    </div>
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

                {/* Quick color info */}
                {(vehicle.exteriorColor || vehicle.interiorColor) && (
                  <div className="flex items-center gap-4 text-sm">
                    {vehicle.exteriorColor && (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Palette className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Ext: <span className="text-zinc-300">{vehicle.exteriorColor}</span></span>
                      </div>
                    )}
                    {vehicle.interiorColor && (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Palette className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Int: <span className="text-zinc-300">{vehicle.interiorColor}</span></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {vehicle.vehicleStatus !== "sold" && (
                    <Link href="/contact" className="block">
                      <Button className="w-full btn-gradient rounded-xl h-12 gap-2 font-semibold">
                        <Phone className="w-4 h-4" />
                        {vehicle.enableRequestPrice ? "Request Price" : "Enquire Now"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 gap-2 h-11"
                      onClick={() => setShowTestDrive(true)}
                    >
                      <Calendar className="w-4 h-4" />
                      Test Drive
                    </Button>
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
                  {vehicle.brochureUrl && (
                    <a
                      href={vehicle.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 gap-2 h-11"
                      >
                        <Download className="w-4 h-4" />
                        Download Brochure
                      </Button>
                    </a>
                  )}
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

      {/* Video Section */}
      {vehicle.videoUrl && (
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:max-w-[60%]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-orange" />
                  Video
                </h2>
                <VideoEmbed url={vehicle.videoUrl} title={`${vehicle.make} ${vehicle.model}`} />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Detailed Info */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-10">
              {/* Tabbed content sections */}
              {hasTabContent && visibleTabs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto">
                    {visibleTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                          activeTab === tab.id
                            ? "text-orange border-orange"
                            : "text-zinc-500 border-transparent hover:text-zinc-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "overview" && (
                        <div className="space-y-4">
                          {vehicle.vehicleOverview && (
                            <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                              {vehicle.vehicleOverview}
                            </div>
                          )}
                          {vehicle.description &&
                            vehicle.description !== vehicle.vehicleOverview && (
                              <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                                {vehicle.description}
                              </div>
                            )}
                        </div>
                      )}

                      {activeTab === "features" && (
                        <div className="space-y-4">
                          {vehicle.featuresAndOptions && (
                            <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                              {vehicle.featuresAndOptions}
                            </div>
                          )}
                          {vehicle.features && vehicle.features.length > 0 && (
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
                          )}
                        </div>
                      )}

                      {activeTab === "specs" && vehicle.technicalSpecs && (
                        <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                          {vehicle.technicalSpecs}
                        </div>
                      )}

                      {activeTab === "general" && vehicle.generalInfo && (
                        <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                          {vehicle.generalInfo}
                        </div>
                      )}

                      {activeTab === "location" && vehicle.vehicleLocation && (
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-zinc-400">
                            <MapPin className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                            <div className="leading-relaxed whitespace-pre-line">
                              {vehicle.vehicleLocation}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Specifications grid */}
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
            </div>

            {/* Sidebar — Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <EnquiryForm vehicle={vehicle} dispatch={dispatch} />
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
                          <ArrowRight className="w-4 h-4" />
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

      <TestDriveModal
        open={showTestDrive}
        onOpenChange={setShowTestDrive}
        vehicle={vehicle}
        dispatch={dispatch}
      />
    </>
  );
}

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-white/5 hover:border-orange/20 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
          <Play className="w-5 h-5 text-orange" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">Watch Video</p>
          <p className="text-xs text-zinc-500 truncate max-w-xs">{url}</p>
        </div>
      </a>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden border border-white/5 bg-surface">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let videoId: string | null = null;
      if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.slice(1);
      } else {
        videoId = u.searchParams.get("v");
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (u.hostname.includes("vimeo.com")) {
      const match = u.pathname.match(/\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
  } catch {
    // invalid URL
  }
  return null;
}

function EnquiryForm({
  vehicle,
  dispatch,
}: {
  vehicle: Vehicle;
  dispatch: AppDispatch;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    const [firstName, ...rest] = form.name.trim().split(" ");
    setSending(true);
    setError(null);
    try {
      await dispatch(
        addEnquiry({
          type: "vehicle",
          firstName,
          lastName: rest.join(" ") || "",
          email: form.email,
          phone: form.phone,
          message:
            form.message ||
            `I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`,
          vehicleId: vehicle.id,
          vehicleLabel: `${vehicle.make} ${vehicle.model} ${vehicle.variant}`,
          marketingConsent: false,
        }),
      ).unwrap();
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (message) {
      setError(String(message));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sticky top-28 bg-surface rounded-2xl border border-white/5 p-6">
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Enquiry Sent!</h3>
          <p className="text-xs text-zinc-400">
            Thank you for your interest. We&apos;ll get back to you shortly.
          </p>
          <Button
            className="mt-4 btn-gradient rounded-xl"
            onClick={() => setSubmitted(false)}
          >
            Send Another Enquiry
          </Button>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-white mb-1">
            Interested in this vehicle?
          </h3>
          <p className="text-xs text-zinc-500 mb-5">
            Fill in your details and we&apos;ll get back to you.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label className="text-xs text-zinc-400 mb-1 block">
                Full Name *
              </Label>
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
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
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
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
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-400 mb-1 block">
                Message
              </Label>
              <Input
                placeholder={`I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}...`}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={sending}
              className="w-full btn-gradient rounded-xl h-11 gap-2 font-semibold"
            >
              <Mail className="w-4 h-4" />
              {sending ? "Sending…" : "Send Enquiry"}
            </Button>
          </form>
        </>
      )}

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
  );
}

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function TestDriveModal({
  open,
  onOpenChange,
  vehicle,
  dispatch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle;
  dispatch: AppDispatch;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    marketingConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.phone) return;
    setSending(true);
    setError(null);
    try {
      await dispatch(
        addEnquiry({
          type: "test-drive",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          message:
            form.message ||
            `I'd like to book a test drive for the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`,
          vehicleId: vehicle.id,
          vehicleLabel: `${vehicle.make} ${vehicle.model} ${vehicle.variant}`,
          preferredDate: form.preferredDate || undefined,
          preferredTime: form.preferredTime || undefined,
          marketingConsent: form.marketingConsent,
        }),
      ).unwrap();
      setSubmitted(true);
    } catch (message) {
      setError(String(message));
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setSubmitted(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        marketingConsent: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-surface border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Book a Test Drive</DialogTitle>
          <DialogDescription>
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.variant}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Booking Received!</h3>
            <p className="text-sm text-zinc-400">
              We&apos;ll confirm your test drive shortly.
            </p>
            <Button
              className="mt-4 btn-gradient rounded-xl"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400 mb-1 block">
                  First Name *
                </Label>
                <Input
                  placeholder="e.g. James"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  required
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400 mb-1 block">
                  Last Name
                </Label>
                <Input
                  placeholder="e.g. Mitchell"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400 mb-1 block">
                  Email *
                </Label>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400 mb-1 block">
                  Phone *
                </Label>
                <Input
                  type="tel"
                  placeholder="07700 900123"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-zinc-400 mb-1 block">
                  Preferred Date
                </Label>
                <Input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, preferredDate: e.target.value }))
                  }
                  className="rounded-xl bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400 mb-1 block">
                  Preferred Time
                </Label>
                <Select
                  value={form.preferredTime}
                  onValueChange={(val) =>
                    setForm((p) => ({ ...p, preferredTime: val ?? "" }))
                  }
                >
                  <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-white/10">
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-zinc-400 mb-1 block">
                Message (Optional)
              </Label>
              <Input
                placeholder="Any specific requests or questions?"
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
              />
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                checked={form.marketingConsent}
                onCheckedChange={(checked) =>
                  setForm((p) => ({
                    ...p,
                    marketingConsent: checked === true,
                  }))
                }
                className="mt-0.5 border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
              />
              <Label className="text-xs text-zinc-400 leading-relaxed cursor-pointer">
                I&apos;d like to receive vehicle updates and offers.
              </Label>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={sending}
              className="w-full btn-gradient rounded-xl h-12 gap-2 font-semibold"
            >
              <Calendar className="w-4 h-4" />
              {sending ? "Sending…" : "Book My Test Drive"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

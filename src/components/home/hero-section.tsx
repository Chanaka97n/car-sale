"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] rounded-full bg-orange/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-orange/3 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
              Premium Used Vehicles
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[0.9] tracking-tight"
            >
              <span className="text-white">Drive Your</span>
              <br />
              <span className="text-white">Dream</span>
              <br />
              <span className="text-gradient">Car Today</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg text-zinc-400 max-w-lg leading-relaxed"
            >
              A curated selection of quality, hand-picked used vehicles. Find
              your next car with confidence at MVA Motor Company.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/vehicles">
                <Button
                  size="lg"
                  className="bg-orange hover:bg-orange-dark text-white rounded-full px-8 gap-2 text-base shadow-lg shadow-orange/25 hover:shadow-orange/40 transition-all hover:scale-105"
                >
                  Explore All Vehicles
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <button className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-orange/50 group-hover:bg-orange/10 transition-all">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                <span className="text-sm font-medium">Watch Overview</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: "500+", label: "Vehicles Sold" },
                { value: "98%", label: "Happy Customers" },
                { value: "5*", label: "Google Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Car Image Area */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-light to-surface rounded-3xl border border-white/5" />
              <img
                src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop"
                alt="Premium BMW vehicle"
                className="absolute inset-0 w-full h-full object-cover rounded-3xl mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Floating Price Tag */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-6 left-6 glass rounded-2xl p-4 border border-white/10"
              >
                <p className="text-xs text-zinc-400">Starting from</p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  &pound;14,990
                </p>
                <p className="text-xs text-orange mt-1">
                  Finance available from &pound;199/mo
                </p>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute top-6 right-6 glass rounded-full px-4 py-2 border border-white/10 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-white font-medium">
                  987 In Stock
                </span>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-orange/20 rounded-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-white/5 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-zinc-500">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2.5 rounded-full bg-orange" />
        </motion.div>
      </motion.div>
    </section>
  );
}

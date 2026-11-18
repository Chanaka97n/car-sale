"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const CarShowcase3D = dynamic(
  () =>
    import("@/components/three/car-showcase").then((m) => ({
      default: m.CarShowcase3D,
    })),
  { ssr: false },
);

const ParticleField = dynamic(
  () =>
    import("@/components/three/particle-field").then((m) => ({
      default: m.ParticleField,
    })),
  { ssr: false },
);

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] rounded-full bg-orange/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-orange/3 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* 3D Particle field background */}
      <ParticleField />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange" />
              </span>
              Premium Used Vehicles
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[0.9] tracking-tight"
            >
              <motion.span
                className="text-white inline-block"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                Drive Your
              </motion.span>
              <br />
              <motion.span
                className="text-white inline-block"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
              >
                Dream
              </motion.span>
              <br />
              <motion.span
                className="text-gradient inline-block"
                initial={{ opacity: 0, x: -40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              >
                Car Today
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-zinc-400 max-w-lg leading-relaxed"
            >
              A curated selection of quality, hand-picked used vehicles. Find
              your next car with confidence at MVA Motor Company.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/vehicles">
                <Button
                  size="lg"
                  className="bg-orange hover:bg-orange-dark text-white rounded-full px-8 gap-2 text-base shadow-lg shadow-orange/25 hover:shadow-orange/40 transition-all hover:scale-105 active:scale-95"
                >
                  Explore All Vehicles
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <button className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group">
                <div className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-orange/50 group-hover:bg-orange/10 transition-all">
                  <Play className="w-4 h-4 ml-0.5" />
                  <span className="absolute inset-0 rounded-full border border-orange/30 animate-ping opacity-0 group-hover:opacity-30" />
                </div>
                <span className="text-sm font-medium">Watch Overview</span>
              </button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: 500, suffix: "+", label: "Vehicles Sold" },
                { value: 98, suffix: "%", label: "Happy Customers" },
                { value: 5, suffix: "★", label: "Google Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={2.5}
                    />
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - 3D Car Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <CarShowcase3D />

              {/* Glass overlay info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="absolute bottom-6 left-6 glass rounded-2xl p-4 border border-white/10"
              >
                <p className="text-xs text-zinc-400">Starting from</p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  &pound;14,990
                </p>
                <p className="text-xs text-orange mt-1">
                  Finance from &pound;199/mo
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                className="absolute top-6 right-6 glass rounded-full px-4 py-2 border border-white/10 flex items-center gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs text-white font-medium">
                  987 In Stock
                </span>
              </motion.div>
            </div>

            {/* Decorative */}
            <motion.div
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute -top-4 -right-4 w-24 h-24 border border-orange/20 rounded-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="absolute -bottom-4 -left-4 w-32 h-32 border border-white/5 rounded-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-zinc-500">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1 h-2.5 rounded-full bg-orange"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

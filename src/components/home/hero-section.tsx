"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&h=900&fit=crop&q=90",
    make: "BMW",
    model: "M4 Competition",
    price: "£54,990",
    tag: "Performance",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&h=900&fit=crop&q=90",
    make: "Mercedes-Benz",
    model: "S-Class",
    price: "£76,990",
    tag: "Luxury",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1400&h=900&fit=crop&q=90",
    make: "Range Rover",
    model: "Sport",
    price: "£54,990",
    tag: "Prestige",
  },
];

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 12 + ((i * 37 + 13) % 76),
  y: 15 + ((i * 29 + 7) % 70),
  dy: -(30 + ((i * 11) % 40)),
  dx: ((i * 17) % 20) - 10,
  dur: 3 + (i % 3),
  delay: (i * 0.35) % 4,
}));

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
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const slide = heroSlides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 hero-gradient" />
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
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: 0.3,
                }}
              >
                Drive Your
              </motion.span>
              <br />
              <motion.span
                className="text-white inline-block"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: 0.45,
                }}
              >
                Dream
              </motion.span>
              <br />
              <motion.span
                className="text-gradient inline-block"
                initial={{ opacity: 0, x: -40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  delay: 0.6,
                }}
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

          {/* Right — Cinematic Car Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="relative hidden lg:block"
          >
            <div
              className="relative aspect-[4/3] rounded-3xl overflow-hidden group"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Car image with cinematic reveal */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                >
                  <img
                    src={slide.image}
                    alt={`${slide.make} ${slide.model}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Cinematic overlay — dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Animated headlight glow — left beam */}
              <motion.div
                className="absolute top-[30%] left-[10%] w-[300px] h-[200px] pointer-events-none"
                animate={{
                  opacity: [0, 0.6, 0.8, 0.6, 0],
                  scale: [0.8, 1.2, 1.3, 1.2, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(232,89,12,0.25) 0%, rgba(232,89,12,0.08) 40%, transparent 70%)",
                }}
              />

              {/* Animated headlight glow — right beam */}
              <motion.div
                className="absolute top-[25%] right-[15%] w-[250px] h-[180px] pointer-events-none"
                animate={{
                  opacity: [0, 0.4, 0.7, 0.4, 0],
                  scale: [0.9, 1.1, 1.2, 1.1, 0.9],
                }}
                transition={{
                  duration: 4,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
                }}
              />

              {/* Sweeping light across car body */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    "linear-gradient(105deg, transparent 0%, transparent 40%, rgba(255,255,255,0.03) 45%, transparent 50%, transparent 100%)",
                    "linear-gradient(105deg, transparent 0%, transparent 50%, rgba(255,255,255,0.08) 55%, transparent 60%, transparent 100%)",
                    "linear-gradient(105deg, transparent 0%, transparent 60%, rgba(255,255,255,0.03) 65%, transparent 70%, transparent 100%)",
                    "linear-gradient(105deg, transparent 0%, transparent 40%, rgba(255,255,255,0.03) 45%, transparent 50%, transparent 100%)",
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Floor reflection glow */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(to top, rgba(232,89,12,0.15) 0%, rgba(232,89,12,0.05) 30%, transparent 100%)",
                }}
              />

              {/* Ambient particles (CSS) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute w-1 h-1 rounded-full bg-orange/40"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    animate={{
                      y: [0, p.dy, 0],
                      x: [0, p.dx, 0],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: p.dur,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Car info overlay — bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    className="flex items-end justify-between"
                  >
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-medium mb-3">
                        {slide.tag}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {slide.make}{" "}
                        <span className="text-orange">{slide.model}</span>
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1">
                        From{" "}
                        <span className="text-white font-semibold">
                          {slide.price}
                        </span>
                      </p>
                    </div>

                    <Link
                      href="/vehicles"
                      className="shrink-0 w-11 h-11 rounded-full bg-orange flex items-center justify-center hover:bg-orange-dark transition-colors shadow-lg shadow-orange/30"
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Slide progress bar */}
                <div className="flex gap-2 mt-5">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="relative h-1 flex-1 rounded-full bg-white/10 overflow-hidden"
                    >
                      {i === current && (
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-orange rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: isAutoPlaying ? 5 : 100,
                            ease: "linear",
                          }}
                          key={`progress-${current}-${isAutoPlaying}`}
                        />
                      )}
                      {i < current && (
                        <div className="absolute inset-0 bg-orange/50 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Glass status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                className="absolute top-4 right-4 glass rounded-full px-4 py-2 border border-white/10 flex items-center gap-2 z-10"
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

            {/* Decorative corner accents */}
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

            {/* Ambient glow behind the card */}
            <motion.div
              className="absolute -inset-8 -z-10 rounded-[2rem]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(ellipse at 60% 50%, rgba(232,89,12,0.12) 0%, transparent 60%)",
              }}
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

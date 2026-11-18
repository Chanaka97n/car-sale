"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
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

function smoothstep(x: number, edge0: number, edge1: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function HeroSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bandIndex, setBandIndex] = useState(0);
  const [bandK, setBandK] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothProgress, "change", (raw) => {
    const p = Math.min(1, Math.max(0, raw));
    const slideIdx = Math.min(
      heroSlides.length - 1,
      Math.floor(p * heroSlides.length)
    );
    setCurrentSlide(slideIdx);

    // 3 text bands mapped to scroll zones
    if (p < 0.33) {
      setBandIndex(0);
      setBandK(smoothstep(p, 0.0, 0.08));
    } else if (p < 0.66) {
      setBandIndex(1);
      setBandK(smoothstep(p, 0.33, 0.41));
    } else {
      setBandIndex(2);
      setBandK(smoothstep(p, 0.66, 0.74));
    }
  });

  // Parallax transforms
  const imageScale = useTransform(smoothProgress, [0, 1], [1.1, 1.3]);
  const imageY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const scrimOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.5, 0.7]);

  const bands = [
    {
      kicker: "PREMIUM USED VEHICLES",
      heading: "Drive Your Dream Car Today",
      sub: null,
    },
    {
      kicker: "CURATED COLLECTION",
      heading: "Hand-Picked. Inspected. Ready.",
      sub: "Every vehicle in our showroom passes a rigorous multi-point inspection before it reaches you.",
    },
    {
      kicker: "MVA MOTOR COMPANY",
      heading: "Where Quality Meets Value",
      sub: null,
    },
  ];

  const activeBand = bands[bandIndex];
  const slide = heroSlides[currentSlide] ?? heroSlides[0];

  return (
    <>
      {/* Scroll-pinned hero — 400vh tall, viewport-sticky stage */}
      <div ref={pinRef} className="relative" style={{ height: "400vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          {/* Background car image with parallax */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 0.8, 0.28, 1] }}
            >
              <motion.img
                src={slide.image}
                alt={`${slide.make} ${slide.model}`}
                className="w-full h-full object-cover will-change-transform"
                style={{ scale: imageScale, y: imageY }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Cinematic scrims */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: scrimOpacity }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 32%, rgba(10,10,14,0.66) 100%)",
              }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Headlight ambient glow */}
          <motion.div
            className="absolute top-[20%] left-[5%] w-[400px] h-[300px] pointer-events-none"
            animate={{
              opacity: [0.15, 0.4, 0.15],
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(232,89,12,0.2) 0%, rgba(232,89,12,0.05) 50%, transparent 75%)",
            }}
          />

          {/* Light sweep across the frame */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(105deg, transparent 0%, transparent 30%, rgba(255,255,255,0.02) 35%, transparent 40%, transparent 100%)",
                "linear-gradient(105deg, transparent 0%, transparent 55%, rgba(255,255,255,0.06) 60%, transparent 65%, transparent 100%)",
                "linear-gradient(105deg, transparent 0%, transparent 80%, rgba(255,255,255,0.02) 85%, transparent 90%, transparent 100%)",
                "linear-gradient(105deg, transparent 0%, transparent 30%, rgba(255,255,255,0.02) 35%, transparent 40%, transparent 100%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Text bands — scroll-revealed */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bandIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 0.8, 0.28, 1],
                    }}
                  >
                    {/* Kicker */}
                    <motion.span
                      className="inline-block font-mono text-xs tracking-[0.16em] text-orange mb-6"
                      style={{
                        opacity: bandK,
                        transform: `translateY(${(1 - bandK) * 12}px)`,
                      }}
                    >
                      {activeBand.kicker}
                    </motion.span>

                    {/* Split heading — word by word reveal */}
                    <h2
                      className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[1.02] tracking-tight"
                      style={{ textShadow: "0 1px 2px rgba(5,5,10,.95), 0 3px 12px rgba(5,5,10,.78), 0 10px 44px rgba(5,5,10,.8)" }}
                    >
                      {activeBand.heading.split(" ").map((word, i, arr) => {
                        const threshold = (i / arr.length) * 0.55;
                        const wordK = Math.min(
                          1,
                          Math.max(0, (bandK - threshold) * 2.8)
                        );
                        return (
                          <span
                            key={word + i}
                            className="inline-block overflow-hidden mr-[0.12em] align-top pb-[0.22em] mb-[-0.22em]"
                          >
                            <span
                              className="inline-block text-white"
                              style={{
                                opacity: wordK,
                                transform: `translateY(${(1 - wordK) * 100}%)`,
                              }}
                            >
                              {word}
                            </span>
                          </span>
                        );
                      })}
                    </h2>

                    {/* Subtitle */}
                    {activeBand.sub && (
                      <motion.p
                        className="mt-5 text-lg text-zinc-300 max-w-lg leading-relaxed"
                        style={{
                          opacity: Math.min(1, Math.max(0, (bandK - 0.4) * 2.5)),
                          transform: `translateY(${Math.max(0, (1 - Math.min(1, Math.max(0, (bandK - 0.4) * 2.5)))) * 14}px)`,
                          textShadow: "0 2px 8px rgba(0,0,0,.6)",
                        }}
                      >
                        {activeBand.sub}
                      </motion.p>
                    )}

                    {/* CTA — appears on last band */}
                    {bandIndex === 2 && (
                      <motion.div
                        className="mt-8"
                        style={{
                          opacity: Math.min(
                            1,
                            Math.max(0, (bandK - 0.6) * 3)
                          ),
                          transform: `translateY(${Math.max(0, (1 - Math.min(1, Math.max(0, (bandK - 0.6) * 3)))) * 14}px)`,
                        }}
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
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Car label overlay — bottom right */}
          <div className="absolute bottom-8 right-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
                className="glass rounded-2xl p-5 border border-white/10 min-w-[200px]"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-[0.65rem] font-medium tracking-wider uppercase mb-2">
                  {slide.tag}
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {slide.make}
                </h3>
                <p className="text-sm text-white/70">
                  {slide.model}
                </p>
                <p className="text-xs text-zinc-500 mt-1.5">
                  From{" "}
                  <span className="text-orange font-semibold">
                    {slide.price}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === currentSlide
                    ? "w-8 bg-orange"
                    : i < currentSlide
                      ? "w-4 bg-orange/40"
                      : "w-4 bg-white/15"
                }`}
              />
            ))}
          </div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 left-8 flex flex-col items-center gap-2 z-10"
            animate={{ opacity: bandIndex === 0 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.14em] text-zinc-500">
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats strip — below hero */}
      <section className="relative z-10 bg-background border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "Vehicles Sold" },
              { value: 98, suffix: "%", label: "Happy Customers" },
              { value: 5, suffix: "★", label: "Google Rating" },
              { value: 100, suffix: "%", label: "Quality Inspected" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white font-heading">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                  />
                </p>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-mono">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    hp: "510",
    topSpeed: "250 km/h",
    accel: "3.9s",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&h=900&fit=crop&q=90",
    make: "Mercedes-Benz",
    model: "S-Class",
    price: "£76,990",
    tag: "Luxury",
    hp: "503",
    topSpeed: "250 km/h",
    accel: "4.4s",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1400&h=900&fit=crop&q=90",
    make: "Range Rover",
    model: "Sport",
    price: "£54,990",
    tag: "Prestige",
    hp: "300",
    topSpeed: "225 km/h",
    accel: "6.6s",
  },
];

const AUTO_ADVANCE_MS = 6000;

function smoothstep(x: number, edge0: number, edge1: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Deterministic particle positions — no Math.random in render
const PARTICLES: Array<{
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}> = Array.from({ length: 30 }, (_, i) => {
  const seed = (i * 7919 + 3571) % 10000;
  return {
    left: `${(seed % 100)}%`,
    top: `${((seed * 3) % 100)}%`,
    size: 1 + (seed % 3),
    delay: (i * 0.4) % 8,
    duration: 4 + (seed % 6),
    drift: -30 - (seed % 50),
  };
});

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, p.drift],
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function SpotlightReveal() {
  return (
    <>
      {/* Primary moving spotlight — sweeps left to right */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        animate={{
          background: [
            "radial-gradient(ellipse 40% 70% at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 80% at 50% 45%, rgba(255,255,255,0.08) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 70% at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 70% at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Orange accent spotlight from below */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        animate={{
          background: [
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(21,115,223,0.08) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(21,115,223,0.14) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(21,115,223,0.08) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function VolumetricBeams() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
      {/* Diagonal light beam from top-right */}
      <motion.div
        className="absolute -top-[20%] -right-[10%] w-[600px] h-[150vh]"
        style={{
          background:
            "linear-gradient(220deg, rgba(255,255,255,0.02) 0%, transparent 40%)",
          transform: "rotate(-15deg)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Diagonal light beam from top-left */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[400px] h-[150vh]"
        style={{
          background:
            "linear-gradient(140deg, rgba(21,115,223,0.015) 0%, transparent 40%)",
          transform: "rotate(15deg)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}

function FloorReflection() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none z-[2]">
      {/* Glossy floor reflection gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 30%, transparent 100%)",
        }}
      />
      {/* Reflected orange glow on floor */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%]"
        animate={{
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(21,115,223,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Floor line — reflective edge */}
      <motion.div
        className="absolute bottom-[35%] left-[10%] right-[10%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04), transparent)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function CornerFrames() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[
        { pos: "top-6 left-6", bx: "to-r", by: "to-b" },
        { pos: "top-6 right-6", bx: "to-l", by: "to-b" },
        { pos: "bottom-6 left-6", bx: "to-r", by: "to-t" },
        { pos: "bottom-6 right-6", bx: "to-l", by: "to-t" },
      ].map(({ pos, bx, by }, i) => (
        <motion.div
          key={pos}
          className={`absolute ${pos} w-20 h-20`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 + i * 0.15 }}
        >
          <div
            className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"} w-full h-px bg-gradient-${bx} from-orange/50 to-transparent`}
          />
          <div
            className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"} h-full w-px bg-gradient-${by} from-orange/50 to-transparent`}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function HeroSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bandIndex, setBandIndex] = useState(0);
  const [bandK, setBandK] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [revealPhase, setRevealPhase] = useState(0);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const startAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [startAutoAdvance]);

  // Reveal phase animation on each slide change
  useEffect(() => {
    setRevealPhase(0);
    const t1 = setTimeout(() => setRevealPhase(1), 100);
    const t2 = setTimeout(() => setRevealPhase(2), 800);
    const t3 = setTimeout(() => setRevealPhase(3), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentSlide]);

  useMotionValueEvent(smoothProgress, "change", (raw) => {
    const p = Math.min(1, Math.max(0, raw));

    if (p > 0.02) {
      if (!isScrolling) {
        setIsScrolling(true);
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      }
      const slideIdx = Math.min(
        heroSlides.length - 1,
        Math.floor(p * heroSlides.length)
      );
      setCurrentSlide(slideIdx);
    } else {
      if (isScrolling) {
        setIsScrolling(false);
        startAutoAdvance();
      }
    }

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

  const imageScale = useTransform(smoothProgress, [0, 1], [1.1, 1.3]);
  const imageY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const scrimOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.3, 0.5, 0.7]
  );

  const bands = [
    {
      kicker: "QUALITY USED & IMPORTED VEHICLES",
      heading: "Quality Cars. Confidence in Every Journey.",
      sub: null,
    },
    {
      kicker: "A BETTER WAY TO BUY",
      heading: "Straightforward. Transparent. Enjoyable.",
      sub: "We believe buying a car should be an exciting experience, not a stressful one.",
    },
    {
      kicker: "APEX SELECT AUTOMOTIVE",
      heading: "Discover Your Next Car",
      sub: null,
    },
  ];

  const activeBand = bands[bandIndex];
  const slide = heroSlides[currentSlide] ?? heroSlides[0];

  // Timer progress for indicators
  const [timerProgress, setTimerProgress] = useState(0);
  useEffect(() => {
    if (isScrolling) return;
    setTimerProgress(0);
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      setTimerProgress(Math.min(1, elapsed / AUTO_ADVANCE_MS));
      if (elapsed < AUTO_ADVANCE_MS)
        rafRef.current = requestAnimationFrame(frame);
    };
    const rafRef = { current: requestAnimationFrame(frame) };
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentSlide, isScrolling]);

  return (
    <>
      <div ref={pinRef} className="relative" style={{ height: "400vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* ===== STAGE 1: Car image with cinematic reveal ===== */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.28, 1] }}
            >
              {/* The car image — starts dark and dramatically revealed */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2, filter: "brightness(0)" }}
                animate={{
                  scale: 1.0,
                  filter:
                    revealPhase >= 1
                      ? revealPhase >= 2
                        ? "brightness(0.85)"
                        : "brightness(0.4)"
                      : "brightness(0)",
                }}
                transition={{ duration: 2, ease: [0.22, 0.8, 0.28, 1] }}
              >
                <motion.img
                  src={slide.image}
                  alt={`${slide.make} ${slide.model}`}
                  className="w-full h-full object-cover will-change-transform"
                  style={{ scale: imageScale, y: imageY }}
                />
              </motion.div>

              {/* Circular spotlight that opens up on reveal */}
              <motion.div
                className="absolute inset-0"
                initial={{
                  background:
                    "radial-gradient(circle 200px at 50% 50%, transparent 0%, black 100%)",
                }}
                animate={{
                  background:
                    revealPhase >= 2
                      ? "radial-gradient(circle 2000px at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)"
                      : revealPhase >= 1
                        ? "radial-gradient(circle 600px at 50% 50%, transparent 0%, rgba(0,0,0,0.85) 100%)"
                        : "radial-gradient(circle 200px at 50% 50%, transparent 0%, black 100%)",
                }}
                transition={{ duration: 2, ease: [0.22, 0.8, 0.28, 1] }}
              />
            </motion.div>
          </AnimatePresence>

          {/* ===== STAGE 2: Atmospheric layers ===== */}

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          {/* Dramatic scrims */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{ opacity: scrimOpacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 pointer-events-none z-[2]" />

          {/* Spotlight reveal effect */}
          <SpotlightReveal />

          {/* Volumetric light beams */}
          <VolumetricBeams />

          {/* Floating atmospheric particles */}
          <FloatingParticles />

          {/* Floor reflection */}
          <FloorReflection />

          {/* Corner frame brackets */}
          <CornerFrames />

          {/* Horizontal scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none z-[6]"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(21,115,223,0.12) 30%, rgba(21,115,223,0.25) 50%, rgba(21,115,223,0.12) 70%, transparent 90%)",
            }}
            animate={{ top: ["-2%", "102%"] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* ===== STAGE 3: Content ===== */}

          {/* Text bands */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${bandIndex}-${currentSlide}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 0.8, 0.28, 1],
                    }}
                  >
                    {/* Kicker with reveal delay */}
                    <motion.span
                      className="inline-block font-mono text-xs tracking-[0.2em] text-orange mb-6 uppercase"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: isScrolling ? bandK : revealPhase >= 2 ? 1 : 0,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 0.8, 0.28, 1],
                      }}
                    >
                      {activeBand.kicker}
                    </motion.span>

                    {/* Heading — word by word cinematic reveal */}
                    <h2
                      className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[1.02] tracking-tight"
                      style={{
                        textShadow:
                          "0 2px 4px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.8), 0 12px 48px rgba(0,0,0,0.9)",
                      }}
                    >
                      {activeBand.heading.split(" ").map((word, i, arr) => {
                        const threshold = (i / arr.length) * 0.55;
                        const wordK = isScrolling
                          ? Math.min(1, Math.max(0, (bandK - threshold) * 2.8))
                          : 1;
                        return (
                          <span
                            key={word + i}
                            className="inline-block overflow-hidden mr-[0.12em] align-top pb-[0.22em] mb-[-0.22em]"
                          >
                            <motion.span
                              className="inline-block text-white"
                              initial={
                                !isScrolling
                                  ? { opacity: 0, y: "110%", rotateX: 40 }
                                  : false
                              }
                              animate={
                                !isScrolling && revealPhase >= 2
                                  ? { opacity: 1, y: "0%", rotateX: 0 }
                                  : !isScrolling
                                    ? { opacity: 0, y: "110%", rotateX: 40 }
                                    : false
                              }
                              transition={
                                !isScrolling
                                  ? {
                                      duration: 0.8,
                                      delay: i * 0.1,
                                      ease: [0.22, 0.8, 0.28, 1],
                                    }
                                  : undefined
                              }
                              style={
                                isScrolling
                                  ? {
                                      opacity: wordK,
                                      transform: `translateY(${(1 - wordK) * 100}%)`,
                                    }
                                  : { perspective: "600px" }
                              }
                            >
                              {word}
                            </motion.span>
                          </span>
                        );
                      })}
                    </h2>

                    {/* Subtitle */}
                    {activeBand.sub && (
                      <motion.p
                        className="mt-5 text-lg text-zinc-300 max-w-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          !isScrolling && revealPhase >= 3
                            ? { opacity: 1, y: 0 }
                            : isScrolling
                              ? {
                                  opacity: Math.min(
                                    1,
                                    Math.max(0, (bandK - 0.4) * 2.5)
                                  ),
                                }
                              : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.7, ease: [0.22, 0.8, 0.28, 1] }}
                        style={{
                          textShadow: "0 2px 12px rgba(0,0,0,.8)",
                          ...(isScrolling
                            ? {
                                transform: `translateY(${Math.max(0, (1 - Math.min(1, Math.max(0, (bandK - 0.4) * 2.5)))) * 14}px)`,
                              }
                            : {}),
                        }}
                      >
                        {activeBand.sub}
                      </motion.p>
                    )}

                    {/* CTA */}
                    {(bandIndex === 2 || !isScrolling) && (
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          !isScrolling && revealPhase >= 3
                            ? { opacity: 1, y: 0 }
                            : isScrolling && bandIndex === 2
                              ? {
                                  opacity: Math.min(
                                    1,
                                    Math.max(0, (bandK - 0.6) * 3)
                                  ),
                                }
                              : !isScrolling
                                ? { opacity: 0, y: 20 }
                                : {}
                        }
                        transition={{
                          duration: 0.6,
                          delay: !isScrolling ? 0.1 : 0,
                          ease: [0.22, 0.8, 0.28, 1],
                        }}
                        style={
                          isScrolling && bandIndex === 2
                            ? {
                                transform: `translateY(${Math.max(0, (1 - Math.min(1, Math.max(0, (bandK - 0.6) * 3)))) * 14}px)`,
                              }
                            : undefined
                        }
                      >
                        <Link href="/vehicles">
                          <Button
                            size="lg"
                            className="btn-gradient rounded-full px-8 gap-2 text-base transition-all hover:scale-105 active:scale-95"
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

          {/* ===== STAGE 4: Car info panel — cinematic card ===== */}
          <div className="absolute bottom-10 right-8 z-20 hidden sm:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={
                  revealPhase >= 3
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 40, scale: 0.9 }
                }
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
                className="relative"
              >
                {/* Glow border */}
                <div
                  className="absolute -inset-px rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(21,115,223,0.4) 0%, transparent 30%, transparent 70%, rgba(21,115,223,0.2) 100%)",
                    opacity: 0.5,
                  }}
                />
                <div className="relative bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/[0.06] overflow-hidden min-w-[260px]">
                  {/* Top accent line */}
                  <motion.div
                    className="h-[2px] bg-gradient-to-r from-transparent via-orange to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={
                      revealPhase >= 3 ? { scaleX: 1 } : { scaleX: 0 }
                    }
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />

                  <div className="p-5">
                    {/* Tag + indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange/15 border border-orange/25 text-orange text-[0.6rem] font-semibold tracking-wider uppercase">
                        {slide.tag}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-orange"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <span className="text-[0.55rem] text-zinc-600 uppercase tracking-widest">
                          In Stock
                        </span>
                      </div>
                    </div>

                    {/* Car name */}
                    <h3 className="text-2xl font-bold text-white leading-tight font-heading tracking-tight">
                      {slide.make}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      {slide.model}
                    </p>

                    {/* Specs row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { val: slide.hp, label: "BHP" },
                        { val: slide.accel, label: "0-60" },
                        { val: slide.topSpeed, label: "Top" },
                      ].map((spec, i) => (
                        <motion.div
                          key={spec.label}
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={
                            revealPhase >= 3
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 10 }
                          }
                          transition={{
                            duration: 0.5,
                            delay: 0.4 + i * 0.1,
                          }}
                        >
                          <span className="text-sm font-bold text-white font-heading block">
                            {spec.val}
                          </span>
                          <span className="text-[0.55rem] text-zinc-600 uppercase tracking-widest">
                            {spec.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-3" />

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] text-zinc-500 uppercase tracking-wider">
                        From
                      </span>
                      <motion.span
                        className="text-xl font-bold text-orange font-heading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                          revealPhase >= 3
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.8 }
                        }
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        {slide.price}
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ===== Slide indicators ===== */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  if (!isScrolling) startAutoAdvance();
                }}
                className="group relative h-8 flex items-center"
              >
                <div className="relative w-12 h-[2px] rounded-full bg-white/10 overflow-hidden">
                  {i === currentSlide ? (
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: isScrolling
                          ? "100%"
                          : `${timerProgress * 100}%`,
                        background:
                          "linear-gradient(90deg, #1573DF, #3B8FEF)",
                      }}
                    />
                  ) : i < currentSlide ? (
                    <div className="absolute inset-0 bg-orange/30 rounded-full" />
                  ) : null}
                </div>
              </button>
            ))}
          </div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-10 left-8 flex flex-col items-center gap-2 z-10"
            animate={{
              opacity: bandIndex === 0 && !isScrolling ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-zinc-600 uppercase">
              Scroll to Explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-4 h-4 text-zinc-600" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
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

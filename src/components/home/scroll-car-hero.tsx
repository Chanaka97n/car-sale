"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// WebGL can't render on the server, so load the canvas client-side only
const ScrollCarCanvas = dynamic(
  () => import("@/components/three/scroll-car").then((m) => m.ScrollCarCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-black" /> }
);

const bands = [
  {
    kicker: "QUALITY USED & IMPORTED VEHICLES",
    heading: "Quality Cars. Confidence in Every Journey.",
    body: "Hand-picked, inspected and ready to drive away.",
  },
  {
    kicker: "EVERY ANGLE CHECKED",
    heading: "Inspected Inside and Out.",
    body: "Multi-point checks, full history and warranty options.",
  },
  {
    kicker: "DRIVE AWAY TODAY",
    heading: "Flexible Finance. Fair Part-Exchange.",
    body: "Tailored plans to get you behind the wheel sooner.",
  },
];

function Band({
  i,
  progress,
  band,
}: {
  i: number;
  progress: MotionValue<number>;
  band: (typeof bands)[number];
}) {
  const start = i / bands.length;
  const end = (i + 1) / bands.length;
  const fadeIn = i === 0 ? [0, 0] : [start, start + 0.06];
  const fadeOut = i === bands.length - 1 ? [1, 1] : [end - 0.06, end];

  const opacity = useTransform(
    progress,
    [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
    [i === 0 ? 1 : 0, 1, 1, i === bands.length - 1 ? 1 : 0]
  );
  const y = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-[14%] px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-[#1573DF] mb-4">{band.kicker}</p>
      <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl mx-auto leading-tight">
        {band.heading}
      </h1>
      <p className="mt-4 text-white/60 max-w-xl mx-auto">{band.body}</p>
    </motion.div>
  );
}

export function ScrollCarHero() {
  const pinRef = useRef<HTMLDivElement>(null);

  // 0 → 1 while the 400vh section scrolls past
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const ctaOpacity = useTransform(progress, [0.8, 0.95], [0, 1]);

  return (
    <div ref={pinRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <ScrollCarCanvas progress={progress} />
        </div>

        {/* readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/60" />

        {bands.map((b, i) => (
          <Band key={i} i={i} band={b} progress={progress} />
        ))}

        <motion.div
          style={{ opacity: ctaOpacity }}
          className="absolute bottom-[12%] inset-x-0 flex justify-center gap-4"
        >
          <Link href="/vehicles">
            <Button size="lg" className="btn-gradient rounded-full px-8 gap-2">
              Browse Vehicles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/finance">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Finance Options
            </Button>
          </Link>
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center text-white/50 text-xs tracking-widest"
        >
          SCROLL TO ROTATE
          <ChevronDown className="mt-2 h-5 w-5 animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
}

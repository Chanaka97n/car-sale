"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ *
 *  360° scroll-spin hero (image-sequence, no 3D / WebGL).
 *
 *  Drop a folder of frames in /public and point FRAME_PATH at it.
 *  Frames must be an ordered loop: frame_000 … frame_(N-1), one full
 *  turn. 36 frames = chunky, 72 = smooth, 96 = very smooth.
 *
 *  To make a per-vehicle spin, copy this file and change the two
 *  constants below (and the headlines). Real photos of your own cars
 *  on a turntable or a walk-around video split into frames work the
 *  same way — same component, just a different folder.
 * ------------------------------------------------------------------ */
const FRAME_COUNT = 72;
const FRAME_PATH = (i: number) =>
  `/cars/demo-spin/frame_${String(i).padStart(3, "0")}.webp`;

const bands = [
  {
    kicker: "QUALITY USED & IMPORTED VEHICLES",
    heading: "See Every Angle Before You Decide.",
    body: "Scroll to spin the car a full 360°.",
  },
  {
    kicker: "INSPECTED INSIDE AND OUT",
    heading: "Nothing Hidden. Nothing to Hide.",
    body: "Multi-point checks and full history on every vehicle.",
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
  const opacity = useTransform(
    progress,
    [start, start + 0.05, end - 0.05, end],
    [i === 0 ? 1 : 0, 1, 1, i === bands.length - 1 ? 1 : 0]
  );
  const y = useTransform(progress, [start, end], [24, -24]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 top-[12%] px-6 text-center"
    >
      <p className="text-xs tracking-[0.3em] text-[#1573DF] mb-3">
        {band.kicker}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 max-w-3xl mx-auto leading-tight">
        {band.heading}
      </h1>
      <p className="mt-3 text-neutral-500 max-w-xl mx-auto">{band.body}</p>
    </motion.div>
  );
}

export function ScrollSpinHero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const lastIdx = useRef(-1);
  const [loaded, setLoaded] = useState(0);

  // ---- preload every frame ----
  useEffect(() => {
    let done = 0;
    const arr: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        done += 1;
        setLoaded(done);
      };
      img.onerror = () => {
        done += 1;
        setLoaded(done);
      };
      arr[i] = img;
    }
    images.current = arr;
  }, []);

  // ---- draw one frame, "contain" inside the canvas ----
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = images.current[idx];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * 0.95;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }, []);

  // ---- scroll → frame index ----
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.0005,
  });

  useMotionValueEvent(progress, "change", (p) => {
    const idx = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(p * (FRAME_COUNT - 1)))
    );
    if (idx === lastIdx.current) return;
    lastIdx.current = idx;
    requestAnimationFrame(() => draw(idx));
  });

  // ---- draw first frame once loaded, and on resize ----
  useEffect(() => {
    if (loaded > 0) draw(Math.max(0, lastIdx.current));
  }, [loaded, draw]);

  useEffect(() => {
    const onResize = () => draw(Math.max(0, lastIdx.current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const ctaOpacity = useTransform(progress, [0.82, 0.96], [0, 1]);
  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <div ref={pinRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#f7f8fa]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* soft vignette so text stays readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f7f8fa] via-transparent to-[#f7f8fa]/70" />

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

        {/* loading bar until frames are ready */}
        {loaded < FRAME_COUNT && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <div className="h-1 w-40 overflow-hidden rounded-full bg-neutral-300">
              <div
                className="h-full bg-[#1573DF] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] tracking-widest text-neutral-400">
              LOADING {pct}%
            </p>
          </div>
        )}

        {loaded >= FRAME_COUNT && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-8 inset-x-0 flex flex-col items-center text-neutral-400 text-xs tracking-widest"
          >
            SCROLL TO SPIN
            <ChevronDown className="mt-2 h-5 w-5 animate-bounce" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

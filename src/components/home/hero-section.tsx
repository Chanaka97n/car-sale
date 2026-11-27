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
 *  BMW 520d scroll-scrubbed hero.
 *
 *  A short cinematic clip (turn -> bonnet opens -> engine rises
 *  out and separates into an exploded view) is split into still frames and drawn to a <canvas>.
 *  Scrolling down plays it forward, scrolling up plays it backward.
 *
 *  Frames live in /public/cars/bmw-520d/frame_000.webp ... and are made
 *  from the source video with:  scripts/extract-hero-frames.sh <video>
 *  The script also writes manifest.json, so the frame count is read at
 *  runtime and this file never needs editing after re-generating.
 *
 *  Until those frames exist, the hero falls back to the demo spin in
 *  /public/cars/demo-spin so the page never renders empty.
 * ------------------------------------------------------------------ */
const PRIMARY = {
  dir: "/cars/bmw-520d",
  manifest: "/cars/bmw-520d/manifest.json",
};
const FALLBACK = { dir: "/cars/demo-spin", count: 72 };
const framePath = (dir: string, i: number) =>
  `${dir}/frame_${String(i).padStart(3, "0")}.webp`;

/* Each chapter matches one beat of the clip (VID-20261126-WA0060.mp4, ~10s):
 *  0.00-0.18  front view on the stage
 *  0.18-0.45  doors open while the camera circles the car
 *  0.45-0.68  bonnet lifts
 *  0.68-0.84  engine rises out of the bay
 *  0.84-1.00  engine separates into an exploded view
 */
const chapters = [
  {
    from: 0,
    to: 0.18,
    kicker: "BMW 520d M SPORT",
    heading: "Presence, From Every Angle.",
    body: "Scroll to walk around it.",
    align: "left" as const,
  },
  {
    from: 0.18,
    to: 0.45,
    kicker: "STEP INSIDE",
    heading: "Room for Every Journey.",
    body: "Comfort and space front and rear, finished to BMW standards.",
    align: "right" as const,
  },
  {
    from: 0.45,
    to: 0.68,
    kicker: "LOOK UNDER THE BONNET",
    heading: "Nothing Hidden.",
    body: "Every car we sell is inspected inside and out.",
    align: "left" as const,
  },
  {
    from: 0.68,
    to: 0.84,
    kicker: "2.0 DIESEL · 48V MILD HYBRID",
    heading: "Efficiency, Engineered In.",
    body: "Effortless torque for the motorway, frugal enough for every day.",
    align: "right" as const,
  },
  {
    from: 0.84,
    to: 1,
    kicker: "EVERY PART CHECKED",
    heading: "Your Next Drive Starts Here.",
    body: "Inspected, warrantied and ready to drive away.",
    align: "left" as const,
  },
];

const specs = [
  { label: "Power", value: "197", unit: "hp" },
  { label: "Torque", value: "400", unit: "Nm" },
  { label: "0–62 mph", value: "7.3", unit: "s" },
];

function Chapter({
  c,
  i,
  progress,
}: {
  c: (typeof chapters)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  const first = i === 0;
  const last = i === chapters.length - 1;
  const stops = [c.from, c.from + 0.05, c.to - 0.05, c.to];
  const opacity = useTransform(progress, stops, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, [c.from, c.to], [28, -28]);
  const filter = useTransform(
    progress,
    stops,
    [first ? "blur(0px)" : "blur(8px)", "blur(0px)", "blur(0px)", last ? "blur(0px)" : "blur(8px)"]
  );
  const right = c.align === "right";

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className={`pointer-events-none absolute inset-x-0 top-[16%] px-6 text-center md:top-[38%] md:px-16 ${
        right ? "md:text-right" : "md:text-left"
      }`}
    >
      <div className={`mx-auto max-w-md ${right ? "md:mr-0 md:ml-auto" : "md:ml-0 md:mr-auto"}`}>
        <p className="mb-4 text-[0.65rem] tracking-[0.35em] text-orange-light md:text-xs">
          {c.kicker}
        </p>
        <h1 className="text-4xl font-bold leading-[1.05] text-white md:text-6xl">{c.heading}</h1>
        <p className="mt-4 text-sm text-white/55 md:text-base">{c.body}</p>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const lastIdx = useRef(0);
  const [frameCount, setFrameCount] = useState(0);
  const [loaded, setLoaded] = useState(0);

  /* ---- pick the frame set (real BMW frames, or demo fallback) ---- */
  useEffect(() => {
    let cancelled = false;
    const loadSet = (dir: string, count: number) => {
      if (cancelled) return;
      let done = 0;
      const arr: HTMLImageElement[] = [];
      for (let i = 0; i < count; i++) {
        const img = new window.Image();
        img.decoding = "async";
        img.src = framePath(dir, i);
        const tick = () => {
          done += 1;
          if (!cancelled) setLoaded(done);
        };
        img.onload = tick;
        img.onerror = tick;
        arr[i] = img;
      }
      images.current = arr;
      setFrameCount(count);
    };

    fetch(PRIMARY.manifest)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("no manifest"))))
      .then((m: { count?: number }) => {
        if (!m.count || m.count < 1) throw new Error("empty manifest");
        loadSet(PRIMARY.dir, m.count);
      })
      .catch(() => loadSet(FALLBACK.dir, FALLBACK.count));

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- draw one frame on a black canvas ---- */
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = images.current[idx];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cw = Math.round(w * dpr);
    const ch = Math.round(h * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    // Fit the whole frame so the top is never cropped; on tall phone screens
    // zoom in slightly so the car isn't tiny (sides crop, top stays intact).
    const contain = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const scale = w >= h ? contain : contain * 1.15;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }, []);

  /* ---- scroll -> frame index (plays forward and backward) ---- */
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0005,
  });

  useMotionValueEvent(progress, "change", (p) => {
    if (!frameCount) return;
    const idx = Math.min(frameCount - 1, Math.max(0, Math.round(p * (frameCount - 1))));
    if (idx === lastIdx.current) return;
    lastIdx.current = idx;
    requestAnimationFrame(() => draw(idx));
  });

  useEffect(() => {
    if (loaded > 0) draw(lastIdx.current);
  }, [loaded, draw]);

  useEffect(() => {
    const onResize = () => draw(lastIdx.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  /* ---- overlay motion ---- */
  const hintOpacity = useTransform(progress, [0, 0.04], [1, 0]);
  const specsOpacity = useTransform(progress, [0.69, 0.73, 0.82, 0.85], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(progress, [0.88, 0.97], [0, 1]);
  const ctaY = useTransform(progress, [0.88, 0.97], [24, 0]);
  const glow = useTransform(progress, [0, 0.5, 1], [0.35, 0.15, 0.5]);

  const pct = frameCount ? Math.round((loaded / frameCount) * 100) : 0;
  const ready = frameCount > 0 && loaded >= frameCount;

  return (
    <section
      ref={pinRef}
      className="relative bg-black"
      style={{ height: "700vh" }}
      aria-label="BMW 520d scroll showcase"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* video sits below the fixed header (88px mobile, 96px sm+) so nothing is hidden behind it */}
        <canvas
          ref={canvasRef}
          className="absolute inset-x-0 bottom-0 top-[88px] h-[calc(100%-88px)] w-full sm:top-24 sm:h-[calc(100%-6rem)]"
        />

        {/* brand-blue floor glow that breathes with scroll */}
        <motion.div
          style={{
            opacity: glow,
            background:
              "radial-gradient(ellipse 55% 60% at 50% 100%, rgba(21,115,223,0.35) 0%, transparent 70%)",
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        />

        {/* vignette + top/bottom fades keep copy readable on any frame */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-[88px] h-12 bg-gradient-to-b from-black to-transparent sm:top-24" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        {chapters.map((c, i) => (
          <Chapter key={c.kicker} c={c} i={i} progress={progress} />
        ))}

        {/* spec strip during the engine beat */}
        <motion.div
          style={{ opacity: specsOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-[14%] flex justify-center px-6"
        >
          <div className="glass flex divide-x divide-white/10 rounded-2xl border border-white/[0.06]">
            {specs.map((s) => (
              <div key={s.label} className="px-5 py-4 text-center md:px-8">
                <div className="text-2xl font-bold tabular-nums text-white md:text-3xl">
                  {s.value}
                  <span className="ml-1 text-sm font-medium text-orange-light">{s.unit}</span>
                </div>
                <div className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs once the door is open */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-x-0 bottom-[12%] flex flex-col items-center justify-center gap-3 px-6 sm:flex-row sm:gap-4"
        >
          <Link href="/vehicles">
            <Button size="lg" className="btn-gradient gap-2 rounded-full px-8">
              Browse Vehicles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10"
            >
              Book a Test Drive
            </Button>
          </Link>
        </motion.div>

        {/* scroll progress rail */}
        <div className="absolute right-6 top-1/2 hidden h-40 w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10 md:block">
          <motion.div
            style={{ scaleY: progress, transformOrigin: "top" }}
            className="h-full w-full bg-orange"
          />
        </div>

        {!ready && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-orange transition-[width] duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-[0.6rem] tracking-[0.3em] text-white/40">LOADING {pct}%</p>
          </div>
        )}

        {ready && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute inset-x-0 bottom-8 flex flex-col items-center text-[0.6rem] tracking-[0.35em] text-white/40"
          >
            SCROLL TO EXPLORE
            <ChevronDown className="mt-2 h-5 w-5 animate-bounce" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Shield, Award, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const promises = [
  {
    icon: Shield,
    title: "Multi-Point Inspected",
    desc: "Every vehicle passes a rigorous check before it reaches the forecourt.",
  },
  {
    icon: Award,
    title: "Warranty Included",
    desc: "Drive with confidence — comprehensive cover comes as standard.",
  },
  {
    icon: Wrench,
    title: "Full Service History",
    desc: "Transparent records so you know exactly what you're buying.",
  },
];

export function CarShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textRef, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0.5, 0.75]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Full-bleed cinematic car image with parallax */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=900&fit=crop&q=90"
          alt="Premium vehicle on road"
          className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
          style={{ y: imageY }}
        />

        {/* Dark overlay — strengthens on scroll */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayOpacity,
            background:
              "linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.3) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 pointer-events-none" />

        {/* Content over image */}
        <div className="relative z-10 h-full flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div ref={textRef} className="max-w-xl">
              <motion.span
                className="block font-mono text-xs tracking-[0.16em] text-orange mb-4 uppercase"
                initial={{ opacity: 0, y: 12 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 0.8, 0.28, 1] }}
              >
                Quality You Can Trust
              </motion.span>

              <motion.h2
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-[1.05]"
                style={{
                  textShadow:
                    "0 2px 4px rgba(0,0,0,0.8), 0 8px 30px rgba(0,0,0,0.5)",
                }}
                initial={{ opacity: 0, y: 28 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
              >
                Every Car.
                <br />
                <span className="text-gradient">Properly Inspected.</span>
              </motion.h2>

              <motion.p
                className="mt-4 text-zinc-300 text-base max-w-md leading-relaxed"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
              >
                Nothing leaves our showroom until it&apos;s been fully vetted.
                We stake our reputation on every vehicle we sell.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.35,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
                className="mt-7"
              >
                <Link href="/about">
                  <Button className="bg-orange hover:bg-orange-dark text-white rounded-full px-7 gap-2 shadow-lg shadow-orange/20 hover:scale-105 active:scale-95 transition-all">
                    Our Promise
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Promise strip — below the image */}
      <div className="relative z-10 bg-surface border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promises.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex gap-4 items-start"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
              >
                <div className="shrink-0 w-11 h-11 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Award,
  Handshake,
  Truck,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const features = [
  {
    icon: Shield,
    title: "Carefully Curated Stock",
    description: "Only the best quality used vehicles make it to our showroom.",
  },
  {
    icon: Handshake,
    title: "Trusted & Transparent",
    description:
      "Straightforward advice with no hidden surprises or pressure sales.",
  },
  {
    icon: Award,
    title: "Flexible Finance",
    description: "Competitive, tailored finance options to suit your budget.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "We deliver your vehicle anywhere in the UK straight to your door.",
  },
];

const featureVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-surface/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: 24 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-1 rounded-full bg-orange"
                />
                <span className="text-sm font-medium text-orange uppercase tracking-wider">
                  Why Choose Us
                </span>
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase text-white leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-block"
                >
                  Experience The
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-gradient inline-block"
                >
                  MVA Difference
                </motion.span>
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-zinc-400 max-w-md leading-relaxed"
              >
                We&apos;re not just another car dealership. We&apos;re committed
                to providing an exceptional buying experience from start to
                finish.
              </motion.p>
            </motion.div>

            <div className="mt-10 space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  custom={i}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex gap-4 group cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0 group-hover:bg-orange/20 group-hover:border-orange/40 transition-colors"
                  >
                    <feature.icon className="w-5 h-5 text-orange" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-orange transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Visual with parallax */}
          <div className="relative">
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-square rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop"
                alt="Premium car showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </motion.div>

            {/* Floating Review Card with parallax */}
            <motion.div
              style={{ y: cardY }}
              initial={{ opacity: 0, y: 30, x: -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 border border-white/10 max-w-xs"
            >
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + j * 0.1 }}
                  >
                    <Star className="w-4 h-4 fill-orange text-orange" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-zinc-300 italic">
                &ldquo;Best car buying experience I&apos;ve ever had. No
                pressure, transparent pricing.&rdquo;
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                David T. — Audi Q5 Owner
              </p>
            </motion.div>

            {/* Floating Stats with parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              className="absolute -top-4 -right-4 glass rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    <AnimatedCounter value={150} suffix="+" />
                  </p>
                  <p className="text-xs text-zinc-400">5-Star Reviews</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

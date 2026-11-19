"use client";

import { motion } from "framer-motion";
import {
  Car,
  Globe,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Car,
    title: "Quality Used Car Sales",
    description:
      "We aim to offer a selection of quality pre-owned vehicles to suit different lifestyles, preferences and budgets.",
    href: "/vehicles",
    color: "from-orange/20 to-orange-dark/10",
  },
  {
    icon: Globe,
    title: "Imported Vehicles",
    description:
      "Explore a wider range of automotive options with our imported vehicle selection, bringing quality and choice together.",
    href: "/vehicles",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: Users,
    title: "Personalised Assistance",
    description:
      "We provide helpful information and straightforward communication so you can explore your options with confidence.",
    href: "/contact",
    color: "from-emerald-500/20 to-emerald-600/10",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function ServicesSection() {
  return (
    <section className="py-24 relative overflow-hidden">

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-px bg-orange"
            />
            <span className="text-sm font-medium text-orange uppercase tracking-wider">
              Our Services
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-px bg-orange"
            />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase text-white">
            Helping You Find the{" "}
            <span className="text-gradient">Right Vehicle</span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Quality used and imported vehicles, supported by a professional and
            customer-focused approach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <Link
                href={service.href}
                className="group block h-full bg-surface rounded-2xl border border-white/5 p-6 hover:border-orange/20 transition-all duration-500 relative overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-orange/5"
              >
                {/* MaxTorque-style top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:border-orange/30 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-orange" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange group-hover:gap-2 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

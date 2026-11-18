"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every vehicle in our stock undergoes a rigorous multi-point inspection. We only sell cars we'd drive ourselves.",
  },
  {
    icon: Award,
    title: "Transparency",
    description:
      "No hidden fees, no pressure tactics. Just honest pricing and straightforward advice you can trust.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Your satisfaction is our priority. We build lasting relationships, not just transactions.",
  },
  {
    icon: Target,
    title: "Expertise",
    description:
      "Our team brings decades of automotive experience to help you find the perfect vehicle.",
  },
];

const stats = [
  { value: "500+", label: "Vehicles Sold" },
  { value: "150+", label: "5-Star Reviews" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "10+", label: "Years Experience" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-orange uppercase tracking-wider font-medium">
              About Us
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase text-white mt-2">
              The MVA Motor{" "}
              <span className="text-gradient">Company Story</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-lg">
              Built on passion, trust and a commitment to excellence in every
              vehicle we sell.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl font-bold uppercase text-white mb-6">
                Driven By <span className="text-gradient">Passion</span>
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  MVA Motor Company was founded with a simple mission: to make
                  buying a premium used car an experience you actually enjoy. No
                  pressure, no gimmicks — just quality vehicles and honest
                  advice.
                </p>
                <p>
                  Based in Manchester, we&apos;ve built our reputation on
                  carefully curating our stock, ensuring every vehicle meets our
                  high standards before it reaches our forecourt. Our team of
                  automotive enthusiasts handpick each car, so you can browse
                  with confidence.
                </p>
                <p>
                  Whether you&apos;re looking for a family SUV, a performance
                  saloon or an eco-friendly hybrid, we&apos;ve got you covered
                  with flexible finance options and competitive part exchange
                  valuations.
                </p>
              </div>
              <Link href="/vehicles" className="inline-block mt-8">
                <Button className="bg-orange hover:bg-orange-dark text-white rounded-full px-8 gap-2">
                  Browse Our Stock
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1562141961-b5d1de9a7708?w=800&h=600&fit=crop"
                  alt="MVA Motor Company showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-orange/20 rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface/50 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-bold text-orange">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl font-bold uppercase text-white">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              The principles that guide everything we do at MVA Motor Company.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface rounded-2xl border border-white/5 p-6 text-center hover:border-orange/20 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange/10 border border-orange/20 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-6 h-6 text-orange" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange via-orange-dark to-orange rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
            <div className="relative">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mb-4">
                Ready to Find Your Next Car?
              </h2>
              <p className="text-white/80 max-w-md mx-auto mb-8">
                Visit our showroom or browse online. Our team is here to help
                you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/vehicles">
                  <Button
                    size="lg"
                    className="bg-white text-orange-dark hover:bg-white/90 rounded-full px-8 gap-2 font-semibold"
                  >
                    Browse Vehicles
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 border-white/30 text-white hover:bg-white/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

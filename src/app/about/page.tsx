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
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const values = [
  {
    icon: Shield,
    title: "Putting Quality First",
    description:
      "Every vehicle we sell is carefully selected and thoroughly inspected. We focus on quality over quantity, so you can browse with confidence.",
  },
  {
    icon: Users,
    title: "A Personal Approach",
    description:
      "We take the time to understand what you're looking for and guide you through the process — no pressure, no rush.",
  },
  {
    icon: Award,
    title: "Transparency You Can Trust",
    description:
      "Honest pricing, clear vehicle histories, and straightforward advice. What you see is what you get.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become a trusted name in the used car market by consistently delivering quality vehicles and an outstanding customer experience.",
  },
];

const stats = [
  { value: "500+", label: "Vehicles Sold" },
  { value: "150+", label: "5-Star Reviews" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "100%", label: "Quality Inspected" },
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
              Driven by Quality.{" "}
              <span className="text-gradient">Built on Trust.</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-lg">
              Apex Select Automotive is a new independent automotive business
              with a clear ambition: to offer quality used and imported vehicles
              alongside excellent customer service and a buying experience
              customers can feel confident about.
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
                Putting Quality <span className="text-gradient">First</span>
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  Apex Select Automotive was founded with a clear mission: to
                  offer quality used and imported vehicles with a service that
                  puts the customer first.
                </p>
                <p>
                  Based in Weston-super-Mare, we carefully select every vehicle
                  in our range, ensuring it meets our high standards before it
                  ever reaches you. Whether you&apos;re looking for a reliable
                  everyday car or something a little more special, we&apos;re
                  here to help you find the right fit.
                </p>
                <p>
                  We believe buying a car should be an exciting experience, not a
                  stressful one. That&apos;s why we focus on making the process
                  as straightforward, transparent and enjoyable as possible — from
                  your first enquiry to the moment you drive away.
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
                  alt="Apex Select Automotive"
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

      {/* A Personal Approach */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop"
                  alt="Personal approach to car buying"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="font-heading text-4xl font-bold uppercase text-white mb-6">
                A Personal <span className="text-gradient">Approach</span>
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  We take the time to understand what you&apos;re looking for and
                  guide you through the process at your pace. Whether you have
                  questions about a specific vehicle, need help arranging finance,
                  or simply want honest advice — we&apos;re here for you.
                </p>
                <p>
                  Our goal is to build lasting relationships with our customers,
                  not just complete a sale. We want you to feel confident and
                  excited about your purchase, every step of the way.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl font-bold uppercase text-white">
              Why Choose <span className="text-gradient">Apex Select</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              The principles that guide everything we do.
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
                Browse our latest stock or get in touch. Our team is here to
                help you every step of the way.
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

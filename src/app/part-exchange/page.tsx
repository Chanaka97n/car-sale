"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Car,
  PoundSterling,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const steps = [
  {
    icon: Car,
    step: "01",
    title: "Tell Us About Your Car",
    description:
      "Enter your vehicle details or registration number for an instant estimate.",
  },
  {
    icon: PoundSterling,
    step: "02",
    title: "Get Your Valuation",
    description:
      "We'll provide a fair, competitive valuation based on current market data.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Drive Away Happy",
    description:
      "Use your part exchange value towards your next vehicle. Simple as that.",
  },
];

export default function PartExchangePage() {
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
              Part Exchange
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase text-white mt-2">
              Trade In Your
              <br />
              <span className="text-gradient">Current Vehicle</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-lg">
              Get a fair, competitive valuation for your current car and put it
              towards your next vehicle with MVA Motor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl font-bold uppercase text-white">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-md mx-auto">
              Three simple steps to exchange your current car for your next one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-surface rounded-2xl border border-white/5 p-8 text-center hover:border-orange/20 transition-all duration-500"
              >
                <span className="text-6xl font-bold text-white/5 absolute top-4 right-6 font-heading">
                  {step.step}
                </span>
                <div className="w-16 h-16 rounded-2xl bg-orange/10 border border-orange/20 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-7 h-7 text-orange" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation Form */}
      <section className="py-16 bg-surface/50 border-y border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading text-3xl font-bold uppercase text-white">
              Get Your <span className="text-gradient">Free Valuation</span>
            </h2>
            <p className="mt-3 text-zinc-400">
              Enter your vehicle details below for an instant estimate.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface rounded-2xl border border-white/5 p-8"
          >
            <form className="space-y-5">
              <div>
                <Label className="text-xs text-zinc-400 mb-1.5 block">
                  Registration Number
                </Label>
                <Input
                  placeholder="e.g. AB12 CDE"
                  className="rounded-xl bg-white/5 border-white/10 text-white text-center text-lg font-bold uppercase placeholder:text-zinc-600 h-14"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-zinc-400 mb-1.5 block">
                    Current Mileage
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 45,000"
                    className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400 mb-1.5 block">
                    Condition
                  </Label>
                  <Select>
                    <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-white/10">
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-zinc-400 mb-1.5 block">
                    Your Name *
                  </Label>
                  <Input
                    placeholder="Full name"
                    className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400 mb-1.5 block">
                    Phone Number *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="07700 900123"
                    className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <Button className="w-full bg-orange hover:bg-orange-dark text-white rounded-xl h-12 gap-2 font-semibold shadow-lg shadow-orange/20">
                <ArrowLeftRight className="w-4 h-4" />
                Get My Free Valuation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl font-bold uppercase text-white mb-4">
              Ready to Upgrade?
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
              Browse our premium stock and find the perfect upgrade for your
              current vehicle.
            </p>
            <Link href="/vehicles">
              <Button className="bg-orange hover:bg-orange-dark text-white rounded-full px-8 gap-2 shadow-lg shadow-orange/20">
                Browse Our Stock
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

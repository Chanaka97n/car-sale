"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Percent,
  Clock,
  CheckCircle2,
  ArrowRight,
  PoundSterling,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const SpeedGauge3D = dynamic(
  () =>
    import("@/components/three/speed-gauge").then((m) => ({
      default: m.SpeedGauge3D,
    })),
  { ssr: false },
);

export default function FinancePage() {
  const [loanAmount, setLoanAmount] = useState([25000]);
  const [term, setTerm] = useState([48]);
  const [deposit, setDeposit] = useState([5000]);

  const monthlyPayment = Math.round(
    ((loanAmount[0] - deposit[0]) * 1.08) / term[0],
  );

  const benefits = [
    "No obligation quote",
    "Competitive interest rates",
    "Flexible terms from 12-60 months",
    "PCP, HP & Personal Loan options",
    "Quick online application",
    "Decisions within hours",
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-sm text-orange uppercase tracking-wider font-medium">
                Vehicle Finance
              </span>
              <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase text-white mt-2">
                Flexible{" "}
                <span className="text-gradient">Finance Options</span>
              </h1>
              <p className="mt-4 text-zinc-400 max-w-lg">
                Make your next car more affordable with our tailored finance
                solutions. Competitive rates and a simple, straightforward
                process.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block h-[300px]"
            >
              <SpeedGauge3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-6 rounded-full bg-orange" />
                <span className="text-sm font-medium text-orange uppercase tracking-wider">
                  Finance Calculator
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold uppercase text-white mb-4">
                Estimate Your{" "}
                <span className="text-gradient">Monthly Payment</span>
              </h2>
              <p className="text-zinc-400 mb-10">
                Use our calculator to get an idea of your monthly payments.
                Contact us for a personalised quote.
              </p>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm text-zinc-400">
                      Vehicle Price
                    </Label>
                    <span className="text-sm font-semibold text-white">
                      &pound;{loanAmount[0].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={loanAmount}
                    onValueChange={(val) => setLoanAmount(Array.isArray(val) ? val : [val])}
                    min={5000}
                    max={100000}
                    step={500}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm text-zinc-400">Deposit</Label>
                    <span className="text-sm font-semibold text-white">
                      &pound;{deposit[0].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={deposit}
                    onValueChange={(val) => setDeposit(Array.isArray(val) ? val : [val])}
                    min={0}
                    max={Math.floor(loanAmount[0] * 0.5)}
                    step={500}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm text-zinc-400">
                      Term (months)
                    </Label>
                    <span className="text-sm font-semibold text-white">
                      {term[0]} months
                    </span>
                  </div>
                  <Slider
                    value={term}
                    onValueChange={(val) => setTerm(Array.isArray(val) ? val : [val])}
                    min={12}
                    max={60}
                    step={6}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <div className="w-full bg-surface rounded-3xl border border-white/5 p-8 sm:p-10">
                <p className="text-sm text-zinc-400 mb-2">
                  Estimated Monthly Payment
                </p>
                <p className="text-5xl sm:text-6xl font-bold text-white mb-1">
                  &pound;{monthlyPayment.toLocaleString()}
                  <span className="text-lg text-zinc-500 font-normal">
                    /mo
                  </span>
                </p>
                <p className="text-xs text-zinc-500 mb-8">
                  *Representative example. Actual rates may vary.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Vehicle Price</span>
                    <span className="text-white font-medium">
                      &pound;{loanAmount[0].toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Deposit</span>
                    <span className="text-white font-medium">
                      &pound;{deposit[0].toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Amount to Finance</span>
                    <span className="text-white font-medium">
                      &pound;
                      {(loanAmount[0] - deposit[0]).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Term</span>
                    <span className="text-white font-medium">
                      {term[0]} months
                    </span>
                  </div>
                </div>

                <Button className="w-full btn-gradient rounded-xl h-12 gap-2 font-semibold">
                  Apply for Finance
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-xs text-zinc-500 text-center mt-3">
                  No impact on your credit score
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-surface/50 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl font-bold uppercase text-white">
              Why Finance With <span className="text-gradient">Apex Select</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-surface rounded-xl border border-white/5 p-4"
              >
                <CheckCircle2 className="w-5 h-5 text-orange shrink-0" />
                <span className="text-sm text-zinc-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
              Apply online or speak to our finance specialists for a
              personalised quote with no obligation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="btn-gradient rounded-full px-8 gap-2">
                  Get a Finance Quote
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/vehicles">
                <Button
                  variant="outline"
                  className="rounded-full px-8 border-white/20 text-white hover:bg-white/5"
                >
                  Browse Vehicles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

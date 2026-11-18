"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator, Percent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinanceBanner() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange via-orange-dark to-orange" />
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative px-8 py-14 sm:px-12 sm:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl">
                <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white leading-tight">
                  Flexible Finance
                  <br />
                  Options Available
                </h2>
                <p className="mt-4 text-white/80 max-w-md">
                  Tailored finance solutions to make your next car even more
                  affordable, with competitive rates and a simple,
                  straightforward process.
                </p>

                <div className="flex flex-wrap gap-6 mt-8">
                  {[
                    { icon: Calculator, text: "Quick Calculator" },
                    { icon: Percent, text: "Competitive Rates" },
                    { icon: Clock, text: "Quick Approval" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-2 text-white/90"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-10">
                  <Link href="/finance">
                    <Button
                      size="lg"
                      className="bg-white text-orange-dark hover:bg-white/90 rounded-full px-8 gap-2 font-semibold"
                    >
                      Get a Finance Quote
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/finance">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 border-white/30 text-white hover:bg-white/10"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Decorative */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-white">0%</p>
                        <p className="text-sm text-white/70 mt-1">
                          APR Available
                        </p>
                        <p className="text-xs text-white/50 mt-0.5">
                          On selected vehicles
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

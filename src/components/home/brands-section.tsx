"use client";

import { motion } from "framer-motion";

const brands = [
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Range Rover",
  "Volkswagen",
  "Volvo",
  "Porsche",
  "Jaguar",
  "Tesla",
  "Land Rover",
];

export function BrandsSection() {
  return (
    <section className="py-16 border-y border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-[0.3em] text-zinc-500 mb-10"
        >
          Trusted Brands We Stock
        </motion.p>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center flex-wrap gap-x-12 gap-y-6"
          >
            {brands.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-zinc-500 hover:text-white transition-colors cursor-default"
              >
                <span className="font-heading text-lg font-medium uppercase tracking-wider">
                  {brand}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

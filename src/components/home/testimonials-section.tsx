"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateY: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Testimonials
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
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: "1200px" }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group bg-surface rounded-2xl border border-white/5 p-6 hover:border-orange/20 hover:shadow-xl hover:shadow-orange/5 transition-colors duration-500 relative"
            >
              {/* Animated glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, rotate: -20 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <Quote className="w-8 h-8 text-orange/20 mb-4" />
                </motion.div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.5 + i * 0.15 + j * 0.08,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <Star className="w-4 h-4 fill-orange text-orange" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-zinc-300 leading-relaxed mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center"
                  >
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

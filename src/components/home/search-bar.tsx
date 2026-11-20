"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makes, bodyTypes } from "@/lib/data";

export function SearchBar() {
  return (
    <section className="relative z-20 -mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl border border-white/10 p-6 shadow-2xl shadow-black/40"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-orange" />
            <h3 className="font-heading text-lg font-semibold uppercase text-white">
              Find Your Next Car
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-12">
                <SelectValue placeholder="Any Make" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {makes.map((make) => (
                  <SelectItem key={make} value={make.toLowerCase()}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-12">
                <SelectValue placeholder="Any Model" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                <SelectItem value="all">All Models</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-12">
                <SelectValue placeholder="Max Price" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {[15000, 20000, 30000, 40000, 50000, 75000, 100000].map(
                  (price) => (
                    <SelectItem key={price} value={price.toString()}>
                      &pound;{price.toLocaleString()}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-12">
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-white/10">
                {bodyTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="btn-gradient rounded-xl h-12 gap-2 font-semibold">
              <Search className="w-5 h-5" />
              Search
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

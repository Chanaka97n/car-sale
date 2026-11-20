"use client";

import { motion } from "framer-motion";
import {
  Car,
  Globe,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    id: "quality-used-cars",
    icon: Car,
    kicker: "Quality Used Car Sales",
    title: "Find a Car That Suits You",
    description:
      "We aim to offer a selection of quality pre-owned vehicles to suit different lifestyles, preferences and budgets.",
    detail:
      "From practical everyday cars to vehicles with something extra to offer, our focus is on helping customers find the right fit.",
    cta: "Explore Our Vehicles",
    href: "/vehicles",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
  },
  {
    id: "imported-vehicles",
    icon: Globe,
    kicker: "Imported Vehicles",
    title: "Explore Something Different",
    description:
      "Alongside our used vehicle selection, Apex Select Automotive specialises in imported cars, giving customers the opportunity to explore a wider range of automotive options.",
    detail:
      "We aim to bring quality and choice together, helping customers discover vehicles that suit their individual preferences.",
    cta: "Contact Us to Learn More",
    href: "/contact",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop",
  },
  {
    id: "personalised-assistance",
    icon: Users,
    kicker: "Personalised Customer Assistance",
    title: "Support Throughout Your Search",
    description:
      "Finding the right vehicle often comes with questions. We're committed to providing helpful information and straightforward communication so you can explore your options with confidence.",
    detail:
      "Whether you're enquiring about a particular vehicle or looking for more information about our stock, our team is here to help.",
    cta: "Get in Touch",
    href: "/contact",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=500&fit=crop",
  },
];

export default function ServicesPage() {
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
              Our Services
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase text-white mt-2">
              Helping You Find the{" "}
              <span className="text-gradient">Right Vehicle</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-lg">
              At Apex Select Automotive, our focus is on offering quality used
              and imported vehicles, supported by a professional and
              customer-focused approach.
            </p>
            <p className="mt-3 text-zinc-400 max-w-lg">
              Whether you&apos;re searching for your next everyday car or
              exploring imported vehicle options, we&apos;re here to help you
              make an informed choice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, i) => (
              <motion.div
                id={service.id}
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
                className="grid lg:grid-cols-2 gap-12 items-center scroll-mt-24"
              >
                <div
                  className={i % 2 === 1 ? "order-2 lg:order-1" : "order-2"}
                >
                  <div className="aspect-[16/10] rounded-3xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className={i % 2 === 1 ? "order-1 lg:order-2" : "order-1"}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-orange" />
                    </div>
                    <span className="text-sm font-medium text-orange uppercase tracking-wider">
                      {service.kicker}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mb-4">
                    {service.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <p className="text-zinc-400 leading-relaxed mb-8">
                    {service.detail}
                  </p>
                  <Link href={service.href}>
                    <Button className="btn-gradient rounded-full px-8 gap-2">
                      {service.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
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
                Looking for Your Next Car?
              </h2>
              <p className="text-white/80 max-w-md mx-auto mb-8">
                Get in touch with Apex Select Automotive to discuss your
                requirements or enquire about our available vehicles.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-orange-dark hover:bg-white/90 rounded-full px-8 gap-2 font-semibold"
                >
                  Get in Touch
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

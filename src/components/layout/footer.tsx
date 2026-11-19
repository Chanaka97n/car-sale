import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Globe,
  MessageCircle,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Inventory", href: "/vehicles" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Finance", href: "/finance" },
];

const infoLinks = [
  { label: "FAQs", href: "/faqs" },
  { label: "Delivery & Collection", href: "/delivery" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      {/* CTA Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange/20 via-orange-dark/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-white">
                Find Your Next Car{" "}
                <span className="text-gradient">Today</span>
              </h2>
              <p className="mt-2 text-zinc-400 max-w-md">
                Browse our latest stock, book a test drive or speak to our team
                and discover the Apex Select difference.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/vehicles">
                <Button className="bg-orange hover:bg-orange-dark text-white rounded-full px-8 gap-2 shadow-lg shadow-orange/20">
                  Browse Vehicles
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full px-8 border-white/20 text-white hover:bg-white/5 gap-2"
                >
                  Contact Our Team
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <img
                src="/images/logo.png"
                alt="Apex Select Automotive"
                className="h-14 w-auto"
              />
            </div>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-orange shrink-0" />
                <span>
                  Apex Select Automotive
                  <br />
                  10B Orchard Street
                  <br />
                  Weston-super-Mare, UK
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange shrink-0" />
                <span>+44 (0)161 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange shrink-0" />
                <span>info@apexselectautomotive.co.uk</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-orange shrink-0" />
                <span>
                  Mon-Fri: 9am - 7pm
                  <br />
                  Sat: 9am - 6pm
                  <br />
                  Sun: 10am - 4pm
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-6">
              Useful Information
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-6">Stay Connected</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Get the latest stock, offers and insights from Apex Select.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
              />
              <Button className="bg-orange hover:bg-orange-dark text-white rounded-full px-6 shrink-0">
                Subscribe
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-6">
              {[Globe, MessageCircle, Tv].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-orange hover:border-orange/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>&copy; 2024 Apex Select Automotive. All rights reserved.</p>
            <p>FCA Authorised & Regulated</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

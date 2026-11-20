"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Heart, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Quality Used Car Sales", href: "/services#quality-used-cars" },
      { label: "Imported Vehicles", href: "/services#imported-vehicles" },
      { label: "Personalised Assistance", href: "/services#personalised-assistance" },
    ],
  },
  {
    label: "Inventory",
    href: "/vehicles",
    children: [
      { label: "All Vehicles", href: "/vehicles" },
      { label: "SUVs", href: "/vehicles?body=SUV" },
      { label: "Saloons", href: "/vehicles?body=Saloon" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="Apex Select Automotive"
              className="h-12 sm:h-14 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3 h-3" />}
                </Link>
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 glass rounded-xl border border-white/10 p-2 shadow-2xl"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
              <Heart className="w-5 h-5" />
            </button>
            <Link href="/contact">
              <Button className="hidden sm:flex btn-gradient rounded-full px-6 gap-2">
                <Phone className="w-4 h-4" />
                Enquire Now
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors text-white">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-background border-l border-white/10 p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/10">
                    <img
                      src="/images/logo.png"
                      alt="Apex Select Automotive"
                      className="h-10 w-auto"
                    />
                  </div>
                  <nav className="flex-1 p-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-3.5 text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-6 border-t border-white/10">
                    <Button className="w-full btn-gradient rounded-full gap-2">
                      <Phone className="w-4 h-4" />
                      Enquire Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

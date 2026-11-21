"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Calendar as CalendarIcon,
  ArrowRight,
  Send,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addEnquiry } from "@/redux/admin/enquiries/enquiriesIndex";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    detail: "+44 (0)161 XXX XXXX",
    sub: "Speak to our friendly team for immediate assistance.",
    href: "tel:+441610000000",
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: "info@apexselectautomotive.co.uk",
    sub: "Send us your enquiry and we'll get back to you shortly.",
    href: "mailto:info@apexselectautomotive.co.uk",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    detail: "Chat with an expert",
    sub: "Mon - Sat, 9am - 6pm",
    href: "#",
  },
  {
    icon: CalendarIcon,
    title: "Book a Visit",
    detail: "Arrange a test drive",
    sub: "Or an in-person consultation.",
    href: "#booking",
  },
];

const faqs = [
  {
    q: "Do I need to book a test drive in advance?",
    a: "While walk-ins are welcome, we recommend booking in advance to ensure the vehicle you want to see is ready and available for your test drive.",
  },
  {
    q: "How long is a test drive?",
    a: "Test drives typically last 30-45 minutes, giving you plenty of time to get a feel for the vehicle on different road types.",
  },
  {
    q: "Can I part exchange my current car?",
    a: "Absolutely! We offer competitive part exchange valuations. You can get an initial estimate online or visit us for a full appraisal.",
  },
  {
    q: "Do you offer finance options?",
    a: "Yes, we offer a range of flexible finance options including PCP, HP, and personal loans. We work with multiple lenders to find the best rate for you.",
  },
  {
    q: "Where are you located?",
    a: "We're based in Weston-super-Mare, UK. Please contact us before arranging a visit, as our vehicle viewing location is yet to be confirmed.",
  },
];

const enquiryTypes = [
  {
    title: "Vehicle Enquiry",
    description: "Ask about a specific car, stock availability or features.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
  },
  {
    title: "Finance Enquiry",
    description: "Get a personalised finance quote and flexible options.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
  },
  {
    title: "Part Exchange",
    description: "Value your current vehicle and explore upgrade options.",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=250&fit=crop",
  },
  {
    title: "General Enquiry",
    description: "For all other questions, our team is ready to help.",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop",
  },
];

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const allVehicles = useAppSelector((s) => s.vehicles.allVehicles);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [disableBefore, setDisableBefore] = useState<Date | undefined>(undefined);

  const [bookingForm, setBookingForm] = useState({
    vehicle: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    marketing: false,
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.firstName || !bookingForm.email || !bookingForm.phone) return;
    const selectedVehicle = allVehicles.find((v) => v.id === bookingForm.vehicle);
    dispatch(
      addEnquiry({
        type: "test-drive",
        firstName: bookingForm.firstName,
        lastName: bookingForm.lastName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        message: bookingForm.message || "I'd like to book a test drive.",
        vehicleId: bookingForm.vehicle || undefined,
        vehicleLabel: selectedVehicle
          ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.variant}`
          : undefined,
        preferredDate: date ? date.toISOString().split("T")[0] : undefined,
        preferredTime: bookingForm.time || undefined,
        marketingConsent: bookingForm.marketing,
      })
    );
    setBookingSubmitted(true);
  };

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
              Contact Us
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase text-white mt-2">
              We&apos;d Love to{" "}
              <span className="text-gradient">Hear From You</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-lg">
              Have a question about one of our vehicles or want to find out more
              about what we offer? Whether you&apos;re enquiring about our used
              cars, imported vehicles or general availability, our team is here
              to help.
            </p>
            <div className="flex gap-4 mt-8">
              <Button className="btn-gradient rounded-full px-8 gap-2">
                Book a Test Drive
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/5 gap-2"
              >
                Contact Our Team
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-16 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-surface border border-white/5 rounded-3xl" />
            <div className="relative grid lg:grid-cols-5 gap-0">
              {/* Image */}
              <div className="lg:col-span-2 relative min-h-[300px] lg:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=800&fit=crop"
                  alt="Premium car"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent lg:hidden" />
              </div>

              {/* Form */}
              <div className="lg:col-span-3 p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 rounded-full bg-orange" />
                  <span className="text-sm font-medium text-orange uppercase tracking-wider">
                    Book a Test Drive
                  </span>
                </div>
                <h2 className="font-heading text-3xl font-bold uppercase text-white mb-2">
                  Book Your Test Drive
                </h2>
                <p className="text-zinc-400 text-sm mb-8">
                  Experience your next car in person. Choose a vehicle and a
                  time that suits you.
                </p>

                {bookingSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Booking Received!</h3>
                    <p className="text-zinc-400">
                      We&apos;ll confirm your test drive shortly.
                    </p>
                    <Button
                      className="mt-6 btn-gradient rounded-full px-8"
                      onClick={() => {
                        setBookingSubmitted(false);
                        setBookingForm({ vehicle: "", time: "", firstName: "", lastName: "", email: "", phone: "", message: "", marketing: false });
                        setDate(undefined);
                      }}
                    >
                      Book Another
                    </Button>
                  </div>
                ) : (
                <form className="space-y-5" onSubmit={handleBookingSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Vehicle (Optional)
                      </Label>
                      <Select
                        value={bookingForm.vehicle}
                        onValueChange={(val) => setBookingForm((p) => ({ ...p, vehicle: val ?? "" }))}
                      >
                        <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select a Vehicle" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface border-white/10">
                          {allVehicles.filter((v) => v.vehicleStatus !== "sold").map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.make} {v.model} {v.variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Preferred Date
                      </Label>
                      <Popover open={dateOpen} onOpenChange={(open) => {
                          if (open) setDisableBefore(new Date());
                          setDateOpen(open);
                        }}>
                        <PopoverTrigger
                          className="flex h-10 w-full items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <span className={date ? "text-white" : "text-zinc-500"}>
                            {date
                              ? date.toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "Pick a date"}
                          </span>
                          <CalendarIcon className="w-4 h-4 text-zinc-500" />
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-auto p-0 bg-surface border-white/10"
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                              setDate(d ?? undefined);
                              setDateOpen(false);
                            }}
                            disabled={disableBefore ? { before: disableBefore } : undefined}
                            className="[--cell-size:--spacing(8)]"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Preferred Time
                      </Label>
                      <Select
                        value={bookingForm.time}
                        onValueChange={(val) => setBookingForm((p) => ({ ...p, time: val ?? "" }))}
                      >
                        <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select a Time" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface border-white/10">
                          {[
                            "9:00 AM",
                            "10:00 AM",
                            "11:00 AM",
                            "12:00 PM",
                            "1:00 PM",
                            "2:00 PM",
                            "3:00 PM",
                            "4:00 PM",
                            "5:00 PM",
                          ].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        First Name *
                      </Label>
                      <Input
                        placeholder="e.g. James"
                        value={bookingForm.firstName}
                        onChange={(e) => setBookingForm((p) => ({ ...p, firstName: e.target.value }))}
                        required
                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Last Name *
                      </Label>
                      <Input
                        placeholder="e.g. Mitchell"
                        value={bookingForm.lastName}
                        onChange={(e) => setBookingForm((p) => ({ ...p, lastName: e.target.value }))}
                        required
                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        placeholder="e.g. james@email.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm((p) => ({ ...p, email: e.target.value }))}
                        required
                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Phone Number *
                      </Label>
                      <Input
                        type="tel"
                        placeholder="e.g. 07700 900123"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm((p) => ({ ...p, phone: e.target.value }))}
                        required
                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400 mb-1.5 block">
                        Additional Message (Optional)
                      </Label>
                      <Input
                        placeholder="Any specific vehicle, features or questions?"
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm((p) => ({ ...p, message: e.target.value }))}
                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="marketing"
                      checked={bookingForm.marketing}
                      onCheckedChange={(checked) => setBookingForm((p) => ({ ...p, marketing: checked === true }))}
                      className="mt-0.5 border-white/20 data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                    />
                    <Label
                      htmlFor="marketing"
                      className="text-xs text-zinc-400 leading-relaxed cursor-pointer"
                    >
                      I&apos;d like to receive vehicle updates, offers and news
                      from Apex Select Automotive. You can unsubscribe at any time.
                    </Label>
                  </div>

                  <Button type="submit" className="w-full btn-gradient rounded-xl h-12 gap-2 font-semibold">
                    <Send className="w-4 h-4" />
                    Book My Test Drive
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 rounded-full bg-orange" />
                <span className="text-sm font-medium text-orange uppercase tracking-wider">
                  Our Dealership
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold uppercase text-white mb-6">
                Visit <span className="text-gradient">Apex Select</span>
              </h2>
              <p className="text-zinc-400 mb-4">
                Our team is ready to help with vehicle enquiries, test drives,
                finance and part exchange valuations.
              </p>
              <p className="text-sm text-orange/80 mb-8 italic">
                Please contact us before arranging a visit. Our vehicle viewing
                location is yet to be confirmed.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-orange" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Apex Select Automotive
                    </p>
                    <p className="text-sm text-zinc-400">
                      10B Orchard Street, Weston-super-Mare, UK
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-orange" />
                  </div>
                  <p className="text-sm text-zinc-400">+44 (0)161 XXX XXXX</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-orange" />
                  </div>
                  <p className="text-sm text-zinc-400">
                    info@apexselectautomotive.co.uk
                  </p>
                </div>
              </div>

              <Button className="mt-8 btn-gradient rounded-full px-8 gap-2">
                Get Directions
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden aspect-video bg-surface border border-white/5"
            >
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-orange/30" />
                  <p className="text-sm">Map Placeholder</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Interactive map will be embedded here
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.title}
                href={method.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-surface rounded-2xl border border-white/5 p-6 hover:border-orange/20 transition-all duration-500 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:border-orange/30 transition-colors">
                  <method.icon className="w-6 h-6 text-orange" />
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-orange mb-1">{method.detail}</p>
                <p className="text-xs text-zinc-500">{method.sub}</p>
              </motion.a>
            ))}
          </div>

          {/* Opening Times */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-surface rounded-2xl border border-white/5 p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange" />
                <span className="font-semibold text-white">Opening Times</span>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <span className="text-zinc-400">
                  Monday - Friday:{" "}
                  <span className="text-white">9:00am - 7:00pm</span>
                </span>
                <span className="text-zinc-400">
                  Saturday:{" "}
                  <span className="text-white">9:00am - 6:00pm</span>
                </span>
                <span className="text-zinc-400">
                  Sunday:{" "}
                  <span className="text-white">10:00am - 4:00pm</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Enquiries */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-heading text-3xl font-bold uppercase text-white">
              Quick <span className="text-gradient">Enquiries</span>
            </h2>
            <p className="mt-2 text-zinc-400 text-sm">
              Need help with something specific? Choose a topic to get in touch
              with the right team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {enquiryTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden border border-white/5 hover:border-orange/20 transition-all duration-500">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  </div>
                  <div className="p-4 bg-surface">
                    <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                      {type.title}
                      <ArrowRight className="w-3.5 h-3.5 text-orange" />
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-orange uppercase tracking-wider font-medium">
                Help & Support
              </span>
              <h2 className="font-heading text-4xl font-bold uppercase text-white mt-2 mb-4">
                Frequently Asked{" "}
                <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-zinc-400 mb-6">
                Quick answers to common questions about bookings, test drives
                and visiting our dealership.
              </p>
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/5 gap-2"
              >
                View All FAQs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Accordion className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-surface rounded-xl border border-white/5 px-5 overflow-hidden"
                  >
                    <AccordionTrigger className="text-sm font-medium text-white hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-zinc-400 pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

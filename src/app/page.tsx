import { HeroSection } from "@/components/home/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { BrandsSection } from "@/components/home/brands-section";
import { FeaturedVehicles } from "@/components/home/featured-vehicles";
import { ServicesSection } from "@/components/home/services-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FinanceBanner } from "@/components/home/finance-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <BrandsSection />
      <FeaturedVehicles />
      <ServicesSection />
      <FinanceBanner />
      <WhyChooseUs />
      <TestimonialsSection />
    </>
  );
}

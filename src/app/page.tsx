import { HeroSection } from "@/components/home/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { BrandsSection } from "@/components/home/brands-section";
import { FeaturedVehicles } from "@/components/home/featured-vehicles";
import { CarShowcase } from "@/components/home/car-showcase";
import { ServicesSection } from "@/components/home/services-section";
import { FinanceBanner } from "@/components/home/finance-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SvgDivider } from "@/components/shared/svg-divider";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <BrandsSection />
      <SvgDivider />
      <FeaturedVehicles />
      <CarShowcase />
      <SvgDivider />
      <ServicesSection />
      <FinanceBanner />
      <WhyChooseUs />
      <SvgDivider />
      <TestimonialsSection />
    </>
  );
}

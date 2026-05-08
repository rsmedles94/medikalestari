import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServicesSection";
import ServicesMenu from "@/components/ServicesMenu";
import AboutMedikaLestari from "@/components/AboutMedikaLestari";
import PromoKesehatan from "@/components/PromoKesehatan";
import CallCenter from "@/components/CallCenter";
import MadingSection from "@/components/MadingSection";

export default async function LocalePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <main>
        <HeroSection />
        <ServicesMenu />

        <ServiceSection />
        <AboutMedikaLestari />

        <PromoKesehatan />

        {/* Bagian Hubungi Kami */}
        <CallCenter />

        <MadingSection />

        <div className="pb-20"></div>
      </main>
    </div>
  );
}

import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServicesSection"; // Nama disesuaikan dengan komponen baru
import ServicesMenu from "@/components/ServicesMenu";
import AboutMedikaLestari from "@/components/AboutMedikaLestari";
import PromoKesehatan from "@/components/PromoKesehatan";
import CallCenter from "@/components/CallCenter"; // Path disesuaikan menggunakan alias @
import MadingSection from "@/components/MadingSection";

export default async function Home() {
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

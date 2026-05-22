import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ServicesMenu from "@/components/ServicesMenu";
import PromoKesehatan from "@/components/PromoKesehatan";
import CallCenter from "@/components/CallCenter"; // Path disesuaikan menggunakan alias @
import MadingSection from "@/components/MadingSection";
import { PageTracker } from "@/components/PageTracker";

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <PageTracker pagePath="/" />
      <main>
        <HeroSection />
        <ServicesMenu />
        <PromoKesehatan />

        <ServiceSection />
        <MadingSection />
      </main>
    </div>
  );
}

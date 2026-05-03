import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ServicesMenu from "@/components/ServicesMenu";
import MadingSection from "@/components/MadingSection"; // Import komponen baru
import LocationSection from "@/components/LocationSection";

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <main>
        {/* 1. HeroSection: Banner Utama */}
        <HeroSection />

        {/* 2. Services Menu: Grid Fasilitas & Layanan */}
        <ServicesMenu />

        {/* 3. Services Section: Informasi & Pelayanan (Aksen Biru) */}
        <ServicesSection />

        {/* Lokasi: Map Tangerang */}
        <LocationSection />

        {/* 4. Mading Section: Edukasi & Event (Sesuai Gambar Mading Melati) */}
        <MadingSection />

        {/* Tambahan Spacing di bawah jika diperlukan */}
        <div className="pb-20"></div>
      </main>
    </div>
  );
}

import DoctorSection from "@/components/DoctorSection";
import { PageTracker } from "@/components/PageTracker";

interface DoctorPageProps {
  readonly searchParams: Promise<{
    search?: string;
    specialty?: string;
    day?: string;
  }>;
}

export const metadata = {
  title: "Dokter Kami",
  description:
    "Lihat daftar dokter spesialis kami yang berpengalaman dan terpercaya",
};

export default async function DoctorPage({
  searchParams,
}: Readonly<DoctorPageProps>) {
  const params = await searchParams;
  return (
    <div className="w-full min-h-screen bg-white">
      <PageTracker pagePath="/dokter" />
      <DoctorSection
        initialSearch={params.search}
        initialSpecialty={params.specialty}
        initialDay={params.day}
      />
    </div>
  );
}

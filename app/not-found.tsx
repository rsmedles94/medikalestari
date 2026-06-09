import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <p className="text-2xl font-semibold text-gray-700">
          Jalur ini buntu. Silakan putar arah demi keselamatan navigasi Anda
        </p>
        <p className="text-gray-500 mb-8">
          Sedang dalam perbaikan. Silakan akses layanan kami yang lain
        </p>
        <Link
          href="/"
          className="inline-block bg-[#003f88] text-white px-8 py-3 active:scale-95 transition-colors rounded-md"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

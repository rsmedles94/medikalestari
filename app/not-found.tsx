import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <p className="text-2xl font-semibold text-gray-700">
          Halaman Tidak Ditemukan
        </p>
        <p className="text-gray-500 mb-8">
          Maaf, halaman yang anda cari sedang dalam pengembangan.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#00796e] text-white px-8 py-3 active:scale-95 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

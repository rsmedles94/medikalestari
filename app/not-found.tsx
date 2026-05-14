import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-700">
          Halaman Tidak Ditemukan
        </p>
        <p className="text-gray-500 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dihapus.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#173A87] text-white px-8 py-3 rounded-lg hover:bg-[#001e3d] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

import { unstable_cache } from "next/cache";
import { fetchAllDoctorsWithSchedules } from "@/lib/api";

export const DOCTORS_REVALIDATE = 300; // detik (5 menit)
export const DOCTORS_TAG = "doctors";

/**
 * Versi ter-cache dari fetchAllDoctorsWithSchedules.
 * - Hasil disimpan di server selama 5 menit, jadi request berikutnya tidak
 *   menunggu database/API dan skeleton nyaris tidak terlihat.
 * - Panggil revalidateTag("doctors") setelah data dokter/jadwal diubah
 *   supaya cache langsung diperbarui.
 *
 * Catatan: fungsi di dalamnya tidak boleh memakai cookies()/headers(),
 * dan hasilnya harus bisa di-serialize ke JSON.
 */
export const getCachedDoctorsWithSchedules = unstable_cache(
  async () => fetchAllDoctorsWithSchedules(),
  ["doctors-with-schedules"],
  { revalidate: DOCTORS_REVALIDATE, tags: [DOCTORS_TAG] },
);

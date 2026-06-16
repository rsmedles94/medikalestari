import { supabase } from "./supabase";
import { debugSupabaseImageUrl } from "./image-url-helper";
import { Doctor, Schedule, MadingContent, HeroBanner } from "./types";
import { deduplicateRequest } from "./enhanced-request-cache";
import { cacheManager } from "./cache-manager";

// UTILITAS: Mekanisme coba ulang untuk menangani masalah kumpulan koneksi
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isLockError = errorMessage.includes("Lock broken");

      if (isLockError && i < maxRetries - 1) {
        // Penundaan eksponensial untuk kesalahan penguncian
        const waitTime = delayMs * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

// DOKTER
export async function fetchDoctors(
  specialty?: string,
  searchName?: string,
): Promise<Doctor[]> {
// Menghasilkan kunci cache berdasarkan parameter untuk menangani berbagai kombinasi filter
  const cacheKey = `doctors:${specialty || "all"}:${searchName || "all"}`;

 // Periksa CacheManager terlebih dahulu
  const cachedData = cacheManager.get(cacheKey);
  if (cachedData) {
    console.debug(`[fetchDoctors] Cache hit for ${cacheKey}`);
    return cachedData as Doctor[];
  }

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      let query = supabase.from("doctors").select("*");

      if (specialty && specialty !== "Semua Spesialis") {
        query = query.eq("specialty", specialty);
      }

      if (searchName) {
        query = query.ilike("name", `%${searchName}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching doctors:", error);
        return [];
      }

      const result = data || [];
      // Simpan di CacheManager dengan TTL yang telah dikonfigurasi
      cacheManager.set(cacheKey, result);
      return result;
    });
  });
}

export async function fetchDoctorById(id: string): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }

  return data;
}

export async function fetchDoctorsBySpecialty(
  specialty: string,
): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("specialty", specialty);

  if (error) {
    console.error("Error fetching doctors by specialty:", error);
    return [];
  }

  return data || [];
}

export async function createDoctor(doctor: Omit<Doctor, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("doctors")
    .insert([doctor])
    .select();

  if (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }

  return data[0];
}

export async function updateDoctor(
  id: string,
  doctor: Partial<Omit<Doctor, "id" | "created_at">>,
) {
  const { data, error } = await supabase
    .from("doctors")
    .update(doctor)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }

  return data[0];
}

export async function deleteDoctor(id: string) {
  const { error } = await supabase.from("doctors").delete().eq("id", id);

  if (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
}

// JADWAL DOKTER
export async function fetchSchedulesByDoctor(
  doctorId: string,
): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("doctor_id", doctorId);

  if (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }

  return data || [];
}

export async function fetchAllDoctorsWithSchedules() {
  try {
    // Fetch semua dokter
    const { data: doctors, error: doctorsError } = await supabase
      .from("doctors")
      .select("*");

    if (doctorsError) {
      console.error("Error fetching doctors:", doctorsError);
      return [];
    }

    if (!doctors || doctors.length === 0) {
      return [];
    }

    // Fetch semua jadwal
    const { data: schedules, error: schedulesError } = await supabase
      .from("schedules")
      .select("*");

    if (schedulesError) {
      console.error("Error fetching schedules:", schedulesError);
      return doctors.map((doctor) => ({
        ...doctor,
        schedules: [],
      }));
    }

   // Gabungkan dokter dengan jadwalnya
    const doctorsWithSchedules = doctors.map((doctor) => ({
      ...doctor,
      schedules: (schedules || []).filter(
        (schedule) => schedule.doctor_id === doctor.id,
      ),
    }));

    return doctorsWithSchedules;
  } catch (error) {
    console.error("Error in fetchAllDoctorsWithSchedules:", error);
    return [];
  }
}

export async function createSchedule(
  schedule: Omit<Schedule, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("schedules")
    .insert([schedule])
    .select();

  if (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }

  return data[0];
}

export async function updateSchedule(
  id: string,
  schedule: Partial<Omit<Schedule, "id" | "created_at">>,
) {
  const { data, error } = await supabase
    .from("schedules")
    .update(schedule)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }

  return data[0];
}

export async function deleteSchedule(id: string) {
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
}

// UPLOAD IMAGE
export async function uploadDoctorImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `doctor-images/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("doctors")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(uploadError.message || "Upload error");
    }

    // getPublicUrl returns { data: { publicUrl: string } }
    interface GetPublicUrlResponse {
      data?: {
        publicUrl?: string;
        public_url?: string;
      };
      publicUrl?: string;
      public_url?: string;
    }
    const publicData = (await supabase.storage
      .from("doctors")
      .getPublicUrl(filePath)) as GetPublicUrlResponse;
    const publicUrl =
      publicData?.data?.publicUrl ||
      publicData?.data?.public_url ||
      publicData?.publicUrl ||
      publicData?.public_url;
    if (!publicUrl) {
      console.error("Public URL missing", publicData);
      throw new Error(
        "Public URL not available. Check bucket permissions and that the bucket exists.",
      );
    }

    return publicUrl;
  } catch (err) {
    // normalize error
    const message =
      (err && (err as Error).message) || String(err) || "Unknown upload error";
    throw message;
  }
}

// MADING 
export async function fetchMadingContent(
  type?: "edukasi" | "event",
): Promise<MadingContent[]> {
  return withRetry(async () => {
    let query = supabase
      .from("mading_content")
      .select("*")
      .order("order", { ascending: true });

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching mading content:", error);
      return [];
    }

    return data || [];
  });
}

export async function createMadingContent(
  content: Omit<MadingContent, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("mading_content")
    .insert([content])
    .select();

  if (error) {
    console.error("Error creating mading content:", error);
    throw error;
  }

  return data[0];
}

export async function updateMadingContent(
  id: string,
  content: Partial<Omit<MadingContent, "id" | "created_at">>,
) {
  const { data, error } = await supabase
    .from("mading_content")
    .update(content)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating mading content:", error);
    throw error;
  }

  return data[0];
}

export async function deleteMadingContent(id: string) {
  const { error } = await supabase.from("mading_content").delete().eq("id", id);

  if (error) {
    console.error("Error deleting mading content:", error);
    throw error;
  }
}

// HERO BANNER OPERATIONS
export async function fetchHeroBanners(
  deviceType?: "desktop" | "mobile",
): Promise<HeroBanner[]> {
  // Gunakan deduplikasi untuk mencegah beberapa permintaan bersamaan untuk tipe perangkat yang sama
  const cacheKey = `hero_banners:${deviceType || "all"}`;

  return deduplicateRequest(cacheKey, () =>
    withRetry(async () => {
      try {
        // Debug info
        const debug = {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? "SET"
            : "MISSING",
          deviceType,
          environment: process.env.NODE_ENV,
        };

        console.log("[fetchHeroBanners] Starting fetch with config:", debug);

        // Menggunakan supabase client langsung untuk query (bukan fetch API)
        let query = supabase
          .from("hero_banners")
          .select("*")
          .eq("is_active", true)
          .order("order", { ascending: true });

        if (deviceType) {
          query = query.eq("device_type", deviceType);
        }

        const { data, error } = await query;

        if (error) {
          console.error("[fetchHeroBanners] Supabase Query Error:", {
            message: error.message,
            code: error.code,
          });
          return [];
        }

        // Jika data kosong, log warning
        if (!data || data.length === 0) {
          console.warn(
            `[fetchHeroBanners] ⚠️ No active banners found for device_type: ${deviceType || "all"}`,
          );
          return [];
        }

        // Validate and normalize image URLs sebelum return
        const validBanners = data
          .map((banner) => {
            let url = banner.image_url;

            // Jika URL tidak lengkap, konstruksi URL publik Supabase
            if (url && !url.startsWith("http")) {
              // Jika path dimulai dengan /, tambahkan base URL Supabase
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
              if (supabaseUrl) {
                url = `${supabaseUrl}/storage/v1/object/public${url}`;
              }
            }

            // Debug log untuk konstruksi URL
            if (process.env.NODE_ENV === "development" && url) {
              debugSupabaseImageUrl(url);
            }

            return {
              ...banner,
              image_url: url,
            };
          })
          .filter((banner) => {
            const isValidUrl =
              banner.image_url &&
              (banner.image_url.startsWith("http") ||
                banner.image_url.startsWith("/"));
            if (!isValidUrl) {
              console.warn(
                `[fetchHeroBanners] Invalid image URL for banner ${banner.id}: ${banner.image_url}`,
              );
            }
            return isValidUrl;
          });

        console.log(
          "[fetchHeroBanners] ✅ Success - fetched",
          validBanners.length,
          "valid banners",
          {
            deviceType,
            ids: validBanners.map((d) => ({ id: d.id, url: d.image_url })),
          },
        );

        return validBanners;
      } catch (error) {
        console.error("[fetchHeroBanners] Unexpected error:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        return [];
      }
    }),
  );
}

export async function fetchHeroBannersForDesktop(): Promise<HeroBanner[]> {
  return fetchHeroBanners("desktop");
}

export async function fetchHeroBannersForMobile(): Promise<HeroBanner[]> {
  return fetchHeroBanners("mobile");
}

/**

* Mengambil semua banner hero untuk panel admin
* Menampilkan banner aktif dan tidak aktif
* Menggunakan endpoint admin yang melewati RLS di lingkungan produksi
*/
export async function fetchAllHeroBannersForAdmin(): Promise<HeroBanner[]> {
  try {
    console.log(
      "[fetchAllHeroBannersForAdmin] Fetching all banners for admin...",
    );

    const response = await fetch("/api/admin/hero-banners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.details || "Gagal mengambil banner dari server",
      );
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.warn(
        "[fetchAllHeroBannersForAdmin] No banners found or error in response",
      );
      return [];
    }

    console.log(
      "[fetchAllHeroBannersForAdmin] ✅ Fetched",
      result.data.length,
      "banners",
      result.data.map((b: HeroBanner) => ({
        id: b.id,
        device_type: b.device_type,
        is_active: b.is_active,
      })),
    );

    return result.data;
  } catch (error) {
    console.error("[fetchAllHeroBannersForAdmin] Error:", error);
    return [];
  }
}

export async function createHeroBanner(
  banner: Omit<HeroBanner, "id" | "created_at">,
) {
  try {
    console.log("Creating new banner with data:", banner);

    const response = await fetch("/api/admin/hero-banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(banner),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "Gagal membuat banner di server");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Tidak ada data yang dikembalikan dari server");
    }

    console.log("Create result:", result.data);
    return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Gagal membuat banner: ${message}`);
  }
}

export async function updateHeroBanner(
  id: string,
  banner: Partial<Omit<HeroBanner, "id" | "created_at">>,
) {
  try {
    console.log("Updating banner with ID:", id);
    console.log("Banner data to update:", banner);

    const response = await fetch("/api/admin/hero-banners", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...banner }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "Gagal mengupdate banner di server");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Tidak ada data yang dikembalikan dari server");
    }

    console.log("Update result:", result.data);
    return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Gagal memperbarui banner: ${message}`);
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    const response = await fetch(`/api/admin/hero-banners?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "Gagal menghapus banner di server");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Gagal menghapus banner");
    }

    console.log("Delete result:", result.message);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Gagal menghapus banner: ${message}`);
  }
}

// upload gambar (generic untuk mading/hero)
export async function uploadContentImage(
  file: File,
  folder: string = "content",
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("content")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(uploadError.message || "Upload error");
    }

    interface GetPublicUrlResponse {
      data?: {
        publicUrl?: string;
        public_url?: string;
      };
      publicUrl?: string;
      public_url?: string;
    }
    const publicData = (await supabase.storage
      .from("content")
      .getPublicUrl(filePath)) as GetPublicUrlResponse;
    const publicUrl =
      publicData?.data?.publicUrl ||
      publicData?.data?.public_url ||
      publicData?.publicUrl ||
      publicData?.public_url;

    if (!publicUrl) {
      console.error("Public URL missing", publicData);
      throw new Error(
        "Public URL not available. Check bucket permissions and that the bucket exists.",
      );
    }

    return publicUrl;
  } catch (err) {
    const message =
      (err && (err as Error).message) || String(err) || "Unknown upload error";
    throw message;
  }
}

// Jenis atau tipe ruangan
export async function fetchRoomTypes() {
  const { data: rooms, error } = await supabase
    .from("room_types")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching room types:", error);
    return [];
  }

  // Mengambil fasilitas dan gambar untuk setiap ruangan
  const roomsWithData = await Promise.all(
    (rooms || []).map(async (room) => {
      const [{ data: facilities }, { data: images }] = await Promise.all([
        supabase
          .from("room_facilities")
          .select("facility_name")
          .eq("room_id", room.id)
          .order("display_order", { ascending: true }),
        supabase
          .from("room_images")
          .select("id, image_url, display_order")
          .eq("room_id", room.id)
          .order("display_order", { ascending: true }),
      ]);

      return {
        ...room,
        facilities: (facilities || []).map((f) => f.facility_name),
        room_images: images || [],
      };
    }),
  );

  return roomsWithData;
}

export async function createRoomType(room: {
  name: string;
  price: string;
  image_url: string;
  description: string;
  display_order: number;
  facilities: string[];
  room_images?: Array<{ image_url: string; display_order: number }>;
}) {
  const { facilities, room_images, ...roomData } = room;

  const { data, error } = await supabase
    .from("room_types")
    .insert([roomData])
    .select()
    .single();

  if (error) {
    console.error("Error creating room type:", error);
    throw error;
  }

  // Tambahkan Fasilitas
  if (facilities.length > 0) {
    const facilitiesData = facilities.map(
      (facility: string, index: number) => ({
        room_id: data.id,
        facility_name: facility,
        display_order: index,
      }),
    );

    const { error: facilitiesError } = await supabase
      .from("room_facilities")
      .insert(facilitiesData);

    if (facilitiesError) {
      console.error("Error adding facilities:", facilitiesError);
    }
  }

  // Tambahkan gambar
  if (room_images && room_images.length > 0) {
    const imagesData = room_images.map((img) => ({
      room_id: data.id,
      image_url: img.image_url,
      display_order: img.display_order,
    }));

    const { error: imagesError } = await supabase
      .from("room_images")
      .insert(imagesData);

    if (imagesError) {
      console.error("Error adding images:", imagesError);
    }
  }

  return {
    ...data,
    facilities,
    room_images: room_images || [],
  };
}

export async function updateRoomType(
  id: string,
  room: Partial<{
    name: string;
    price: string;
    image_url: string;
    description: string;
    display_order: number;
    facilities: string[];
    room_images?: Array<{
      id?: string;
      image_url: string;
      display_order: number;
    }>;
  }>,
) {
  const { facilities, room_images, ...roomData } = room;

  const { data, error } = await supabase
    .from("room_types")
    .update({ ...roomData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating room type:", error);
    throw error;
  }

  // Perbarui fasilitas jika tersedia
  if (facilities !== undefined) {
    // Hapus fasilitas lama
    await supabase.from("room_facilities").delete().eq("room_id", id);

    // Tambahkan fasilitas baru
    if (facilities.length > 0) {
      const facilitiesData = facilities.map(
        (facility: string, index: number) => ({
          room_id: id,
          facility_name: facility,
          display_order: index,
        }),
      );

      const { error: facilitiesError } = await supabase
        .from("room_facilities")
        .insert(facilitiesData);

      if (facilitiesError) {
        console.error("Error updating facilities:", facilitiesError);
      }
    }
  }

  // Perbarui gambar jika tersedia
  if (room_images !== undefined) {
    // Hapus gambar lama
    await supabase.from("room_images").delete().eq("room_id", id);

    // Tambahkan gambar baru
    if (room_images.length > 0) {
      const imagesData = room_images.map((img) => ({
        room_id: id,
        image_url: img.image_url,
        display_order: img.display_order,
      }));

      const { error: imagesError } = await supabase
        .from("room_images")
        .insert(imagesData);

      if (imagesError) {
        console.error("Error updating images:", imagesError);
      }
    }
  }

  return {
    ...data,
    facilities: facilities || [],
    room_images: room_images || [],
  };
}

export async function deleteRoomType(id: string) {
  // Hapus fasilitas terlebih dahulu
  await supabase.from("room_facilities").delete().eq("room_id", id);

  // Hapus gambar
  await supabase.from("room_images").delete().eq("room_id", id);

  // Hapus ruangan
  const { error } = await supabase.from("room_types").delete().eq("id", id);

  if (error) {
    console.error("Error deleting room type:", error);
    throw error;
  }
}

export async function deleteRoomImages(imageIds: string[]) {
  if (imageIds.length === 0) return;

  const { error } = await supabase
    .from("room_images")
    .delete()
    .in("id", imageIds);

  if (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
}

export async function uploadRoomImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `room-images/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("content")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(uploadError.message || "Upload error");
    }

    interface GetPublicUrlResponse {
      data?: {
        publicUrl?: string;
        public_url?: string;
      };
      publicUrl?: string;
      public_url?: string;
    }
    const publicData = (await supabase.storage
      .from("content")
      .getPublicUrl(filePath)) as GetPublicUrlResponse;
    const publicUrl =
      publicData?.data?.publicUrl ||
      publicData?.data?.public_url ||
      publicData?.publicUrl ||
      publicData?.public_url;

    if (!publicUrl) {
      console.error("Public URL missing", publicData);
      throw new Error(
        "Public URL not available. Check bucket permissions and that the bucket exists.",
      );
    }

    return publicUrl;
  } catch (err) {
    const message =
      (err && (err as Error).message) || String(err) || "Unknown upload error";
    throw message;
  }
}

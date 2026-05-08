import { supabase } from "./supabase";
import { Doctor, Schedule, MadingContent, HeroBanner } from "./types";

// DOCTOR OPERATIONS
export async function fetchDoctors(
  specialty?: string,
  searchName?: string,
): Promise<Doctor[]> {
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

  return data || [];
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

// SCHEDULE OPERATIONS
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
    // Fetch all doctors
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

    // Fetch all schedules
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

    // Combine doctors with their schedules
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

// MADING OPERATIONS
export async function fetchMadingContent(
  type?: "edukasi" | "event",
): Promise<MadingContent[]> {
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
  let query = supabase
    .from("hero_banners")
    .select("*")
    .order("order", { ascending: true });

  if (deviceType) {
    query = query.eq("device_type", deviceType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching hero banners:", error);
    return [];
  }

  return data || [];
}

export async function fetchHeroBannersForDesktop(): Promise<HeroBanner[]> {
  return fetchHeroBanners("desktop");
}

export async function fetchHeroBannersForMobile(): Promise<HeroBanner[]> {
  return fetchHeroBanners("mobile");
}

export async function createHeroBanner(
  banner: Omit<HeroBanner, "id" | "created_at">,
) {
  try {
    console.log("Creating new banner with data:", banner);

    const { data, error } = await supabase
      .from("hero_banners")
      .insert([banner])
      .select();

    if (error) {
      console.error("Error creating hero banner:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("Create result:", data);

    if (!data || data.length === 0) {
      throw new Error("Tidak ada data yang dikembalikan dari server");
    }

    return data[0];
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

    const { data, error } = await supabase
      .from("hero_banners")
      .update(banner)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating hero banner:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("Update result:", data);

    if (!data || data.length === 0) {
      console.warn(
        "No data returned from update, attempting to fetch updated record",
      );
      // Try to fetch the updated record separately
      const { data: fetchedData, error: fetchError } = await supabase
        .from("hero_banners")
        .select()
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching updated banner:", fetchError);
        throw new Error(
          `Record mungkin tidak ditemukan atau gagal di-update: ${fetchError.message}`,
        );
      }

      if (!fetchedData) {
        throw new Error("Record tidak ditemukan setelah update");
      }

      return fetchedData;
    }

    return data[0];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Gagal memperbarui banner: ${message}`);
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    const { error } = await supabase.from("hero_banners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting hero banner:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Gagal menghapus banner: ${message}`);
  }
}

// UPLOAD IMAGE (generic for mading/hero)
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

// ROOM TYPE OPERATIONS
export async function fetchRoomTypes() {
  const { data: rooms, error } = await supabase
    .from("room_types")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching room types:", error);
    return [];
  }

  // Fetch facilities and images for each room
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

  // Add facilities
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

  // Add images
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

  // Update facilities if provided
  if (facilities !== undefined) {
    // Delete old facilities
    await supabase.from("room_facilities").delete().eq("room_id", id);

    // Add new facilities
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

  // Update images if provided
  if (room_images !== undefined) {
    // Delete old images
    await supabase.from("room_images").delete().eq("room_id", id);

    // Add new images
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
  // Delete facilities first
  await supabase.from("room_facilities").delete().eq("room_id", id);

  // Delete images
  await supabase.from("room_images").delete().eq("room_id", id);

  // Delete room
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

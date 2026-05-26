export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image_url: string;
  experience_years?: number;
  bio: string;
  // optional contact fields (kept for backward compatibility)
  phone?: string;
  email?: string;
  // status: 'hadir' = available / 'cuti' = on leave
  status?: "hadir" | "cuti";
  created_at: string;
}

export interface Schedule {
  id: string;
  doctor_id: string;
  day_of_week: string; // Senin, Selasa, etc.
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_available: boolean;
  created_at: string;
}

export interface DaySchedule {
  day: string;
  dayOfWeek: string;
  schedules: Array<{
    startTime: string;
    endTime: string;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface MadingContent {
  id: string;
  type: "edukasi" | "event"; // edukasi or event
  title: string;
  description: string;
  image_url: string;
  date?: string; // Only for edukasi
  start_date?: string; // For event - tanggal mulai event
  end_date?: string; // For event - optional tanggal akhir event
  order: number;
  link?: string; // Optional link for artikel/event
  created_at: string;
}

export interface HeroBanner {
  id: string;
  image_url: string;
  order: number;
  is_active: boolean;
  device_type: "desktop" | "mobile"; // desktop (1900x720) or mobile (2208x2760)
  created_at: string;
}

export interface PositionPhoto {
  id: string;
  image_url: string;
  position_name: string;
  order: number;
}

export interface CareersBannerConfig {
  id: string;
  banner_image_url: string;
  is_form_active: boolean;
  form_title: string;
  form_description: string;
  criteria: string[]; // JSON array stored as string
  phone_number: string;
  position_photos: PositionPhoto[]; // Array of position photos with their names
  created_at: string;
  updated_at: string;
}

export interface CareerRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  education: string;
  experience_years: number;
  criteria_fields: Record<string, string>; // JSON object for dynamic criteria
  resume_url: string;
  whatsapp_link?: string;
  created_at: string;
}

export interface RoomType {
  id: string;
  name: string;
  price: string;
  image_url: string; // primary image (deprecated, kept for compatibility)
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoomFacility {
  id: string;
  room_id: string;
  facility_name: string;
  display_order: number;
  created_at: string;
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface MCUPackage {
  id: string;
  title: string;
  price: string;
  image_url: string;
  href: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

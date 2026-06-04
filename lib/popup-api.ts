import { supabase } from "./supabase";

export type Popup = {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// POPUP OPERATIONS - PUBLIC (untuk frontend public)
export async function fetchPopups() {
  try {
    const { data, error } = await supabase
      .from("popups")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching popups:", error);
    return [];
  }
}

// POPUP OPERATIONS - ADMIN (untuk admin panel)
export async function fetchAllPopups() {
  const { data, error } = await supabase
    .from("popups")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching all popups:", error);
    throw error;
  }

  return data || [];
}

export async function createPopup(popupData: {
  image_url: string;
  title?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}) {
  const { data, error } = await supabase
    .from("popups")
    .insert([popupData])
    .select()
    .single();

  if (error) {
    console.error("Error creating popup:", error);
    throw error;
  }

  return data;
}

export async function updatePopup(
  id: string,
  popupData: Partial<Omit<Popup, "id" | "created_at">>,
) {
  const updateData = {
    ...popupData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("popups")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating popup:", error);
    throw error;
  }

  return data;
}

export async function deletePopup(id: string) {
  const { error } = await supabase.from("popups").delete().eq("id", id);

  if (error) {
    console.error("Error deleting popup:", error);
    throw error;
  }
}

export async function uploadPopupImage(file: File): Promise<string> {
  try {
    const fileName = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const filePath = `popups/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("content")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
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
      throw new Error("Public URL not available");
    }

    return publicUrl;
  } catch (err) {
    const message =
      (err && (err as Error).message) || String(err) || "Unknown upload error";
    throw message;
  }
}

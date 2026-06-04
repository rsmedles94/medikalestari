// WhatsApp API Utility
const CS_PHONE = "082246232527"; // No WhatsApp CS

export interface BookingMessage {
  patientName: string;
  doctorName: string;
  specialty: string;
  preferredDate: string;
  patientPhone?: string;
  keluhan?: string;
}

export function generateBookingMessage(booking: BookingMessage): string {
  const message = `Saya ingin bertemu dengan dokter ${booking.doctorName} (${booking.specialty}).

Detail Pasien:
Nama: ${booking.patientName}
${booking.patientPhone ? `Nomor Telepon: ${booking.patientPhone}` : ""}
${booking.preferredDate ? `Tanggal Preferensi: ${booking.preferredDate}` : ""}
${booking.keluhan ? `Keluhan: ${booking.keluhan}` : ""}

Mohon bantu mengatur jadwal konsultasi.`;

  return message;
}

export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = CS_PHONE.replaceAll(/\D/g, "");
  const phoneWithCountry = cleanPhone.startsWith("62")
    ? cleanPhone
    : "62" + cleanPhone.substring(1);
  return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedMessage}`;
}

export function sendWhatsAppBooking(booking: BookingMessage): void {
  const message = generateBookingMessage(booking);
  const link = getWhatsAppLink(message);
  window.open(link, "_blank");
}

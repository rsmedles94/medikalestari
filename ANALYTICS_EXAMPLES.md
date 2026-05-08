/\*\*

- Contoh Implementasi Analytics Tracking
- File ini menunjukkan cara mengintegrasikan tracking ke dalam components
  \*/

// ============================================
// 1. TRACK PAGE VIEW (Gunakan di Page Level)
// ============================================

// File: app/page.tsx atau app/[path]/page.tsx
/\*
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

export default function HomePage() {
useEffect(() => {
trackPageView("Homepage");
}, []);

return (
<div>
{/_ ... _//_}
</div>
);
}
_/

// ============================================
// 2. TRACK BUTTON CLICKS
// ============================================

// File: components/Navbar.tsx
/\*
import { trackButtonClick } from "@/lib/analytics";

export default function Navbar() {
const handleDoctorClick = async () => {
await trackButtonClick("Navbar: Cari Dokter");
// navigate to doctors page
};

return (
<button onClick={handleDoctorClick}>
Cari Dokter
</button>
);
}
\*/

// ============================================
// 3. CONTOH TRACKING DI BERBAGAI KOMPONEN
// ============================================

export const analyticsExamples = {
// Homepage clicks
bookingCTA: "Homepage: Booking CTA Button",
heroServiceClick: "Homepage: Hero Service Click",
doctorRecommendation: "Homepage: Doctor Recommendation Click",

// Navigation
navDoctors: "Navbar: Doctors Link",
navServices: "Navbar: Services Link",
navContact: "Navbar: Contact Link",
navSchedule: "Navbar: Schedule Link",

// Services
emergencyService: "Services: Emergency Click",
pharmacyService: "Services: Pharmacy Click",
physiotherapy: "Services: Physiotherapy Click",
laboratory: "Services: Laboratory Click",
radiology: "Services: Radiology Click",
hospitalRoom: "Services: Hospital Room Click",
MCU: "Services: MCU Click",

// Doctors
bookDoctor: "Doctors: Book Appointment",
doctorDetail: "Doctors: View Detail",
doctorFilter: "Doctors: Filter Applied",

// Booking
submitBooking: "Booking: Form Submitted",
selectDateTime: "Booking: Date/Time Selected",
selectDoctor: "Booking: Doctor Selected",

// Contact
submitContact: "Contact: Form Submitted",
callCenter: "Contact: Call Center Click",
whatsappContact: "Contact: WhatsApp Click",

// Admin
adminCreateDoctor: "Admin: Create Doctor",
adminEditDoctor: "Admin: Edit Doctor",
adminDeleteDoctor: "Admin: Delete Doctor",
adminScheduleCreate: "Admin: Schedule Create",
adminMCUCreate: "Admin: MCU Create",
};

// ============================================
// 4. IMPLEMENTASI DI KOMPONEN
// ============================================

/\*
// Contoh di components/BookingForm.tsx
import { trackButtonClick } from "@/lib/analytics";
import { analyticsExamples } from "@/lib/analytics-examples";

export default function BookingForm() {
const handleSubmit = async (e) => {
e.preventDefault();

    // Track button click
    await trackButtonClick(analyticsExamples.submitBooking);

    // Submit form
    // ...

};

const handleSelectDoctor = () => {
trackButtonClick(analyticsExamples.selectDoctor);
// ...
};

return (
<form onSubmit={handleSubmit}>
<button onClick={handleSelectDoctor}>
Pilih Dokter
</button>
<button type="submit">
Konfirmasi Booking
</button>
</form>
);
}
\*/

// ============================================
// 5. SETUP DI ROOT LAYOUT
// ============================================

/\*
// File: app/layout.tsx
"use client";

import React from "react";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="id">
<head>
{/\* _/}
</head>
<body>
{children}
<Analytics /> {/_ Vercel Analytics _/}
</body>
</html>
);
}
_/

// ============================================
// 6. ENVIRONMENT VARIABLES (.env.local)
// ============================================

/\*

# .env.local

NEXT_PUBLIC_VERCEL_ANALYTICS_ID=<your-vercel-analytics-id>
\*/

export default analyticsExamples;

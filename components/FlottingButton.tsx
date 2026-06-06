"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Stethoscope, PhoneCall } from "lucide-react";
import BookingModalFloating from "./BookingModalFloating";

const actions = [
  { id: "booking", aria: "Janji Temu", icon: CalendarCheck, href: null },
  {
    id: "doctors",
    aria: "Dokter Spesialis",
    icon: Stethoscope,
    href: "/dokter",
  },
  {
    id: "contact",
    aria: "Hubungi Kami",
    icon: PhoneCall,
    href: "/kontak-kami",
  },
];

export default function FlottingButton() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const router = useRouter();

  const handleActionClick = (action: (typeof actions)[0]) => {
    if (action.id === "booking") {
      setIsBookingOpen(true);
    } else if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="hidden lg:flex fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="pr-1 bg-[#003f88] rounded-tr-xl rounded-br-xl shadow-md overflow-hidden">
          {actions.map((a, index) => {
            const Icon = a.icon as React.ComponentType<
              React.SVGProps<SVGSVGElement>
            >;
            return (
              <button
                key={a.id}
                onClick={() => handleActionClick(a)}
                aria-label={a.aria}
                className={`w-14 px-2 flex flex-col items-center justify-center py-4 transition-colors hover:bg-[#002f68] ${
                  index !== actions.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <Icon width={20} height={20} className="text-white" />
                <span className="text-xs text-white mt-1 text-center leading-tight">
                  {a.aria}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}

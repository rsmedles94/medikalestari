"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EmergencyWA = () => {
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ref untuk menyimpan posisi scroll terakhir guna mendeteksi arah scroll
  const lastScrollY = useRef(0);

  // Check jika mobile / desktop berdasarkan ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      const mobileStatus = window.innerWidth < 768;
      setIsMobile(mobileStatus);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Logika Scroll Baru: Hanya sembunyikan jika scroll ke bawah & posisi > 10
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Jika posisi scroll di paling atas, biarkan tetap terbuka
      if (currentScrollY <= 10) {
        lastScrollY.current = currentScrollY;
        return;
      }

      // Deteksi arah: jika currentScrollY lebih besar dari lastScrollY, berarti scroll ke BAWAH
      if (currentScrollY > lastScrollY.current) {
        setIsCollapsed(true);
      }
      // Jika scroll ke ATAS, kita diamkan (tidak dipaksa hide)

      // Update posisi scroll terakhir
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname !== "/") return null;

  return (
    <AnimatePresence>
      {!isFooterVisible && (
        <div className="fixed right-4 bottom-60 md:bottom-40 z-9999 flex flex-col items-end">
          {/* Tombol Chevron - Muncul di semua device */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            animate={{
              x: isCollapsed ? 12 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-5 h-5 bg-black/20 text-white flex items-center justify-center rounded-full border border-white/20 active:scale-90 z-20 -mb-3 mr-1"
          >
            <motion.span
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.span>
          </motion.button>

          {/* Badge WhatsApp - Animasi hide/collapse untuk semua ukuran layar */}
          <motion.div
            initial={false}
            animate={{
              x: isCollapsed ? 100 : 0,
              opacity: isCollapsed ? 0.6 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              delay: isCollapsed ? 0.2 : 0,
            }}
            className="z-10"
          >
            <a
              href="https://wa.me/6282246232527"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white py-1.5 px-3.5 no-underline whitespace-nowrap rounded-t-lg origin-right -rotate-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-[12px] font-bold tracking-wider uppercase">
                Customer Care
              </span>
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyWA;

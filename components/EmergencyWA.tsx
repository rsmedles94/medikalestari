"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EmergencyWA = () => {
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHiddenBySwipe, setIsHiddenBySwipe] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Tooltip hilang otomatis setelah 5 detik
    const timer = setTimeout(() => setShowTooltip(false), 5000);

    const footer =
      document.querySelector("footer") || document.getElementById("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(footer);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  const showButton = !isFooterVisible;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          drag="x"
          // Batasi drag: kiri sedikit (-50), kanan cukup lebar (200)
          dragConstraints={{ left: -50, right: 200 }}
          dragElastic={0.05}
          onDragStart={() => setShowTooltip(false)}
          onDragEnd={(_, info) => {
            // Sensitivitas tinggi: geser sedikit (15px) langsung bereaksi
            if (info.offset.x > 15) {
              setIsHiddenBySwipe(true);
            } else if (info.offset.x < -15) {
              setIsHiddenBySwipe(false);
            }
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: 1,
            // 70% agar tetap menyisakan bagian yang mudah ditarik
            x: isHiddenBySwipe ? "70%" : "0%",
          }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="fixed right-0 top-[50%] z-[9999] cursor-grab active:cursor-grabbing touch-none select-none p-4" // p-4 memperluas area tangkapan jari
        >
          <div className="relative flex items-center justify-end">
            {/* Tooltip Swipe */}
            <AnimatePresence>
              {showTooltip && !isHiddenBySwipe && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-[110%] top-[-30px] bg-black/70 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap"
                >
                  Swipe kanan untuk hide →
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href="https://wa.me/6282246232527"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.9 }}
              className={`
                flex items-center gap-2 bg-[#25D366] text-white py-1.5 px-3.5 
                no-underline shadow-xl origin-right -rotate-90 transition-all
                ${isHiddenBySwipe ? "opacity-80 scale-95" : "opacity-100 scale-100"}
              `}
              onClick={(e) => {
                if (isHiddenBySwipe) {
                  e.preventDefault();
                  setIsHiddenBySwipe(false);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>

              <span className="text-[12px] font-bold tracking-wider uppercase whitespace-nowrap">
                Customer Care
              </span>
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyWA;

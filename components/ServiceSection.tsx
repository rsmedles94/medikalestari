"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  motion,
  useMotionValue,
  animate,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

interface KisahItem {
  id: number;
  author: string;
  rating: number;
  date: string;
  reviewText: string;
  href: string;
}

// jeda muncul antar kartu
const CARD_STAGGER = 0.08;

// warna bintang
const STAR_EMPTY = "#E2E8F0";
const STAR_FILLED = "#F59E0B";

// warna avatar
const AVATAR = "#003f88";

// ukuran kartu (samakan dengan class Tailwind: w-[320px] md:w-[420px], gap-6)
const CARD_WIDTH_MOBILE = 320;
const CARD_WIDTH_DESKTOP = 420;
const CARD_GAP = 24;

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * CARD_STAGGER, ease: REVEAL_EASE },
  }),
};

// deteksi mobile (< 768px) tanpa hydration mismatch
const MOBILE_QUERY = "(max-width: 767px)";

const subscribeMobile = (onChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
const getMobileSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const getMobileServerSnapshot = () => false;

const ServiceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // animasi mulai saat slider terlihat
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });
  const reduceMotion = useReducedMotion();
  const showStars = isInView || !!reduceMotion;

  // animasi muncul untuk header dan navigasi
  const reveal = (delay = 0, y = 28) => ({
    initial: reduceMotion ? (false as const) : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: REVEAL_VIEWPORT,
    transition: { duration: 0.7, delay, ease: REVEAL_EASE },
  });

  const ulasanData: KisahItem[] = [
    {
      id: 1,
      author: "Diah Delina",
      rating: 5,
      date: "3 bulan lalu",
      reviewText:
        "Pengalaman melahirkan di RS Medika Lestari sangat memuaskan. Dari pendaftaran yang cepat, pelayanan yang ramah, hingga proses pemeriksaan yang tidak perlu menunggu lama. Saya USG dan melahirkan caesar ERACS dengan Dr. Kendrick Liong — dokter yang sangat baik, ramah, dan detail dalam menjelaskan. Perawat dan bidan sigap serta membantu. Kamar SVIP Lely juga bersih, rapi, dan nyaman. Terima kasih Mas Angga dan seluruh tim RS Medika Lestari. Sangat rekomendasi 🙏",
      href: "https://maps.app.goo.gl/z68tfUZiL5jLkBig8",
    },
    {
      id: 2,
      author: "Veren Salsa",
      rating: 5,
      date: "7 bulan lalu",
      reviewText:
        "bessttt deh pelayanan walaupun lama maklumin aja yang penting staff2 nya ramah ramah kalo gue nanya jadi gak sungkan karna staff nya emng baik2 jawaban nya gak ngegas atau gak ngotot2,gk kaya tempat lain sok sok an jutek pengen gua tampol aja rasanya,untuk dokter THT dr.nadhila dan sus nya terimkasih sudah sabar dan penjelasan nya gak ngotot dan menghadapi aku meler parah ini dengan sabar dan ngang ngong ngang ngong🤧😂.",
      href: "https://maps.app.goo.gl/Xwg3pewgjAXwiPgcA",
    },
    {
      id: 3,
      author: "Friska Junita",
      rating: 5,
      date: "7 bulan lalu",
      reviewText:
        "Alhamdullilah beruntung bisa lahiran di RS Medika Lestari. USG dan melahirkan caesar eracs dengan Dr. Kendrick Liong. Masyallah dokternya baik hati, ramah dan detail menjelaskan setiap pertanyaan. Perawat staf bidannya sigap, ramah dan sangat membantu. Pelayanan disini sangat sangat memuaskan, Dan kamar Rawat inap bersih, nyaman. Dapet fasilitas SVIP jugaa masyaallah berasa nginep di hotel hihi. Terimakasih RS Medika Lestari. Sehat selalu Dr. Kendrick liong.",
      href: "https://maps.app.goo.gl/ccmz5QQv8M64ziXNA",
    },
    {
      id: 4,
      author: "ADI ANTO",
      rating: 5,
      date: "4 bulan lalu",
      reviewText:
        "Jam 1 malem harus ke ugd karena anak sakit. Sampai pintu pendaftaran di sambut dengan senyuman ramah petugas pendaftaran dan harus di ranap. Thanks ya RS medika lestari good experience 🙏 cuma parkir nya musti ada petugas khusus dari RS. Thank you.",
      href: "https://maps.app.goo.gl/prEZmJqBC1D13Kwi7",
    },
    {
      id: 5,
      author: "anas tasya",
      rating: 5,
      date: "8 bulan lalu",
      reviewText:
        "semenjak masuk kelas ibu jadi lebih semangat buat kontrol kehamilan. Setiap bulan selalu cek usg dimedika lestari pejelasan dokter Kendrick sangat detail dan mengedukasi Semoga bisa lancar sampai persalinan di medika lestari 😇 terimakasih jg buat tim medika mas angga&mas karis dan bidan² yg selalu memberi afirmasi positif dikelas ibu 🙏",
      href: "https://maps.app.goo.gl/gHLU5YZn9triKhyP9",
    },
    {
      id: 6,
      author: "Dhea Aryanti",
      rating: 5,
      date: "10 bulan lalu",
      reviewText:
        "Melahirkan di RS Medika Lestari merupakan pilihan yang sangat tepat. Selama saya hamil & melahirkan di RS medika lestari memberikan pengalaman yang sangat luar biasa baik, mulai dari Dokternya, staff para perawat and bidan yang membantu proses melahirkan sangat tidak mengecewakan. Pelayanan ny sangat memuaskan. Jangan ragu untuk berobat ataupun melahirkan di RS Medika Lestari.",
      href: "https://maps.app.goo.gl/26njXCsTPG9fnt8F6",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getMobileServerSnapshot,
  );

  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // jumlah dot dihitung dari jarak geser slider
  const totalDots = Math.max(
    1,
    Math.ceil(
      Math.abs(dragConstraints.left) /
        ((isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP) + CARD_GAP),
    ) + 1,
  );

  const x = useMotionValue(0);
  const isDragging = useRef(false);

  const calculateConstraints = useCallback(() => {
    if (containerRef.current && trackRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth;
      setDragConstraints({
        left: -(trackWidth - containerWidth),
        right: 0,
      });
    }
  }, []);

  // ukur ulang batas drag saat ukuran berubah
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const observer = new ResizeObserver(() => calculateConstraints());
    observer.observe(container);
    observer.observe(track);

    return () => observer.disconnect();
  }, [calculateConstraints]);

  const getItemWidth = () => {
    return (isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP) + CARD_GAP;
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    const itemWidth = getItemWidth();
    const targetX = -(index * itemWidth);

    animate(x, Math.max(targetX, dragConstraints.left), {
      type: "spring",
      stiffness: 200,
      damping: 25,
    });
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 100);

    const currentX = x.get();
    const itemWidth = getItemWidth();
    let calculatedIndex = Math.round(Math.abs(currentX) / itemWidth);

    if (calculatedIndex >= totalDots) {
      calculatedIndex = totalDots - 1;
    }
    if (calculatedIndex < 0) {
      calculatedIndex = 0;
    }

    setActiveIndex(calculatedIndex);

    const snapX = -(calculatedIndex * itemWidth);
    animate(x, Math.max(snapX, dragConstraints.left), {
      type: "spring",
      stiffness: 250,
      damping: 25,
    });
  };

  const handleCardClick = (href: string) => {
    if (!isDragging.current) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  // bintang terisi satu per satu setelah kartu muncul
  const renderStars = (rating: number, cardIndex: number) => {
    const starsBaseDelay = cardIndex * CARD_STAGGER + 0.5;

    return Array.from({ length: 5 }).map((_, index) => (
      <motion.svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5 md:w-6 md:h-6"
        aria-hidden="true"
        initial={reduceMotion ? false : { fill: STAR_EMPTY }}
        animate={{
          fill: showStars && index < rating ? STAR_FILLED : STAR_EMPTY,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          delay: starsBaseDelay + index * 0.25,
        }}
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </motion.svg>
    ));
  };

  return (
    <section className="w-full bg-[#3D8ECB] py-16 md:py-20 font-sans overflow-hidden">
      <div className="max-w-[1180px] mx-auto">
        {/* Header */}
        <header className="px-4 md:px-8 mb-12 flex items-end justify-center w-full gap-4">
          <div className="text-center min-w-0">
            <motion.h2
              {...reveal(0)}
              className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-3"
            >
              Ulasan Pasien
            </motion.h2>
            <motion.p
              {...reveal(0.12)}
              className="text-sm md:text-base text-white leading-relaxed"
            >
              Apa kata mereka yang telah merasakan langsung pelayanan dan
              fasilitas medis di Rumah Sakit Medika Lestari?
            </motion.p>
          </div>
        </header>

        {/* Slider */}
        <div
          ref={containerRef}
          className="w-full px-4 md:px-8 overflow-visible"
        >
          <motion.div
            ref={trackRef}
            className="flex gap-6 pb-6 cursor-grab active:cursor-grabbing w-max"
            style={{ x }}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.08}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {ulasanData.map((item, index) => (
              <motion.article
                key={item.id}
                variants={cardVariants}
                custom={index}
                initial={reduceMotion ? false : "hidden"}
                animate={showStars ? "visible" : "hidden"}
                onClick={() => handleCardClick(item.href)}
                className="w-[320px] md:w-[420px] h-[310px] md:h-[340px] flex-shrink-0 flex flex-col justify-between bg-white rounded-md p-6 md:p-7 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer text-left select-none"
              >
                {/* Isi ulasan (maks 7 baris, tinggi kartu tetap sama) */}
                <p className="text-sm md:text-base text-slate-700 leading-relaxed font-normal line-clamp-7 break-words">
                  &quot;{item.reviewText}&quot;
                </p>

                {/* Footer: avatar kiri, nama + bintang kanan */}
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center justify-center flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full"
                    style={{ backgroundColor: AVATAR }}
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-7 h-7 md:w-8 md:h-8"
                      fill="#FFFFFF"
                    >
                      <circle cx="12" cy="8" r="4.2" />
                      <path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z" />
                    </svg>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-0">
                    <span
                      className="max-w-full text-right text-base md:text-lg font-bold text-slate-800 truncate leading-tight"
                      title={item.author}
                    >
                      {item.author}
                    </span>
                    <div
                      className="flex items-center gap-1"
                      role="img"
                      aria-label={`Rating ${item.rating} dari 5`}
                    >
                      {renderStars(item.rating, index)}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Navigasi */}
        <motion.footer
          {...reveal(0.1, 20)}
          className="px-4 md:px-8 mt-10 flex items-center justify-between md:justify-start md:gap-8"
        >
          {/* Dot */}
          <nav
            aria-label="Navigasi Ulasan"
            className="flex items-center justify-start gap-4"
          >
            {Array.from({ length: totalDots }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                  aria-label={`Go to page ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      backgroundColor: isActive
                        ? "#3D8ECB"
                        : "rgb(255, 255, 255)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-5 h-5 rounded-full z-10 pointer-events-none"
                  />

                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1 : 0.4,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    className="absolute w-9 h-9 rounded-full border-[5px] border-white bg-white z-0 origin-center pointer-events-none"
                  />
                </button>
              );
            })}
          </nav>

          {/* Link ulasan lainnya */}
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://www.google.com/maps/place/RS+Medika+Lestari/@-6.2248952,106.708865,866m/data=!3m2!1e3!5s0x2e69fb20f9710f11:0xb1df070900c513d2!4m16!1m9!3m8!1s0x2e69fa1cb5b440a1:0xe21244587f98ac8f!2sRS+Medika+Lestari!8m2!3d-6.2248952!4d106.7114399!9m1!1b1!16s%2Fg%2F11h0hgmvp!3m5!1s0x2e69fa1cb5b440a1:0xe21244587f98ac8f!8m2!3d-6.2248952!4d106.7114399!16s%2Fg%2F11h0hgmvp?hl=id-ID&entry=ttu&g_ep=EgoyMDI2MDUyNi4wIKXMDSoASAFQAw%3D%3D",
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="text-white font-semibold text-[10px] md:text-sm flex items-center gap-1 transition-all duration-700 hover:text-[#e67e22] hover:underline cursor-pointer"
          >
            <span className="text-base">→</span> Lihat ulasan lainnya
          </button>
        </motion.footer>
      </div>
    </section>
  );
};

export default ServiceSection;

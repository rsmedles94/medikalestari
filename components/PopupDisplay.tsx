"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { fetchPopups } from "@/lib/popup-api";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import { imageLoader } from "@/lib/image-loader";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const FIVE_MINUTES = 5 * 60 * 1000;
const POPUP_KEY = "last_popup_exit_time";
const SESSION_KEY = "has_seen_popup_session";
const BEHAVIOR_KEY = "popup_user_behavior";
const INDEX_KEY = "current_popup_index";

const PopupDisplay = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const popupsRef = useRef<
    Array<{ id: string; image_url: string; title?: string }>
  >([]);
  const tabLeftTimeRef = useRef<number | null>(null);
  const openTimeRef = useRef<number>(0);

  const fetchPopupsCallback = useCallback(() => fetchPopups(), []);

  const { data: popups = [] } = useCachedFetch(
    fetchPopupsCallback,
    "popups-data",
    { deduplicate: true },
  );

  useEffect(() => {
    if (popups) {
      popupsRef.current = popups;
    }
  }, [popups]);

  const getBehavior = useCallback(() => {
    const raw = localStorage.getItem(BEHAVIOR_KEY);
    return raw ? JSON.parse(raw) : { quickClose: 0, engaged: 0 };
  }, []);

  const syncIndexFromStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const savedIndex = sessionStorage.getItem(INDEX_KEY);
      const actualIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
      setCurrentIndex(actualIndex);
      return actualIndex;
    }
    return 0;
  }, []);

  const checkLogicAndShow = useCallback(() => {
    const now = Date.now();
    const lastExit = localStorage.getItem(POPUP_KEY);
    const hasSeenThisSession = sessionStorage.getItem(SESSION_KEY);
    const behavior = getBehavior();
    let cooldown = FIVE_MINUTES;
    if (behavior.quickClose >= 3) {
      cooldown = FIVE_MINUTES * 2;
    }

    const actualIndex = syncIndexFromStorage();

    if (
      popupsRef.current.length > 0 &&
      actualIndex >= popupsRef.current.length
    ) {
      setIsVisible(false);
      return;
    }

    if (!hasSeenThisSession) {
      setIsVisible(true);
      openTimeRef.current = now;
      sessionStorage.setItem(SESSION_KEY, "true");
      return;
    }

    if (lastExit && now - parseInt(lastExit) < cooldown) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    openTimeRef.current = now;
  }, [getBehavior, syncIndexFromStorage]);

  useEffect(() => {
    if (popups && popups.length > 0) {
      void Promise.all(
        popups.map((item) =>
          imageLoader.loadImage({
            url: item.image_url,
            priority: "low",
          }),
        ),
      )
        .then(() => {
          checkLogicAndShow();
        })
        .catch((err) => {
          console.warn("Error preloading popup images:", err);
          checkLogicAndShow();
        });
    }
  }, [popups, checkLogicAndShow]);

  useEffect(() => {
    syncIndexFromStorage();

    const handlePopState = () => {
      syncIndexFromStorage();
      checkLogicAndShow();
    };

    const handleFocus = () => {
      syncIndexFromStorage();
      checkLogicAndShow();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkLogicAndShow, syncIndexFromStorage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.hidden) {
        tabLeftTimeRef.current = now;
      } else {
        syncIndexFromStorage();
        if (
          tabLeftTimeRef.current &&
          now - tabLeftTimeRef.current > FIVE_MINUTES
        ) {
          checkLogicAndShow();
        } else {
          checkLogicAndShow();
        }
        tabLeftTimeRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkLogicAndShow, syncIndexFromStorage]);

  const closePopup = useCallback(
    (totalClose = true) => {
      const now = Date.now();
      const duration = now - openTimeRef.current;
      const behavior = getBehavior();
      if (duration < 2000) {
        behavior.quickClose += 1;
      } else {
        behavior.engaged += 1;
      }
      localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(behavior));

      requestAnimationFrame(() => {
        setIsVisible(false);
        if (totalClose) {
          setCurrentIndex(0);
          sessionStorage.setItem(INDEX_KEY, "0");
          localStorage.setItem(POPUP_KEY, now.toString());
        }
      });
    },
    [getBehavior],
  );

  const handleImageClick = useCallback(() => {
    const length = popupsRef.current.length;
    const currentPopup = popupsRef.current[currentIndex];
    const targetUrl = currentPopup?.title?.trim();

    const isLastPopup = currentIndex >= length - 1;
    const nextIndex = currentIndex + 1;

    if (!isLastPopup) {
      sessionStorage.setItem(INDEX_KEY, nextIndex.toString());
      setCurrentIndex(nextIndex);
      closePopup(false);
    } else {
      closePopup(true);
    }

    if (targetUrl) {
      if (targetUrl.startsWith("http")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        router.push(targetUrl);
      }
    }
  }, [currentIndex, closePopup, router]);

  const handleXAction = useCallback(() => {
    const length = popupsRef.current.length;
    if (currentIndex < length - 1) {
      const nextIndex = currentIndex + 1;
      sessionStorage.setItem(INDEX_KEY, nextIndex.toString());
      setCurrentIndex(nextIndex);
    } else {
      void closePopup(true);
    }
  }, [closePopup, currentIndex]);

  // FIX SCROLL LOCK: Mengunci html & body secara menyeluruh
  useEffect(() => {
    if (isVisible) {
      const scrollY = window.scrollY;

      // Simpan posisi scroll saat ini & kunci posisi layar
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Kembalikan ke keadaan semula saat popup ditutup
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Kembalikan posisi scroll ke tempat terakhir pengguna berada
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisible]);

  if (
    !isVisible ||
    !popups ||
    popups.length === 0 ||
    currentIndex >= popups.length
  )
    return null;

  const currentPopup = popups[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 touch-none"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleXAction}
      />

      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-300 max-w-[85%] md:max-w-[500px]">
        {/* X mark menyatu di pojok kanan atas panel, sudut kiri bawah rounded */}
        <button
          onClick={handleXAction}
          aria-label="Tutup popup"
          className="absolute top-0 right-0 z-10 flex items-center justify-center bg-white text-black p-2 rounded-bl-2xl"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <div
          onClick={handleImageClick}
          className="relative flex justify-center items-center overflow-hidden shadow-2xl cursor-pointer transition hover:opacity-95"
        >
          <img
            src={currentPopup.image_url}
            alt="Popup Content"
            loading="eager"
            className="w-full h-auto max-h-[70vh] object-contain block"
          />
        </div>

        {popups.length > 1 && (
          <span className="mt-3 text-[10px] text-white/20 font-mono tracking-tighter">
            {currentIndex + 1}/{popups.length}
          </span>
        )}
      </div>
    </div>
  );
});

PopupDisplay.displayName = "PopupDisplay";

export default PopupDisplay;

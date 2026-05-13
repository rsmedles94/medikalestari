"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchPopups, type Popup } from "@/lib/popup-api";
import { X } from "lucide-react";

const PopupDisplay = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const popupsRef = useRef<Popup[]>([]);
  const tabLeftTimeRef = useRef<number | null>(null);
  const openTimeRef = useRef<number>(0);

  const POPUP_KEY = "last_popup_exit_time";
  const SESSION_KEY = "has_seen_popup_session";
  const BEHAVIOR_KEY = "popup_user_behavior";

  const FIVE_MINUTES = 5 * 60 * 1000;

  useEffect(() => {
    popupsRef.current = popups;
  }, [popups]);

  // ===== Behavior Tracking =====
  const getBehavior = () => {
    const raw = localStorage.getItem(BEHAVIOR_KEY);
    return raw ? JSON.parse(raw) : { quickClose: 0, engaged: 0 };
  };

  const updateBehavior = (viewDuration: number) => {
    const behavior = getBehavior();
    if (viewDuration < 2000) {
      behavior.quickClose += 1;
    } else {
      behavior.engaged += 1;
    }
    localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(behavior));
  };

  const getDynamicCooldown = () => {
    const behavior = getBehavior();
    if (behavior.quickClose >= 3) {
      return FIVE_MINUTES * 2;
    }
    return FIVE_MINUTES;
  };

  const checkLogicAndShow = useCallback(() => {
    const now = Date.now();
    const lastExit = localStorage.getItem(POPUP_KEY);
    const hasSeenThisSession = sessionStorage.getItem(SESSION_KEY);
    const cooldown = getDynamicCooldown();

    if (!hasSeenThisSession) {
      setIsVisible(true);
      openTimeRef.current = now;
      sessionStorage.setItem(SESSION_KEY, "true");
      return;
    }

    if (lastExit && now - parseInt(lastExit) < cooldown) {
      return;
    }

    setIsVisible(true);
    openTimeRef.current = now;
  }, []);

  const preloadImages = useCallback((data: Popup[]) => {
    data.forEach((item) => {
      const img = new Image();
      img.src = item.image_url;
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadPopups = async () => {
      try {
        const popupData = await fetchPopups();
        if (!mounted) return;
        if (popupData?.length) {
          preloadImages(popupData);
          setPopups(popupData);
          checkLogicAndShow();
        }
      } catch (error) {
        console.error("Error loading popups:", error);
      }
    };
    loadPopups();
    return () => {
      mounted = false;
    };
  }, [checkLogicAndShow, preloadImages]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.hidden) {
        tabLeftTimeRef.current = now;
      } else {
        if (
          tabLeftTimeRef.current &&
          now - tabLeftTimeRef.current > FIVE_MINUTES
        ) {
          checkLogicAndShow();
        }
        tabLeftTimeRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkLogicAndShow]);

  const closePopup = useCallback(() => {
    const now = Date.now();
    const duration = now - openTimeRef.current;
    updateBehavior(duration);
    requestAnimationFrame(() => {
      setIsVisible(false);
      setCurrentIndex(0);
      localStorage.setItem(POPUP_KEY, now.toString());
    });
  }, []);

  const handleAction = useCallback(() => {
    if (currentIndex < popupsRef.current.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      closePopup();
    }
  }, [currentIndex, closePopup]);

  // handleForceClose dihapus/tidak digunakan di overlay agar area luar tidak menutup popup

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
  }, [isVisible]);

  if (!isVisible || popups.length === 0) return null;

  const currentPopup = popups[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      {/* area bg */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm will-change-opacity" />

      {/* Container */}
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-300 max-w-[85%] md:max-w-[500px] will-change-transform">
        {/* close button  */}
        <button
          onClick={handleAction}
          className="absolute -top-10 -right-4 bg-white rounded-full text-black transition-colors p-1 active:scale-95"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Image Content */}
        <div
          className="relative cursor-pointer flex justify-center items-center overflow-hidden shadow-2xl"
          onClick={handleAction}
        >
          <img
            src={currentPopup.image_url}
            alt="Popup Content"
            loading="eager"
            decoding="async"
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
};

export default PopupDisplay;

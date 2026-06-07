"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { fetchPopups } from "@/lib/popup-api";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import { imageLoader } from "@/lib/image-loader";
import { X } from "lucide-react";

const FIVE_MINUTES = 5 * 60 * 1000;
const POPUP_KEY = "last_popup_exit_time";
const SESSION_KEY = "has_seen_popup_session";
const BEHAVIOR_KEY = "popup_user_behavior";

const PopupDisplay = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const popupsRef = useRef<Array<{ id: string; image_url: string }>>([]);
  const tabLeftTimeRef = useRef<number | null>(null);
  const openTimeRef = useRef<number>(0);

  // Wrap fetchPopups dengan useCallback untuk stable reference
  const fetchPopupsCallback = useCallback(() => fetchPopups(), []);

  // Use cached fetch dengan deduplication untuk popups
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

  // ===== Behavior Tracking =====
  const getBehavior = useCallback(() => {
    const raw = localStorage.getItem(BEHAVIOR_KEY);
    return raw ? JSON.parse(raw) : { quickClose: 0, engaged: 0 };
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
  }, [getBehavior]);

  // Preload popup images dengan priority queue
  useEffect(() => {
    if (popups && popups.length > 0) {
      // Preload images dengan low priority untuk tidak block
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
          // Show anyway even if preload fails
          checkLogicAndShow();
        });
    }
  }, [popups, checkLogicAndShow]);

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
    // Update behavior inline to avoid dependency issues
    const behavior = getBehavior();
    if (duration < 2000) {
      behavior.quickClose += 1;
    } else {
      behavior.engaged += 1;
    }
    localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(behavior));

    requestAnimationFrame(() => {
      setIsVisible(false);
      setCurrentIndex(0);
      localStorage.setItem(POPUP_KEY, now.toString());
    });
  }, [getBehavior]);

  const handleAction = useCallback(() => {
    // Use ref to check length, not state dependency
    const length = popupsRef.current.length;
    if (currentIndex < length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      void closePopup();
    }
  }, [closePopup, currentIndex]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
  }, [isVisible]);

  if (!isVisible || !popups || popups.length === 0) return null;

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
          className="absolute -top-10 -right-4 bg-white rounded-full text-black transition-colors p-1"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Image Content */}
        <div
          className="relative flex justify-center items-center overflow-hidden shadow-2xl"
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
});

PopupDisplay.displayName = "PopupDisplay";

export default PopupDisplay;

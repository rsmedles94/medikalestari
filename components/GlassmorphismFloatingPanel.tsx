"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface GlassmorphismFloatingPanelProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  maxHeight?: string;
  minHeight?: string;
}

/**
 * Komponen Glassmorphism Floating Panel dengan efek bening putih Apple
 * Bisa di-slider/drag ke atas dan ke bawah
 */
const GlassmorphismFloatingPanel: React.FC<GlassmorphismFloatingPanelProps> = ({
  children,
  isOpen = true,
  onClose,
  maxHeight = "70vh",
  minHeight = "200px",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);

  const snapToPosition = useCallback((offset: number) => {
    if (offset < -50) {
      setDragOffset(-200);
      setIsCollapsed(true);
    } else {
      setDragOffset(0);
      setIsCollapsed(false);
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      startYRef.current = e.clientY;
      startOffsetRef.current = dragOffset;
    },
    [dragOffset],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      startYRef.current = e.touches[0].clientY;
      startOffsetRef.current = dragOffset;
    },
    [dragOffset],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startYRef.current;
      const newOffset = startOffsetRef.current + deltaY;
      setDragOffset(Math.min(newOffset, 0));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      snapToPosition(dragOffset);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, snapToPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - startYRef.current;
      const newOffset = startOffsetRef.current + deltaY;
      setDragOffset(Math.min(newOffset, 0));
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      snapToPosition(dragOffset);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragOffset, snapToPosition]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
      style={{
        transform: `translateY(calc(${dragOffset}px))`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
      }}
    >
      <div
        className="mx-auto max-w-md pointer-events-auto"
        style={{
          maxHeight: isCollapsed ? "80px" : maxHeight,
          minHeight: isCollapsed ? "80px" : minHeight,
        }}
      >
        {/* Glassmorphism Panel */}
        <button
          className="w-full h-full rounded-3xl flex flex-col overflow-hidden shadow-2xl select-none border-0 bg-transparent p-0 m-0 text-left"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(25px) saturate(200%)",
            WebkitBackdropFilter: "blur(25px) saturate(200%)",
            border: "1.5px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 16px 48px 0 rgba(0, 0, 0, 0.1)",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          aria-label="Floating panel"
        >
          {/* Handle Bar / Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
            {/* Draggable handle indicator */}
            <div className="w-8 h-1 bg-white/40 rounded-full mx-auto" />

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="ml-auto p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            )}
          </div>

          {/* Content Area */}
          {!isCollapsed && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="text-white/90">{children}</div>
            </div>
          )}

          {/* Footer Toggle */}
          <div className="px-6 py-3 border-t border-white/20 flex justify-center">
            <button
              onClick={() => {
                if (isCollapsed) {
                  setDragOffset(0);
                  setIsCollapsed(false);
                } else {
                  setDragOffset(-200);
                  setIsCollapsed(true);
                }
              }}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              {isCollapsed ? (
                <>
                  <ChevronUp size={16} />
                  Buka
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Tutup
                </>
              )}
            </button>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GlassmorphismFloatingPanel;

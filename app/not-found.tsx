"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const css = `
  .nf-stage {
    font-size: clamp(7rem, 28vw, 17rem);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.02em;
    line-height: 1;
  }

  .nf-digit {
    display: block;
    font-weight: 900;
    line-height: 0.85;
    letter-spacing: -0.05em;
    color: #d1d5db; /* abu muda */
    user-select: none;
    animation: nf-rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  .nf-digit-right { animation-delay: 0.15s; }

  /* Kolom tengah: jam sebagai angka 0 */
  .nf-clock-col {
    width: 0.78em;
    height: 0.85em;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: nf-rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s both;
  }
  .nf-clock {
    width: 0.74em;
    height: 0.74em;
    display: block;
    filter: drop-shadow(0 0.03em 0.05em rgba(0, 0, 0, 0.12));
    overflow: visible;
  }

  /* Blob latar belakang */
  .nf-blob {
    position: absolute;
    border-radius: 9999px;
    filter: blur(60px);
    opacity: 0.55;
    pointer-events: none;
  }
  .nf-blob-1 { width: 18rem; height: 18rem; top: -4rem; left: -5rem; background: #e5e7eb; animation: nf-drift 9s ease-in-out infinite alternate; }
  .nf-blob-2 { width: 20rem; height: 20rem; bottom: -6rem; right: -6rem; background: #d1d5db; animation: nf-drift 11s ease-in-out infinite alternate-reverse; }
  .nf-blob-3 { width: 12rem; height: 12rem; top: 45%; right: 18%; background: #e5e7eb; animation: nf-drift 8s ease-in-out infinite alternate; }

  /* Titik-titik melayang */
  .nf-dot {
    position: absolute;
    border-radius: 9999px;
    background: #9ca3af;
    opacity: 0.25;
    pointer-events: none;
    animation: nf-float 6s ease-in-out infinite;
  }

  .nf-fade-up {
    animation: nf-fade-up 0.8s ease-out both;
  }

  @keyframes nf-rise {
    from { opacity: 0; transform: translateY(1.2em); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes nf-drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.15); }
  }

  @keyframes nf-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-18px); }
  }

  @keyframes nf-fade-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .nf-digit, .nf-clock-col, .nf-blob, .nf-dot, .nf-fade-up {
      animation: none !important;
    }
  }
`;

// Sumber waktu eksternal untuk useSyncExternalStore:
// React hanya re-render saat nilai detik berubah (cek tiap 200ms).
function subscribeClock(onChange: () => void) {
  const id = setInterval(onChange, 200);
  return () => clearInterval(id);
}
const getClockSnapshot = () => Math.floor(Date.now() / 1000);
const getClockServerSnapshot = () => 0;

// Jam real-time: jarum detik berdetak per detik, menit & jam ikut bergerak.
// Sudut dihitung dari detik sejak tengah malam (kontinu, tidak pernah
// "mundur" saat melewati 360°, jadi transisinya selalu mulus).
function useTickingClock() {
  const nowSec = useSyncExternalStore(
    subscribeClock,
    getClockSnapshot,
    getClockServerSnapshot,
  );

  // Transisi baru diaktifkan sesaat setelah mount, supaya jarum tidak
  // "berputar" dari 0° ke posisi waktu sekarang saat pertama muncul.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (nowSec === 0) {
    return { started: false, secondAngle: 0, minuteAngle: 0, hourAngle: 0 };
  }

  const d = new Date(nowSec * 1000);
  const secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();

  return {
    started: armed,
    secondAngle: secs * 6,
    minuteAngle: secs * 0.1,
    hourAngle: secs / 120,
  };
}

function ClockZero() {
  const { started, secondAngle, minuteAngle, hourAngle } = useTickingClock();

  const handStyle = (angle: number, transition: string) => ({
    transform: `rotate(${angle}deg)`,
    transformOrigin: "50px 50px",
    transition: started ? transition : "none",
  });

  return (
    <svg className="nf-clock" viewBox="0 0 100 100" aria-hidden="true">
      {/* Bingkai jam (membentuk angka 0) */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="#ffffff"
        stroke="#d1d5db"
        strokeWidth="9"
      />
      <circle
        cx="50"
        cy="50"
        r="40.5"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
      />

      {/* Garis penanda menit & jam */}
      {Array.from({ length: 60 }).map((_, i) => {
        const isHour = i % 5 === 0;
        return (
          <line
            key={i}
            x1="50"
            x2="50"
            y1={isHour ? 13 : 13}
            y2={isHour ? 20 : 16}
            stroke={isHour ? "#9ca3af" : "#d1d5db"}
            strokeWidth={isHour ? 2.4 : 1.1}
            strokeLinecap="round"
            transform={`rotate(${i * 6} 50 50)`}
          />
        );
      })}

      {/* Jarum jam */}
      <g style={handStyle(hourAngle, "transform 0.6s ease-out")}>
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="30"
          stroke="#4b5563"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Jarum menit */}
      <g style={handStyle(minuteAngle, "transform 0.6s ease-out")}>
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="21"
          stroke="#6b7280"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>

      {/* Jarum detik (berdetak dengan sedikit memantul) */}
      <g
        style={handStyle(
          secondAngle,
          "transform 0.35s cubic-bezier(0.34, 1.8, 0.5, 1)",
        )}
      >
        <line
          x1="50"
          y1="60"
          x2="50"
          y2="15"
          stroke="#000000"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>

      {/* Poros tengah */}
      <circle cx="50" cy="50" r="3.6" fill="#000000" />
      <circle cx="50" cy="50" r="1.4" fill="#ffffff" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 select-none overflow-hidden">
      <style>{css}</style>

      {/* Latar belakang animasi */}
      <div className="nf-blob nf-blob-1" />
      <div className="nf-blob nf-blob-2" />
      <div className="nf-blob nf-blob-3" />

      <span
        className="nf-dot"
        style={{
          width: 10,
          height: 10,
          top: "18%",
          left: "14%",
          animationDelay: "0s",
        }}
      />
      <span
        className="nf-dot"
        style={{
          width: 14,
          height: 14,
          top: "28%",
          right: "12%",
          animationDelay: "1.2s",
        }}
      />
      <span
        className="nf-dot"
        style={{
          width: 8,
          height: 8,
          bottom: "22%",
          left: "22%",
          animationDelay: "2.1s",
        }}
      />
      <span
        className="nf-dot"
        style={{
          width: 12,
          height: 12,
          bottom: "16%",
          right: "26%",
          animationDelay: "0.6s",
        }}
      />
      <span
        className="nf-dot"
        style={{
          width: 6,
          height: 6,
          top: "60%",
          left: "8%",
          animationDelay: "3s",
        }}
      />

      {/* 404 besar: angka 0 diganti jam yang berdetak */}
      <div className="relative z-10 nf-stage" role="img" aria-label="404">
        <span className="nf-digit">4</span>

        <div className="nf-clock-col">
          <ClockZero />
        </div>

        <span className="nf-digit nf-digit-right">4</span>
      </div>

      {/* Teks & tombol */}
      <div className="relative z-10 text-center mt-6">
        <h1
          className="nf-fade-up text-[50px] md:text-[90px] font-bold text-gray-300 mb-2"
          style={{ animationDelay: "0.5s" }}
        >
          Oops,
        </h1>
        <p
          className="nf-fade-up text-gray-400 text-xl mb-6"
          style={{ animationDelay: "0.65s" }}
        >
          Halaman sedang dalam pemeliharaan
        </p>

        <div className="nf-fade-up" style={{ animationDelay: "0.8s" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-black hover:underline underline-offset-4 px-4 py-2 active:scale-95 transition-all font-medium"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

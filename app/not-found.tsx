"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Game Variables Ref
  const gameStateRef = useRef({
    currentScore: 0,
    isJumping: false,
    jumpVelocity: 0,
    gravity: 0.6,
    //  BOLA (radius, rotasi, dll)
    ball: { x: 70, y: 240, radius: 18, color: "#003f88", rotation: 0 },
    obstacles: [] as Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
    }>,
    spawnTimer: 0,
    gameSpeed: 5,
  });

  // Reset data permainan ketika restart
  const resetGameData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = {
      currentScore: 0,
      isJumping: false,
      jumpVelocity: 0,
      gravity: 0.6,
      ball: {
        x: 70,
        y: canvas.height - 28,
        radius: 18,
        color: "#003f88",
        rotation: 0,
      },
      obstacles: [],
      spawnTimer: 0,
      gameSpeed: 5,
    };
    setScore(0);
  }, []);

  // Logika aksi melompat (Bisa ditrigger Keyboard / Sentuhan HP)
  const triggerJump = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs.isJumping && !gameOver) {
      if (!gameStarted) {
        setGameStarted(true);
      }
      gs.isJumping = true;
      gs.jumpVelocity = -12.5; // Kekuatan lompatan bola
    }
  }, [gameOver, gameStarted]);

  const restartGame = () => {
    setGameOver(false);
    setGameStarted(false);
    resetGameData();
  };

  // Main Effect: Loop Menggambar Game Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = gameContainerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const setCanvasSize = () => {
      canvas.width = container.clientWidth - 32; // Responsive terpotong padding
      canvas.height = 260; // Arena yang proporsional di desktop & mobile
      gameStateRef.current.ball.y = canvas.height - 28;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    resetGameData();

    // --- LOOP UTAMA GAME ---
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gs = gameStateRef.current;
      const ball = gs.ball;

      // 1. Gambar Garis Tanah
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 10);
      ctx.lineTo(canvas.width, canvas.height - 10);
      ctx.strokeStyle = "#E5E7EB"; // Gray-200
      ctx.lineWidth = 3;
      ctx.stroke();

      // 2. Fisika & Efek Rotasi Bola
      if (gs.isJumping) {
        ball.y += gs.jumpVelocity;
        gs.jumpVelocity += gs.gravity;

        // Bola berputar lebih cepat saat melompat
        ball.rotation += 0.1;

        const groundY = canvas.height - 10 - ball.radius;
        if (ball.y >= groundY) {
          ball.y = groundY;
          gs.isJumping = false;
        }
      } else if (gameStarted && !gameOver) {
        // Efek menggelinding di tanah
        ball.rotation += 0.05;
      }

      // 3. Gambar Karakter BOLA yang Menggelinding
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.rotation);

      // Lingkaran luar bola
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();

      // Corak/Garis di dalam bola agar terlihat menggelinding
      ctx.beginPath();
      ctx.moveTo(-ball.radius, 0);
      ctx.lineTo(ball.radius, 0);
      ctx.moveTo(0, -ball.radius);
      ctx.lineTo(0, ball.radius);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      ctx.restore();

      // Jalankan logika rintangan jika game sedang berjalan
      if (gameStarted && !gameOver) {
        gs.currentScore++;
        if (gs.currentScore % 5 === 0) {
          setScore(Math.floor(gs.currentScore / 5));
        }

        // Tambah kecepatan perlahan biar menantang
        if (gs.currentScore % 1500 === 0) gs.gameSpeed += 0.8;

        // Munculkan rintangan buntu (Kaktus/Balok Merah)
        gs.spawnTimer--;
        if (gs.spawnTimer <= 0) {
          const height = Math.random() * 30 + 25; // Tinggi acak 25px - 55px
          gs.obstacles.push({
            x: canvas.width,
            y: canvas.height - 10 - height,
            width: 16,
            height: height,
            speed: gs.gameSpeed,
          });
          gs.spawnTimer = (Math.random() * 50 + 70) * (5 / gs.gameSpeed);
        }
      }

      // 4. Update & Deteksi Tabrakan Rintangan
      ctx.fillStyle = "#EF4444"; 

      for (let i = gs.obstacles.length - 1; i >= 0; i--) {
        const obs = gs.obstacles[i];

        if (gameStarted && !gameOver) {
          obs.x -= obs.speed;
        }

        // Menggambar rintangan kotak tajam
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // --- Deteksi Tabrakan Lingkaran (Bola) dan Kotak (Rintangan) ---
        const closestX = Math.max(obs.x, Math.min(ball.x, obs.x + obs.width));
        const closestY = Math.max(obs.y, Math.min(ball.y, obs.y + obs.height));

        const distanceX = ball.x - closestX;
        const distanceY = ball.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        // Toleransi hitbox 
        const hitRadius = ball.radius - 2;

        if (distanceSquared < hitRadius * hitRadius) {
          setGameOver(true);
          const finalScore = Math.floor(gs.currentScore / 5);
          setHighScore((prev) => Math.max(prev, finalScore));
        }

        // Bersihkan rintangan di luar layar kiri
        if (obs.x + obs.width < 0) {
          gs.obstacles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, gameStarted, resetGameData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handler Keyboard Desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (document.activeElement === document.body) {
          e.preventDefault();
        }
        triggerJump();
      }
    };

    // Handler Sentuh Layar Mobile HP/Tablet
    const handleTouchStart = (e: TouchEvent) => {
      if (e.target === canvas) {
        triggerJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, [triggerJump]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 select-none overflow-x-hidden">


      {/* Arena Game Canvas */}
      <div
        ref={gameContainerRef}
        className="relative bg-white border border-gray-200 rounded-2xl shadow-md p-4 w-full max-w-[1000px] overflow-hidden"
      >
        {/* Papan Skor Akurat */}
        <div className="absolute top-4 right-4 flex space-x-5 text-xs md:text-sm font-mono font-bold text-gray-500 bg-gray-100/80 px-3 py-1.5 rounded-full z-20">
          <div>HI {highScore.toString().padStart(5, "0")}</div>
          <div className="text-blue-600">
            SCORE {score.toString().padStart(5, "0")}
          </div>
        </div>

        {/* Layar Start Awal */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 backdrop-blur-[1px] z-10">
            <p className="text-xs md:text-sm font-semibold text-gray-700 bg-white px-5 py-2.5 rounded-full shadow-md animate-pulse border">
              Tap Layar atau Tekan{" "}
              <span className="font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded border">
                Space
              </span>{" "}
               untuk Melompat
            </p>
          </div>
        )}

        {/* Layar Game Over */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10 transition-all">
            <p className="text-2xl font-black text-red-500 mb-1 tracking-wider">
              GAME OVER
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Skor Anda berhasil diselamatkan!
            </p>
            <button
              onClick={restartGame}
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-full text-sm active:scale-95 transition-all shadow-md"
            >
              Main Lagi
            </button>
          </div>
        )}

        {/* Elemen Canvas Utama */}
        <canvas
          ref={canvasRef}
          className="w-full block cursor-pointer touch-none"
        />
      </div>

      {/* Footer Navigasi */}
      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm mb-4">
          Sedang dalam pemulihan. Silakan akses layanan kami yang lain.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#003f88] hover:bg-[#002f66] rounded-md text-white px-8 py-3 active:scale-95 transition-all font-medium "
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

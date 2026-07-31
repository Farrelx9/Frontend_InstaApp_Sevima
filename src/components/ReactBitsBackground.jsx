import { useEffect, useRef } from "react";

export default function ReactBitsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Palet Warna Instagram yang Elegan
    const orbs = [
      { x: 0.2, y: 0.3, r: 0.6, color: "#ec4899", vx: 0.0008, vy: 0.0006 }, // Pink
      { x: 0.8, y: 0.7, r: 0.5, color: "#a855f7", vx: -0.0007, vy: 0.0009 }, // Purple
      { x: 0.5, y: 0.8, r: 0.45, color: "#f97316", vx: 0.0009, vy: -0.0005 }, // Orange
      { x: 0.7, y: 0.2, r: 0.55, color: "#db2777", vx: -0.0006, vy: -0.0008 }, // Magenta
    ];

    let time = 0;

    const render = () => {
      time += 1;

      // Base background gelap
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      // Kunci efek silk: Blend mode 'screen' + Blur Ekstrem
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(100px)";

      orbs.forEach((orb, i) => {
        // Gerakan sangat lambat dan mengalir
        const moveX = Math.sin(time * orb.vx + i) * width * 0.2;
        const moveY = Math.cos(time * orb.vy + i * 1.5) * height * 0.2;

        const cx = width * orb.x + moveX;
        const cy = height * orb.y + moveY;
        const radius = Math.min(width, height) * orb.r;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset filter agar tidak mempengaruhi elemen lain jika ada
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#050508]">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Noise overlay elegan menggunakan SVG (bukan pixel manipulation) */}
      {/* Opacity 0.04 cukup untuk memberi tekstur tanpa membuatnya kasar */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette untuk memfokuskan perhatian ke tengah */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050508_80%)]" />
    </div>
  );
}

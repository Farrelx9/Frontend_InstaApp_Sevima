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
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Color nodes representing Instagram / Aurora palette
    const colors = [
      { r: 236, g: 72, b: 153 }, // Pink
      { r: 168, g: 85, b: 247 }, // Purple
      { r: 249, g: 115, b: 22 }, // Orange
      { r: 217, g: 70, b: 239 }, // Magenta
    ];

    // Blob particles for fluid aurora wave
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.min(width, height) * (0.35 + Math.random() * 0.25),
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      // Render glowing aurora blobs
      blobs.forEach((blob, idx) => {
        blob.x += Math.sin(time + blob.phase) * 0.6 + blob.vx;
        blob.y += Math.cos(time + blob.phase) * 0.6 + blob.vy;

        // Bounce gently inside canvas boundaries
        if (blob.x < -100) blob.x = width + 100;
        if (blob.x > width + 100) blob.x = -100;
        if (blob.y < -100) blob.y = height + 100;
        if (blob.y > height + 100) blob.y = -100;

        const pulseRadius = blob.radius + Math.sin(time * 1.5 + idx) * 30;

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          pulseRadius
        );

        const { r, g, b } = blob.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.12)`);
        gradient.addColorStop(1, "rgba(5, 5, 8, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Overlay subtle wave grid lines (ReactBits aesthetic)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Soft overlay gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/40" />
    </div>
  );
}

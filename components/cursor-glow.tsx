"use client";

import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      
      // Add point to trail
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      // Keep only recent points (last 500ms)
      const now = Date.now();
      trailRef.current = trailRef.current.filter((p) => now - p.timestamp < 500);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const trail = trailRef.current;

      // Draw comet trail
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const point = trail[i];
          const prevPoint = trail[i - 1];
          const age = now - point.timestamp;
          const maxAge = 500;
          const alpha = Math.max(0, 1 - age / maxAge) * 0.6;
          const size = Math.max(1, (1 - age / maxAge) * 8);

          // Gradient from cyan to blue
          const gradient = ctx.createLinearGradient(prevPoint.x, prevPoint.y, point.x, point.y);
          gradient.addColorStop(0, `rgba(34, 211, 238, ${alpha * 0.3})`); // cyan-400
          gradient.addColorStop(1, `rgba(96, 165, 250, ${alpha * 0.5})`); // blue-400

          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = size;
          ctx.lineCap = "round";
          ctx.stroke();

          // Add sparkle particles
          if (i % 3 === 0 && alpha > 0.2) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.fill();
          }
        }
      }

      // Draw main cursor glow
      if (isVisible) {
        const { x, y } = mouseRef.current;

        // Outer glow
        const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, 80);
        outerGradient.addColorStop(0, "rgba(96, 165, 250, 0.15)"); // blue-400
        outerGradient.addColorStop(0.5, "rgba(34, 211, 238, 0.08)"); // cyan-400
        outerGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(x, y, 80, 0, Math.PI * 2);
        ctx.fillStyle = outerGradient;
        ctx.fill();

        // Inner bright core
        const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        innerGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        innerGradient.addColorStop(0.5, "rgba(147, 197, 253, 0.3)"); // blue-300
        innerGradient.addColorStop(1, "rgba(96, 165, 250, 0)");

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();
      }

      // Clean up old trail points
      trailRef.current = trailRef.current.filter((p) => now - p.timestamp < 500);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface PinkShootingStar {
  active: boolean;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number; // radians
  alpha: number;
  cooldownFrames: number;
}

export function StarCasingBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Stars collection
    let stars: Star[] = [];

    // SINGLETON PINK SHOOTING STAR
    const pinkShooter: PinkShootingStar = {
      active: false,
      x: 0,
      y: 0,
      length: 130,
      speed: 13,
      angle: (Math.PI / 180) * 28, // ~28 degrees downward
      alpha: 0,
      cooldownFrames: 60, // spawns ~1 second after opening
    };

    const spawnPinkShootingStar = () => {
      pinkShooter.active = true;
      // Start slightly off-canvas on upper left/top region
      pinkShooter.x = Math.random() * (width * 0.45) - 30;
      pinkShooter.y = Math.random() * (height * 0.25) - 10;
      pinkShooter.speed = 11 + Math.random() * 4;
      pinkShooter.length = 110 + Math.random() * 50;
      pinkShooter.angle = (Math.PI / 180) * (26 + Math.random() * 8);
      pinkShooter.alpha = 1;
    };

    const initStars = () => {
      const count = Math.min(Math.floor((width * height) / 10000), 110);
      stars = Array.from({ length: Math.max(50, count) }, () => {
        const radius = Math.random() * 1.1 + 0.4;
        const baseAlpha = Math.random() * 0.5 + 0.25;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: 0.008 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initStars();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Star Casing Celestial Grid & Rings (Deep Architectural Space)
      const centerX = width * 0.75;
      const centerY = height * 0.25;

      ctx.save();
      // Subtle concentric coordinate rings
      const radii = [140, 280, 460];
      for (let i = 0; i < radii.length; i++) {
        const r = radii[i];
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? 'rgba(255, 255, 255, 0.038)' : 'rgba(255, 255, 255, 0.022)';
        ctx.lineWidth = 1;
        ctx.setLineDash(i === 0 ? [2, 10] : [3, 14]);
        ctx.stroke();
      }

      // Faint radial axis lines
      ctx.beginPath();
      ctx.setLineDash([4, 12]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.moveTo(centerX - 500, centerY);
      ctx.lineTo(centerX + 500, centerY);
      ctx.moveTo(centerX, centerY - 500);
      ctx.lineTo(centerX, centerY + 500);
      ctx.stroke();

      // Delicate celestial crosshair (+) markers at intersections
      const markers = [
        { x: centerX + 140, y: centerY },
        { x: centerX - 140, y: centerY },
        { x: centerX, y: centerY + 140 },
        { x: centerX, y: centerY - 140 },
        { x: centerX + 280, y: centerY },
        { x: centerX - 280, y: centerY },
      ];

      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      for (const m of markers) {
        if (m.x >= 0 && m.x <= width && m.y >= 0 && m.y <= height) {
          ctx.beginPath();
          ctx.moveTo(m.x - 4, m.y);
          ctx.lineTo(m.x + 4, m.y);
          ctx.moveTo(m.x, m.y - 4);
          ctx.lineTo(m.x, m.y + 4);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 2. Draw Ambient Micro-Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const pulse = (Math.sin(star.phase) + 1) * 0.5; // 0 to 1
        star.alpha = star.baseAlpha * 0.6 + pulse * (star.baseAlpha * 0.7);

        ctx.fillStyle = `rgba(226, 232, 240, ${star.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Very faint halo on slightly larger stars
        if (star.radius > 1.1) {
          ctx.fillStyle = `rgba(203, 213, 225, ${(star.alpha * 0.18).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw EXACTLY ONE Pink Shooting Star
      if (pinkShooter.active) {
        const dx = Math.cos(pinkShooter.angle) * pinkShooter.speed;
        const dy = Math.sin(pinkShooter.angle) * pinkShooter.speed;

        pinkShooter.x += dx;
        pinkShooter.y += dy;

        const tailX = pinkShooter.x - Math.cos(pinkShooter.angle) * pinkShooter.length;
        const tailY = pinkShooter.y - Math.sin(pinkShooter.angle) * pinkShooter.length;

        // Gradient trail for the single pink shooting star
        const gradient = ctx.createLinearGradient(tailX, tailY, pinkShooter.x, pinkShooter.y);
        gradient.addColorStop(0, 'rgba(244, 114, 182, 0)');
        gradient.addColorStop(0.55, 'rgba(236, 72, 153, 0.28)');
        gradient.addColorStop(0.85, 'rgba(244, 114, 182, 0.75)');
        gradient.addColorStop(1, 'rgba(253, 164, 175, 0.95)');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(pinkShooter.x, pinkShooter.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Soft pink ambient glow halo around head
        const glowGradient = ctx.createRadialGradient(
          pinkShooter.x,
          pinkShooter.y,
          0,
          pinkShooter.x,
          pinkShooter.y,
          10
        );
        glowGradient.addColorStop(0, 'rgba(244, 114, 182, 0.65)');
        glowGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.25)');
        glowGradient.addColorStop(1, 'rgba(244, 114, 182, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(pinkShooter.x, pinkShooter.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Bright white-pink pinpoint head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pinkShooter.x, pinkShooter.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check if out of bounds
        if (
          pinkShooter.x > width + 120 ||
          pinkShooter.y > height + 120 ||
          pinkShooter.x < -150 ||
          pinkShooter.y < -150
        ) {
          pinkShooter.active = false;
          // Cooldown between 6.5s and 8.5s (~400-520 frames at 60fps)
          pinkShooter.cooldownFrames = Math.floor(390 + Math.random() * 120);
        }
      } else {
        pinkShooter.cooldownFrames--;
        if (pinkShooter.cooldownFrames <= 0) {
          spawnPinkShootingStar();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}

import { useEffect, useRef } from 'react';

/**
 * Field of dots rolling in slow waves, drawn in perspective on a canvas behind the home hero.
 * Purely decorative: it pauses when scrolled out of view or the tab is hidden, and draws a
 * single still frame for visitors who prefer reduced motion.
 */
export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COLS = 64;
    const ROWS = 30;
    const SPACING = 26; // world units between dots
    const FOV = 340;
    const CAMERA_Z = 120;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let t = reduceMotion ? 12 : 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      // The wave sits in the lower part of the hero, rising towards the horizon.
      const horizon = height * 0.55;
      const scale = Math.max(1, width / 1200);

      for (let r = 0; r < ROWS; r++) {
        const z = r * SPACING + 20;
        const depth = FOV / (z + CAMERA_Z);
        const fade = 1 - r / ROWS;
        for (let c = 0; c < COLS; c++) {
          const x = (c - COLS / 2) * SPACING * scale;
          const y =
            Math.sin(c * 0.22 + t * 0.9) * 16 +
            Math.cos(r * 0.32 + t * 0.7) * 14 +
            Math.sin((c + r) * 0.11 + t * 0.45) * 10;
          const sx = cx + x * depth;
          const sy = horizon + (110 - y) * depth;
          if (sx < -4 || sx > width + 4 || sy > height + 4) continue;
          const size = Math.max(0.5, 1.5 * depth);
          // Crests are brighter than troughs, distant dots fade out.
          const alpha = Math.min(0.5, (0.14 + (y + 40) / 160) * fade * 0.8);
          ctx.fillStyle = `rgba(44, 67, 119, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      t += 0.012;
      draw();
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="hero-particles" aria-hidden="true" />;
}

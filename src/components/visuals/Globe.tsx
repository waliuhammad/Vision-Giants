import { useEffect, useRef } from 'react';

interface Pt {
  x: number;
  y: number;
  z: number;
  /** 0 = blue, 1 = purple tint */
  hue: number;
}

/** Deterministic PRNG so arcs are stable between renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cheap pseudo-continent field: clusters points into land-like patches. */
function landField(lat: number, lon: number) {
  return (
    Math.sin(lon * 2 + 1.3) * Math.cos(lat * 3) +
    0.6 * Math.sin(lon * 5 + lat * 2.2) +
    0.35 * Math.cos(lon * 9 - lat * 6) +
    0.25 * Math.sin(lat * 11 + lon * 3)
  );
}

function buildGlobe(count: number) {
  const land: Pt[] = [];
  const ocean: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const lat = Math.asin(y);
    const lon = Math.atan2(z, x);
    const p = { x, y, z, hue: Math.max(0, Math.sin(lon + 0.6) * 0.9) };
    if (landField(lat, lon) > 0.2 && Math.abs(lat) < 1.3) land.push(p);
    else if (i % 3 === 0) ocean.push(p);
  }

  // Great-circle arcs between land points, lifted above the surface
  const rand = mulberry32(7);
  const arcs: { pts: [number, number, number][]; speed: number; offset: number }[] = [];
  let guard = 0;
  while (arcs.length < 14 && guard++ < 400) {
    const a = land[Math.floor(rand() * land.length)];
    const b = land[Math.floor(rand() * land.length)];
    if (!a || !b) break;
    const dot = a.x * b.x + a.y * b.y + a.z * b.z;
    const omega = Math.acos(Math.min(1, Math.max(-1, dot)));
    if (omega < 0.5 || omega > 2.2) continue;
    const steps = 48;
    const pts: [number, number, number][] = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const k1 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const k2 = Math.sin(t * omega) / Math.sin(omega);
      const lift = 1 + 0.22 * omega * 0.5 * Math.sin(Math.PI * t);
      pts.push([(a.x * k1 + b.x * k2) * lift, (a.y * k1 + b.y * k2) * lift, (a.z * k1 + b.z * k2) * lift]);
    }
    arcs.push({ pts, speed: 0.12 + rand() * 0.12, offset: rand() });
  }
  return { land, ocean, arcs };
}

/**
 * Lightweight rotating dot-globe with network arcs, rendered to a 2D canvas.
 * Pauses off-screen / in background tabs and renders a single static frame for reduced motion.
 */
export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const small = window.innerWidth < 640;
    let land: Pt[] = [];
    let ocean: Pt[] = [];
    let arcs: ReturnType<typeof buildGlobe>['arcs'] = [];
    let ready = false;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rotation = 0.9;
    let last = performance.now();
    let elapsed = 0;
    let raf = 0;
    let inView = true;
    const tilt = 0.38;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const project = (x: number, y: number, z: number, cosR: number, sinR: number) => {
      const x1 = x * cosR - z * sinR;
      const z1 = x * sinR + z * cosR;
      const y2 = y * cosT - z1 * sinT;
      const z2 = y * sinT + z1 * cosT;
      return [x1, y2, z2] as const;
    };

    function draw() {
      if (!ctx || !width || !ready) return;
      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.4;
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);
      ctx.clearRect(0, 0, width, height);

      // Sphere body
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, 'rgba(70, 120, 200, 0.32)');
      body.addColorStop(0.6, 'rgba(20, 48, 100, 0.3)');
      body.addColorStop(1, 'rgba(14, 33, 66, 0.15)');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Atmosphere rim
      const rim = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.12);
      rim.addColorStop(0, 'rgba(143, 184, 232, 0)');
      rim.addColorStop(0.35, 'rgba(143, 184, 232, 0.28)');
      rim.addColorStop(1, 'rgba(91, 143, 214, 0)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.fill();

      // Ocean grid dots (very faint)
      ctx.fillStyle = 'rgba(150, 185, 235, 0.16)';
      for (const p of ocean) {
        const [x, y, z] = project(p.x, p.y, p.z, cosR, sinR);
        if (z < 0) continue;
        ctx.fillRect(cx + x * R, cy - y * R, 1, 1);
      }

      // Land dots
      for (const p of land) {
        const [x, y, z] = project(p.x, p.y, p.z, cosR, sinR);
        const sx = cx + x * R;
        const sy = cy - y * R;
        if (z < 0) {
          if (z > -0.6) {
            ctx.fillStyle = 'rgba(120, 155, 215, 0.10)';
            ctx.fillRect(sx, sy, 1, 1);
          }
          continue;
        }
        const a = 0.4 + 0.6 * z;
        const s = 1.1 + 1.3 * z;
        const r = Math.round(110 + 70 * p.hue);
        const g = Math.round(165 + 35 * p.hue);
        ctx.fillStyle = `rgba(${r}, ${g}, 238, ${a.toFixed(2)})`;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      }

      // Arcs and travelling pulses
      ctx.lineWidth = 1;
      for (const arc of arcs) {
        ctx.beginPath();
        let started = false;
        let visible = 0;
        for (const [px, py, pz] of arc.pts) {
          const [x, y, z] = project(px, py, pz, cosR, sinR);
          if (z < -0.05) {
            started = false;
            continue;
          }
          visible++;
          const sx = cx + x * R;
          const sy = cy - y * R;
          if (started) ctx.lineTo(sx, sy);
          else {
            ctx.moveTo(sx, sy);
            started = true;
          }
        }
        if (!visible) continue;
        ctx.strokeStyle = 'rgba(143, 184, 232, 0.32)';
        ctx.stroke();

        const end = arc.pts[0]!;
        const [ex, ey, ez] = project(end[0], end[1], end[2], cosR, sinR);
        if (ez > 0) {
          ctx.fillStyle = 'rgba(160, 235, 255, 0.95)';
          ctx.beginPath();
          ctx.arc(cx + ex * R, cy - ey * R, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        const t = (elapsed * arc.speed + arc.offset) % 1;
        const idx = Math.floor(t * (arc.pts.length - 1));
        const pp = arc.pts[idx]!;
        const [qx, qy, qz] = project(pp[0], pp[1], pp[2], cosR, sinR);
        if (qz > 0) {
          const sx = cx + qx * R;
          const sy = cy - qy * R;
          const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, 7);
          halo.addColorStop(0, 'rgba(200, 245, 255, 0.95)');
          halo.addColorStop(1, 'rgba(143, 184, 232, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(sx, sy, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      rotation += dt * 0.09;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (inView) start();
      else stop();
    });
    const onVisibility = () => (document.hidden ? stop() : start());

    // Build the point cloud when the main thread is idle so it doesn't compete with hydration
    const init = () => {
      ({ land, ocean, arcs } = buildGlobe(small ? 2200 : 4200));
      ready = true;
      ro.observe(canvas);
      io.observe(canvas);
      document.addEventListener('visibilitychange', onVisibility);
      resize();
      start();
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(init, { timeout: 1500 })
      : window.setTimeout(init, 200);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="globe__canvas" />;
}

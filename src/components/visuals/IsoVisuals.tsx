import { useId, type CSSProperties, type ReactNode } from 'react';

/* ------------------------------------------------------------------
   Isometric helpers: a coherent family of light, line-led illustrations
   ------------------------------------------------------------------ */
const C = Math.cos(Math.PI / 6);
const iso = (x: number, y: number, z: number) => `${((x - y) * C).toFixed(1)},${((x + y) * 0.5 - z).toFixed(1)}`;

interface BoxProps {
  x?: number;
  y?: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  ids: Ids;
  tone?: 'blue' | 'bright' | 'purple' | 'glass';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

type Ids = ReturnType<typeof useIds>;

function useIds() {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  const mk = (n: string) => `${n}-${raw}`;
  return {
    topBlue: mk('tb'),
    topBright: mk('tbr'),
    topPurple: mk('tp'),
    left: mk('l'),
    right: mk('r'),
    glass: mk('g'),
    glow: mk('gl'),
    portal: mk('po'),
    blur: mk('bl'),
  };
}

function Defs({ ids }: { ids: Ids }) {
  return (
    <defs>
      <linearGradient id={ids.topBlue} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dbe7fd" stopOpacity="0.9" />
        <stop offset="1" stopColor="#bcd2f7" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id={ids.topBright} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#bcd2f7" />
        <stop offset="0.5" stopColor="#5b8def" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id={ids.topPurple} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e0eafc" stopOpacity="0.85" />
        <stop offset="1" stopColor="#bcd2f7" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id={ids.left} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c7d8fa" stopOpacity="0.85" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id={ids.right} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9bb8ef" stopOpacity="0.9" />
        <stop offset="1" stopColor="#7ea2ea" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id={ids.glass} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5b8def" stopOpacity="0.32" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.14" />
      </linearGradient>
      <radialGradient id={ids.glow}>
        <stop offset="0" stopColor="#5b8def" stopOpacity="0.16" />
        <stop offset="0.5" stopColor="#2563eb" stopOpacity="0.06" />
        <stop offset="1" stopColor="#7ea2ea" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ids.portal} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2563eb" />
        <stop offset="0.35" stopColor="#5b8def" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.4" />
      </linearGradient>
      <filter id={ids.blur} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
  );
}

function Box({ x = 0, y = 0, z = 0, w, d, h, ids, tone = 'blue', className, style, children }: BoxProps) {
  const top = `${iso(x, y, z + h)} ${iso(x + w, y, z + h)} ${iso(x + w, y + d, z + h)} ${iso(x, y + d, z + h)}`;
  const left = `${iso(x, y + d, z)} ${iso(x + w, y + d, z)} ${iso(x + w, y + d, z + h)} ${iso(x, y + d, z + h)}`;
  const right = `${iso(x + w, y, z)} ${iso(x + w, y + d, z)} ${iso(x + w, y + d, z + h)} ${iso(x + w, y, z + h)}`;
  const topFill =
    tone === 'bright'
      ? ids.topBright
      : tone === 'purple'
        ? ids.topPurple
        : tone === 'glass'
          ? ids.glass
          : ids.topBlue;
  const glass = tone === 'glass';
  return (
    <g className={className} style={style}>
      <polygon points={left} fill={glass ? `url(#${ids.glass})` : `url(#${ids.left})`} />
      <polygon points={right} fill={glass ? `url(#${ids.glass})` : `url(#${ids.right})`} opacity={glass ? 0.7 : 1} />
      <polygon points={top} fill={`url(#${topFill})`} />
      <g fill="none" stroke="#5b8def" strokeOpacity={glass ? 0.75 : 0.55} strokeWidth="1" strokeLinejoin="round">
        <polygon points={top} />
        <polyline points={`${iso(x, y + d, z + h)} ${iso(x, y + d, z)} ${iso(x + w, y + d, z)} ${iso(x + w, y, z)} ${iso(x + w, y, z + h)}`} />
        <line
          x1={iso(x + w, y + d, z).split(',')[0]}
          y1={iso(x + w, y + d, z).split(',')[1]}
          x2={iso(x + w, y + d, z + h).split(',')[0]}
          y2={iso(x + w, y + d, z + h).split(',')[1]}
        />
      </g>
      {children}
    </g>
  );
}

function Glow({ cx, cy, rx, ry, ids }: { cx: number; cy: number; rx: number; ry: number; ids: Ids }) {
  return <ellipse className="glow-pulse" cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${ids.glow})`} />;
}

function Sparkles({ points }: { points: [number, number][] }) {
  return (
    <g fill="#93b4f5">
      {points.map(([x, y], i) => (
        <circle key={i} className="twinkle" cx={x} cy={y} r={i % 3 ? 1.2 : 2} style={{ animationDelay: `${i * 0.45}s` }} />
      ))}
    </g>
  );
}

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/* ------------------------------------------------------------------ */

/** Services: stacked glowing layers (platform of services). */
export function LayersVisual() {
  const ids = useIds();
  return (
    <svg viewBox="-230 -210 460 400" role="img">
      <Defs ids={ids} />
      <Glow cx={0} cy={110} rx={210} ry={80} ids={ids} />
      <Sparkles points={[[-190, -120], [170, -150], [200, 40], [-200, 70], [-120, -180], [120, 150]]} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="float" style={delay(-i * 0.6)}>
          <Box x={-75} y={-75} z={i * 46 - 20} w={150} d={150} h={12} ids={ids} tone={i === 3 ? 'bright' : i === 1 ? 'purple' : 'blue'} />
        </g>
      ))}
      <g className="float float--slow" style={delay(-2)}>
        <Box x={120} y={-140} z={60} w={26} d={26} h={26} ids={ids} tone="glass" />
      </g>
      <g className="float float--slow" style={delay(-5)}>
        <Box x={-150} y={90} z={150} w={20} d={20} h={20} ids={ids} tone="glass" />
      </g>
    </svg>
  );
}

/** About: large translucent cube containing a bright core cube. */
export function CubeVisual() {
  const ids = useIds();
  return (
    <svg viewBox="-230 -230 460 420" role="img">
      <Defs ids={ids} />
      <Glow cx={0} cy={110} rx={200} ry={70} ids={ids} />
      <Sparkles points={[[-200, -150], [180, -170], [210, 60], [-210, 40], [60, -210], [-90, 160]]} />
      <g className="float float--slow">
        <Box x={-70} y={-70} z={-30} w={140} d={140} h={140} ids={ids} tone="glass" />
        <Box x={-30} y={-30} z={10} w={60} d={60} h={60} ids={ids} tone="bright" />
      </g>
      <g className="float" style={delay(-2.5)}>
        <Box x={110} y={-150} z={40} w={46} d={46} h={46} ids={ids} tone="blue" />
      </g>
      <g className="float" style={delay(-4.5)}>
        <Box x={-160} y={70} z={150} w={30} d={30} h={30} ids={ids} tone="purple" />
      </g>
    </svg>
  );
}

/** Technologies: layered architecture platform with floating service tiles. */
export function StackVisual() {
  const ids = useIds();
  const tile = (x: number, y: number, z: number, d: number, glyph: ReactNode, tone: BoxProps['tone'] = 'glass') => (
    <g className="float" style={delay(d)}>
      <Box x={x} y={y} z={z} w={40} d={40} h={8} ids={ids} tone={tone} />
      <g transform={`translate(${((x + 20 - (y + 20)) * C).toFixed(1)} ${((x + 20 + y + 20) * 0.5 - z - 8).toFixed(1)})`}>
        {glyph}
      </g>
    </g>
  );
  const s = { fill: 'none', stroke: '#2563eb', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="-240 -210 480 400" role="img">
      <Defs ids={ids} />
      <Glow cx={0} cy={100} rx={230} ry={85} ids={ids} />
      <Box x={-110} y={-110} z={-30} w={220} d={220} h={14} ids={ids} tone="blue" />
      <Box x={-75} y={-75} z={-4} w={150} d={150} h={14} ids={ids} tone="purple" />
      <g className="float float--slow">
        <Box x={-40} y={-40} z={40} w={80} d={80} h={22} ids={ids} tone="bright" />
      </g>
      {/* connection lines from core to tiles */}
      <g stroke="#5b8def" strokeOpacity="0.45" strokeDasharray="3 5">
        <line x1="0" y1="-60" x2="-150" y2="-120" />
        <line x1="0" y1="-60" x2="150" y2="-120" />
        <line x1="0" y1="-60" x2="-170" y2="10" />
        <line x1="0" y1="-60" x2="170" y2="10" />
      </g>
      {tile(-60, 140, 110, -1, <path {...s} d="M-6 -4 -11 0l5 4M6 -4l5 4-5 4M2 -7-2 7" transform="translate(0 -1)" />)}
      {tile(140, -60, 110, -3, <g {...s}><ellipse cx="0" cy="-5" rx="8" ry="3" /><path d="M-8 -5v9c0 1.7 3.6 3 8 3s8-1.3 8-3v-9" /></g>, 'purple')}
      {tile(-20, 190, 10, -2, <path {...s} d="M-8 4h14a5 5 0 0 0 0-10 7 7 0 0 0-13 2 4 4 0 0 0-1 8z" />)}
      {tile(190, -20, 10, -4, <path {...s} d="M0 -9l8 3v5c0 5-3.5 8-8 9.5-4.5-1.5-8-4.5-8-9.5v-5z" />, 'purple')}
      <Sparkles points={[[-220, -160], [210, -170], [0, -200], [220, 120], [-220, 110]]} />
    </svg>
  );
}

/** Portfolio: constellation network around a floating browser window. */
export function NetworkVisual() {
  const ids = useIds();
  const nodes: [number, number][] = [
    [-190, -120], [-120, -170], [-40, -140], [60, -175], [150, -130], [200, -40],
    [170, 70], [90, 140], [-20, 165], [-130, 120], [-195, 30], [-90, -60], [110, -40],
  ];
  const links: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 0], [2, 11], [11, 10], [3, 12], [12, 5], [11, 9],
  ];
  return (
    <svg viewBox="-230 -210 460 400" role="img">
      <Defs ids={ids} />
      <Glow cx={0} cy={0} rx={200} ry={150} ids={ids} />
      <g stroke="#5b8def" strokeOpacity="0.4" strokeWidth="1">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a]![0]} y1={nodes[a]![1]} x2={nodes[b]![0]} y2={nodes[b]![1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i % 4 === 0 ? 7 : 4} fill="#5b8def" opacity="0.18" />
          <circle className="twinkle" cx={x} cy={y} r={i % 4 === 0 ? 3 : 2} fill="#2563eb" style={delay(i * 0.3)} />
        </g>
      ))}
      <g className="float float--slow">
        <rect x="-120" y="-80" width="240" height="160" rx="12" fill="#ffffff" stroke="#5b8def" strokeOpacity="0.6" />
        <rect x="-120" y="-80" width="240" height="26" rx="12" fill="#f1f5fb" />
        <rect x="-120" y="-62" width="240" height="8" fill="#f1f5fb" />
        <circle cx="-102" cy="-67" r="4" fill="#f87171" opacity="0.8" />
        <circle cx="-88" cy="-67" r="4" fill="#fbbf24" opacity="0.8" />
        <circle cx="-74" cy="-67" r="4" fill="#34d399" opacity="0.8" />
        <rect x="-104" y="-40" width="90" height="10" rx="3" fill="#5b8def" opacity="0.9" />
        <rect x="-104" y="-22" width="130" height="6" rx="3" fill="#cbd5e1" opacity="0.6" />
        <rect x="-104" y="-10" width="110" height="6" rx="3" fill="#cbd5e1" opacity="0.6" />
        <rect x="-104" y="10" width="62" height="54" rx="6" fill={`url(#${ids.topBright})`} opacity="0.85" />
        <rect x="-34" y="10" width="62" height="54" rx="6" fill={`url(#${ids.topPurple})`} opacity="0.8" />
        <rect x="36" y="10" width="68" height="54" rx="6" fill={`url(#${ids.topBlue})`} opacity="0.8" />
        <rect x="36" y="-40" width="68" height="36" rx="6" fill="none" stroke="#5b8def" strokeOpacity="0.6" />
        <polyline points="42,-12 56,-22 70,-16 86,-32 98,-26" fill="none" stroke="#5b8def" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Contact: glowing envelope with communication nodes. */
export function EnvelopeVisual() {
  const ids = useIds();
  return (
    <svg viewBox="-230 -200 460 380" role="img">
      <Defs ids={ids} />
      <Glow cx={0} cy={60} rx={210} ry={110} ids={ids} />
      <g stroke="#5b8def" strokeOpacity="0.35" fill="none">
        <path d="M-210 -120 C -120 -150, -80 -40, 0 -40" strokeDasharray="4 6" />
        <path d="M210 -140 C 120 -160, 90 -50, 20 -40" strokeDasharray="4 6" />
        <path d="M-200 120 C -120 140, -60 60, -20 40" strokeDasharray="4 6" />
      </g>
      {[[-210, -120], [210, -140], [-200, 120], [190, 110]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#2563eb" opacity="0.18" />
          <circle className="twinkle" cx={x} cy={y} r="3.5" fill="#2563eb" style={delay(i * 0.7)} />
        </g>
      ))}
      <g className="float" style={{ transformOrigin: 'center' }}>
        <g transform="rotate(-14)">
          <rect x="-125" y="-80" width="250" height="160" rx="14" fill={`url(#${ids.topBlue})`} stroke="#2563eb" strokeOpacity="0.9" strokeWidth="1.5" />
          <path d="M-125 -66 L0 20 L125 -66" fill="none" stroke="#2563eb" strokeWidth="2" strokeOpacity="0.85" />
          <path d="M-125 80 L-30 -6 M125 80 L30 -6" stroke="#5b8def" strokeOpacity="0.5" />
          <path d="M-125 -66 L0 20 L125 -66 L125 -80 L-125 -80 Z" fill={`url(#${ids.topBright})`} opacity="0.7" />
        </g>
      </g>
      <g opacity="0.7">
        <path d="M-200 30 h60 M-210 50 h40 M150 -20 h55 M165 0 h35" stroke="#5b8def" strokeLinecap="round" strokeWidth="2" strokeOpacity="0.5" />
      </g>
      <Sparkles points={[[-150, -170], [140, 160], [60, -180], [-60, 160], [205, 30]]} />
    </svg>
  );
}

/** Careers: steps leading up to a glowing portal. */
export function PortalVisual() {
  const ids = useIds();
  return (
    <svg viewBox="-230 -250 460 440" role="img">
      <Defs ids={ids} />
      <Glow cx={0} cy={80} rx={220} ry={90} ids={ids} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Box key={i} x={-60} y={98 - i * 36} z={i * 18 - 60} w={120} d={36} h={18} ids={ids} tone={i === 4 ? 'bright' : 'blue'} />
      ))}
      {/* Portal frame */}
      <g>
        <Box x={-60} y={-60} z={30} w={14} d={14} h={180} ids={ids} tone="blue" />
        <Box x={46} y={-60} z={30} w={14} d={14} h={180} ids={ids} tone="blue" />
        <Box x={-60} y={-60} z={210} w={120} d={14} h={14} ids={ids} tone="bright" />
        <polygon
          className="glow-pulse"
          points={`${iso(-46, -53, 30)} ${iso(46, -53, 30)} ${iso(46, -53, 210)} ${iso(-46, -53, 210)}`}
          fill={`url(#${ids.portal})`}
        />
        <polygon
          points={`${iso(-46, -53, 30)} ${iso(46, -53, 30)} ${iso(46, -53, 210)} ${iso(-46, -53, 210)}`}
          fill={`url(#${ids.portal})`}
          filter={`url(#${ids.blur})`}
          opacity="0.7"
        />
      </g>
      <g className="float float--slow" style={delay(-2)}>
        <Box x={120} y={-170} z={80} w={26} d={26} h={26} ids={ids} tone="glass" />
      </g>
      <g className="float" style={delay(-4)}>
        <Box x={-170} y={60} z={190} w={20} d={20} h={20} ids={ids} tone="purple" />
      </g>
      <Sparkles points={[[-200, -200], [190, -220], [210, 40], [-210, 0], [0, -240], [140, 150]]} />
    </svg>
  );
}

import type { CSSProperties } from 'react';
import { CodeXml, Smartphone, Cloud, Palette } from 'lucide-react';
import { Globe } from './Globe';

const chips = [
  { label: 'Web Apps', icon: CodeXml, pos: { top: '14%', left: '2%' } },
  { label: 'Mobile', icon: Smartphone, pos: { top: '22%', right: '0%' } },
  { label: 'UI/UX', icon: Palette, pos: { bottom: '20%', left: '0%' } },
  { label: 'Cloud', icon: Cloud, pos: { bottom: '12%', right: '6%' } },
];

/** Deterministic star field so server and client markup match. */
const stars = Array.from({ length: 26 }, (_, i) => ({
  cx: (i * 137.5) % 500,
  cy: (i * 89.3 + 40) % 500,
  r: i % 5 === 0 ? 1.6 : 0.9,
  d: `${(i % 7) * 0.5}s`,
}));

/** Home hero visual: glow + orbit rings + particles (static SVG) around the animated canvas globe. */
export function HeroGlobe() {
  return (
    <div className="globe" aria-hidden="true">
      <div className="globe__glow" />
      <svg className="globe__orbits" viewBox="0 0 500 500" fill="none">
        <defs>
          <linearGradient id="orbit-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8fb8e8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8fb8e8" stopOpacity="0.7" />
            <stop offset="1" stopColor="#4a74b8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orbit-b" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#4a74b8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#4a74b8" stopOpacity="0.6" />
            <stop offset="1" stopColor="#5b8fd6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {stars.map((s, i) => (
          <circle
            key={i}
            className="twinkle"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#a9c6ee"
            style={{ animationDelay: s.d }}
          />
        ))}
        <g className="globe__orbit globe__orbit--1">
          <ellipse cx="250" cy="250" rx="235" ry="82" stroke="url(#orbit-a)" strokeWidth="1.2" />
          <circle cx="485" cy="250" r="3.5" fill="#8fb8e8" />
        </g>
        <g className="globe__orbit globe__orbit--2">
          <ellipse cx="250" cy="250" rx="225" ry="120" stroke="url(#orbit-b)" strokeWidth="1" />
          <circle cx="25" cy="250" r="3" fill="#9db9e3" />
        </g>
      </svg>
      <Globe />
      {chips.map(({ label, icon: Icon, pos }, i) => (
        <span
          key={label}
          className="globe__chip float"
          style={{ ...pos, animationDelay: `${-i * 1.7}s` } as CSSProperties}
        >
          <Icon size={14} />
          {label}
        </span>
      ))}
    </div>
  );
}

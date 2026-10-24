import { useId } from 'react';
import type { TechId } from '../../data/technologies';

/**
 * Simplified technology marks, used only to identify the tools described.
 * Trademarks belong to their respective owners; check each brand's guidelines before
 * using them in other contexts.
 */
export function TechLogo({ id, className }: { id: TechId; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  switch (id) {
    case 'react':
      return (
        <svg className={className} viewBox="-12 -11 24 22" aria-hidden="true">
          <circle r="2.05" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'node':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 3 42 13.5v21L24 45 6 34.5v-21z" fill="none" stroke="#6cc24a" strokeWidth="2.6" strokeLinejoin="round" />
          <text x="24" y="30" textAnchor="middle" fontFamily="Space Grotesk Variable, Space Grotesk, sans-serif" fontWeight="700" fontSize="15" fill="#6cc24a">
            JS
          </text>
        </svg>
      );
    case 'firebase':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <defs>
            <linearGradient id={`fb-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffca28" />
              <stop offset="1" stopColor="#ff8f00" />
            </linearGradient>
          </defs>
          <path d="M10 37 15.5 4.5c.2-1 1.5-1.2 2-.3L23 14.5z" fill="#ffa000" />
          <path d="M10 37 29 15l-4.4-8.4c-.4-.8-1.6-.8-2 0z" fill="#f57c00" />
          <path d="M10 37 33.5 10.6c.6-.6 1.6-.3 1.7.5L39 37l-13.4 7.6c-1 .5-2.2.5-3.2 0z" fill={`url(#fb-${uid})`} />
        </svg>
      );
    case 'cloudinary':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M13 34h-1.5a8.5 8.5 0 0 1-1.3-16.9 12 12 0 0 1 23.3-2.6A9.5 9.5 0 0 1 37.5 34H35"
            fill="none"
            stroke="#5b8cff"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <g stroke="#5b8cff" strokeWidth="2.6" strokeLinecap="round">
            <path d="M18 26v14M24 23v17M30 26v14" />
          </g>
        </svg>
      );
  }
}

import { useId } from 'react';
import type { TechId } from '../../data/technologies';

/**
 * Authentic vector technology marks for identifying tools across the platform.
 * Clean, lightweight, scalable SVGs matching official brand marks and palettes.
 */
export function TechLogo({ id, className = '' }: { id: TechId; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  switch (id) {
    // ─── 1. Web Development ─────────────────────────────────────────────
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

    case 'nextjs':
      return (
        <svg className={className} viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="90" fill="#000000" />
          <path
            d="M149.5 147.5L70.5 45H52.5v90h16.2V65.8l70.2 90.7c3.6-2.7 7.1-5.7 10.6-9z"
            fill="url(#next-grad)"
          />
          <path d="M112.5 45h16.2v49.5l-16.2-21z" fill="#ffffff" />
          <defs>
            <linearGradient id="next-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'typescript':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#3178c6" />
          <path d="M15 18h12v4.2h-3.9v14.4h-4.2V22.2H15V18zm14.4 12.3c1.5 1.5 3.3 2.4 5.4 2.4 2.1 0 3.3-.9 3.3-2.4 0-3.3-8.7-2.7-8.7-8.1 0-3 2.4-5.1 6.3-5.1 2.1 0 3.9.6 5.4 1.8l-1.5 3.3c-1.2-.9-2.7-1.5-3.9-1.5-1.8 0-2.7.9-2.7 2.1 0 3 8.7 2.4 8.7 8.1 0 3.3-2.4 5.4-6.9 5.4-2.7 0-4.8-.9-6.6-2.4l1.2-3.6z" fill="#ffffff" />
        </svg>
      );

    case 'javascript':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#f7df1e" />
          <path d="M16.5 34.5c.9.6 2.1 1.2 3.6 1.2 2.1 0 3.3-1.2 3.3-3.6v-9.6h-3.9v9.6c0 1.2-.3 1.8-1.2 1.8-.6 0-1.2-.3-1.8-.6v1.2zm12.3-1.2c1.2 1.2 2.7 1.8 4.5 1.8 1.8 0 3-.9 3-2.1 0-3-7.2-2.4-7.2-7.2 0-2.7 2.1-4.5 5.7-4.5 1.8 0 3.3.6 4.5 1.5l-1.5 2.7c-.9-.6-2.1-1.2-3-1.2-1.5 0-2.4.6-2.4 1.8 0 2.7 7.2 2.1 7.2 7.2 0 3-2.4 4.8-6 4.8-2.4 0-4.2-.9-5.4-2.1l1.6-2.7z" fill="#000000" />
        </svg>
      );

    case 'html5':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 4l3.6 40L24 48l12.4-4L40 4H8z" fill="#e34f26" />
          <path d="M24 7.5v36.8l9.4-3 2.8-33.8H24z" fill="#ef652a" />
          <path d="M24 16.5h7.2l-.5 6H24v5.3h6.2l-.6 7-5.6 1.6V42l10.3-2.9 1.4-16.1.1-1.5H24v-5z" fill="#ffffff" />
          <path d="M24 16.5H16.8l.5 6H24v-6zm0 11.3h-3.6l-.3-3.8h-4.9l.6 7.6 8.2 2.3v-6.1z" fill="#ebebeb" />
        </svg>
      );

    case 'css3':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 4l3.6 40L24 48l12.4-4L40 4H8z" fill="#1572b6" />
          <path d="M24 7.5v36.8l9.4-3 2.8-33.8H24z" fill="#33a9dc" />
          <path d="M24 16.5h7.2l-.5 6H24v5.3h6.2l-.6 7-5.6 1.6V42l10.3-2.9 1.4-16.1.1-1.5H24v-5z" fill="#ffffff" />
          <path d="M24 16.5H16.8l.5 6H24v-6zm0 11.3h-3.6l-.3-3.8h-4.9l.6 7.6 8.2 2.3v-6.1z" fill="#ebebeb" />
        </svg>
      );

    case 'vue':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 38.4L2.4 4.8h8.4L24 23.4 37.2 4.8h8.4L24 38.4z" fill="#41b883" />
          <path d="M24 38.4L10.8 15.6h6.6L24 26.4l6.6-10.8h6.6L24 38.4z" fill="#35495e" />
        </svg>
      );

    case 'angular':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 3L4.8 9.6l2.9 25.2L24 45l16.3-10.2 2.9-25.2L24 3z" fill="#dd0031" />
          <path d="M24 3v42l16.3-10.2 2.9-25.2L24 3z" fill="#c3002f" />
          <path d="M24 9.6L14.4 31.2h4.5l1.9-4.8h6.4l1.9 4.8h4.5L24 9.6zm2.4 12.6h-4.8l2.4-6 2.4 6z" fill="#ffffff" />
        </svg>
      );

    case 'tailwind':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 21.6c1.6-4.8 5.6-7.2 12-7.2 8 0 10.4 4.8 12.8 7.2 2.4 2.4 4.8 4 9.6 4-1.6 4.8-5.6 7.2-12 7.2-8 0-10.4-4.8-12.8-7.2-2.4-2.4-4.8-4-9.6-4zm-9.6 9.6c1.6-4.8 5.6-7.2 12-7.2 8 0 10.4 4.8 12.8 7.2 2.4 2.4 4.8 4 9.6 4-1.6 4.8-5.6 7.2-12 7.2-8 0-10.4-4.8-12.8-7.2-2.4-2.4-4.8-4-9.6-4z" fill="#38bdf8" />
        </svg>
      );

    case 'bootstrap':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#7952b3" />
          <path d="M18 12h8.4c3.6 0 6 1.8 6 4.8 0 2.1-1.2 3.6-3 4.2 2.4.6 3.9 2.4 3.9 4.8 0 3.3-2.7 5.4-6.6 5.4H18V12zm4.5 7.8h3.6c1.5 0 2.4-.6 2.4-1.8s-.9-1.8-2.4-1.8h-3.6v3.6zm0 7.2h3.9c1.8 0 2.7-.9 2.7-2.1 0-1.5-.9-2.1-2.7-2.1h-3.9v4.2z" fill="#ffffff" />
        </svg>
      );

    // ─── 2. App Development (Mobile) ────────────────────────────────────
    case 'flutter':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28.8 4.8L12 21.6l5.2 5.2L39.2 4.8H28.8z" fill="#02569b" />
          <path d="M28.8 25.2L16.8 37.2l5.2 5.2L39.2 25.2H28.8z" fill="#0175c2" />
          <path d="M22 32l6.8-6.8h10.4L28.8 35.6 22 32z" fill="#54c5f8" />
          <path d="M28.8 35.6l5.2 5.2L39.2 35.6h-10.4z" fill="#29b6f6" />
        </svg>
      );

    case 'react-native':
      return (
        <svg className={className} viewBox="-12 -11 24 22" aria-hidden="true">
          <circle r="2.2" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1.1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case 'kotlin':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <defs>
            <linearGradient id={`kt-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7f52ff" />
              <stop offset="50%" stopColor="#c711e1" />
              <stop offset="100%" stopColor="#e44857" />
            </linearGradient>
          </defs>
          <path d="M48 48H0V0h48L24 24l24 24z" fill={`url(#kt-${uid})`} />
        </svg>
      );

    case 'swift':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M43.2 26.4c-.6 1.8-1.8 3.6-3 5.4 3-3.6 4.8-8.4 4.8-13.8 0-1.8-.3-3.6-.6-5.4-3.6 6-9 10.2-15.6 11.4 6-4.8 9.6-12 9.6-20.4 0-1.2-.1-2.4-.4-3.6-6 4.8-13.2 7.2-21 7.2-1.8 0-3.6-.1-5.4-.4 10.2 4.2 18 12.6 21 23.4-6.6-4.2-14.4-6-22.2-4.8 7.2 4.8 15.6 7.2 24.6 6.6-8.4 5.4-18.6 7.2-28.8 4.8 11.4 7.2 25.2 7.8 37.2 1.8 2.4-1.2 4.8-2.7 7.2-4.5-2.4.6-4.8 1.2-7.4 1.3z" fill="#fa7343" />
        </svg>
      );

    case 'android-studio':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 18a12 12 0 0 1 24 0v3H12v-3z" fill="#3ddc84" />
          <circle cx="18" cy="15" r="1.5" fill="#ffffff" />
          <circle cx="30" cy="15" r="1.5" fill="#ffffff" />
          <path d="M15 7l-2.4-3.6M33 7l2.4-3.6" stroke="#3ddc84" strokeWidth="2" strokeLinecap="round" />
          <rect x="12" y="23" width="24" height="15" rx="3" fill="#3ddc84" />
          <path d="M8 24v10a2 2 0 0 0 4 0V24a2 2 0 0 0-4 0zM36 24v10a2 2 0 0 0 4 0V24a2 2 0 0 0-4 0z" fill="#3ddc84" />
        </svg>
      );

    case 'expo':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#000020" />
          <path d="M14.4 33.6L24 16.8l9.6 16.8h-4.8l-4.8-8.4-4.8 8.4h-4.8z" fill="#ffffff" />
        </svg>
      );

    // ─── 3. Software Development ────────────────────────────────────────
    case 'python':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M23.6 3.6c-9.6 0-9 4.2-9 4.2v4.4h9.2v1.3H11s-5.8.6-5.8 8.7 5.1 8.4 5.1 8.4h3v-4.2s-.2-5.1 5-5.1h8.7s4.8.1 4.8-4.7V8.3s.7-4.7-10.2-4.7zm-2.7 2.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" fill="#3776ab" />
          <path d="M24.4 44.4c9.6 0 9-4.2 9-4.2v-4.4h-9.2v-1.3h12.8s5.8-.6 5.8-8.7-5.1-8.4-5.1-8.4h-3v4.2s.2 5.1-5 5.1h-8.7s-4.8-.1-4.8 4.7v8.3s-.7 4.7 10.2 4.7zm2.7-2.6a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z" fill="#ffd438" />
        </svg>
      );

    case 'java':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M21.6 8.4s-3.6 3.6 1.2 8.4c4.8 4.8 2.4 7.2 2.4 7.2s6-3.6 1.2-8.4c-4.8-4.8-4.8-7.2-4.8-7.2zm6 2.4s-4.8 3.6 0 7.2 3.6 6 3.6 6 4.8-3.6 0-7.2c-4.8-3.6-3.6-6-3.6-6z" fill="#ea2d2e" />
          <path d="M14.4 31.2c7.2 1.8 19.2 1.8 24 0 0 0-3.6 4.8-12 4.8s-12-4.8-12-4.8zm-2.4 7.2c9.6 2.4 24 2.4 31.2 0 0 0-4.8 4.8-15.6 4.8s-15.6-4.8-15.6-4.8z" fill="#5382a1" />
          <path d="M12 25.2c9.6 2.4 24 2.4 31.2 0-3.6 6-12 7.2-15.6 7.2s-12-1.2-15.6-7.2z" fill="#ea2d2e" />
        </svg>
      );

    case 'cpp':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 4.8L40.8 14.4v19.2L24 43.2 7.2 33.6V14.4L24 4.8z" fill="#00599c" />
          <path d="M20.4 20.4a6 6 0 1 0 0 7.2h3.6a9.6 9.6 0 1 1 0-7.2h-3.6zM28.8 21.6v2.4h-2.4v2.4h2.4v2.4h2.4v-2.4h2.4V24h-2.4v-2.4h-2.4zm8.4 0v2.4h-2.4v2.4h2.4v2.4h2.4v-2.4h2.4V24h-2.4v-2.4h-2.4z" fill="#ffffff" />
        </svg>
      );

    case 'csharp':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 4.8L40.8 14.4v19.2L24 43.2 7.2 33.6V14.4L24 4.8z" fill="#239120" />
          <path d="M20.4 20.4a6 6 0 1 0 0 7.2h3.6a9.6 9.6 0 1 1 0-7.2h-3.6zM31.2 21.6h2.4v2.4h-2.4v4.8h2.4v2.4h-2.4v2.4h-2.4v-2.4h-2.4v2.4h-2.4v-2.4h-2.4v-2.4h2.4v-4.8h-2.4v-2.4h2.4v-2.4h2.4v2.4h2.4v-2.4h2.4v2.4zm-4.8 4.8v4.8h2.4v-4.8h-2.4z" fill="#ffffff" />
        </svg>
      );

    case 'dotnet':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#512bd4" />
          <circle cx="12" cy="31" r="3" fill="#ffffff" />
          <path d="M19.2 16.8h6c4.8 0 8.4 3.6 8.4 8.4s-3.6 8.4-8.4 8.4h-6V16.8zm4.8 12.6h1.2c2.4 0 4.2-1.8 4.2-4.2s-1.8-4.2-4.2-4.2H24v8.4z" fill="#ffffff" />
        </svg>
      );

    case 'electron':
      return (
        <svg className={className} viewBox="-12 -11 24 22" aria-hidden="true">
          <circle r="2.2" fill="#47848f" />
          <g stroke="#47848f" strokeWidth="1.2" fill="none">
            <ellipse rx="11" ry="4.2" transform="rotate(30)" />
            <ellipse rx="11" ry="4.2" transform="rotate(90)" />
            <ellipse rx="11" ry="4.2" transform="rotate(150)" />
          </g>
        </svg>
      );

    case 'qt':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#41cd52" />
          <path d="M22.8 15.6c-4.8 0-8.4 3.6-8.4 8.4s3.6 8.4 8.4 8.4c2.1 0 4.2-.9 5.4-2.1l3.6 3.6 2.4-2.4-3.3-3.3c1.5-1.5 2.1-3 2.1-4.2 0-4.8-3.6-8.4-8.4-8.4zm0 12.6c-2.4 0-4.2-1.8-4.2-4.2s1.8-4.2 4.2-4.2 4.2 1.8 4.2 4.2-1.8 4.2-4.2 4.2zm12-9.6h-4.8v3.6h2.4v6c0 1.2.6 1.8 1.8 1.8h.6v-2.4h-.6c-.3 0-.6-.3-.6-.6v-4.8h2.4v-3.6h-3.2z" fill="#ffffff" />
        </svg>
      );

    // ─── 4. Robotics ────────────────────────────────────────────────────
    case 'ros':
    case 'ros2':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="14" cy="14" r="4.5" fill="#22314e" />
          <circle cx="24" cy="14" r="4.5" fill="#22314e" />
          <circle cx="34" cy="14" r="4.5" fill="#22314e" />
          <circle cx="14" cy="24" r="4.5" fill="#22314e" />
          <circle cx="24" cy="24" r="4.5" fill="#22314e" />
          <circle cx="34" cy="24" r="4.5" fill="#22314e" />
          <circle cx="14" cy="34" r="4.5" fill="#22314e" />
          <circle cx="24" cy="34" r="4.5" fill="#22314e" />
          <circle cx="34" cy="34" r="4.5" fill="#22314e" />
        </svg>
      );

    case 'arduino':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M16 14.4c-5.4 0-9.6 4.2-9.6 9.6s4.2 9.6 9.6 9.6c4.8 0 8.4-3.6 10.8-7.2-2.4-3.6-6-7.2-10.8-7.2zm16 0c-4.8 0-8.4 3.6-10.8 7.2 2.4 3.6 6 7.2 10.8 7.2 5.4 0 9.6-4.2 9.6-9.6s-4.2-9.6-9.6-9.6zM13.2 25.2H9.6v-2.4h3.6V25.2zm18 0h-2.4v2.4h-2.4v-2.4h-2.4v-2.4h2.4v-2.4h2.4v2.4h2.4v2.4z" fill="#00979d" />
        </svg>
      );

    case 'raspberry-pi':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 16.8c-2.4-2.4-6-2.4-8.4 0-1.2 1.2-1.8 3-1.8 4.8 3 0 6.6-1.8 10.2-4.8zm0 0c2.4-2.4 6-2.4 8.4 0 1.2 1.2 1.8 3 1.8 4.8-3 0-6.6-1.8-10.2-4.8z" fill="#75a928" />
          <circle cx="20" cy="24" r="3.5" fill="#c51a4a" />
          <circle cx="28" cy="24" r="3.5" fill="#c51a4a" />
          <circle cx="16" cy="30" r="3.5" fill="#c51a4a" />
          <circle cx="24" cy="30" r="3.5" fill="#c51a4a" />
          <circle cx="32" cy="30" r="3.5" fill="#c51a4a" />
          <circle cx="20" cy="36" r="3.5" fill="#c51a4a" />
          <circle cx="28" cy="36" r="3.5" fill="#c51a4a" />
        </svg>
      );

    case 'nvidia-jetson':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#76b900" />
          <path d="M12 24c0-6.6 5.4-12 12-12s12 5.4 12 12-5.4 12-12 12-12-5.4-12-12zm7.2 0c0 2.7 2.1 4.8 4.8 4.8s4.8-2.1 4.8-4.8-2.1-4.8-4.8-4.8-4.8 2.1-4.8 4.8z" fill="#ffffff" />
        </svg>
      );

    case 'matlab':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M7.2 38.4l12-21.6 7.2 10.8 14.4-18-9.6 28.8H7.2z" fill="#d9531e" />
          <path d="M19.2 16.8L31.2 9.6l-2.4 18-9.6-10.8z" fill="#005f9e" opacity="0.85" />
        </svg>
      );

    // ─── 5. Artificial Intelligence ─────────────────────────────────────
    case 'tensorflow':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 3.6L9.6 12v12l7.2-4.2V16.2l7.2-4.2 7.2 4.2v3.6l7.2 4.2V12L24 3.6z" fill="#e535ab" />
          <path d="M24 16.8l-7.2 4.2v19.2l7.2 4.2V16.8z" fill="#ff6f00" />
          <path d="M24 16.8l7.2 4.2v19.2l-7.2 4.2V16.8z" fill="#ffa800" />
        </svg>
      );

    case 'pytorch':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M31.2 9.6c-4.8-4.8-12-4.8-16.8 0-4.8 4.8-4.8 12 0 16.8l9.6 9.6 9.6-9.6c4.8-4.8 4.8-12 0-16.8zm-7.2 14.4l-3.6-3.6c-2.4-2.4-2.4-6 0-8.4s6-2.4 8.4 0l-4.8 12z" fill="#ee4c2c" />
          <circle cx="33.6" cy="12" r="3" fill="#ee4c2c" />
        </svg>
      );

    case 'keras':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#d00000" />
          <path d="M14.4 12h5.4v9.6l7.2-9.6h6.6L24 23.4l10.2 12.6h-7.2l-7.2-9.6v9.6h-5.4V12z" fill="#ffffff" />
        </svg>
      );

    case 'opencv':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="14.4" r="7.2" fill="none" stroke="#ea212d" strokeWidth="3.6" strokeDasharray="34 11" />
          <circle cx="15.6" cy="30" r="7.2" fill="none" stroke="#5c3ee8" strokeWidth="3.6" strokeDasharray="34 11" />
          <circle cx="32.4" cy="30" r="7.2" fill="none" stroke="#00ab4e" strokeWidth="3.6" strokeDasharray="34 11" />
        </svg>
      );

    case 'scikit-learn':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="19.2" cy="24" r="10.8" fill="#f7931e" />
          <circle cx="28.8" cy="24" r="10.8" fill="#3499cd" opacity="0.85" />
          <path d="M16.8 19.2l14.4 9.6" stroke="#ffffff" strokeWidth="2.4" />
        </svg>
      );

    case 'huggingface':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#ffd21e" />
          <circle cx="16.8" cy="19.2" r="2.4" fill="#000000" />
          <circle cx="31.2" cy="19.2" r="2.4" fill="#000000" />
          <path d="M16.8 28.8c2.4 3.6 12 3.6 14.4 0" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'langchain':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#00a67e" />
          <path d="M14.4 24a9.6 9.6 0 0 1 19.2 0M24 14.4V24m-6 4.8l6 6 6-6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    // ─── 6. IoT Development ─────────────────────────────────────────────
    case 'mqtt':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#660066" />
          <path d="M14.4 33.6V14.4l9.6 9.6 9.6-9.6v19.2" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'node-red':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#8f0000" />
          <circle cx="16.8" cy="24" r="3.6" fill="#ffffff" />
          <circle cx="31.2" cy="16.8" r="3.6" fill="#ffffff" />
          <circle cx="31.2" cy="31.2" r="3.6" fill="#ffffff" />
          <path d="M16.8 24h14.4m-14.4 0l14.4-7.2m-14.4 7.2l14.4 7.2" stroke="#ffffff" strokeWidth="2" />
        </svg>
      );

    case 'esp32':
    case 'esp8266':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#e7352f" />
          <text x="24" y="29" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="13" fill="#ffffff">
            ESP
          </text>
        </svg>
      );

    case 'aws-iot':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#ff9900" />
          <path d="M14.4 24l9.6-9.6 9.6 9.6-9.6 9.6z" fill="#232f3e" />
          <circle cx="24" cy="24" r="3.6" fill="#ffffff" />
        </svg>
      );

    // ─── 7. Social Media Marketing ──────────────────────────────────────
    case 'meta-business':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12.6 14.4C7.8 14.4 4.8 18 4.8 24s3 9.6 7.8 9.6c4.2 0 7.2-3.6 11.4-9.6-4.2-6-7.2-9.6-11.4-9.6zm22.8 0c-4.2 0-7.2 3.6-11.4 9.6 4.2 6 7.2 9.6 11.4 9.6 4.8 0 7.8-3.6 7.8-9.6s-3-9.6-7.8-9.6z" fill="#0668e1" />
        </svg>
      );

    case 'google-ads':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <ellipse cx="16.8" cy="24" rx="4.8" ry="12" transform="rotate(-30 16.8 24)" fill="#4285f4" />
          <ellipse cx="31.2" cy="24" rx="4.8" ry="12" transform="rotate(30 31.2 24)" fill="#fbbc05" />
          <circle cx="34.8" cy="33.6" r="4.8" fill="#34a853" />
        </svg>
      );

    case 'tiktok-ads':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#000000" />
          <path d="M28.8 12c1.2 3.6 3.6 6 7.2 6.6v4.8c-2.4 0-4.8-.6-6.6-1.8v10.2c0 5.4-4.2 9.6-9.6 9.6s-9.6-4.2-9.6-9.6 4.2-9.6 9.6-9.6c.6 0 1.2 0 1.8.2v5c-.6-.2-1.2-.4-1.8-.4-2.6 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8V12h4.2z" fill="#25f4ee" />
          <path d="M30 13.2c1.2 3.6 3.6 6 7.2 6.6v3.6c-2.4 0-4.8-.6-6.6-1.8v10.2c0 5.4-4.2 9.6-9.6 9.6s-9.6-4.2-9.6-9.6 4.2-9.6 9.6-9.6c.6 0 1.2 0 1.8.2v3.8c-.6-.2-1.2-.4-1.8-.4-2.6 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8V13.2h4.2z" fill="#fe2c55" opacity="0.8" />
        </svg>
      );

    case 'buffer':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 7.2l14.4 7.2-14.4 7.2-14.4-7.2L24 7.2zm0 10.8l14.4 7.2-14.4 7.2-14.4-7.2 14.4-7.2zm0 10.8l14.4 7.2-14.4 7.2-14.4-7.2 14.4-7.2z" fill="#231f20" />
        </svg>
      );

    case 'hootsuite':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="19.2" fill="#111111" />
          <circle cx="18" cy="20.4" r="4.8" fill="#ffffff" />
          <circle cx="30" cy="20.4" r="4.8" fill="#ffffff" />
          <circle cx="18" cy="20.4" r="2.4" fill="#111111" />
          <circle cx="30" cy="20.4" r="2.4" fill="#111111" />
          <path d="M24 24l-3 4.8h6L24 24z" fill="#ffffff" />
        </svg>
      );

    case 'canva':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#00c4cc" />
          <text x="24" y="32" textAnchor="middle" fontFamily="sans-serif" fontStyle="italic" fontWeight="900" fontSize="24" fill="#ffffff">
            C
          </text>
        </svg>
      );

    // ─── 8. Graphic Design ───────────────────────────────────────────────
    case 'photoshop':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#001e36" />
          <text x="24" y="31" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="19" fill="#31a8ff">
            Ps
          </text>
        </svg>
      );

    case 'illustrator':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#330000" />
          <text x="24" y="31" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="19" fill="#ff9a00">
            Ai
          </text>
        </svg>
      );

    case 'figma':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M16.8 6h7.2v12h-7.2a6 6 0 0 1 0-12z" fill="#f24e1e" />
          <path d="M24 6h7.2a6 6 0 0 1 0 12H24V6z" fill="#ff7262" />
          <path d="M16.8 18h7.2v12h-7.2a6 6 0 0 1 0-12z" fill="#a259ff" />
          <circle cx="30" cy="24" r="6" fill="#1abcfe" />
          <path d="M16.8 30h7.2v6a6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 4.8-6z" fill="#0acf83" />
        </svg>
      );

    case 'indesign':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#49021f" />
          <text x="24" y="31" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="19" fill="#ff3366">
            Id
          </text>
        </svg>
      );

    case 'coreldraw':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="19.2" fill="#008752" />
          <circle cx="24" cy="21.6" r="8.4" fill="#ffffff" />
          <path d="M20.4 33.6l3.6 7.2 3.6-7.2z" fill="#ffffff" />
        </svg>
      );

    // ─── 9. Video Editing ────────────────────────────────────────────────
    case 'premiere':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#00005b" />
          <text x="24" y="31" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="19" fill="#9999ff">
            Pr
          </text>
        </svg>
      );

    case 'after-effects':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#00005b" />
          <text x="24" y="31" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="19" fill="#d291ff">
            Ae
          </text>
        </svg>
      );

    case 'davinci-resolve':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="19.2" fill="#1a1a1a" />
          <path d="M24 12l8.4 14.4h-16.8L24 12z" fill="#ec1a24" />
          <path d="M14.4 28.8l14.4-8.4v16.8l-14.4-8.4z" fill="#f7941d" opacity="0.8" />
        </svg>
      );

    case 'capcut':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#000000" />
          <path d="M12 18l12 6-12 6V18zm24 0l-12 6 12 6V18z" fill="#ffffff" />
        </svg>
      );

    case 'final-cut-pro':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#1c1c1e" />
          <path d="M12 14.4h24v19.2H12V14.4z" fill="#5ac8fa" />
          <path d="M12 14.4l7.2 7.2m4.8-7.2l7.2 7.2m4.8-7.2l-7.2 7.2" stroke="#ffffff" strokeWidth="2.4" />
        </svg>
      );

    // ─── 10. E-Commerce ──────────────────────────────────────────────────
    case 'shopify':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M34.8 12L31.2 8.4 25.2 6l-1.2 2.4-3.6 1.2-8.4 3.6 4.8 28.8L37.2 38l4.8-24-7.2-2z" fill="#95bf47" />
          <path d="M28.8 19.2c-1.2 0-2.4.6-3 1.8l-1.8 3.6c-.6 1.2-.6 2.4 0 3.6l1.8 3.6c.6 1.2 1.8 1.8 3 1.8 2.4 0 4.2-1.8 4.2-4.2s-1.8-10.2-4.2-10.2z" fill="#ffffff" />
        </svg>
      );

    case 'woocommerce':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#96588a" />
          <path d="M13.2 20.4l3.6 10.8 3.6-7.2 3.6 7.2 3.6-10.8h3.6l-5.4 14.4-3.6-7.2-3.6 7.2-5.4-14.4h3.6z" fill="#ffffff" />
        </svg>
      );

    case 'magento':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 3.6l16.8 9.6v19.2L36 35.4v-18L24 10.8 12 17.4v18L7.2 32.4V13.2L24 3.6z" fill="#ee672f" />
          <path d="M24 22.8l7.2 4.2v14.4L24 45.6l-7.2-4.2V27l7.2-4.2z" fill="#ee672f" />
        </svg>
      );

    case 'wordpress':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="19.2" fill="#21759b" />
          <circle cx="24" cy="24" r="16.8" fill="none" stroke="#ffffff" strokeWidth="2.4" />
          <path d="M14.4 20.4l7.2 18 2.4-7.2-3.6-10.8h-6zm19.2 0l-7.2 18-2.4-7.2 3.6-10.8h6z" fill="#ffffff" />
        </svg>
      );

    // ─── 11. Database & Backend ──────────────────────────────────────────
    case 'node':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 3 42 13.5v21L24 45 6 34.5v-21z" fill="none" stroke="#6cc24a" strokeWidth="2.6" strokeLinejoin="round" />
          <text x="24" y="30" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="15" fill="#6cc24a">
            JS
          </text>
        </svg>
      );

    case 'express':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#000000" />
          <text x="24" y="30" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="15" fill="#ffffff">
            EX
          </text>
        </svg>
      );

    case 'mongodb':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 3.6c-1.2 4.8-9.6 13.2-9.6 22.8 0 7.2 4.8 14.4 9.6 18 4.8-3.6 9.6-10.8 9.6-18 0-9.6-8.4-18-9.6-22.8z" fill="#47a248" />
          <path d="M24 3.6v40.8c.6-.6 1.8-1.2 2.4-1.8 4.8-3.6 7.2-9.6 7.2-16.2 0-9.6-8.4-18-9.6-22.8z" fill="#499d4a" />
        </svg>
      );

    case 'mysql':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#00758f" />
          <path d="M14.4 31.2c4.8 2.4 14.4 2.4 19.2 0-2.4-4.8-8.4-7.2-14.4-7.2-2.4 0-4.8.6-4.8 7.2z" fill="#f29111" />
          <circle cx="21.6" cy="20.4" r="3" fill="#ffffff" />
        </svg>
      );

    case 'postgresql':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 6c-8.4 0-14.4 6-14.4 14.4 0 6 3.6 10.8 8.4 13.2v8.4h4.8v-6h2.4v6h4.8v-8.4c4.8-2.4 8.4-7.2 8.4-13.2C38.4 12 32.4 6 24 6z" fill="#336791" />
          <circle cx="19.2" cy="18" r="2.4" fill="#ffffff" />
          <circle cx="28.8" cy="18" r="2.4" fill="#ffffff" />
        </svg>
      );

    case 'firebase':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <defs>
            <linearGradient id={`fb-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffca28" />
              <stop offset="100%" stopColor="#ff8f00" />
            </linearGradient>
          </defs>
          <path d="M10 37 15.5 4.5c.2-1 1.5-1.2 2-.3L23 14.5z" fill="#ffa000" />
          <path d="M10 37 29 15l-4.4-8.4c-.4-.8-1.6-.8-2 0z" fill="#f57c00" />
          <path d="M10 37 33.5 10.6c.6-.6 1.6-.3 1.7.5L39 37l-13.4 7.6c-1 .5-2.2.5-3.2 0z" fill={`url(#fb-${uid})`} />
        </svg>
      );

    // ─── 12. Cloud & DevOps ─────────────────────────────────────────────
    case 'aws':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="8" fill="#232f3e" />
          <path d="M12 28.8c7.2 3.6 16.8 3.6 24 0-1.2 2.4-3.6 3.6-7.2 3.6-6 0-12-1.2-16.8-3.6z" fill="#ff9900" />
          <text x="24" y="24" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#ffffff">
            AWS
          </text>
        </svg>
      );

    case 'azure':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8.4 37.2l12-30h8.4L16.8 37.2H8.4zm14.4-18l6-7.2H36l-9.6 25.2h-7.2l3.6-18z" fill="#0078d4" />
        </svg>
      );

    case 'gcp':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 14.4c4.8 0 8.4 3 9.6 7.2H36c4.8 0 8.4 3.6 8.4 8.4s-3.6 8.4-8.4 8.4H14.4C9.6 38.4 6 34.8 6 30c0-4.2 3-7.8 7.2-8.4 1.2-4.2 6-7.2 10.8-7.2z" fill="#4285f4" />
          <circle cx="24" cy="26.4" r="6" fill="#ffffff" />
        </svg>
      );

    case 'docker':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M38.4 20.4c-.6-3.6-3.6-6-7.2-6-1.2 0-2.4.3-3.6.9V12h-6v6h-6V12h-6v12H6c-1.2 2.4-1.2 6 0 9.6 4.8 8.4 15.6 9.6 24 7.2 7.2-2.4 12-8.4 12-14.4 0-1.8-.6-3-1.8-4z" fill="#2496ed" />
          <rect x="15.6" y="14.4" width="3.6" height="3.6" fill="#ffffff" />
          <rect x="20.4" y="14.4" width="3.6" height="3.6" fill="#ffffff" />
          <rect x="25.2" y="14.4" width="3.6" height="3.6" fill="#ffffff" />
        </svg>
      );

    case 'kubernetes':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="19.2" fill="#326ce5" />
          <path d="M24 12l10.8 6v12L24 36l-10.8-6V18L24 12zm0 6l-5.4 3v6l5.4 3 5.4-3v-6L24 18z" fill="#ffffff" />
        </svg>
      );

    case 'github':
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="19.2" fill="#181717" />
          <path d="M24 10.8c-7.2 0-13.2 6-13.2 13.2 0 6 3.6 10.8 9 12.6.6.1.9-.3.9-.6v-2.4c-3.6.9-4.5-1.8-4.5-1.8-.6-1.5-1.5-1.8-1.5-1.8-1.2-.9.1-.9.1-.9 1.5.1 2.1 1.5 2.1 1.5 1.2 2.1 3.3 1.5 3.9 1.2.1-.9.6-1.5 1-1.8-3-.3-6-1.5-6-6.6 0-1.5.6-2.7 1.5-3.6-.1-.3-.6-1.8.1-3.6 0 0 1.2-.3 3.6 1.5 1.2-.3 2.4-.6 3.6-.6s2.4.3 3.6.6c2.4-1.8 3.6-1.5 3.6-1.5.7 1.8.2 3.3.1 3.6.9.9 1.5 2.1 1.5 3.6 0 5.1-3 6.3-6 6.6.6.6.9 1.5.9 2.7v3.9c0 .3.3.7.9.6 5.4-1.8 9-6.6 9-12.6 0-7.2-6-13.2-13.2-13.2z" fill="#ffffff" />
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

    // ─── Default Generic Technology Fallback ─────────────────────────────
    default: {
      const label = id ? id.slice(0, 2).toUpperCase() : 'TG';
      return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#0b1736" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="15" fill="rgba(37, 99, 235, 0.15)" />
          <text
            x="24"
            y="29"
            textAnchor="middle"
            fontFamily="Space Grotesk, sans-serif"
            fontWeight="700"
            fontSize="14"
            fill="#60a5fa"
            letterSpacing="0.05em"
          >
            {label}
          </text>
        </svg>
      );
    }
  }
}

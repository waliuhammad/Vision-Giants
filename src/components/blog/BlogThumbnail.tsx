import type { BlogCategory } from '../../data/blog';

interface BlogThumbnailProps {
  category: Exclude<BlogCategory, 'All Articles'>;
  title: string;
  imageUrl?: string;
  className?: string;
}

export function BlogThumbnail({ category, title, imageUrl, className = '' }: BlogThumbnailProps) {
  if (imageUrl) {
    return (
      <div className={`blog-thumbnail ${className}`.trim()}>
        <img src={imageUrl} alt={title} className="blog-thumbnail__image" loading="lazy" />
      </div>
    );
  }

  // Artistic SVG geometric visuals for each category using the project's exact brand colors
  return (
    <div className={`blog-thumbnail blog-thumbnail--${getCategoryClass(category)} ${className}`.trim()}>
      <div className="blog-thumbnail__glow" aria-hidden="true" />
      <svg
        className="blog-thumbnail__svg"
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="400" height="240" fill="url(#bg-grad)" />

        {/* Ambient Grid */}
        <g opacity="0.12" stroke="#6f86b8" strokeWidth="1">
          <line x1="0" y1="40" x2="400" y2="40" />
          <line x1="0" y1="80" x2="400" y2="80" />
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="160" x2="400" y2="160" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="80" y1="0" x2="80" y2="240" />
          <line x1="160" y1="0" x2="160" y2="240" />
          <line x1="240" y1="0" x2="240" y2="240" />
          <line x1="320" y1="0" x2="320" y2="240" />
        </g>

        {category === 'Web Development' && (
          <g transform="translate(110, 35)">
            {/* Window Container */}
            <rect x="0" y="0" width="180" height="150" rx="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M0 24 H180" stroke="#6f86b8" strokeWidth="1" strokeOpacity="0.25" />
            <circle cx="14" cy="12" r="3.5" fill="#f87171" opacity="0.8" />
            <circle cx="28" cy="12" r="3.5" fill="#fbbf24" opacity="0.8" />
            <circle cx="42" cy="12" r="3.5" fill="#16a34a" opacity="0.8" />
            {/* Code lines */}
            <rect x="18" y="42" width="70" height="8" rx="4" fill="#6f86b8" opacity="0.75" />
            <rect x="18" y="60" width="110" height="8" rx="4" fill="#2c4377" opacity="0.6" />
            <rect x="36" y="78" width="85" height="8" rx="4" fill="#2c4377" opacity="0.5" />
            <rect x="36" y="96" width="60" height="8" rx="4" fill="#6f86b8" opacity="0.4" />
            <rect x="18" y="114" width="40" height="8" rx="4" fill="#2c4377" opacity="0.75" />
            {/* Accent badge */}
            <circle cx="150" cy="120" r="16" fill="#2c4377" fillOpacity="0.3" stroke="#6f86b8" strokeWidth="1.5" />
            <path d="M144 120 L148 124 L157 115" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {category === 'AI & Technology' && (
          <g transform="translate(120, 35)">
            {/* Circuit Nodes */}
            <circle cx="80" cy="75" r="32" fill="#ffffff" stroke="#6f86b8" strokeWidth="2" />
            <circle cx="80" cy="75" r="18" fill="#2c4377" fillOpacity="0.4" />
            <circle cx="80" cy="75" r="8" fill="#2c4377" />
            {/* Satellites */}
            <circle cx="20" cy="30" r="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" />
            <circle cx="140" cy="30" r="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" />
            <circle cx="20" cy="120" r="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" />
            <circle cx="140" cy="120" r="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" />
            {/* Connectors */}
            <path d="M28 35 L58 60" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
            <path d="M132 35 L102 60" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
            <path d="M28 115 L58 90" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
            <path d="M132 115 L102 90" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
          </g>
        )}

        {category === 'Mobile App Development' && (
          <g transform="translate(145, 25)">
            {/* Phone Mockup */}
            <rect x="0" y="0" width="110" height="180" rx="18" fill="#ffffff" stroke="#6f86b8" strokeWidth="2" strokeOpacity="0.5" />
            {/* Speaker bar */}
            <rect x="38" y="10" width="34" height="4" rx="2" fill="#6f86b8" opacity="0.6" />
            {/* Screen content */}
            <rect x="12" y="26" width="86" height="45" rx="8" fill="#2c4377" fillOpacity="0.35" stroke="#6f86b8" strokeWidth="1" strokeOpacity="0.3" />
            <rect x="12" y="80" width="86" height="24" rx="6" fill="#ffffff" />
            <rect x="12" y="112" width="86" height="24" rx="6" fill="#ffffff" />
            <circle cx="55" cy="158" r="8" fill="#2c4377" fillOpacity="0.4" />
          </g>
        )}

        {category === 'UI/UX Design' && (
          <g transform="translate(110, 35)">
            {/* Canvas / Layers */}
            <rect x="30" y="30" width="140" height="110" rx="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="10" y="10" width="140" height="110" rx="10" fill="#eff6ff" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Palette circles */}
            <circle cx="36" cy="38" r="10" fill="#2c4377" />
            <circle cx="64" cy="38" r="10" fill="#6f86b8" />
            <circle cx="92" cy="38" r="10" fill="#16a34a" />
            <circle cx="120" cy="38" r="10" fill="#fbbf24" />
            {/* Wireframe shape */}
            <rect x="25" y="62" width="110" height="40" rx="6" fill="#ffffff" stroke="#6f86b8" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M40 82 L65 72 L95 86 L120 74" stroke="#6f86b8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {category === 'Programming Tutorials' && (
          <g transform="translate(110, 35)">
            {/* Terminal Window */}
            <rect x="0" y="0" width="180" height="145" rx="8" fill="#f7f9fc" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M0 24 H180" stroke="#6f86b8" strokeWidth="1" strokeOpacity="0.2" />
            <circle cx="12" cy="12" r="3" fill="#f87171" opacity="0.7" />
            <circle cx="24" cy="12" r="3" fill="#fbbf24" opacity="0.7" />
            <circle cx="36" cy="12" r="3" fill="#16a34a" opacity="0.7" />
            {/* Code Brackets & Prompt */}
            <text x="16" y="52" fill="#16a34a" fontFamily="var(--font-mono, monospace)" fontSize="13" fontWeight="600">&gt;_</text>
            <rect x="38" y="42" width="80" height="11" rx="3" fill="#6f86b8" opacity="0.6" />
            <rect x="16" y="66" width="110" height="9" rx="3" fill="#2c4377" opacity="0.4" />
            <rect x="32" y="84" width="70" height="9" rx="3" fill="#6f86b8" opacity="0.5" />
            <rect x="32" y="102" width="120" height="9" rx="3" fill="#2c4377" opacity="0.4" />
            <rect x="16" y="120" width="50" height="9" rx="3" fill="#16a34a" opacity="0.6" />
          </g>
        )}

        {category === 'Business & Digital Growth' && (
          <g transform="translate(100, 35)">
            {/* Chart Area */}
            <rect x="0" y="0" width="200" height="150" rx="10" fill="#ffffff" stroke="#6f86b8" strokeWidth="1.5" strokeOpacity="0.35" />
            <path d="M25 125 L65 95 L110 108 L155 50 L180 35" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 125 L65 95 L110 108 L155 50 L180 35 V130 H25 Z" fill="url(#growth-area)" opacity="0.3" />
            <circle cx="180" cy="35" r="5" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
            <circle cx="155" cy="50" r="4" fill="#16a34a" />
            <circle cx="110" cy="108" r="4" fill="#16a34a" />
            <circle cx="65" cy="95" r="4" fill="#16a34a" />
          </g>
        )}

        <defs>
          <linearGradient id="bg-grad" x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eef3fb" />
            <stop offset="100%" stopColor="#dde3ef" />
          </linearGradient>
          <linearGradient id="growth-area" x1="0" y1="35" x2="0" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function getCategoryClass(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

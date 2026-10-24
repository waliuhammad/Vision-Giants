import { useId, type ReactNode } from 'react';
import { projectCover, type PreviewKind, type Project } from '../../data/portfolio';

/**
 * Illustrative UI mockups for portfolio cards, drawn as SVG so they stay crisp and tiny.
 * Swap for real screenshots (e.g. via Cloudinary) once actual projects are available.
 */
export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const g = (n: string) => `${n}-${uid}`;
  const body: Record<PreviewKind, ReactNode> = {
    dashboard: <Dashboard g={g} />,
    store: <Store />,
    mobile: <Mobile g={g} />,
    kanban: <Kanban />,
    booking: <Booking />,
    learning: <Learning g={g} />,
  };
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={g('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b3a6b" />
          <stop offset="1" stopColor="#0e2142" />
        </linearGradient>
        <linearGradient id={g('area')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b9bde" stopOpacity="0.55" />
          <stop offset="1" stopColor="#6b9bde" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={g('accent')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b9bde" />
          <stop offset="1" stopColor="#4a74b8" />
        </linearGradient>
        <radialGradient id={g('glow')} cx="0.8" cy="0.1" r="0.8">
          <stop offset="0" stopColor="#4a74b8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4a74b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${g('bg')})`} />
      <rect width="400" height="250" fill={`url(#${g('glow')})`} />
      {body[kind]}
    </svg>
  );
}

type G = { g: (n: string) => string };
const line = '#2a3b66';
const text = '#7f90b0';

function Window({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <g>
      <rect x="28" y="22" width="344" height="216" rx="10" fill={light ? '#eef3fb' : '#132a52'} stroke={light ? '#c9d6ee' : line} />
      <circle cx="44" cy="36" r="3.5" fill="#f87171" />
      <circle cx="56" cy="36" r="3.5" fill="#fbbf24" />
      <circle cx="68" cy="36" r="3.5" fill="#34d399" />
      {children}
    </g>
  );
}

function Dashboard({ g }: G) {
  return (
    <Window>
      <rect x="28" y="48" width="64" height="190" fill="#091331" />
      {[64, 84, 104, 124, 144].map((y, i) => (
        <rect key={y} x="40" y={y} width={i === 0 ? 40 : 34} height="6" rx="3" fill={i === 0 ? '#6b9bde' : text} opacity={i === 0 ? 1 : 0.5} />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={104 + i * 88} y="58" width="78" height="40" rx="6" fill="#0f2150" stroke={line} />
          <rect x={112 + i * 88} y="66" width="30" height="5" rx="2.5" fill={text} />
          <rect x={112 + i * 88} y="78" width={40 + i * 6} height="9" rx="3" fill={i === 1 ? '#8fb8e8' : '#cfe0ff'} />
        </g>
      ))}
      <rect x="104" y="108" width="166" height="118" rx="6" fill="#0f2150" stroke={line} />
      <path d="M112 200 L135 180 L155 188 L178 160 L200 168 L222 140 L246 150 L262 128 L262 218 L112 218Z" fill={`url(#${g('area')})`} />
      <polyline points="112,200 135,180 155,188 178,160 200,168 222,140 246,150 262,128" fill="none" stroke="#6b9bde" strokeWidth="2" />
      <rect x="280" y="108" width="80" height="118" rx="6" fill="#0f2150" stroke={line} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={290 + i * 14} y={210 - [40, 64, 30, 78, 52][i]!} width="8" height={[40, 64, 30, 78, 52][i]} rx="2" fill={i % 2 ? '#4a74b8' : '#6b9bde'} />
      ))}
    </Window>
  );
}

function Store() {
  const colors = ['#1e293b', '#5b8fd6', '#0f172a', '#6366f1'];
  return (
    <Window light>
      <rect x="40" y="50" width="60" height="8" rx="4" fill="#1e293b" />
      <rect x="250" y="48" width="110" height="14" rx="7" fill="#dbe4f3" />
      <rect x="40" y="70" width="320" height="50" rx="8" fill="#5b8fd6" />
      <rect x="54" y="82" width="110" height="9" rx="4" fill="#fff" />
      <rect x="54" y="98" width="70" height="7" rx="3.5" fill="#cfe0ff" />
      <rect x="290" y="88" width="56" height="16" rx="8" fill="#fff" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={40 + i * 82} y="130" width="74" height="96" rx="8" fill="#fff" stroke="#dbe4f3" />
          <rect x={50 + i * 82} y="138" width="54" height="50" rx="6" fill="#f1f5fb" />
          {i % 2 === 0 ? (
            <path d={`M${66 + i * 82} 148 h22 l4 32 h-30z`} fill={colors[i]} />
          ) : (
            <circle cx={77 + i * 82} cy="163" r="15" fill={colors[i]} />
          )}
          <rect x={50 + i * 82} y="196" width="44" height="6" rx="3" fill="#334155" />
          <rect x={50 + i * 82} y="208" width="26" height="6" rx="3" fill="#5b8fd6" />
        </g>
      ))}
    </Window>
  );
}

function Phone({ x, children, tilt = 0 }: { x: number; children: ReactNode; tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} ${x + 45} 125)`}>
      <rect x={x} y="28" width="90" height="194" rx="16" fill="#070d22" stroke="#3a4d80" strokeWidth="2" />
      <rect x={x + 6} y="34" width="78" height="182" rx="11" fill="#0d1b40" />
      <rect x={x + 33} y="38" width="24" height="5" rx="2.5" fill="#070d22" />
      {children}
    </g>
  );
}

function Mobile({ g }: G) {
  return (
    <g>
      <Phone x={62} tilt={-6}>
        <rect x="72" y="56" width="40" height="6" rx="3" fill={text} />
        <circle cx="107" cy="110" r="26" fill="none" stroke="#1f3570" strokeWidth="8" />
        <circle cx="107" cy="110" r="26" fill="none" stroke="#8fb8e8" strokeWidth="8" strokeDasharray="110 200" transform="rotate(-90 107 110)" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x="74" y={152 + i * 18} width="66" height="12" rx="4" fill="#132857" />
        ))}
      </Phone>
      <Phone x={155}>
        <rect x="167" y="56" width="50" height="7" rx="3" fill="#cfe0ff" />
        <rect x="167" y="72" width="66" height="44" rx="8" fill={`url(#${g('accent')})`} />
        <polyline points="172,106 184,96 196,100 208,86 226,90" fill="none" stroke="#fff" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx="174" cy={134 + i * 20} r="6" fill={i % 2 ? '#4a74b8' : '#6b9bde'} />
            <rect x="186" y={131 + i * 20} width="44" height="6" rx="3" fill={text} />
          </g>
        ))}
      </Phone>
      <Phone x={248} tilt={6}>
        <rect x="260" y="56" width="36" height="6" rx="3" fill={text} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={262 + i * 9} y={140 - [30, 50, 40, 64, 44, 70, 56][i]!} width="5" height={[30, 50, 40, 64, 44, 70, 56][i]} rx="2" fill={i === 5 ? '#8fb8e8' : '#6b9bde'} />
        ))}
        {[0, 1].map((i) => (
          <rect key={i} x="260" y={156 + i * 24} width="66" height="18" rx="5" fill="#132857" />
        ))}
      </Phone>
    </g>
  );
}

function Kanban() {
  const cols = [
    { title: 'To do', cards: [26, 18, 22], color: '#6b9bde' },
    { title: 'In progress', cards: [22, 30], color: '#4a74b8' },
    { title: 'Review', cards: [18, 24, 16], color: '#8fb8e8' },
    { title: 'Done', cards: [20, 26], color: '#34d399' },
  ];
  return (
    <Window>
      <rect x="44" y="54" width="90" height="8" rx="4" fill="#cfe0ff" />
      {cols.map((c, i) => {
        let y = 86;
        return (
          <g key={c.title}>
            <rect x={44 + i * 80} y="72" width="72" height="156" rx="6" fill="#0f2150" />
            <circle cx={54 + i * 80} cy="80" r="3" fill={c.color} />
            <rect x={62 + i * 80} y="77" width="36" height="5" rx="2.5" fill={text} />
            {c.cards.map((h, j) => {
              const el = (
                <g key={j}>
                  <rect x={50 + i * 80} y={y + 4} width="60" height={h + 12} rx="4" fill="#15295c" stroke={line} />
                  <rect x={56 + i * 80} y={y + 10} width="40" height="4" rx="2" fill="#a9bbdf" />
                  <rect x={56 + i * 80} y={y + h + 6} width="16" height="4" rx="2" fill={c.color} opacity="0.8" />
                </g>
              );
              y += h + 18;
              return el;
            })}
          </g>
        );
      })}
    </Window>
  );
}

function Booking() {
  return (
    <Window>
      <rect x="44" y="54" width="100" height="8" rx="4" fill="#cfe0ff" />
      <rect x="44" y="72" width="210" height="154" rx="6" fill="#0f2150" />
      {Array.from({ length: 35 }, (_, i) => {
        const cx = 52 + (i % 7) * 29;
        const cy = 82 + Math.floor(i / 7) * 28;
        const active = i === 17;
        const booked = [3, 9, 12, 20, 24, 30].includes(i);
        return (
          <rect
            key={i}
            x={cx}
            y={cy}
            width="22"
            height="20"
            rx="4"
            fill={active ? '#5b8fd6' : booked ? '#2b2468' : '#132857'}
            stroke={active ? '#7fb2ff' : 'none'}
          />
        );
      })}
      <rect x="264" y="72" width="96" height="154" rx="6" fill="#0f2150" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="272" y={84 + i * 34} width="80" height="26" rx="5" fill={i === 1 ? '#5b8fd6' : '#132857'} />
          <rect x="280" y={94 + i * 34} width="38" height="6" rx="3" fill={i === 1 ? '#fff' : text} />
        </g>
      ))}
    </Window>
  );
}

function Learning({ g }: G) {
  return (
    <Window>
      <rect x="44" y="56" width="208" height="120" rx="8" fill={`url(#${g('accent')})`} opacity="0.85" />
      <circle cx="148" cy="116" r="20" fill="#fff" opacity="0.92" />
      <path d="M142 106 L158 116 L142 126Z" fill="#5b8fd6" />
      <rect x="44" y="186" width="208" height="5" rx="2.5" fill="#1f3570" />
      <rect x="44" y="186" width="120" height="5" rx="2.5" fill="#8fb8e8" />
      <rect x="44" y="202" width="130" height="8" rx="4" fill="#cfe0ff" />
      <rect x="44" y="216" width="90" height="6" rx="3" fill={text} />
      <rect x="264" y="56" width="96" height="170" rx="6" fill="#0f2150" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx="278" cy={74 + i * 30} r="7" fill={i < 2 ? '#8fb8e8' : '#1f3570'} />
          <rect x="292" y={70 + i * 30} width="56" height="5" rx="2.5" fill={i === 2 ? '#cfe0ff' : text} />
          <rect x="292" y={79 + i * 30} width="34" height="4" rx="2" fill={text} opacity="0.5" />
        </g>
      ))}
    </Window>
  );
}

/** A project's cover screenshot, or its illustration when it has none. */
export function ProjectMedia({ project }: { project: Pick<Project, 'title' | 'preview' | 'images' | 'imageUrl'> }) {
  const cover = projectCover(project);
  if (cover) return <img src={cover} alt={`${project.title} website`} loading="lazy" decoding="async" />;
  return <ProjectPreview kind={project.preview} />;
}

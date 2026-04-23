import React from 'react';

// ─── Icon Component ───
interface IconProps {
  d: React.ReactNode;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ d, size = 18, stroke = 1.6, style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
  >
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

// ─── Icon Paths ───
export const Icons = {
  Search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  Bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  Play: <path d="M7 5v14l12-7z" fill="currentColor" stroke="none" />,
  Pause: <><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none" /><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none" /></>,
  Heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  Home: <path d="M3 11l9-7 9 7v10h-6v-6h-6v6H3z" />,
  Book: <path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z M4 16a4 4 0 0 1 4-4h10" />,
  Compass: <><circle cx="12" cy="12" r="9" /><path d="m9 15 2-6 6-2-2 6z" /></>,
  Clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  User: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>,
  Menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  ChevronRight: <path d="m9 6 6 6-6 6" />,
  ChevronLeft: <path d="m15 6-6 6 6 6" />,
  ChevronDown: <path d="m6 9 6 6 6-6" />,
  X: <><path d="m6 6 12 12" /><path d="m6 18 12-12" /></>,
  Check: <path d="m5 12 4 4 10-10" />,
  Plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  Volume: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M16 8a5 5 0 0 1 0 8" /></>,
  Share: <><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="m8 11 8-4" /><path d="m8 13 8 4" /></>,
  Copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  Download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 19h16" /></>,
  Moon: <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z" />,
  Heart2: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="currentColor" stroke="none" />,
  MapPin: <><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></>,
  Dot: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,
  Sparkle: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.5 5.5l3.5 3.5M15 15l3.5 3.5M5.5 18.5 9 15M15 9l3.5-3.5" />,
  Volume2: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M16 8a5 5 0 0 1 0 8" /><path d="M19 5a9 9 0 0 1 0 14" /></>,
  SkipBack: <><path d="M20 5v14l-10-7z" fill="currentColor" stroke="none" /><rect x="5" y="5" width="2" height="14" fill="currentColor" stroke="none" /></>,
  SkipForward: <><path d="M4 5v14l10-7z" fill="currentColor" stroke="none" /><rect x="17" y="5" width="2" height="14" fill="currentColor" stroke="none" /></>,
  ArrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  ArrowRight: <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
} as const;

// ─── Placeholder ───
interface PlaceholderProps {
  label?: string;
  aspect?: string;
  style?: React.CSSProperties;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ label = 'imagery', aspect = '16/9', style }) => (
  <div
    style={{
      aspectRatio: aspect,
      background: 'repeating-linear-gradient(135deg, var(--bq-paper-100) 0 10px, var(--bq-paper-200) 10px 11px)',
      borderRadius: 'var(--bq-radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--bq-paper-500)',
      fontFamily: 'var(--bq-font-mono)',
      fontSize: 11,
      letterSpacing: 0.5,
      ...style,
    }}
  >
    {label}
  </div>
);

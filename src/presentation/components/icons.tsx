/**
 * icons.tsx — Lucide React icon wrapper
 * Style: rounded, clean, minimal line (Lucide).
 */

import React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Heart,
  Home,
  BookOpen,
  Compass,
  Clock,
  User,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Check,
  Plus,
  Volume2,
  Share2,
  Copy,
  Download,
  Moon,
  MapPin,
  Sparkles,
  SkipBack,
  SkipForward,
  ArrowUpRight,
  ArrowRight,
  Settings,
  Globe,
  Mail,
  Phone,
  Star,
  Bell,
  Navigation,
  AlertCircle,
  Info,
  Repeat,
  Sun,
  Sunrise,
  Sunset,
  Cloud,
  MoreVertical,
  MoreHorizontal,
  Lock,
  Shield,
  FileText,
} from 'lucide-react';

// ─── Icon type (accepts any Lucide icon) ───
export type AppIcon = LucideIcon | React.ElementType;

// ─── Icon Component ───
interface IconProps {
  /** Pass an Icons.X value directly */
  d: AppIcon;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ d: LucideComp, size = 18, stroke = 1.75, style, className, color }) => {
  return <LucideComp size={size} strokeWidth={stroke} style={style} className={className} color={color} />;
};

// ─── Dot icon (simple circle) ───
const DotIcon: LucideIcon = (({ size = 18, color = 'currentColor', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...p}>
    <circle cx="12" cy="12" r="3" />
  </svg>
)) as unknown as LucideIcon;

// ─── Icon Map ───
export const Icons = {
  Search,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Heart,
  Heart2: Heart,
  Home,
  Book: BookOpen,
  Compass,
  Clock,
  User,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Check,
  Plus,
  Volume: Volume2,
  Volume2,
  Share: Share2,
  Copy,
  Download,
  Moon,
  MapPin,
  Dot: DotIcon,
  Sparkle: Sparkles,
  SkipBack,
  SkipForward,
  ArrowUpRight,
  ArrowRight,
  Settings,
  Globe,
  Mail,
  Phone,
  Star,
  Bell,
  Navigation,
  AlertCircle,
  Info,
  Repeat,
  Sun,
  Sunrise,
  Sunset,
  Cloud,
  MoreVertical,
  MoreHorizontal,
  Lock,
  Shield,
  FileText,
} as const;

// ─── Placeholder ───
interface PlaceholderProps {
  label?: string;
  aspect?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ label = 'imagery', aspect = '16/9', style, className }) => (
  <div
    className={className}
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

import React from 'react';
import { Icon, type AppIcon } from '../icons';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: AppIcon;
  iconRight?: AppIcon;
}

const sizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 13, height: 32 },
  md: { padding: '10px 16px', fontSize: 14, height: 40 },
  lg: { padding: '14px 22px', fontSize: 15, height: 48 },
};

const variants: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--bq-brown-400)', color: 'var(--bq-paper-50)', boxShadow: 'var(--bq-shadow-sm)' },
  secondary: { background: 'var(--bq-paper-50)', color: 'var(--bq-paper-700)', borderColor: 'var(--bq-paper-200)' },
  ghost:     { background: 'transparent', color: 'var(--bq-paper-700)' },
  gold:      { background: 'var(--bq-gold-300)', color: 'var(--bq-paper-800)', boxShadow: 'var(--bq-shadow-sm)' },
  outline:   { background: 'transparent', color: 'var(--bq-brown-400)', borderColor: 'var(--bq-brown-400)' },
};

const baseStyle: React.CSSProperties = {
  fontFamily: 'var(--bq-font-sans)',
  fontWeight: 600,
  border: '1px solid transparent',
  borderRadius: 'var(--bq-radius-md)',
  cursor: 'pointer',
  transition: 'all var(--bq-dur-fast) var(--bq-ease)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'center',
  whiteSpace: 'nowrap',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  style,
  ...rest
}) => (
  <button
    {...rest}
    style={{ ...baseStyle, ...sizes[size], ...variants[variant], ...style }}
  >
    {icon && <Icon d={icon} size={size === 'sm' ? 14 : 16} stroke={1.75} />}
    {children}
    {iconRight && <Icon d={iconRight} size={size === 'sm' ? 14 : 16} stroke={1.75} />}
  </button>
);

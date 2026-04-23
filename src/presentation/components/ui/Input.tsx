import React from 'react';
import { Icon } from '../icons';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({ icon, placeholder, style, ...rest }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--bq-paper-50)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 'var(--bq-radius-md)',
      padding: '10px 14px',
      fontSize: 14,
      color: 'var(--bq-paper-700)',
      transition: 'border-color var(--bq-dur-fast)',
      ...style,
    }}
  >
    {icon && <Icon d={icon} size={16} style={{ color: 'var(--bq-paper-400)', flexShrink: 0 }} />}
    <input
      placeholder={placeholder}
      {...rest}
      style={{
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        font: 'inherit',
        color: 'inherit',
        width: '100%',
      }}
    />
  </div>
);

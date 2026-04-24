import React from 'react';
import { Icon, type AppIcon } from '../icons';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'className'> {
  icon?: AppIcon;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ icon, placeholder, className = '', ...rest }) => (
  <div
    className={`flex items-center gap-2.5 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--bq-paper-700)] transition-colors duration-200 focus-within:border-[var(--bq-gold-400)] focus-within:ring-1 focus-within:ring-[var(--bq-gold-400)] ${className}`}
  >
    {icon && (
      <Icon 
        d={icon} 
        size={16} 
        stroke={1.75} 
        className="text-[var(--bq-paper-400)] shrink-0" 
      />
    )}
    <input
      placeholder={placeholder}
      {...rest}
      className="flex-1 w-full border-none outline-none bg-transparent font-inherit text-inherit placeholder:text-[var(--bq-paper-400)]"
    />
  </div>
);

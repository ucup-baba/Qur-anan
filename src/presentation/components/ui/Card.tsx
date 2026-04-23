import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, hover, style, className = '', onClick }) => (
  <div
    style={style}
    onClick={onClick}
    className={`bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
      hover ? 'cursor-pointer hover:border-[var(--bq-brown-300)] hover:shadow-md' : ''
    } ${className}`}
  >
    {children}
  </div>
);

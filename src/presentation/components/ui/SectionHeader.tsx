import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle }) => (
  <div style={{ marginBottom: 28 }}>
    {eyebrow && (
      <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600 }}>
        {eyebrow}
      </div>
    )}
    <h2 className="bq-serif" style={{ fontSize: 42, margin: '6px 0 4px', fontWeight: 500, letterSpacing: -0.5, color: 'var(--bq-paper-800)' }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', maxWidth: 540, margin: 0 }}>
        {subtitle}
      </p>
    )}
  </div>
);

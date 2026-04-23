import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role }) => (
  <div style={{ background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', padding: 24 }}>
    <div className="bq-serif" style={{ fontSize: 48, lineHeight: 0.7, color: 'var(--bq-gold-300)', marginBottom: 4 }}>&ldquo;</div>
    <p className="bq-serif" style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--bq-paper-700)', margin: '0 0 16px', fontWeight: 400, fontStyle: 'italic' }}>
      {quote}
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--bq-paper-200)' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--bq-brown-200)', color: 'var(--bq-brown-600)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 13,
      }}>
        {name.split(' ').map(n => n[0]).slice(0, 2).join('')}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-700)' }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>{role}</div>
      </div>
    </div>
  </div>
);

'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface DonationCardProps {
  title: string;
  description: string;
  urgent?: boolean;
  image: string;
}

export const DonationCard: React.FC<DonationCardProps> = ({ title, description, urgent, image }) => {
  const scrollToRekening = () => {
    document.getElementById('rekening')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: '0 0 80vw', maxWidth: 360, scrollSnapAlign: 'start' }}>
      <div style={{ aspectRatio: '210/297', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <Badge tone="brown">Donasi</Badge>
            {urgent && <Badge tone="warning">Mendesak</Badge>}
          </div>
          <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>{title}</h3>
          <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0, lineHeight: 1.5 }}>{description}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" size="sm" onClick={scrollToRekening}>Donasi</Button>
        </div>
      </div>
    </div>
  );
};

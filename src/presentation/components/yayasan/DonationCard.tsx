import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Placeholder } from '../icons';

interface DonationCardProps {
  title: string;
  description: string;
  raised: number;
  target: number;
  donors: number;
  urgent?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({ title, description, raised, target, donors, urgent }) => {
  const pct = Math.min(100, (raised / target) * 100);
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  return (
    <div style={{ background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Placeholder label="foto program" aspect="16/9" style={{ borderRadius: 0 }} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <Badge tone="brown">Donasi</Badge>
            {urgent && <Badge tone="warning">Mendesak</Badge>}
          </div>
          <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>{title}</h3>
          <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0, lineHeight: 1.5 }}>{description}</p>
        </div>
        <div>
          <div style={{ height: 6, background: 'var(--bq-paper-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--bq-gold-300)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--bq-paper-500)' }}>Terkumpul</span>
            <span style={{ color: 'var(--bq-paper-700)', fontWeight: 600 }}>{fmt(raised)} <span style={{ color: 'var(--bq-paper-400)', fontWeight: 400 }}>dari {fmt(target)}</span></span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}><strong style={{ color: 'var(--bq-paper-700)' }}>{donors}</strong> donatur</div>
          <Button variant="primary" size="sm">Donasi</Button>
        </div>
      </div>
    </div>
  );
};

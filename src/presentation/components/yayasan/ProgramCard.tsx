import React from 'react';
import { Icon, Icons, Placeholder } from '../icons';
import { Badge } from '../ui/Badge';

interface ProgramCardProps {
  kind: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ kind, title, description, date, location }) => (
  <div style={{ background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <Placeholder label="foto kegiatan" aspect="16/10" />
    <div><Badge tone="gold">{kind}</Badge></div>
    <div>
      <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--bq-paper-600)', paddingTop: 4, borderTop: '1px dashed var(--bq-paper-200)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <Icon d={Icons.Clock} size={14} style={{ color: 'var(--bq-paper-400)' }} /> {date}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon d={Icons.MapPin} size={14} style={{ color: 'var(--bq-paper-400)' }} /> {location}
      </div>
    </div>
  </div>
);

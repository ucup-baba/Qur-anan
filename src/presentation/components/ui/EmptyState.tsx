import React from 'react';
import { Icon, Icons } from '@/presentation/components/icons';

interface EmptyStateProps {
  icon?: keyof typeof Icons;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'Heart',
  title,
  description,
  action,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center py-12 px-6 border-2 border-dashed border-[var(--bq-paper-200)] rounded-2xl ${className}`}
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--bq-paper-100)] to-[var(--bq-paper-200)] flex items-center justify-center mb-4">
      <Icon
        d={Icons[icon]}
        size={28}
        style={{ color: 'var(--bq-brown-400)' }}
      />
    </div>
    <h3 className="text-base font-semibold text-[var(--bq-paper-800)] mb-1.5">
      {title}
    </h3>
    {description && (
      <p className="text-[13px] text-[var(--bq-paper-500)] max-w-[300px] leading-relaxed mb-4">
        {description}
      </p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

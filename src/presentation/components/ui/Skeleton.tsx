import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  style,
  width,
  height,
  rounded = 'md',
}) => {
  const radiusMap = {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  } as const;

  return (
    <div
      className={`bq-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radiusMap[rounded],
        ...style,
      }}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={12}
        width={i === lines - 1 ? '70%' : '100%'}
        rounded="sm"
      />
    ))}
  </div>
);

export const SkeletonAyat: React.FC = () => (
  <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 mb-3">
    <div className="flex justify-between items-start mb-4">
      <Skeleton width={32} height={32} rounded="lg" />
      <div className="flex gap-2">
        <Skeleton width={28} height={28} rounded="full" />
        <Skeleton width={28} height={28} rounded="full" />
        <Skeleton width={28} height={28} rounded="full" />
      </div>
    </div>
    <div className="flex justify-end mb-4">
      <Skeleton width="80%" height={32} rounded="md" />
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonSurahCard: React.FC = () => (
  <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5">
    <div className="flex justify-between items-center mb-4">
      <Skeleton width={40} height={40} rounded="lg" />
      <Skeleton width={80} height={28} rounded="md" />
    </div>
    <Skeleton width="60%" height={16} rounded="sm" className="mb-1" />
    <Skeleton width="40%" height={12} rounded="sm" />
  </div>
);

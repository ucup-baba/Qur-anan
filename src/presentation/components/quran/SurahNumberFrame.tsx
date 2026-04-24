import React from 'react';

interface SurahNumberFrameProps extends React.SVGProps<SVGSVGElement> {
  num: number;
}

export const SurahNumberFrame: React.FC<SurahNumberFrameProps> = ({ num, className, ...rest }) => (
  <div className={`relative flex items-center justify-center w-11 h-11 ${className || ''}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 44 44" 
      className="absolute inset-0 w-full h-full text-[var(--bq-gold-400)]"
      {...rest}
    >
      <polygon 
        points="22,2 40,13 40,31 22,42 4,31 4,13" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.4"
      />
    </svg>
    <span className="relative text-sm font-semibold text-[var(--bq-paper-800)] font-sans">
      {num}
    </span>
  </div>
);

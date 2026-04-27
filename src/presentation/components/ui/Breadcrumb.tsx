import React from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => (
  <nav
    aria-label="Breadcrumb"
    className={`flex items-center gap-1.5 text-xs text-[var(--bq-paper-500)] ${className}`}
  >
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <React.Fragment key={i}>
          {item.href && !isLast ? (
            <Link
              href={item.href}
              className="hover:text-[var(--bq-brown-500)] transition-colors no-underline truncate max-w-[140px]"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`truncate max-w-[200px] ${isLast ? 'text-[var(--bq-paper-700)] font-semibold' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
          {!isLast && (
            <Icon d={Icons.ChevronRight} size={12} style={{ color: 'var(--bq-paper-300)', flexShrink: 0 }} />
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

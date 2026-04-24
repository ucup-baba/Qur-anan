import React from 'react';
import { Icon, Icons } from '../icons';
import { SurahNumberFrame } from './SurahNumberFrame';

interface SurahListItemProps {
  num: number;
  name: string;        // Arabic
  transliteration: string;
  meaning: string;
  ayatCount: number;
  revelation: string;
  bookmarked?: boolean;
  onClick?: () => void;
  onToggleBookmark?: (e: React.MouseEvent) => void;
}

export const SurahListItem: React.FC<SurahListItemProps> = ({
  num, name, transliteration, meaning, ayatCount, revelation, bookmarked, onClick, onToggleBookmark
}) => (
  <div
    onClick={onClick}
    className="grid grid-cols-[44px_1fr_auto] gap-4 items-center p-5 md:px-6 bg-white border border-[var(--bq-paper-200)] rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-[var(--bq-gold-300)]"
  >
    <SurahNumberFrame num={num} />
    
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-base font-semibold text-[var(--bq-paper-800)]">
          {transliteration}
        </span>
        <span className="text-xs text-[var(--bq-paper-500)]">· {meaning}</span>
      </div>
      <div className="text-[13px] text-[var(--bq-paper-500)]">
        {revelation} · {ayatCount} ayat
      </div>
    </div>
    
    <div className="flex items-center gap-3.5">
      {onToggleBookmark ? (
        <button 
          onClick={onToggleBookmark}
          className="p-2 -mr-2 rounded-full hover:bg-[var(--bq-paper-50)] transition-colors"
          aria-label={bookmarked ? "Hapus dari bookmark" : "Tambahkan ke bookmark"}
        >
          <Icon 
            d={Icons.Bookmark} 
            size={18} 
            style={{ 
              color: bookmarked ? 'var(--bq-gold-400)' : 'var(--bq-paper-300)',
              fill: bookmarked ? 'var(--bq-gold-400)' : 'none'
            }} 
          />
        </button>
      ) : (
        bookmarked && <Icon d={Icons.Bookmark} size={16} style={{ color: 'var(--bq-gold-400)', fill: 'var(--bq-gold-400)' }} />
      )}
      <span className="bq-arabic text-[28px] text-[var(--bq-paper-800)] leading-none mt-1">
        {name}
      </span>
    </div>
  </div>
);

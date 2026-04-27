'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '../icons';
import { Badge } from '../ui/Badge';
import { getArticles, type Article } from '@/infrastructure/firebase/articles';

export function ArticleSlider() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getArticles(10)
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIdx(idx);
  };

  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
    setActiveIdx(idx);
  };

  if (loading) {
    return (
      <div style={{
        padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div
          className="animate-spin"
          style={{
            width: 24, height: 24,
            border: '3px solid var(--bq-paper-200)',
            borderTopColor: 'var(--bq-brown-400)',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  if (articles.length === 0) return null; // No articles, hide slider

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)',
        borderRadius: 'var(--bq-radius-lg)', overflow: 'hidden',
      }}>
        {/* ── Swipeable article cards ── */}
        <div style={{ position: 'relative' }}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
            }}
            className="hide-scrollbar"
          >
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/yayasan/berita/${article.id}`}
                style={{
                  flex: '0 0 100%', scrollSnapAlign: 'start',
                  position: 'relative', aspectRatio: '16/9',
                  display: 'block', textDecoration: 'none',
                  background: 'var(--bq-paper-100)',
                }}
              >
                {article.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.thumbnailUrl}
                    alt={article.title}
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--bq-brown-50), var(--bq-gold-50))',
                  }}>
                    <Icon d={Icons.Newspaper} size={48} style={{ color: 'var(--bq-paper-300)' }} />
                  </div>
                )}
                {/* Dark gradient overlay at bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '40px 16px 14px',
                }}>
                  <div style={{ marginBottom: 6 }}>
                    <Badge tone="gold">Berita</Badge>
                  </div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 600, color: '#fff', margin: 0,
                    lineHeight: 1.3, overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>
                    {article.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Dot indicators */}
          {articles.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 10, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 6, zIndex: 2,
            }}>
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); goTo(i); }}
                  style={{
                    width: i === activeIdx ? 20 : 6, height: 6,
                    borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                    background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.25s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Card body (active article info) ── */}
        <div style={{ padding: '12px 16px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 13, fontWeight: 500, color: 'var(--bq-paper-700)', margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {articles[activeIdx]?.title ?? ''}
            </p>
            <p style={{ fontSize: 11, color: 'var(--bq-paper-400)', margin: '2px 0 0' }}>
              {articles.length} berita tersedia
            </p>
          </div>
          <Link
            href={`/yayasan/berita/${articles[activeIdx]?.id ?? ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 600, color: 'var(--bq-brown-400)',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Baca <Icon d={Icons.ArrowRight} size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

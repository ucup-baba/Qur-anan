'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon, Icons } from '@/presentation/components/icons';
import {
  getArticleById,
  getAdjacentArticles,
  type Article,
} from '@/infrastructure/firebase/articles';
import { useToast } from '@/presentation/components/ui/Toast';
import { Breadcrumb } from '@/presentation/components/ui/Breadcrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [adjacent, setAdjacent] = useState<{
    prev: { id: string; title: string } | null;
    next: { id: string; title: string } | null;
  }>({ prev: null, next: null });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getArticleById(id), getAdjacentArticles(id)])
      .then(([art, adj]) => {
        if (cancelled) return;
        setArticle(art);
        setAdjacent(adj);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div
          className="animate-spin"
          style={{
            width: 32, height: 32,
            border: '3px solid var(--bq-paper-200)',
            borderTopColor: 'var(--bq-brown-400)',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24 }}>
        <Icon d={Icons.Newspaper} size={48} style={{ color: 'var(--bq-paper-300)', marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--bq-paper-700)', margin: '0 0 8px' }}>
          Artikel tidak ditemukan
        </h2>
        <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', margin: '0 0 20px' }}>
          Artikel yang Anda cari mungkin telah dihapus atau tidak ada.
        </p>
        <button
          onClick={() => router.push('/yayasan')}
          style={{
            padding: '10px 20px', background: 'var(--bq-brown-400)', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Kembali ke Yayasan
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* ── Floating back button ── */}
      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed', top: 72, left: 16, zIndex: 50,
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--bq-paper-200)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--bq-shadow-md)',
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Icon d={Icons.ChevronLeft} size={20} style={{ color: 'var(--bq-paper-700)' }} />
      </button>

      {/* ── Hero thumbnail ── */}
      {article.thumbnailUrl ? (
        <div style={{ position: 'relative', width: '100%', maxHeight: 400, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            style={{
              width: '100%', height: 'auto', maxHeight: 400,
              objectFit: 'cover', display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(transparent, #fff)',
          }} />
        </div>
      ) : (
        <div style={{
          height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--bq-brown-50), var(--bq-gold-50))',
        }}>
          <Icon d={Icons.Newspaper} size={56} style={{ color: 'var(--bq-paper-300)' }} />
        </div>
      )}

      {/* ── Article body ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 40px' }}>
        <Breadcrumb
          className="mt-5 mb-4"
          items={[
            { label: 'Beranda', href: '/' },
            { label: 'Yayasan', href: '/yayasan' },
            { label: 'Berita', href: '/yayasan' },
            { label: article.title },
          ]}
        />
        {/* Meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: 'var(--bq-paper-400)', marginBottom: 12, marginTop: article.thumbnailUrl ? 0 : 24,
        }}>
          <Icon d={Icons.CalendarDays} size={14} />
          {article.createdAt.toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </div>

        {/* Title */}
        <h1
          className="bq-serif"
          style={{
            fontSize: 28, fontWeight: 700, margin: '0 0 24px',
            color: 'var(--bq-paper-800)', lineHeight: 1.25,
            letterSpacing: '-0.3px',
          }}
        >
          {article.title}
        </h1>

        {/* Divider */}
        <div style={{
          width: 40, height: 3, borderRadius: 2,
          background: 'var(--bq-gold-300)', marginBottom: 28,
        }} />

        {/* Markdown content */}
        <div
          className="article-content"
          style={{
            fontSize: 15, lineHeight: 1.85, color: 'var(--bq-paper-600)',
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* ── Share section ── */}
        <div style={{
          marginTop: 40, paddingTop: 20,
          borderTop: '1px solid var(--bq-paper-200)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13, color: 'var(--bq-paper-500)' }}>Bagikan:</span>
          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: article.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.show('Link berhasil disalin!', 'success');
              }
            }}
            style={{
              background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)',
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--bq-paper-600)',
            }}
          >
            <Icon d={Icons.Share} size={14} /> Bagikan
          </button>
        </div>

        {/* ── Prev / Next navigation ── */}
        <div style={{
          marginTop: 32, display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          {adjacent.prev ? (
            <Link
              href={`/yayasan/berita/${adjacent.prev.id}`}
              style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                padding: '16px 14px', borderRadius: 14,
                background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 11, color: 'var(--bq-paper-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon d={Icons.ChevronLeft} size={12} /> Sebelumnya
              </span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-700)',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}>
                {adjacent.prev.title}
              </span>
            </Link>
          ) : <div />}

          {adjacent.next ? (
            <Link
              href={`/yayasan/berita/${adjacent.next.id}`}
              style={{
                display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', textAlign: 'right',
                padding: '16px 14px', borderRadius: 14,
                background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 11, color: 'var(--bq-paper-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Selanjutnya <Icon d={Icons.ChevronRight} size={12} />
              </span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-700)',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}>
                {adjacent.next.title}
              </span>
            </Link>
          ) : <div />}
        </div>

        {/* ── Back to Yayasan ── */}
        <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 20 }}>
          <Link
            href="/yayasan"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: 'var(--bq-brown-400)',
              textDecoration: 'none',
            }}
          >
            <Icon d={Icons.ChevronLeft} size={14} /> Kembali ke Yayasan
          </Link>
        </div>
      </div>

      {/* ── Article content markdown styles ── */}
      <style>{`
        .article-content h1 { font-size: 26px; font-weight: 700; margin: 28px 0 12px; color: var(--bq-paper-800); }
        .article-content h2 { font-size: 22px; font-weight: 600; margin: 24px 0 10px; color: var(--bq-paper-800); }
        .article-content h3 { font-size: 18px; font-weight: 600; margin: 20px 0 8px; color: var(--bq-paper-800); }
        .article-content p { margin: 0 0 16px; }
        .article-content ul, .article-content ol { padding-left: 24px; margin: 0 0 16px; }
        .article-content li { margin-bottom: 6px; }
        .article-content blockquote {
          border-left: 3px solid var(--bq-gold-300);
          padding: 12px 18px;
          margin: 16px 0;
          background: var(--bq-gold-50);
          color: var(--bq-paper-600);
          border-radius: 0 10px 10px 0;
          font-style: italic;
        }
        .article-content code {
          background: var(--bq-paper-100);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--bq-font-mono);
          font-size: 13px;
        }
        .article-content pre {
          background: var(--bq-paper-800);
          color: var(--bq-paper-100);
          padding: 16px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 16px 0;
        }
        .article-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        .article-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 16px 0;
        }
        .article-content a {
          color: var(--bq-brown-400);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-content a:hover {
          color: var(--bq-brown-500);
        }
        .article-content hr {
          border: none;
          border-top: 1px solid var(--bq-paper-200);
          margin: 24px 0;
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        .article-content th, .article-content td {
          border: 1px solid var(--bq-paper-200);
          padding: 8px 12px;
          text-align: left;
          font-size: 14px;
        }
        .article-content th {
          background: var(--bq-paper-100);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

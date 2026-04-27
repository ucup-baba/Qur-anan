'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import {
  uploadThumbnail,
  createArticle,
  getArticles,
  deleteArticle,
  type Article,
} from '@/infrastructure/firebase/articles';

// Dynamic import to avoid SSR issues with EasyMDE
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const ADMIN_EMAIL = 'baitulqowwam123@gmail.com';

export default function AdminBeritaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // ── Load existing articles ──
  const loadArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const data = await getArticles(50);
      setArticles(data);
    } catch (e) {
      console.error('Failed to load articles', e);
    }
    setLoadingArticles(false);
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) loadArticles();
  }, [user, loadArticles]);

  // ── Thumbnail preview ──
  useEffect(() => {
    if (!thumbnailFile) { setThumbnailPreview(null); return; }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  // ── EasyMDE options ──
  const mdeOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: 'Tulis konten artikel menggunakan Markdown...',
    status: false,
    autofocus: false,
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'heading-1', 'heading-2', 'heading-3', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', 'code', 'horizontal-rule', '|',
      'preview', 'side-by-side', 'fullscreen', '|',
      'guide',
    ] as const,
    minHeight: '300px',
  }), []);

  // ── Handle save ──
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Judul dan konten tidak boleh kosong.');
      return;
    }

    setSaving(true);
    try {
      let thumbnailUrl = '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }
      await createArticle({ title: title.trim(), content, thumbnailUrl });
      setSuccessMsg('Artikel berhasil dipublikasikan!');
      setTitle('');
      setContent('');
      setThumbnailFile(null);
      setThumbnailPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadArticles();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      console.error('Failed to save article', e);
      alert('Gagal menyimpan artikel. Silakan coba lagi.');
    }
    setSaving(false);
  };

  // ── Handle delete ──
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      await deleteArticle(id);
      await loadArticles();
    } catch (e) {
      console.error('Failed to delete', e);
    }
  };



  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--bq-brown-400)', color: 'var(--bq-gold-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon d={Icons.Newspaper} size={22} />
        </div>
        <div>
          <h1 className="bq-serif" style={{ fontSize: 24, fontWeight: 600, margin: 0, color: 'var(--bq-paper-800)' }}>
            Admin Panel Berita
          </h1>
          <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0 }}>
            Tulis dan kelola berita/artikel Yayasan
          </p>
        </div>
      </div>

      {/* ── Success toast ── */}
      {successMsg && (
        <div style={{
          padding: '12px 16px', marginBottom: 20, borderRadius: 12,
          background: 'rgba(74, 124, 59, 0.1)', border: '1px solid rgba(74, 124, 59, 0.2)',
          color: 'var(--bq-success)', fontSize: 14, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'bq-slide-up 0.3s ease',
        }}>
          <Icon d={Icons.Check} size={16} /> {successMsg}
        </div>
      )}

      {/* ── Form ── */}
      <div style={{
        background: '#fff', border: '1px solid var(--bq-paper-200)',
        borderRadius: 16, padding: 24, marginBottom: 32,
        boxShadow: 'var(--bq-shadow-sm)',
      }}>
        {/* Title */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-600)', display: 'block', marginBottom: 6 }}>
            Judul Artikel
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul artikel..."
            style={{
              width: '100%', padding: '12px 14px', fontSize: 15,
              border: '1px solid var(--bq-paper-200)', borderRadius: 10,
              background: 'var(--bq-paper-50)', outline: 'none',
              fontFamily: 'var(--bq-font-sans)', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--bq-gold-400)'}
            onBlur={e => e.target.style.borderColor = 'var(--bq-paper-200)'}
          />
        </label>

        {/* Thumbnail */}
        <label style={{ display: 'block', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-600)', display: 'block', marginBottom: 6 }}>
            Thumbnail (Foto)
          </span>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--bq-paper-200)', borderRadius: 12,
              padding: thumbnailPreview ? 0 : '28px 16px',
              textAlign: 'center', cursor: 'pointer',
              background: 'var(--bq-paper-50)',
              overflow: 'hidden', position: 'relative',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--bq-gold-400)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--bq-paper-200)')}
          >
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailPreview}
                alt="Preview"
                style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <>
                <Icon d={Icons.ImageIcon} size={32} style={{ color: 'var(--bq-paper-300)', marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: 'var(--bq-paper-400)', margin: 0 }}>
                  Klik untuk memilih gambar thumbnail
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            style={{ display: 'none' }}
          />
        </label>

        {/* Markdown Editor */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-600)', display: 'block', marginBottom: 6 }}>
            Konten Artikel (Markdown)
          </span>
          <div className="admin-mde-wrapper">
            <SimpleMDE
              value={content}
              onChange={setContent}
              options={mdeOptions}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon={Icons.Eye}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Tutup Preview' : 'Preview'}
          </Button>
          <Button
            variant="primary"
            icon={Icons.Send}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Publikasikan'}
          </Button>
        </div>
      </div>

      {/* ── Preview modal ── */}
      {showPreview && (
        <div style={{
          background: '#fff', border: '1px solid var(--bq-paper-200)',
          borderRadius: 16, padding: 24, marginBottom: 32,
          boxShadow: 'var(--bq-shadow-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--bq-paper-700)', margin: 0 }}>
              📋 Preview Artikel
            </h2>
            <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Icon d={Icons.X} size={18} style={{ color: 'var(--bq-paper-400)' }} />
            </button>
          </div>
          {thumbnailPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailPreview}
              alt="Preview thumbnail"
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
            />
          )}
          <h1 className="bq-serif" style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px', color: 'var(--bq-paper-800)' }}>
            {title || 'Judul Artikel'}
          </h1>
          <div className="article-content" style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--bq-paper-600)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*Belum ada konten...*'}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* ── Existing articles list ── */}
      <div>
        <h2 className="bq-serif" style={{ fontSize: 20, fontWeight: 600, margin: '0 0 16px', color: 'var(--bq-paper-800)' }}>
          Daftar Artikel ({articles.length})
        </h2>
        {loadingArticles ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="animate-spin" style={{ width: 28, height: 28, border: '3px solid var(--bq-paper-200)', borderTopColor: 'var(--bq-brown-400)', borderRadius: '50%', margin: '0 auto' }} />
          </div>
        ) : articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            background: 'var(--bq-paper-50)', borderRadius: 16,
            border: '1px dashed var(--bq-paper-200)',
          }}>
            <Icon d={Icons.Newspaper} size={36} style={{ color: 'var(--bq-paper-300)', marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: 'var(--bq-paper-400)', margin: 0 }}>
              Belum ada artikel. Tulis artikel pertama Anda di atas!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map((article) => (
              <div
                key={article.id}
                style={{
                  display: 'flex', gap: 14, alignItems: 'center',
                  padding: 14, background: '#fff',
                  border: '1px solid var(--bq-paper-200)', borderRadius: 14,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {article.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.thumbnailUrl}
                    alt={article.title}
                    style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: 72, height: 52, borderRadius: 8, flexShrink: 0,
                    background: 'var(--bq-paper-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon d={Icons.ImageIcon} size={20} style={{ color: 'var(--bq-paper-300)' }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--bq-paper-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--bq-paper-400)', margin: '2px 0 0' }}>
                    {article.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(article.id)}
                  style={{
                    background: 'rgba(154, 63, 46, 0.08)', border: 'none', borderRadius: 8,
                    width: 36, height: 36, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(154, 63, 46, 0.16)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(154, 63, 46, 0.08)'}
                >
                  <Icon d={Icons.Trash2} size={16} style={{ color: 'var(--bq-error)' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── EasyMDE global styles override ── */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css');
        
        .admin-mde-wrapper .EasyMDEContainer {
          border: 1px solid var(--bq-paper-200) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .admin-mde-wrapper .EasyMDEContainer .CodeMirror {
          border: none !important;
          background: var(--bq-paper-50) !important;
          font-family: var(--bq-font-sans) !important;
          font-size: 14px !important;
          color: var(--bq-paper-700) !important;
          border-radius: 0 !important;
        }
        .admin-mde-wrapper .editor-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--bq-paper-200) !important;
          background: #fff !important;
          padding: 6px 4px !important;
          opacity: 1 !important;
        }
        .admin-mde-wrapper .editor-toolbar button {
          color: var(--bq-paper-500) !important;
          border-radius: 6px !important;
          width: 32px !important;
          height: 32px !important;
        }
        .admin-mde-wrapper .editor-toolbar button:hover {
          background: var(--bq-paper-100) !important;
          color: var(--bq-brown-400) !important;
        }
        .admin-mde-wrapper .editor-toolbar button.active {
          background: var(--bq-brown-50) !important;
          color: var(--bq-brown-400) !important;
        }
        .admin-mde-wrapper .editor-toolbar i.separator {
          border-left-color: var(--bq-paper-200) !important;
        }
        .admin-mde-wrapper .CodeMirror-focused {
          outline: none !important;
        }

        /* Article content markdown styles */
        .article-content h1 { font-size: 28px; font-weight: 700; margin: 24px 0 12px; color: var(--bq-paper-800); }
        .article-content h2 { font-size: 22px; font-weight: 600; margin: 20px 0 10px; color: var(--bq-paper-800); }
        .article-content h3 { font-size: 18px; font-weight: 600; margin: 16px 0 8px; color: var(--bq-paper-800); }
        .article-content p { margin: 0 0 12px; }
        .article-content ul, .article-content ol { padding-left: 20px; margin: 0 0 12px; }
        .article-content li { margin-bottom: 4px; }
        .article-content blockquote {
          border-left: 3px solid var(--bq-gold-300);
          padding: 8px 16px;
          margin: 12px 0;
          background: var(--bq-gold-50);
          color: var(--bq-paper-600);
          border-radius: 0 8px 8px 0;
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
          border-radius: 10px;
          overflow-x: auto;
        }
        .article-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        .article-content img {
          max-width: 100%;
          border-radius: 10px;
          margin: 12px 0;
        }
        .article-content a {
          color: var(--bq-brown-400);
          text-decoration: underline;
        }
        .article-content hr {
          border: none;
          border-top: 1px solid var(--bq-paper-200);
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}

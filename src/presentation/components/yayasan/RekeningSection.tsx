'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const REKENING = {
  bank: 'BPD Syariah',
  subtitle: 'Bank Jogja',
  no: '801211018056',
  name: 'Panti Asuhan Yatim Miskin Baitul Qowwam',
};

const WA_NUMBER = '6285643386134';
const WA_DISPLAY = '0856-4338-6134';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 700,
        color: copied ? '#15803D' : 'var(--bq-brown-600)',
        background: copied ? '#F0FDF4' : '#fff',
        border: `1.5px solid ${copied ? '#86EFAC' : 'var(--bq-paper-200)'}`,
        borderRadius: 10, padding: '7px 12px',
        cursor: 'pointer', transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tersalin
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="4.5" y="1" width="7.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 4.5V10.5a1 1 0 001 1h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Salin
        </>
      )}
    </button>
  );
}

export function RekeningSection() {
  return (
    <div id="rekening" style={{
      background: 'linear-gradient(160deg, var(--bq-paper-100) 0%, var(--bq-paper-50) 100%)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 24, padding: '24px 20px 24px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--bq-gold-500)', fontWeight: 700, marginBottom: 6 }}>
          Salurkan Donasi
        </div>
        <h3 className="bq-serif" style={{ fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--bq-paper-800)', letterSpacing: -0.3 }}>
          Rekening & QRIS
        </h3>
      </div>

      {/* Rekening Bank Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1A3C6E 0%, #2A5490 60%, #1A3C6E 100%)',
        borderRadius: 18,
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 14,
        boxShadow: '0 8px 24px rgba(26, 60, 110, 0.25)',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
        <div style={{ position: 'absolute', left: -20, bottom: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)' }} />

        {/* Top row: bank logo + chip */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 700, marginBottom: 3 }}>
              Transfer Bank
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: -0.2 }}>
              {REKENING.bank}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>
              {REKENING.subtitle}
            </div>
          </div>
          {/* Chip */}
          <div style={{
            width: 38, height: 28, borderRadius: 5,
            background: 'linear-gradient(135deg, #FFD580 0%, #C9A24E 100%)',
            position: 'relative', flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}>
            <div style={{ position: 'absolute', inset: '4px 6px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: '50%', left: '20%', right: '20%', height: 1, background: 'rgba(0,0,0,0.15)' }} />
          </div>
        </div>

        {/* Account number */}
        <div style={{
          fontFamily: 'var(--bq-font-mono)',
          fontSize: 24, fontWeight: 700,
          color: '#fff', letterSpacing: 2.5,
          marginBottom: 14,
          position: 'relative',
        }}>
          {REKENING.no.replace(/(\d{4})/g, '$1 ').trim()}
        </div>

        {/* Bottom: name + copy */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 2 }}>
              Atas Nama
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
              {REKENING.name}
            </div>
          </div>
          <CopyButton text={REKENING.no} />
        </div>
      </div>

      {/* Divider with "ATAU" */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 4px' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--bq-paper-200)' }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--bq-paper-400)', letterSpacing: 1.5 }}>ATAU</div>
        <div style={{ flex: 1, height: 1, background: 'var(--bq-paper-200)' }} />
      </div>

      {/* QRIS Card */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--bq-paper-200)',
        borderRadius: 18,
        padding: 18,
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        {/* QR */}
        <div style={{
          width: 116, height: 116, flexShrink: 0,
          borderRadius: 12, overflow: 'hidden',
          border: '1px solid var(--bq-paper-100)',
          background: '#fff', padding: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          position: 'relative',
        }}>
          <Image
            src="/qris-bpd.png"
            alt="QRIS BPD Syariah"
            fill
            sizes="116px"
            style={{ objectFit: 'contain', padding: 4 }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, #DC2626, #EF4444)', borderRadius: 6, padding: '3px 8px', marginBottom: 8, letterSpacing: 0.5 }}>
            QRIS
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bq-paper-800)', marginBottom: 4, lineHeight: 1.3 }}>
            Scan & Bayar Cepat
          </div>
          <div style={{ fontSize: 11, color: 'var(--bq-paper-500)', lineHeight: 1.5, marginBottom: 8 }}>
            GoPay · OVO · Dana · ShopeePay · M-Banking
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#15803D', fontWeight: 700, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, padding: '3px 8px' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4 7L8 3" stroke="#15803D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            0% biaya untuk donasi sosial
          </div>
        </div>
      </div>

      {/* Konfirmasi WA */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=Assalamualaikum%2C+saya+ingin+konfirmasi+donasi.`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
          borderRadius: 14, padding: '14px 16px',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(22,163,74,0.25)',
          transition: 'transform 0.18s, box-shadow 0.18s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(22,163,74,0.35)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(22,163,74,0.25)';
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.523 5.84L.057 23.25a.75.75 0 00.914.914l5.41-1.466A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Konfirmasi Donasi via WhatsApp</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{WA_DISPLAY} · sertakan bukti transfer</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M3 7h8M7 3l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}

// Foundation artboards: Colors, Typography, Spacing, Radius, Shadows

const Swatch = ({ name, token, value, textDark }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{
      height: 72,
      background: value,
      borderRadius: 'var(--bq-radius-md)',
      border: '1px solid rgba(46,38,25,0.08)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: 8,
      color: textDark ? 'var(--bq-paper-700)' : 'var(--bq-paper-50)',
      fontSize: 11,
      fontFamily: 'var(--bq-font-mono)',
    }}>
      {value}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-paper-700)' }}>{name}</span>
      <span style={{ fontSize: 11, fontFamily: 'var(--bq-font-mono)', color: 'var(--bq-paper-500)' }}>{token}</span>
    </div>
  </div>
);

const SwatchRow = ({ title, items }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: 'var(--bq-paper-500)',
      marginBottom: 12,
    }}>{title}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
      {items.map(s => <Swatch key={s.token} {...s} />)}
    </div>
  </div>
);

const ColorsArtboard = () => (
  <div className="bq-root" style={{ padding: 40, background: 'var(--bq-paper-50)', minHeight: '100%' }}>
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600 }}>01 · Foundation</div>
      <h2 className="bq-serif" style={{ fontSize: 42, margin: '6px 0 4px', fontWeight: 500, letterSpacing: -0.5, color: 'var(--bq-paper-800)' }}>Color Palette</h2>
      <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', maxWidth: 540, margin: 0 }}>
        Warm neutrals sebagai fondasi, coklat hangat untuk primary, dan emas untuk aksen. Terinspirasi dari mushaf cetak Madinah — tenang, hangat, dan khusyuk.
      </p>
    </div>

    <SwatchRow title="Neutral · Paper" items={[
      { name: '50',  token: '--bq-paper-50',  value: '#FBF8F2', textDark: true },
      { name: '100', token: '--bq-paper-100', value: '#F5F0E6', textDark: true },
      { name: '200', token: '--bq-paper-200', value: '#EADFCC', textDark: true },
      { name: '400', token: '--bq-paper-400', value: '#A89478', textDark: false },
      { name: '700', token: '--bq-paper-700', value: '#2E2619', textDark: false },
    ]} />

    <SwatchRow title="Primary · Coklat" items={[
      { name: '50',  token: '--bq-brown-50',  value: '#F7F0E4', textDark: true },
      { name: '100', token: '--bq-brown-100', value: '#E8D6B8', textDark: true },
      { name: '300', token: '--bq-brown-300', value: '#A07C4A', textDark: false },
      { name: '400', token: '--bq-brown-400', value: '#7A5A30', textDark: false },
      { name: '600', token: '--bq-brown-600', value: '#3F2E17', textDark: false },
    ]} />

    <SwatchRow title="Accent · Emas" items={[
      { name: '50',  token: '--bq-gold-50',  value: '#FBF4E0', textDark: true },
      { name: '100', token: '--bq-gold-100', value: '#F2E1B0', textDark: true },
      { name: '200', token: '--bq-gold-200', value: '#E5C77A', textDark: true },
      { name: '300', token: '--bq-gold-300', value: '#C9A24E', textDark: false },
      { name: '400', token: '--bq-gold-400', value: '#A8842E', textDark: false },
    ]} />

    <div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Semantic</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Swatch name="Success" token="--bq-success" value="#4A7C3B" />
        <Swatch name="Warning" token="--bq-warning" value="#B8832E" />
        <Swatch name="Error"   token="--bq-error"   value="#9A3F2E" />
        <Swatch name="Info"    token="--bq-info"    value="#3A6B7C" />
      </div>
    </div>
  </div>
);

// ─── Typography ───
const TypeRow = ({ label, spec, children, arabic }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    gap: 24,
    paddingBlock: 18,
    borderBottom: '1px dashed var(--bq-paper-200)',
    alignItems: 'baseline',
  }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-700)' }}>{label}</div>
      <div style={{ fontSize: 11, fontFamily: 'var(--bq-font-mono)', color: 'var(--bq-paper-500)' }}>{spec}</div>
    </div>
    <div style={arabic ? { direction: 'rtl', textAlign: 'right' } : {}}>{children}</div>
  </div>
);

const TypographyArtboard = () => (
  <div className="bq-root" style={{ padding: 40, minHeight: '100%' }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600 }}>02 · Foundation</div>
      <h2 className="bq-serif" style={{ fontSize: 42, margin: '6px 0 4px', fontWeight: 500, letterSpacing: -0.5, color: 'var(--bq-paper-800)' }}>Typography</h2>
      <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', maxWidth: 560, margin: 0 }}>
        <strong style={{ color: 'var(--bq-paper-700)' }}>Fraunces</strong> untuk display (warm, editorial),{' '}
        <strong style={{ color: 'var(--bq-paper-700)' }}>Plus Jakarta Sans</strong> untuk UI/body, dan{' '}
        <strong style={{ color: 'var(--bq-paper-700)' }}>Amiri Quran</strong> untuk mushaf — font standar akademis untuk teks Al-Qur'an.
      </p>
    </div>

    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 8 }}>Latin · Display (Fraunces)</div>

      <TypeRow label="Display" spec="64px · 500 · -0.5">
        <span className="bq-serif" style={{ fontSize: 64, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.05, color: 'var(--bq-paper-800)' }}>Baitul Qowwam</span>
      </TypeRow>
      <TypeRow label="H1" spec="48px · 500">
        <span className="bq-serif" style={{ fontSize: 48, fontWeight: 500, lineHeight: 1.1, color: 'var(--bq-paper-800)' }}>Bacalah dengan nama Tuhan-mu</span>
      </TypeRow>
      <TypeRow label="H2" spec="36px · 500">
        <span className="bq-serif" style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.15, color: 'var(--bq-paper-700)' }}>Surah Al-Fātiḥah</span>
      </TypeRow>
      <TypeRow label="H3" spec="22px · 600">
        <span style={{ fontSize: 22, fontWeight: 600, fontFamily: 'var(--bq-font-sans)', color: 'var(--bq-paper-700)' }}>Jadwal Kajian Sabtu Pagi</span>
      </TypeRow>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginTop: 28, marginBottom: 8 }}>Latin · UI (Plus Jakarta Sans)</div>

      <TypeRow label="Body" spec="16px · 400 · 1.55">
        <span style={{ fontSize: 16, color: 'var(--bq-paper-600)' }}>Yayasan Baitul Qowwam adalah lembaga pendidikan dan sosial yang menaungi panti asuhan, pondok pesantren, dan kajian rutin untuk masyarakat luas.</span>
      </TypeRow>
      <TypeRow label="Caption" spec="12px · 500 · 1.2 uppercase">
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-paper-500)' }}>Makkiyyah · 7 ayat</span>
      </TypeRow>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginTop: 28, marginBottom: 8 }}>Arabic (Amiri Quran)</div>

      <TypeRow label="Ayat · Large" spec="56px · rtl · 2.0" arabic>
        <span className="bq-arabic" style={{ fontSize: 56, color: 'var(--bq-paper-800)' }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
      </TypeRow>
      <TypeRow label="Ayat · Base" spec="40px · rtl · 2.0" arabic>
        <span className="bq-arabic" style={{ fontSize: 40, color: 'var(--bq-paper-700)' }}>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</span>
      </TypeRow>
      <TypeRow label="Ayat · Small" spec="24px · rtl" arabic>
        <span className="bq-arabic" style={{ fontSize: 24, color: 'var(--bq-paper-600)' }}>مَٰلِكِ يَوْمِ ٱلدِّينِ</span>
      </TypeRow>
    </div>
  </div>
);

// ─── Spacing / Radius / Shadow ───
const SpacingArtboard = () => {
  const spaces = [
    { name: 'space-1', val: 4 }, { name: 'space-2', val: 8 }, { name: 'space-3', val: 12 },
    { name: 'space-4', val: 16 }, { name: 'space-5', val: 20 }, { name: 'space-6', val: 24 },
    { name: 'space-8', val: 32 }, { name: 'space-10', val: 40 }, { name: 'space-12', val: 48 },
    { name: 'space-16', val: 64 },
  ];
  const radii = [
    { name: 'xs', val: 4 }, { name: 'sm', val: 6 }, { name: 'md', val: 10 },
    { name: 'lg', val: 16 }, { name: 'xl', val: 24 }, { name: 'full', val: 999 },
  ];
  const shadows = [
    { name: 'xs', token: 'var(--bq-shadow-xs)' },
    { name: 'sm', token: 'var(--bq-shadow-sm)' },
    { name: 'md', token: 'var(--bq-shadow-md)' },
    { name: 'lg', token: 'var(--bq-shadow-lg)' },
  ];

  return (
    <div className="bq-root" style={{ padding: 40, minHeight: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600 }}>03 · Foundation</div>
        <h2 className="bq-serif" style={{ fontSize: 42, margin: '6px 0 4px', fontWeight: 500, letterSpacing: -0.5, color: 'var(--bq-paper-800)' }}>Spacing, Radius & Shadows</h2>
        <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', margin: 0 }}>Skala 4px · radius konsisten · shadow rendah-saturasi dengan sedikit kehangatan.</p>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Spacing · 4px base</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {spaces.map(s => (
          <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '100px 60px 1fr', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontFamily: 'var(--bq-font-mono)', color: 'var(--bq-paper-500)' }}>{s.name}</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--bq-font-mono)', color: 'var(--bq-paper-700)' }}>{s.val}px</span>
            <div style={{ height: 12, width: s.val, background: 'var(--bq-brown-300)', borderRadius: 3 }} />
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Radius</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 }}>
        {radii.map(r => (
          <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 72, height: 72, background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: r.val }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--bq-font-mono)', color: 'var(--bq-paper-500)' }}>{r.val === 999 ? '∞' : `${r.val}px`}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Shadow</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {shadows.map(s => (
          <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ width: '100%', height: 72, background: 'var(--bq-paper-50)', borderRadius: 'var(--bq-radius-md)', boxShadow: s.token, border: '1px solid rgba(46,38,25,0.04)' }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>shadow-{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { ColorsArtboard, TypographyArtboard, SpacingArtboard });

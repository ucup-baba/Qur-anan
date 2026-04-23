// Base components: Button, Input, Card, Badge, Tabs

// ─── BUTTON ───
const Button = ({ variant = 'primary', size = 'md', icon, children, iconRight, style, ...rest }) => {
  const base = {
    fontFamily: 'var(--bq-font-sans)',
    fontWeight: 600,
    border: '1px solid transparent',
    borderRadius: 'var(--bq-radius-md)',
    cursor: 'pointer',
    transition: 'all var(--bq-dur-fast) var(--bq-ease)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13, height: 32 },
    md: { padding: '10px 16px', fontSize: 14, height: 40 },
    lg: { padding: '14px 22px', fontSize: 15, height: 48 },
  };
  const variants = {
    primary:   { background: 'var(--bq-brown-400)', color: 'var(--bq-paper-50)', boxShadow: 'var(--bq-shadow-sm)' },
    secondary: { background: 'var(--bq-paper-50)', color: 'var(--bq-paper-700)', borderColor: 'var(--bq-paper-200)' },
    ghost:     { background: 'transparent', color: 'var(--bq-paper-700)' },
    gold:      { background: 'var(--bq-gold-300)', color: 'var(--bq-paper-800)', boxShadow: 'var(--bq-shadow-sm)' },
    outline:   { background: 'transparent', color: 'var(--bq-brown-400)', borderColor: 'var(--bq-brown-400)' },
  };
  return (
    <button {...rest} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {icon && <Icon d={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
      {iconRight && <Icon d={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
};

// ─── INPUT ───
const Input = ({ icon, placeholder, style, value, ...rest }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bq-paper-50)',
    border: '1px solid var(--bq-paper-200)',
    borderRadius: 'var(--bq-radius-md)',
    padding: '10px 14px',
    fontSize: 14,
    color: 'var(--bq-paper-700)',
    transition: 'border-color var(--bq-dur-fast)',
    ...style,
  }}>
    {icon && <Icon d={icon} size={16} style={{ color: 'var(--bq-paper-400)', flexShrink: 0 }} />}
    <input
      value={value}
      placeholder={placeholder}
      {...rest}
      style={{
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        font: 'inherit', color: 'inherit', width: '100%',
      }}
    />
  </div>
);

// ─── CARD ───
const Card = ({ children, hover, style }) => (
  <div style={{
    background: 'var(--bq-paper-50)',
    border: '1px solid var(--bq-paper-200)',
    borderRadius: 'var(--bq-radius-lg)',
    boxShadow: 'var(--bq-shadow-xs)',
    overflow: 'hidden',
    transition: 'all var(--bq-dur-med)',
    ...(hover && { cursor: 'pointer' }),
    ...style,
  }}>{children}</div>
);

// ─── BADGE ───
const Badge = ({ children, tone = 'neutral', style }) => {
  const tones = {
    neutral: { bg: 'var(--bq-paper-100)', fg: 'var(--bq-paper-600)', br: 'var(--bq-paper-200)' },
    gold:    { bg: 'var(--bq-gold-50)',   fg: 'var(--bq-gold-500)',  br: 'var(--bq-gold-200)' },
    brown:   { bg: 'var(--bq-brown-50)',  fg: 'var(--bq-brown-500)', br: 'var(--bq-brown-100)' },
    success: { bg: '#E8F0E3', fg: 'var(--bq-success)', br: '#C6D8BC' },
    warning: { bg: '#F7EAD0', fg: 'var(--bq-warning)', br: '#ECD49E' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px',
      background: t.bg, color: t.fg,
      border: `1px solid ${t.br}`,
      borderRadius: 'var(--bq-radius-full)',
      fontSize: 11, fontWeight: 600,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
};

// ─── SECTION HEADER (shared) ───
const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div style={{ marginBottom: 28 }}>
    {eyebrow && <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600 }}>{eyebrow}</div>}
    <h2 className="bq-serif" style={{ fontSize: 42, margin: '6px 0 4px', fontWeight: 500, letterSpacing: -0.5, color: 'var(--bq-paper-800)' }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', maxWidth: 540, margin: 0 }}>{subtitle}</p>}
  </div>
);

// ─── BASE COMPONENTS ARTBOARD ───
const BaseComponentsArtboard = () => (
  <div className="bq-root" style={{ padding: 40, minHeight: '100%' }}>
    <SectionHeader eyebrow="04 · Components" title="Base Components" subtitle="Primitif yang dipakai berulang di seluruh aplikasi — buttons, input, card, badge. Konsisten dan tidak memaksakan diri." />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      {/* BUTTONS */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Buttons</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary" icon={Icons.Book}>Baca Qur'an</Button>
            <Button variant="secondary">Terjemahan</Button>
            <Button variant="gold" icon={Icons.Heart}>Donasi</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost" icon={Icons.Bookmark}>Ghost</Button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary" iconRight={Icons.ArrowRight}>Large</Button>
          </div>
        </div>
      </div>

      {/* INPUTS */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Inputs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input icon={Icons.Search} placeholder="Cari surah atau ayat…" />
          <Input placeholder="Nama lengkap" />
          <Input icon={Icons.User} placeholder="email@example.com" />
        </div>
      </div>

      {/* BADGES */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Badges</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="neutral">Makkiyyah</Badge>
          <Badge tone="brown">Juz 30</Badge>
          <Badge tone="gold">Populer</Badge>
          <Badge tone="success">Selesai</Badge>
          <Badge tone="warning">Baru</Badge>
        </div>
      </div>

      {/* CARDS */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Cards</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-700)', marginBottom: 4 }}>Default Card</div>
              <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>Bordered · shadow-xs · radius-lg</div>
            </div>
          </Card>
          <Card style={{ background: 'var(--bq-brown-400)', color: 'var(--bq-paper-50)', borderColor: 'transparent' }}>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Filled Card</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Untuk last-read, hero CTA, dll.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { Button, Input, Card, Badge, SectionHeader, BaseComponentsArtboard });

// Yayasan components: DonationCard, ProgramCard, TestimonialCard

// ─── DONATION CARD ───
const DonationCard = ({ title, description, raised, target, donors, urgent }) => {
  const pct = Math.min(100, (raised / target) * 100);
  const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');
  return (
    <div style={{
      background: 'var(--bq-paper-50)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 'var(--bq-radius-lg)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <Placeholder label="foto program" aspect="16/9" style={{ borderRadius: 0 }} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <Badge tone="brown">Donasi</Badge>
            {urgent && <Badge tone="warning">Mendesak</Badge>}
          </div>
          <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>{title}</h3>
          <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0, lineHeight: 1.5 }}>{description}</p>
        </div>
        <div>
          <div style={{ height: 6, background: 'var(--bq-paper-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--bq-gold-300)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--bq-paper-500)' }}>Terkumpul</span>
            <span style={{ color: 'var(--bq-paper-700)', fontWeight: 600 }}>{fmt(raised)} <span style={{ color: 'var(--bq-paper-400)', fontWeight: 400 }}>dari {fmt(target)}</span></span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>
            <strong style={{ color: 'var(--bq-paper-700)' }}>{donors}</strong> donatur
          </div>
          <Button variant="primary" size="sm">Donasi</Button>
        </div>
      </div>
    </div>
  );
};

// ─── PROGRAM CARD ───
const ProgramCard = ({ kind, title, description, date, location }) => (
  <div style={{
    background: 'var(--bq-paper-50)',
    border: '1px solid var(--bq-paper-200)',
    borderRadius: 'var(--bq-radius-lg)',
    padding: 20,
    display: 'flex', flexDirection: 'column', gap: 14,
  }}>
    <Placeholder label="foto kegiatan" aspect="16/10" />
    <div>
      <Badge tone="gold">{kind}</Badge>
    </div>
    <div>
      <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--bq-paper-600)', paddingTop: 4, borderTop: '1px dashed var(--bq-paper-200)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <Icon d={Icons.Clock} size={14} style={{ color: 'var(--bq-paper-400)' }} />
        {date}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon d={Icons.MapPin} size={14} style={{ color: 'var(--bq-paper-400)' }} />
        {location}
      </div>
    </div>
  </div>
);

// ─── TESTIMONIAL CARD ───
const TestimonialCard = ({ quote, name, role }) => (
  <div style={{
    background: 'var(--bq-paper-100)',
    border: '1px solid var(--bq-paper-200)',
    borderRadius: 'var(--bq-radius-lg)',
    padding: 24,
  }}>
    <div className="bq-serif" style={{ fontSize: 48, lineHeight: 0.7, color: 'var(--bq-gold-300)', marginBottom: 4 }}>"</div>
    <p className="bq-serif" style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--bq-paper-700)', margin: '0 0 16px', fontWeight: 400, fontStyle: 'italic' }}>
      {quote}
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--bq-paper-200)' }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: '50%',
        background: 'var(--bq-brown-200)',
        color: 'var(--bq-brown-600)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 13,
      }}>{name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-paper-700)' }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>{role}</div>
      </div>
    </div>
  </div>
);

// ─── YAYASAN ARTBOARD ───
const YayasanComponentsArtboard = () => (
  <div className="bq-root" style={{ padding: 40, minHeight: '100%' }}>
    <SectionHeader eyebrow="06 · Yayasan" title="Yayasan Components" subtitle="Komponen untuk area non-Qur'an: donasi, program, testimoni. Nuansa sama — hangat, tenang, tidak agresif." />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <DonationCard
        title="Renovasi Asrama Panti"
        description="Memperbaiki 12 kamar asrama untuk 48 santri yatim di Cilegon."
        raised={68500000}
        target={120000000}
        donors={214}
        urgent
      />
      <ProgramCard
        kind="Kajian"
        title="Kajian Sabtu Pagi"
        description="Kajian tafsir rutin bersama Ust. Ahmad Faisal setiap pekan, terbuka untuk umum."
        date="Setiap Sabtu · 06:00 WIB"
        location="Masjid Baitul Qowwam"
      />
      <TestimonialCard
        quote="Alhamdulillah, anak saya tumbuh menjadi hafidz yang berakhlak di pesantren Baitul Qowwam. Pengajarannya hangat dan serius."
        name="Siti Hadijah"
        role="Orang tua santri"
      />
    </div>
  </div>
);

Object.assign(window, { DonationCard, ProgramCard, TestimonialCard, YayasanComponentsArtboard });

// ─── YAYASAN PAGE ───
const YayasanPage = () => (
  <div>
    <div style={{ padding: '48px 24px 40px', background: 'var(--bq-paper-100)', borderBottom: '1px solid var(--bq-paper-200)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 10 }}>Yayasan Baitul Qowwam</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }} className="bq-hero-grid">
          <div>
            <h1 className="bq-serif" style={{ fontSize: 52, fontWeight: 500, margin: '0 0 14px', color: 'var(--bq-paper-800)', letterSpacing: -0.8, lineHeight: 1.05 }}>
              Merawat yatim, mendidik hafidz, menerangi ummat.
            </h1>
            <p style={{ fontSize: 16, color: 'var(--bq-paper-600)', margin: '0 0 24px', lineHeight: 1.55, maxWidth: 520 }}>
              Panti asuhan, pondok pesantren, dan kajian terbuka — sejak 2011 kami hadir untuk masyarakat luas dengan niat tulus menegakkan nilai-nilai Qur'ani.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="primary" size="lg" icon={Icons.Heart2} onClick={() => navigate('/donasi')}>Donasi</Button>
              <Button variant="secondary" size="lg" iconRight={Icons.ArrowRight}>Kegiatan</Button>
            </div>
          </div>
          <Placeholder label="foto santri / kajian" aspect="4/3" style={{ borderRadius: 'var(--bq-radius-lg)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--bq-paper-200)' }}>
          {[['14', 'Tahun berdiri'], ['182', 'Santri & yatim'], ['46', 'Hafidz Qur\'an'], ['Rp 2,4M', 'Tersalurkan 2025']].map(([n, l]) => (
            <div key={l}>
              <div className="bq-serif" style={{ fontSize: 36, fontWeight: 500, color: 'var(--bq-paper-800)', letterSpacing: -0.5 }}>{n}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-paper-500)', letterSpacing: 0.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      <SectionHeader eyebrow="Kegiatan" title="Program rutin" subtitle="Terbuka untuk umum." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
        <ProgramCard kind="Kajian" title="Kajian Sabtu Pagi" description="Kajian tafsir rutin bersama Ust. Ahmad Faisal setiap pekan." date="Setiap Sabtu · 06:00 WIB" location="Masjid Baitul Qowwam, Cilegon" />
        <ProgramCard kind="Pesantren" title="Tahfidz Qur'an" description="Program menghafal Al-Qur'an 30 juz untuk santri usia 12–18 tahun." date="Pendaftaran dibuka Juni 2026" location="Pondok Baitul Qowwam" />
        <ProgramCard kind="Sosial" title="Santunan Yatim" description="Santunan rutin 48 anak yatim & dhuafa di lingkungan sekitar." date="Setiap bulan" location="Panti Baitul Qowwam" />
      </div>
      <SectionHeader eyebrow="Testimoni" title="Kata mereka" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <TestimonialCard quote="Alhamdulillah, anak saya tumbuh menjadi hafidz yang berakhlak di pesantren Baitul Qowwam." name="Siti Hadijah" role="Orang tua santri" />
        <TestimonialCard quote="Kajian Sabtu paginya hangat dan substansial. Saya jadi betah mengajak keluarga." name="Rudi Pratama" role="Jamaah kajian" />
        <TestimonialCard quote="Laporan donasinya transparan dan rutin. Saya tenang menitipkan infaq di sini." name="Dewi Anggraini" role="Donatur" />
      </div>
    </div>
  </div>
);

// ─── DONASI PAGE ───
const DonasiPage = () => (
  <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 6 }}>Donasi</div>
      <h1 className="bq-serif" style={{ fontSize: 40, fontWeight: 500, margin: '0 0 8px', color: 'var(--bq-paper-800)', letterSpacing: -0.5 }}>Program yang membutuhkan dukunganmu</h1>
      <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', margin: 0, maxWidth: 600 }}>Setiap rupiah dialirkan langsung ke penerima manfaat. Kami publikasikan laporan bulanan.</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
      <DonationCard title="Renovasi Asrama Panti" description="Memperbaiki 12 kamar asrama untuk 48 santri yatim di Cilegon." raised={68500000} target={120000000} donors={214} urgent />
      <DonationCard title="Beasiswa Tahfidz 2026" description="Biaya hidup & pendidikan 30 santri penghafal Qur'an selama 1 tahun." raised={145000000} target={200000000} donors={387} />
      <DonationCard title="Kitab & Al-Qur'an" description="Pengadaan 500 mushaf dan kitab tafsir untuk perpustakaan pesantren." raised={12300000} target={40000000} donors={89} />
      <DonationCard title="Infaq Bulanan" description="Donasi rutin untuk operasional panti asuhan & pesantren." raised={8500000} target={25000000} donors={142} />
    </div>

    {/* Transfer info */}
    <div style={{ background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', padding: 28 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 8 }}>Transfer Manual</div>
      <h3 className="bq-serif" style={{ fontSize: 24, fontWeight: 500, margin: '0 0 16px', color: 'var(--bq-paper-800)' }}>Rekening Yayasan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {[
          { bank: 'Bank Syariah Indonesia', no: '7123 4567 89', name: 'Yayasan Baitul Qowwam' },
          { bank: 'Bank Muamalat', no: '301 0012 345', name: 'Yayasan Baitul Qowwam' },
          { bank: 'BCA', no: '234 567 8901', name: 'Yayasan Baitul Qowwam' },
        ].map(b => (
          <div key={b.bank} style={{ padding: 16, background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-md)' }}>
            <div style={{ fontSize: 11, color: 'var(--bq-paper-500)', marginBottom: 4, fontWeight: 600 }}>{b.bank}</div>
            <div style={{ fontSize: 18, fontFamily: 'var(--bq-font-mono)', fontWeight: 600, color: 'var(--bq-paper-800)', marginBottom: 2 }}>{b.no}</div>
            <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>a.n. {b.name}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--bq-paper-500)', lineHeight: 1.6 }}>
        Setelah transfer, mohon konfirmasi via WhatsApp <strong>0812-3456-7890</strong> dengan menyertakan bukti transfer agar kami catat sebagai donatur.
      </div>
    </div>
  </div>
);

Object.assign(window, { SholatPage, YayasanPage, DonasiPage });
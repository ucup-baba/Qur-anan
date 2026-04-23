// 4 Preview Layout Variations — all using the same design system,
// but exploring different compositional takes for the home/reading UI.

// ─── Shared chrome helpers ───
const MobileFrame = ({ children, label, width = 320, height = 620 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
    <div style={{
      width, height,
      background: 'var(--bq-paper-50)',
      borderRadius: 28,
      border: '10px solid #1C170F',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--bq-shadow-lg)',
    }}>
      <div className="bq-noscroll" style={{ width: '100%', height: '100%', overflow: 'auto' }}>{children}</div>
    </div>
    {label && <div style={{ fontSize: 11, color: 'var(--bq-paper-500)', fontFamily: 'var(--bq-font-mono)' }}>{label}</div>}
  </div>
);

// ═══════════════════════════════════════════════
// VARIATION 1 — EDITORIAL HOME (desktop)
// Typography-forward, like a quiet morning journal
// ═══════════════════════════════════════════════
const V1EditorialHome = () => (
  <div className="bq-root" style={{ minHeight: '100%', padding: 40, background: 'var(--bq-paper-50)' }}>
    {/* Top Nav */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--bq-radius-sm)', background: 'var(--bq-brown-500)', color: 'var(--bq-gold-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="bq-arabic" style={{ fontSize: 16, lineHeight: 1 }}>ب</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>Qur'anan</div>
          <div style={{ fontSize: 10, color: 'var(--bq-paper-500)', letterSpacing: 1, textTransform: 'uppercase' }}>Baitul Qowwam</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--bq-paper-600)' }}>
        <span style={{ fontWeight: 600, color: 'var(--bq-paper-800)' }}>Baca</span>
        <span>Kajian</span>
        <span>Tentang</span>
        <span>Donasi</span>
      </div>
      <Button variant="secondary" size="sm" icon={Icons.User}>Masuk</Button>
    </div>

    {/* Editorial hero */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid var(--bq-paper-200)' }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 14 }}>
          Ayat Hari Ini · Senin, 22 April 2026
        </div>
        <div className="bq-arabic" style={{ fontSize: 44, color: 'var(--bq-paper-800)', lineHeight: 1.9, marginBottom: 20, textAlign: 'right' }}>
          وَبَشِّرِ ٱلصَّٰبِرِينَ
        </div>
        <p className="bq-serif" style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--bq-paper-700)', margin: '0 0 20px', fontWeight: 400, letterSpacing: -0.2 }}>
          "Dan sampaikanlah kabar gembira kepada orang-orang yang sabar."
        </p>
        <div style={{ fontSize: 13, color: 'var(--bq-paper-500)', marginBottom: 24 }}>
          — Al-Baqarah : 155
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" icon={Icons.Book}>Lanjutkan membaca</Button>
          <Button variant="ghost" icon={Icons.Share}>Bagikan ayat</Button>
        </div>
      </div>
      <LastReadCard surah="Al-Baqarah" ayat="52 dari 286" progress={0.18} />
    </div>

    {/* 3-up */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Lanjutkan</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SurahListItem num={2} name="ٱلْبَقَرَة" transliteration="Al-Baqarah" meaning="Sapi Betina" ayatCount={286} revelation="Madaniyyah" bookmarked />
          <SurahListItem num={36} name="يٰسٓ" transliteration="Yā-Sīn" meaning="Yā Sīn" ayatCount={83} revelation="Makkiyyah" />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Jadwal Sholat · Jakarta</div>
        <div style={{ background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', padding: 18 }}>
          {[['Subuh', '04:32'], ['Dzuhur', '11:54'], ['Ashar', '15:14', true], ['Maghrib', '17:52'], ['Isya', '19:02']].map(([n, t, active]) => (
            <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--bq-paper-200)', fontSize: 13, color: active ? 'var(--bq-brown-500)' : 'var(--bq-paper-600)', fontWeight: active ? 700 : 400 }}>
              <span>{n}</span>
              <span style={{ fontFamily: 'var(--bq-font-mono)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 12 }}>Kajian Sabtu Pagi</div>
        <ProgramCard
          kind="Kajian"
          title="Tafsir Al-Baqarah"
          description="Pekan ini membahas ayat 155–157 tentang keutamaan sabar."
          date="Sabtu, 26 Apr · 06:00"
          location="Masjid Baitul Qowwam"
        />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════
// VARIATION 2 — READING VIEW (desktop, focused)
// Single surah reading experience
// ═══════════════════════════════════════════════
const V2ReadingView = () => (
  <div className="bq-root" style={{ minHeight: '100%', background: 'var(--bq-paper-50)', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
    {/* Sidebar */}
    <div style={{ borderRight: '1px solid var(--bq-paper-200)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bq-paper-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid var(--bq-paper-200)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 'var(--bq-radius-sm)', background: 'var(--bq-brown-500)', color: 'var(--bq-gold-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="bq-arabic" style={{ fontSize: 14, lineHeight: 1 }}>ب</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Qur'anan</div>
      </div>
      <Input icon={Icons.Search} placeholder="Cari surah…" />
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 8 }}>Daftar Surah</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            [1, 'Al-Fātiḥah', 'Pembukaan', 7],
            [2, 'Al-Baqarah', 'Sapi Betina', 286],
            [3, 'Āli \'Imrān', 'Keluarga Imran', 200],
            [4, 'An-Nisā\'', 'Wanita', 176],
            [5, 'Al-Mā\'idah', 'Hidangan', 120],
          ].map(([n, t, m, a], i) => (
            <div key={n} style={{
              display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 8, padding: '8px 10px', borderRadius: 'var(--bq-radius-sm)',
              background: i === 1 ? 'var(--bq-paper-50)' : 'transparent',
              border: i === 1 ? '1px solid var(--bq-paper-200)' : '1px solid transparent',
              cursor: 'pointer',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--bq-font-mono)', color: 'var(--bq-paper-400)' }}>{String(n).padStart(3, '0')}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-paper-800)' }}>{t}</div>
                <div style={{ fontSize: 10, color: 'var(--bq-paper-500)' }}>{m} · {a} ayat</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Reading column */}
    <div style={{ padding: '32px 56px', maxWidth: 780, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 12, color: 'var(--bq-paper-500)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon d={Icons.ChevronLeft} size={14} /> Al-Baqarah · 286 ayat
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" icon={Icons.Volume}>Dengarkan</Button>
          <Button variant="ghost" size="sm" icon={Icons.Bookmark}>Tandai</Button>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '28px 0 24px', borderBottom: '1px solid var(--bq-paper-200)', marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 4 }}>Surah 2 · Madaniyyah</div>
        <div className="bq-arabic" style={{ fontSize: 52, color: 'var(--bq-paper-800)', lineHeight: 1.1, marginBottom: 2 }}>ٱلْبَقَرَة</div>
        <div className="bq-serif" style={{ fontSize: 18, color: 'var(--bq-paper-600)', fontStyle: 'italic' }}>Al-Baqarah · Sapi Betina</div>
      </div>

      <div className="bq-arabic" style={{ fontSize: 40, color: 'var(--bq-paper-800)', textAlign: 'center', marginBottom: 36, lineHeight: 2 }}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AyatCard surah="Al-Baqarah" ayat={1} arabic="الٓمٓ" transliteration="Alif Lām Mīm" translation="Alif Lām Mīm." compact />
        <AyatCard surah="Al-Baqarah" ayat={2} arabic="ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ" transliteration="Żālika l-kitābu lā rayba fīhi hudal lil-muttaqīn" translation="Kitab (Al-Qur'an) ini tidak ada keraguan di dalamnya; petunjuk bagi orang-orang yang bertakwa." compact />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════
// VARIATION 3 — MOBILE HOME
// Mobile-first, focused on last read + quick actions
// ═══════════════════════════════════════════════
const V3MobileHome = () => (
  <div style={{ background: 'var(--bq-paper-100)', minHeight: '100%', padding: 30, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
    <MobileFrame label="Mobile · Home" width={340} height={700}>
      <div className="bq-root" style={{ padding: 20, paddingBottom: 80 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>Assalamu'alaikum,</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bq-paper-800)' }}>Ahmad</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ ...iconBtnStyle, width: 36, height: 36, background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)' }}><Icon d={Icons.Search} size={16} /></button>
            <button style={{ ...iconBtnStyle, width: 36, height: 36, background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)' }}><Icon d={Icons.Bookmark} size={16} /></button>
          </div>
        </div>

        <LastReadCard surah="Al-Baqarah" ayat="52 dari 286" progress={0.18} />

        {/* Quick grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 20, marginBottom: 24 }}>
          {[
            { icon: Icons.Book, label: 'Qur\'an' },
            { icon: Icons.Compass, label: 'Kiblat' },
            { icon: Icons.Clock, label: 'Sholat' },
            { icon: Icons.Sparkle, label: 'Do\'a' },
          ].map(q => (
            <div key={q.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 0', background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-md)' }}>
              <Icon d={q.icon} size={18} style={{ color: 'var(--bq-brown-400)' }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--bq-paper-600)' }}>{q.label}</span>
            </div>
          ))}
        </div>

        {/* Today's prayer */}
        <div style={{ background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-md)', padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-500)' }}>Ashar</span>
            <span style={{ fontSize: 10, color: 'var(--bq-paper-400)' }}>Jakarta</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="bq-serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--bq-paper-800)' }}>15:14</span>
            <span style={{ fontSize: 11, color: 'var(--bq-paper-500)' }}>dalam 2 jam 12 menit</span>
          </div>
        </div>

        {/* Popular surahs */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 10 }}>Populer</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SurahListItem num={36} name="يٰسٓ" transliteration="Yā-Sīn" meaning="Yā Sīn" ayatCount={83} revelation="Makkiyyah" />
          <SurahListItem num={67} name="ٱلْمُلْك" transliteration="Al-Mulk" meaning="Kerajaan" ayatCount={30} revelation="Makkiyyah" />
        </div>
      </div>
      {/* Bottom tab bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bq-paper-50)', borderTop: '1px solid var(--bq-paper-200)',
        padding: '10px 20px', display: 'flex', justifyContent: 'space-around',
      }}>
        {[[Icons.Home, 'Beranda', true], [Icons.Book, 'Baca'], [Icons.Clock, 'Sholat'], [Icons.Heart, 'Yayasan']].map(([icon, label, active]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active ? 'var(--bq-brown-500)' : 'var(--bq-paper-400)' }}>
            <Icon d={icon} size={18} />
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </MobileFrame>
  </div>
);

// ═══════════════════════════════════════════════
// VARIATION 4 — YAYASAN / DONATION PAGE
// The foundation side of the app
// ═══════════════════════════════════════════════
const V4YayasanPage = () => (
  <div className="bq-root" style={{ minHeight: '100%', background: 'var(--bq-paper-50)' }}>
    {/* Hero */}
    <div style={{ padding: '48px 40px 40px', background: 'var(--bq-paper-100)', borderBottom: '1px solid var(--bq-paper-200)' }}>
      <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 10 }}>
        Yayasan Baitul Qowwam
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <h1 className="bq-serif" style={{ fontSize: 52, fontWeight: 500, margin: '0 0 14px', color: 'var(--bq-paper-800)', letterSpacing: -0.8, lineHeight: 1.05 }}>
            Merawat yatim, mendidik hafidz, menerangi ummat.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--bq-paper-600)', margin: '0 0 24px', lineHeight: 1.55, maxWidth: 520 }}>
            Panti asuhan, pondok pesantren, dan kajian terbuka — sejak 2011 kami hadir untuk masyarakat luas dengan niat tulus menegakkan nilai-nilai Qur'ani.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" size="lg" icon={Icons.Heart}>Donasi sekarang</Button>
            <Button variant="secondary" size="lg" iconRight={Icons.ArrowRight}>Tentang kami</Button>
          </div>
        </div>
        <Placeholder label="foto santri / kajian" aspect="4/3" style={{ borderRadius: 'var(--bq-radius-lg)' }} />
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--bq-paper-200)' }}>
        {[['14', 'Tahun berdiri'], ['182', 'Santri & yatim'], ['46', 'Hafidz Qur\'an'], ['Rp 2,4M', 'Tersalurkan 2025']].map(([n, l]) => (
          <div key={l}>
            <div className="bq-serif" style={{ fontSize: 36, fontWeight: 500, color: 'var(--bq-paper-800)', letterSpacing: -0.5 }}>{n}</div>
            <div style={{ fontSize: 12, color: 'var(--bq-paper-500)', letterSpacing: 0.4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Donation programs */}
    <div style={{ padding: '48px 40px' }}>
      <SectionHeader eyebrow="Donasi" title="Program yang membutuhkan dukunganmu" subtitle="Setiap rupiah dialirkan langsung ke penerima manfaat. Kami publikasikan laporan bulanan." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <DonationCard title="Renovasi Asrama Panti" description="Memperbaiki 12 kamar asrama untuk 48 santri yatim di Cilegon." raised={68500000} target={120000000} donors={214} urgent />
        <DonationCard title="Beasiswa Tahfidz 2026" description="Biaya hidup & pendidikan 30 santri penghafal Qur'an selama 1 tahun." raised={145000000} target={200000000} donors={387} />
        <DonationCard title="Kitab & Al-Qur'an" description="Pengadaan 500 mushaf dan kitab tafsir untuk perpustakaan pesantren." raised={12300000} target={40000000} donors={89} />
      </div>
    </div>

    {/* Programs + testimonial */}
    <div style={{ padding: '0 40px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div>
        <SectionHeader eyebrow="Kegiatan" title="Program rutin" subtitle="Terbuka untuk umum." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ProgramCard kind="Kajian" title="Kajian Sabtu Pagi" description="Kajian tafsir rutin bersama Ust. Ahmad Faisal setiap pekan." date="Setiap Sabtu · 06:00 WIB" location="Masjid Baitul Qowwam, Cilegon" />
        </div>
      </div>
      <div>
        <SectionHeader eyebrow="Testimoni" title="Kata mereka" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TestimonialCard quote="Alhamdulillah, anak saya tumbuh menjadi hafidz yang berakhlak di pesantren Baitul Qowwam." name="Siti Hadijah" role="Orang tua santri" />
          <TestimonialCard quote="Kajian Sabtu paginya hangat dan substansial. Saya jadi betah mengajak keluarga." name="Rudi Pratama" role="Jamaah kajian" />
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { V1EditorialHome, V2ReadingView, V3MobileHome, V4YayasanPage });

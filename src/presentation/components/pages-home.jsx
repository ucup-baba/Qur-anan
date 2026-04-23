// Home page, Surah list page

const HomePage = () => {
  const [lastRead, setLastRead] = React.useState(null);
  const [popular, setPopular] = React.useState([]);
  const [ayatOfDay, setAyatOfDay] = React.useState(null);

  React.useEffect(() => {
    setLastRead(Storage.getLastRead());
    API.listSurahs().then(list => {
      // pick popular ones
      const picks = [1, 18, 36, 55, 67, 112].map(n => list.find(s => s.nomor === n)).filter(Boolean);
      setPopular(picks);
    }).catch(() => setPopular([]));

    // Ayat of the day — Al-Baqarah 155 fallback, or pull from Yā-Sīn 9 etc
    API.getSurah(2).then(d => {
      const a = d.ayat.find(a => a.nomorAyat === 155);
      if (a) setAyatOfDay({ surah: d.namaLatin, nomor: 2, ayat: a });
    }).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero: ayat of the day + last read */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'center', marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid var(--bq-paper-200)' }} className="bq-hero-grid">
        <div>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 12 }}>
            Ayat Hari Ini
          </div>
          {ayatOfDay ? (
            <>
              <div className="bq-arabic" style={{ fontSize: 44, color: 'var(--bq-paper-800)', lineHeight: 1.9, marginBottom: 16, textAlign: 'right' }}>
                {ayatOfDay.ayat.teksArab}
              </div>
              <p className="bq-serif" style={{ fontSize: 20, lineHeight: 1.45, color: 'var(--bq-paper-700)', margin: '0 0 14px', fontStyle: 'italic' }}>
                "{ayatOfDay.ayat.teksIndonesia}"
              </p>
              <div style={{ fontSize: 12, color: 'var(--bq-paper-500)', marginBottom: 20 }}>
                — {ayatOfDay.surah} : {ayatOfDay.ayat.nomorAyat}
              </div>
            </>
          ) : (
            <div style={{ padding: 40, background: 'var(--bq-paper-100)', borderRadius: 'var(--bq-radius-lg)', color: 'var(--bq-paper-500)', fontSize: 13 }}>Memuat ayat hari ini…</div>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="primary" icon={Icons.Book} onClick={() => navigate('/quran')}>Baca Qur'an</Button>
            <Button variant="ghost" icon={Icons.Share}>Bagikan</Button>
          </div>
        </div>
        {lastRead ? (
          <div onClick={() => navigate(`/quran/${lastRead.surah}#${lastRead.ayat}`)} style={{ cursor: 'pointer' }}>
            <LastReadCard surah={lastRead.surahName} ayat={`${lastRead.ayat} dari ${lastRead.total}`} progress={lastRead.ayat / lastRead.total} />
          </div>
        ) : (
          <Card style={{ padding: 28, background: 'var(--bq-paper-100)' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 10 }}>Mulai membaca</div>
            <div className="bq-serif" style={{ fontSize: 24, fontWeight: 500, color: 'var(--bq-paper-800)', marginBottom: 8 }}>Belum ada riwayat baca</div>
            <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', marginBottom: 16 }}>Buka surah apa saja, posisi terakhir akan disimpan otomatis.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/quran')} iconRight={Icons.ArrowRight}>Jelajahi surah</Button>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 48 }}>
        {[
          { icon: Icons.Book, label: 'Al-Qur\'an', sub: '114 surah · 30 juz', to: '/quran' },
          { icon: Icons.Clock, label: 'Jadwal Sholat', sub: 'Waktu presisi lokasi', to: '/sholat' },
          { icon: Icons.Compass, label: 'Arah Kiblat', sub: 'Kompas digital', to: '/sholat' },
          { icon: Icons.Sparkle, label: 'Do\'a & Asmaul Husna', sub: '99 nama Allah', to: '/doa' },
        ].map(q => (
          <a key={q.label} href={'#' + q.to} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: 18,
            background: 'var(--bq-paper-50)',
            border: '1px solid var(--bq-paper-200)',
            borderRadius: 'var(--bq-radius-md)',
            textDecoration: 'none',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 'var(--bq-radius-sm)',
              background: 'var(--bq-brown-50)', color: 'var(--bq-brown-500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon d={q.icon} size={20} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--bq-paper-800)' }}>{q.label}</div>
              <div style={{ fontSize: 11, color: 'var(--bq-paper-500)' }}>{q.sub}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Popular surahs */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600 }}>Populer</div>
            <h2 className="bq-serif" style={{ fontSize: 28, fontWeight: 500, margin: '4px 0 0', color: 'var(--bq-paper-800)', letterSpacing: -0.3 }}>Surah yang sering dibaca</h2>
          </div>
          <Button variant="ghost" size="sm" iconRight={Icons.ArrowRight} onClick={() => navigate('/quran')}>Lihat semua</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 10 }}>
          {popular.map(s => (
            <a key={s.nomor} href={`#/quran/${s.nomor}`} style={{ textDecoration: 'none' }}>
              <SurahListItem
                num={s.nomor}
                name={s.nama}
                transliteration={s.namaLatin}
                meaning={s.arti}
                ayatCount={s.jumlahAyat}
                revelation={s.tempatTurun === 'Mekah' ? 'Makkiyyah' : 'Madaniyyah'}
                bookmarked={Storage.isBookmarked(`surah-${s.nomor}`)}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Baitul Qowwam card — subtle */}
      <div style={{
        background: 'var(--bq-paper-700)', color: 'var(--bq-paper-50)',
        borderRadius: 'var(--bq-radius-xl)',
        padding: 40,
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-300)', fontWeight: 600, marginBottom: 10 }}>Yayasan Baitul Qowwam</div>
          <h3 className="bq-serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 8px', letterSpacing: -0.3 }}>
            Merawat yatim, mendidik hafidz.
          </h3>
          <p style={{ fontSize: 14, opacity: 0.75, margin: 0, maxWidth: 520, lineHeight: 1.55 }}>
            Setiap kali Anda membaca Qur'an di sini, Anda juga turut mendukung panti asuhan dan pesantren kami. Kenali lebih dekat.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="gold" icon={Icons.Heart2} onClick={() => navigate('/donasi')}>Donasi</Button>
          <Button variant="secondary" onClick={() => navigate('/yayasan')}>Tentang</Button>
        </div>
      </div>
    </div>
  );
};

// ─── SURAH LIST PAGE ───
const SurahListPage = () => {
  const [surahs, setSurahs] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // all | makkiyyah | madaniyyah | bookmarks
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    API.listSurahs().then(list => { setSurahs(list); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = surahs.filter(s => {
    const matchesQ = !query ||
      s.namaLatin.toLowerCase().includes(query.toLowerCase()) ||
      s.arti.toLowerCase().includes(query.toLowerCase()) ||
      String(s.nomor).includes(query);
    if (!matchesQ) return false;
    if (filter === 'makkiyyah') return s.tempatTurun === 'Mekah';
    if (filter === 'madaniyyah') return s.tempatTurun === 'Madinah';
    if (filter === 'bookmarks') return Storage.isBookmarked(`surah-${s.nomor}`);
    return true;
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 6 }}>Al-Qur'an</div>
        <h1 className="bq-serif" style={{ fontSize: 40, fontWeight: 500, margin: '0 0 8px', color: 'var(--bq-paper-800)', letterSpacing: -0.5 }}>Daftar Surah</h1>
        <p style={{ fontSize: 14, color: 'var(--bq-paper-500)', margin: 0 }}>114 surah · 30 juz · 6236 ayat</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <Input icon={Icons.Search} placeholder="Cari surah, arti, atau nomor…" value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['all', 'Semua'], ['makkiyyah', 'Makkiyyah'], ['madaniyyah', 'Madaniyyah'], ['bookmarks', 'Bookmark']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              padding: '8px 14px', fontSize: 13, fontWeight: 600,
              background: filter === v ? 'var(--bq-brown-400)' : 'var(--bq-paper-50)',
              color: filter === v ? 'var(--bq-paper-50)' : 'var(--bq-paper-600)',
              border: '1px solid ' + (filter === v ? 'var(--bq-brown-400)' : 'var(--bq-paper-200)'),
              borderRadius: 'var(--bq-radius-md)', cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--bq-paper-500)' }}>Memuat daftar surah…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--bq-paper-500)' }}>Tidak ada surah yang cocok.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 8 }}>
          {filtered.map(s => (
            <a key={s.nomor} href={`#/quran/${s.nomor}`} style={{ textDecoration: 'none' }}>
              <SurahListItem
                num={s.nomor}
                name={s.nama}
                transliteration={s.namaLatin}
                meaning={s.arti}
                ayatCount={s.jumlahAyat}
                revelation={s.tempatTurun === 'Mekah' ? 'Makkiyyah' : 'Madaniyyah'}
                bookmarked={Storage.isBookmarked(`surah-${s.nomor}`)}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { HomePage, SurahListPage });

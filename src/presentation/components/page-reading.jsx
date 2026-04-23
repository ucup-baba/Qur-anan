// Reading page — surah detail with ayat, audio, tafsir

const ReadingPage = ({ surahNum }) => {
  const [surah, setSurah] = React.useState(null);
  const [tafsir, setTafsir] = React.useState(null);
  const [english, setEnglish] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [playingAyat, setPlayingAyat] = React.useState(null);
  const [audioRef] = React.useState(React.createRef());
  const [showEng, setShowEng] = React.useState(false);
  const [showTafsir, setShowTafsir] = React.useState(null); // ayat nomor for tafsir expand

  React.useEffect(() => {
    setLoading(true);
    API.getSurah(surahNum).then(d => {
      setSurah(d);
      setLoading(false);
      // store last read
      Storage.setLastRead({ surah: d.nomor, surahName: d.namaLatin, ayat: 1, total: d.jumlahAyat });
    }).catch(() => setLoading(false));
    API.getTafsir(surahNum).then(setTafsir).catch(() => {});
    API.getSurahEnglish(surahNum).then(setEnglish).catch(() => {});
  }, [surahNum]);

  const playAyat = (ayat, audioUrl) => {
    if (playingAyat === ayat.nomorAyat) {
      audioRef.current?.pause();
      setPlayingAyat(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      setPlayingAyat(ayat.nomorAyat);
      Storage.setLastRead({ surah: surah.nomor, surahName: surah.namaLatin, ayat: ayat.nomorAyat, total: surah.jumlahAyat });
    }
  };

  if (loading || !surah) {
    return <div style={{ padding: 80, textAlign: 'center', color: 'var(--bq-paper-500)' }}>Memuat surah…</div>;
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 120px' }}>
      {/* Nav back */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <a href="#/quran" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--bq-paper-500)', textDecoration: 'none' }}>
          <Icon d={Icons.ChevronLeft} size={14} /> Daftar Surah
        </a>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" icon={showEng ? Icons.Check : Icons.Plus} onClick={() => setShowEng(s => !s)}>EN</Button>
          <Button variant="ghost" size="sm" icon={Icons.Bookmark}>Bookmark</Button>
        </div>
      </div>

      {/* Header ornament */}
      <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'><path d='M0 50 L20 30 L40 50 L60 30 L80 50 L100 30 L120 50 L140 30 L160 50 L180 30 L200 50' fill='none' stroke='%23C9A24E' stroke-width='0.5' opacity='0.2'/></svg>")`, backgroundRepeat: 'repeat-x', backgroundPosition: 'center top', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 6 }}>Surah {surah.nomor} · {surah.tempatTurun === 'Mekah' ? 'Makkiyyah' : 'Madaniyyah'} · {surah.jumlahAyat} ayat</div>
          <div className="bq-arabic" style={{ fontSize: 56, color: 'var(--bq-paper-800)', lineHeight: 1.1, marginBottom: 6 }}>{surah.nama}</div>
          <div className="bq-serif" style={{ fontSize: 20, color: 'var(--bq-paper-700)', fontStyle: 'italic', marginBottom: 4 }}>{surah.namaLatin}</div>
          <div style={{ fontSize: 13, color: 'var(--bq-paper-500)' }}>{surah.arti}</div>
        </div>
      </div>

      {/* Bismillah (except An-Nas & At-Taubah) */}
      {surah.nomor !== 9 && (
        <div className="bq-arabic" style={{ fontSize: 42, color: 'var(--bq-paper-800)', textAlign: 'center', marginBottom: 36, lineHeight: 2 }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {/* Ayat list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {surah.ayat.map(a => {
          const engAyat = english?.ayahs?.find(x => x.numberInSurah === a.nomorAyat);
          const tafsirAyat = tafsir?.tafsir?.find(x => x.ayat === a.nomorAyat);
          const isPlaying = playingAyat === a.nomorAyat;
          return (
            <div key={a.nomorAyat} style={{
              background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)',
              borderRadius: 'var(--bq-radius-lg)', padding: 22,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 16, borderBottom: '1px dashed var(--bq-paper-200)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', background: 'var(--bq-brown-50)', borderRadius: 'var(--bq-radius-full)' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bq-brown-400)', color: 'var(--bq-paper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'var(--bq-font-mono)' }}>{a.nomorAyat}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-brown-500)' }}>{surah.namaLatin} : {a.nomorAyat}</span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button onClick={() => playAyat(a, a.audio?.['05'] || a.audio?.['01'])} style={{ ...iconBtnStyle, background: isPlaying ? 'var(--bq-gold-100)' : 'transparent', color: isPlaying ? 'var(--bq-brown-500)' : 'var(--bq-paper-500)' }}><Icon d={isPlaying ? Icons.Pause : Icons.Play} size={14} /></button>
                  <button style={iconBtnStyle}><Icon d={Icons.Bookmark} size={14} /></button>
                  <button style={iconBtnStyle} onClick={() => navigator.clipboard?.writeText(`${a.teksArab}\n\n${a.teksIndonesia}\n— ${surah.namaLatin} : ${a.nomorAyat}`)}><Icon d={Icons.Copy} size={14} /></button>
                  <button style={iconBtnStyle} onClick={() => setShowTafsir(t => t === a.nomorAyat ? null : a.nomorAyat)}><Icon d={Icons.Book} size={14} /></button>
                </div>
              </div>
              <div className="bq-arabic" style={{ fontSize: 40, color: 'var(--bq-paper-800)', textAlign: 'right', marginBottom: 16, lineHeight: 2 }}>
                {a.teksArab}
              </div>
              <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--bq-paper-400)', marginBottom: 10, letterSpacing: 0.2 }}>
                {a.teksLatin}
              </div>
              <div style={{ fontSize: 15, color: 'var(--bq-paper-600)', lineHeight: 1.6 }}>
                {a.teksIndonesia}
              </div>
              {showEng && engAyat && (
                <div style={{ fontSize: 14, color: 'var(--bq-paper-500)', lineHeight: 1.55, marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--bq-paper-200)', fontStyle: 'italic' }}>
                  EN · {engAyat.text}
                </div>
              )}
              {showTafsir === a.nomorAyat && tafsirAyat && (
                <div style={{ marginTop: 14, padding: 14, background: 'var(--bq-gold-50)', border: '1px solid var(--bq-gold-100)', borderRadius: 'var(--bq-radius-md)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-gold-500)', marginBottom: 6 }}>Tafsir · Kemenag</div>
                  <div style={{ fontSize: 13, color: 'var(--bq-paper-700)', lineHeight: 1.65 }}>{tafsirAyat.teks}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Surah nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 10 }}>
        {surah.suratSebelumnya ? (
          <a href={`#/quran/${surah.suratSebelumnya.nomor}`} style={{ flex: 1, padding: 16, background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-md)', textDecoration: 'none', color: 'var(--bq-paper-700)' }}>
            <div style={{ fontSize: 11, color: 'var(--bq-paper-500)', marginBottom: 2 }}>← Sebelumnya</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{surah.suratSebelumnya.namaLatin}</div>
          </a>
        ) : <div style={{ flex: 1 }} />}
        {surah.suratSelanjutnya ? (
          <a href={`#/quran/${surah.suratSelanjutnya.nomor}`} style={{ flex: 1, padding: 16, background: 'var(--bq-paper-100)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-md)', textDecoration: 'none', color: 'var(--bq-paper-700)', textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--bq-paper-500)', marginBottom: 2 }}>Selanjutnya →</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{surah.suratSelanjutnya.namaLatin}</div>
          </a>
        ) : <div style={{ flex: 1 }} />}
      </div>

      {/* Floating player */}
      {playingAyat && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: 'min(480px, calc(100vw - 40px))' }}>
          <AudioPlayer surah={`${surah.namaLatin} : ${playingAyat}`} reciter="Hani ar-Rifa'i" playing />
        </div>
      )}

      <audio ref={audioRef} onEnded={() => setPlayingAyat(null)} style={{ display: 'none' }} />
    </div>
  );
};

Object.assign(window, { ReadingPage });

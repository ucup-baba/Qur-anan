// Qur'an-specific components: SurahListItem, AyatCard, AudioPlayer, JuzNavigation

// ─── SURAH LIST ITEM ───
const SurahListItem = ({ num, name, transliteration, meaning, ayatCount, revelation, bookmarked }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '44px 1fr auto',
    gap: 14,
    alignItems: 'center',
    padding: '14px 16px',
    background: 'var(--bq-paper-50)',
    border: '1px solid var(--bq-paper-200)',
    borderRadius: 'var(--bq-radius-md)',
    cursor: 'pointer',
    transition: 'all var(--bq-dur-fast)',
  }}>
    <div style={{
      width: 44, height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><polygon points='22,2 40,13 40,31 22,42 4,31 4,13' fill='none' stroke='%23C9A24E' stroke-width='1.4'/></svg>")`,
      fontSize: 13, fontWeight: 600,
      color: 'var(--bq-brown-500)',
      fontFamily: 'var(--bq-font-mono)',
    }}>{num}</div>
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--bq-paper-800)' }}>{transliteration}</span>
        <span style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>· {meaning}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>
        {revelation} · {ayatCount} ayat
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {bookmarked && <Icon d={Icons.Bookmark} size={16} style={{ color: 'var(--bq-gold-400)' }} />}
      <span className="bq-arabic" style={{ fontSize: 26, color: 'var(--bq-paper-800)', lineHeight: 1 }}>{name}</span>
    </div>
  </div>
);

// ─── AYAT CARD ───
const AyatCard = ({ surah, ayat, arabic, translation, transliteration, compact }) => (
  <div style={{
    background: 'var(--bq-paper-50)',
    border: '1px solid var(--bq-paper-200)',
    borderRadius: 'var(--bq-radius-lg)',
    padding: compact ? 20 : 28,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingBottom: 14, marginBottom: 18,
      borderBottom: '1px dashed var(--bq-paper-200)',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '4px 10px 4px 4px',
        background: 'var(--bq-brown-50)',
        borderRadius: 'var(--bq-radius-full)',
      }}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--bq-brown-400)', color: 'var(--bq-paper-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, fontFamily: 'var(--bq-font-mono)',
        }}>{ayat}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-brown-500)' }}>{surah} : {ayat}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, color: 'var(--bq-paper-400)' }}>
        <button style={iconBtnStyle}><Icon d={Icons.Play} size={14} /></button>
        <button style={iconBtnStyle}><Icon d={Icons.Bookmark} size={14} /></button>
        <button style={iconBtnStyle}><Icon d={Icons.Copy} size={14} /></button>
        <button style={iconBtnStyle}><Icon d={Icons.Share} size={14} /></button>
      </div>
    </div>

    <div className="bq-arabic" style={{
      fontSize: compact ? 38 : 48,
      color: 'var(--bq-paper-800)',
      textAlign: 'right',
      marginBottom: 20,
      lineHeight: 2,
    }}>
      {arabic}
    </div>

    {transliteration && (
      <div style={{
        fontSize: 13,
        fontStyle: 'italic',
        color: 'var(--bq-paper-400)',
        marginBottom: 10,
        letterSpacing: 0.2,
      }}>{transliteration}</div>
    )}

    <div style={{
      fontSize: compact ? 14 : 16,
      color: 'var(--bq-paper-600)',
      lineHeight: 1.6,
      textWrap: 'pretty',
    }}>{translation}</div>
  </div>
);

const iconBtnStyle = {
  width: 28, height: 28,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: 'var(--bq-radius-sm)',
  cursor: 'pointer',
  color: 'var(--bq-paper-500)',
  transition: 'all var(--bq-dur-fast)',
};

// ─── AUDIO PLAYER (murottal) ───
const AudioPlayer = ({ surah, reciter, progress = 0.35, playing = true, style }) => (
  <div style={{
    background: 'var(--bq-paper-700)',
    color: 'var(--bq-paper-50)',
    borderRadius: 'var(--bq-radius-xl)',
    padding: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: 'var(--bq-shadow-lg)',
    ...style,
  }}>
    <div style={{
      width: 52, height: 52,
      borderRadius: 'var(--bq-radius-md)',
      background: 'linear-gradient(135deg, var(--bq-gold-300), var(--bq-brown-300))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span className="bq-arabic" style={{ fontSize: 24, color: 'var(--bq-paper-800)', lineHeight: 1 }}>قرآن</span>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{surah}</div>
      <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 8 }}>{reciter}</div>
      <div style={{
        height: 3,
        background: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: 'var(--bq-gold-300)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, opacity: 0.65, fontFamily: 'var(--bq-font-mono)' }}>
        <span>01:12</span>
        <span>03:28</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button style={playerBtnStyle}><Icon d={Icons.SkipBack} size={16} /></button>
      <button style={{ ...playerBtnStyle, width: 44, height: 44, background: 'var(--bq-gold-300)', color: 'var(--bq-paper-800)' }}>
        <Icon d={playing ? Icons.Pause : Icons.Play} size={18} />
      </button>
      <button style={playerBtnStyle}><Icon d={Icons.SkipForward} size={16} /></button>
    </div>
  </div>
);

const playerBtnStyle = {
  width: 36, height: 36,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent', border: 'none', borderRadius: '50%',
  color: 'var(--bq-paper-50)', cursor: 'pointer',
};

// ─── LAST READ CARD ───
const LastReadCard = ({ surah, ayat, progress = 0.18 }) => (
  <div style={{
    background: 'linear-gradient(135deg, var(--bq-brown-500), var(--bq-brown-400))',
    color: 'var(--bq-paper-50)',
    borderRadius: 'var(--bq-radius-lg)',
    padding: 22,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', right: -20, top: -20,
      width: 140, height: 140,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(201,162,78,0.25), transparent 70%)',
    }} />
    <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 14, fontWeight: 600 }}>
      Terakhir dibaca
    </div>
    <div className="bq-serif" style={{ fontSize: 26, fontWeight: 500, marginBottom: 2 }}>
      {surah}
    </div>
    <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 18 }}>Ayat {ayat}</div>
    <div style={{
      height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 6,
    }}>
      <div style={{ width: `${progress * 100}%`, height: '100%', background: 'var(--bq-gold-300)', borderRadius: 2 }} />
    </div>
    <div style={{ fontSize: 11, opacity: 0.65, fontFamily: 'var(--bq-font-mono)' }}>{Math.round(progress * 100)}% selesai</div>
  </div>
);

// ─── QUR'AN COMPONENTS ARTBOARD ───
const QuranComponentsArtboard = () => (
  <div className="bq-root" style={{ padding: 40, minHeight: '100%' }}>
    <SectionHeader eyebrow="05 · Qur'an" title="Qur'an Components" subtitle="Komponen khusus untuk pengalaman membaca. Typography Arab diutamakan — UI chrome mundur ke latar." />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      {/* SURAH LIST */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Surah List Item</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SurahListItem num={1} name="ٱلْفَاتِحَة" transliteration="Al-Fātiḥah" meaning="Pembukaan" ayatCount={7} revelation="Makkiyyah" bookmarked />
          <SurahListItem num={2} name="ٱلْبَقَرَة" transliteration="Al-Baqarah" meaning="Sapi Betina" ayatCount={286} revelation="Madaniyyah" />
          <SurahListItem num={36} name="يٰسٓ" transliteration="Yā-Sīn" meaning="Yā Sīn" ayatCount={83} revelation="Makkiyyah" />
        </div>
      </div>

      {/* LAST READ + PLAYER */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Last Read & Player</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <LastReadCard surah="Al-Baqarah" ayat="52 dari 286" progress={0.18} />
          <AudioPlayer surah="Surah Al-Mulk" reciter="Mishary Rashid Alafasy" playing />
        </div>
      </div>
    </div>

    {/* AYAT CARD */}
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-paper-500)', marginBottom: 14 }}>Ayat Card</div>
      <AyatCard
        surah="Al-Fātiḥah"
        ayat={2}
        arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
        transliteration="Al-ḥamdu lillāhi rabbi l-'ālamīn"
        translation="Segala puji bagi Allah, Tuhan seluruh alam."
      />
    </div>
  </div>
);

Object.assign(window, { SurahListItem, AyatCard, AudioPlayer, LastReadCard, QuranComponentsArtboard });

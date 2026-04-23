// App shell — top nav, footer, layout wrapper

const NAV_ITEMS = [
  { path: '/',         label: 'Beranda' },
  { path: '/quran',    label: 'Baca Qur\'an' },
  { path: '/sholat',   label: 'Sholat' },
  { path: '/yayasan',  label: 'Yayasan' },
  { path: '/donasi',   label: 'Donasi' },
];

const Logo = () => (
  <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
    <div style={{
      width: 36, height: 36, borderRadius: 'var(--bq-radius-sm)',
      background: 'var(--bq-brown-500)', color: 'var(--bq-gold-200)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span className="bq-arabic" style={{ fontSize: 18, lineHeight: 1 }}>ب</span>
    </div>
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>Qur'anan</div>
      <div style={{ fontSize: 9, color: 'var(--bq-paper-500)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Baitul Qowwam</div>
    </div>
  </a>
);

const TopNav = ({ route }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isActive = (p) => p === '/' ? route === '/' : route.startsWith(p);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(251,248,242,0.88)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--bq-paper-200)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <Logo />
        <nav className="bq-nav-desktop" style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}>
          {NAV_ITEMS.map(item => (
            <a key={item.path} href={'#' + item.path} style={{
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: isActive(item.path) ? 700 : 500,
              color: isActive(item.path) ? 'var(--bq-paper-800)' : 'var(--bq-paper-600)',
              background: isActive(item.path) ? 'var(--bq-paper-100)' : 'transparent',
              borderRadius: 'var(--bq-radius-sm)',
              textDecoration: 'none',
            }}>{item.label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="ghost" size="sm" icon={Icons.Search} onClick={() => navigate('/quran')}>Cari</Button>
          <LoginButton />
          <button className="bq-nav-mobile-toggle" onClick={() => setMobileOpen(o => !o)} style={{
            display: 'none', width: 40, height: 40, border: '1px solid var(--bq-paper-200)',
            background: 'var(--bq-paper-50)', borderRadius: 'var(--bq-radius-sm)',
            cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={mobileOpen ? Icons.X : Icons.Menu} size={18} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div style={{ padding: '8px 24px 16px', borderTop: '1px solid var(--bq-paper-200)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <a key={item.path} href={'#' + item.path} onClick={() => setMobileOpen(false)} style={{
              padding: '12px 14px', fontSize: 14,
              fontWeight: isActive(item.path) ? 700 : 500,
              color: isActive(item.path) ? 'var(--bq-paper-800)' : 'var(--bq-paper-600)',
              background: isActive(item.path) ? 'var(--bq-paper-100)' : 'transparent',
              borderRadius: 'var(--bq-radius-sm)', textDecoration: 'none',
            }}>{item.label}</a>
          ))}
        </div>
      )}
    </header>
  );
};

// Google Sign-In placeholder (Firebase Auth — UI only)
const LoginButton = () => {
  const [user, setUser] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('bq:user') || 'null'); } catch { return null; }
  });
  const [open, setOpen] = React.useState(false);
  const signIn = () => {
    // UI-only demo; in production this calls Firebase Auth with Google provider
    const mock = { name: 'Ahmad Fauzan', email: 'ahmad@gmail.com', avatar: 'AF' };
    setUser(mock);
    localStorage.setItem('bq:user', JSON.stringify(mock));
    setOpen(false);
  };
  const signOut = () => { setUser(null); localStorage.removeItem('bq:user'); setOpen(false); };

  if (!user) return (
    <>
      <Button variant="secondary" size="sm" icon={Icons.User} onClick={() => setOpen(true)}>Masuk</Button>
      {open && <SignInModal onClose={() => setOpen(false)} onSignIn={signIn} />}
    </>
  );
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--bq-brown-200)', color: 'var(--bq-brown-600)',
        border: '1px solid var(--bq-paper-200)', fontWeight: 700, fontSize: 12,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{user.avatar}</button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 220,
          background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)',
          borderRadius: 'var(--bq-radius-md)', boxShadow: 'var(--bq-shadow-lg)', padding: 6, zIndex: 100,
        }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--bq-paper-200)', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: 'var(--bq-paper-500)' }}>{user.email}</div>
          </div>
          <a href="#/bookmarks" onClick={() => setOpen(false)} style={dropItemStyle}>Bookmark saya</a>
          <a href="#/" onClick={signOut} style={dropItemStyle}>Keluar</a>
        </div>
      )}
    </div>
  );
};

const dropItemStyle = {
  display: 'block', padding: '8px 12px', fontSize: 13,
  color: 'var(--bq-paper-700)', textDecoration: 'none',
  borderRadius: 'var(--bq-radius-sm)',
};

const SignInModal = ({ onClose, onSignIn }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, background: 'rgba(28, 23, 15, 0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    padding: 20,
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background: 'var(--bq-paper-50)', borderRadius: 'var(--bq-radius-lg)',
      padding: 32, maxWidth: 380, width: '100%', boxShadow: 'var(--bq-shadow-lg)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--bq-radius-md)',
          background: 'var(--bq-brown-500)', color: 'var(--bq-gold-200)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <span className="bq-arabic" style={{ fontSize: 28, lineHeight: 1 }}>ب</span>
        </div>
        <h2 className="bq-serif" style={{ fontSize: 24, fontWeight: 500, margin: '0 0 6px', color: 'var(--bq-paper-800)' }}>Masuk ke Qur'anan</h2>
        <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0 }}>Sinkronkan bookmark & last read antar device</p>
      </div>
      <button onClick={onSignIn} style={{
        width: '100%', padding: '12px 16px',
        background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-300)',
        borderRadius: 'var(--bq-radius-md)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        fontSize: 14, fontWeight: 600, color: 'var(--bq-paper-700)',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Lanjutkan dengan Google
      </button>
      <div style={{ fontSize: 11, color: 'var(--bq-paper-400)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
        Dengan masuk, Anda menyetujui Syarat &amp; Ketentuan dan Kebijakan Privasi kami.
      </div>
    </div>
  </div>
);

// Footer
const Footer = () => (
  <footer style={{ background: 'var(--bq-paper-700)', color: 'var(--bq-paper-200)', marginTop: 64, padding: '48px 24px 24px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--bq-radius-sm)', background: 'var(--bq-gold-300)', color: 'var(--bq-paper-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="bq-arabic" style={{ fontSize: 16, lineHeight: 1 }}>ب</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bq-paper-50)' }}>Qur'anan</div>
              <div style={{ fontSize: 10, color: 'var(--bq-paper-400)', letterSpacing: 1 }}>BAITUL QOWWAM</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--bq-paper-300)', lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
            Membaca Qur'an, mengenal yayasan, menebar manfaat. Dari keluarga besar Baitul Qowwam untuk ummat.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-400)', marginBottom: 12 }}>Jelajahi</div>
          {['Beranda', 'Baca Qur\'an', 'Jadwal Sholat', 'Do\'a Harian', 'Asmaul Husna'].map(x => <div key={x} style={{ fontSize: 13, padding: '4px 0', color: 'var(--bq-paper-200)' }}>{x}</div>)}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-400)', marginBottom: 12 }}>Yayasan</div>
          {['Tentang Kami', 'Program', 'Donasi', 'Laporan', 'Kontak'].map(x => <div key={x} style={{ fontSize: 13, padding: '4px 0', color: 'var(--bq-paper-200)' }}>{x}</div>)}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--bq-paper-400)', marginBottom: 12 }}>Kontak</div>
          <div style={{ fontSize: 13, color: 'var(--bq-paper-200)', lineHeight: 1.7 }}>
            Jl. Baitul Qowwam No. 1<br/>
            Cilegon, Banten<br/>
            info@baitulqowwam.or.id
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 11, color: 'var(--bq-paper-400)' }}>
        <div>© 2026 Yayasan Baitul Qowwam · Semua hak dilindungi</div>
        <div>Qur'an data: equran.id &amp; alquran.cloud</div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { TopNav, Footer, Logo });

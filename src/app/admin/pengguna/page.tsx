'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon, Icons } from '@/presentation/components/icons';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useToast } from '@/presentation/components/ui/Toast';
import { UserAvatar } from '@/presentation/components/ui/UserAvatar';
import {
  listUsers,
  setUserRole,
  setUserBlocked,
  deleteUserAccount,
  type AdminListedUser,
} from '@/infrastructure/firebase/adminApi';

type FilterRole = 'all' | 'super-admin' | 'admin' | 'user' | 'blocked';

const ROLE_META: Record<AdminListedUser['role'], { label: string; tone: string; icon: typeof Icons.User }> = {
  'super-admin': {
    label: 'Super Admin',
    tone: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
    icon: Icons.Crown,
  },
  admin: {
    label: 'Admin',
    tone: 'bg-[var(--bq-brown-500)] text-white',
    icon: Icons.ShieldCheck,
  },
  user: {
    label: 'Pengguna',
    tone: 'bg-[var(--bq-paper-200)] text-[var(--bq-paper-700)]',
    icon: Icons.User,
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}j lalu`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}h lalu`;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ConfirmAction {
  title: string;
  description: string;
  confirmLabel: string;
  tone: 'danger' | 'warning' | 'primary';
  onConfirm: () => Promise<void>;
}

export default function AdminPenggunaPage() {
  const { user: currentUser, isSuperAdmin, refreshRole } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<AdminListedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterRole>('all');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [pendingUid, setPendingUid] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listUsers();
      setUsers(result.users);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal memuat data pengguna.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'super-admin').length;
    const blocked = users.filter((u) => u.disabled).length;
    const last7d = users.filter((u) => {
      if (!u.lastSignIn) return false;
      const d = new Date(u.lastSignIn).getTime();
      return Date.now() - d < 7 * 24 * 60 * 60 * 1000;
    }).length;
    return { total, admins, blocked, last7d };
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (filter === 'blocked') list = list.filter((u) => u.disabled);
    else if (filter !== 'all') list = list.filter((u) => u.role === filter);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.displayName?.toLowerCase().includes(q) ||
          u.uid.toLowerCase().includes(q)
      );
    }
    // Sort: super-admin > admin > user, blocked last within same role
    return [...list].sort((a, b) => {
      if (a.disabled !== b.disabled) return a.disabled ? 1 : -1;
      const order = { 'super-admin': 0, admin: 1, user: 2 } as const;
      if (order[a.role] !== order[b.role]) return order[a.role] - order[b.role];
      const ad = a.lastSignIn ? new Date(a.lastSignIn).getTime() : 0;
      const bd = b.lastSignIn ? new Date(b.lastSignIn).getTime() : 0;
      return bd - ad;
    });
  }, [users, filter, search]);

  const runAction = async (uid: string, fn: () => Promise<void>, successMsg: string) => {
    setPendingUid(uid);
    try {
      await fn();
      toast.show(successMsg, 'success');
      if (uid === currentUser?.uid) {
        await refreshRole();
      }
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Tindakan gagal.';
      toast.show(msg, 'error');
    } finally {
      setPendingUid(null);
      setConfirmAction(null);
    }
  };

  const promoteToAdmin = (u: AdminListedUser) => {
    setConfirmAction({
      title: `Jadikan admin?`,
      description: `${u.displayName ?? u.email} akan mendapatkan akses penuh ke panel admin (banner, berita, donasi).`,
      confirmLabel: 'Jadikan Admin',
      tone: 'primary',
      onConfirm: () => runAction(u.uid, () => setUserRole(u.uid, 'admin'), 'Pengguna sekarang menjadi admin.'),
    });
  };

  const demoteToUser = (u: AdminListedUser) => {
    setConfirmAction({
      title: `Cabut akses admin?`,
      description: `${u.displayName ?? u.email} akan kehilangan semua akses admin dan kembali menjadi pengguna biasa.`,
      confirmLabel: 'Cabut Akses',
      tone: 'warning',
      onConfirm: () => runAction(u.uid, () => setUserRole(u.uid, 'user'), 'Akses admin dicabut.'),
    });
  };

  const blockUser = (u: AdminListedUser) => {
    setConfirmAction({
      title: `Blokir akun?`,
      description: `${u.displayName ?? u.email} tidak akan bisa login. Akun tetap ada dan bisa di-unblok kapan saja.`,
      confirmLabel: 'Blokir Akun',
      tone: 'warning',
      onConfirm: () => runAction(u.uid, () => setUserBlocked(u.uid, true), 'Akun diblokir.'),
    });
  };

  const unblockUser = (u: AdminListedUser) => {
    setConfirmAction({
      title: `Buka blokir?`,
      description: `${u.displayName ?? u.email} akan bisa login kembali ke aplikasi.`,
      confirmLabel: 'Buka Blokir',
      tone: 'primary',
      onConfirm: () => runAction(u.uid, () => setUserBlocked(u.uid, false), 'Akun dibuka kembali.'),
    });
  };

  const deleteUser = (u: AdminListedUser) => {
    setConfirmAction({
      title: `Hapus akun permanen?`,
      description: `Akun ${u.displayName ?? u.email} dan semua datanya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`,
      confirmLabel: 'Hapus Permanen',
      tone: 'danger',
      onConfirm: () => runAction(u.uid, () => deleteUserAccount(u.uid), 'Akun dihapus permanen.'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--bq-brown-500)] to-[var(--bq-brown-700)] text-white flex items-center justify-center shadow-lg">
            <Icon d={Icons.Users} size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--bq-paper-800)] leading-tight">Pengguna & Akses</h1>
            <p className="text-sm text-[var(--bq-paper-500)]">Kelola pengguna, blokir, dan tetapkan admin baru.</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Pengguna" value={stats.total} icon={Icons.Users} accent="from-[var(--bq-brown-400)] to-[var(--bq-brown-600)]" />
        <StatCard label="Admin" value={stats.admins} icon={Icons.ShieldCheck} accent="from-amber-400 to-amber-600" />
        <StatCard label="Aktif 7 Hari" value={stats.last7d} icon={Icons.UserCheck} accent="from-emerald-400 to-emerald-600" />
        <StatCard label="Diblokir" value={stats.blocked} icon={Icons.Ban} accent="from-rose-400 to-rose-600" />
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--bq-paper-400)] pointer-events-none">
            <Icon d={Icons.Search} size={16} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau UID..."
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] focus:outline-none focus:border-[var(--bq-brown-400)] focus:bg-white transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'super-admin', 'admin', 'user', 'blocked'] as FilterRole[]).map((f) => {
            const labels: Record<FilterRole, string> = {
              all: 'Semua',
              'super-admin': 'Super Admin',
              admin: 'Admin',
              user: 'Pengguna',
              blocked: 'Diblokir',
            };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-[var(--bq-brown-500)] text-white shadow-sm'
                    : 'bg-[var(--bq-paper-50)] text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-100)]'
                }`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <Icon d={Icons.AlertCircle} size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-red-900">Gagal memuat data</div>
            <div className="text-xs text-red-700 mt-0.5 break-words">{error}</div>
            <button onClick={load} className="text-xs font-bold text-red-700 hover:underline mt-2">
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-4 flex items-center gap-3">
              <div className="bq-skeleton w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="bq-skeleton h-3.5 w-32 rounded mb-2" />
                <div className="bq-skeleton h-3 w-48 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white border-2 border-dashed border-[var(--bq-paper-200)] rounded-2xl py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bq-paper-100)] mx-auto mb-3 flex items-center justify-center">
            <Icon d={Icons.Users} size={28} style={{ color: 'var(--bq-paper-400)' }} />
          </div>
          <div className="text-sm font-semibold text-[var(--bq-paper-700)] mb-1">Tidak ada pengguna</div>
          <div className="text-xs text-[var(--bq-paper-500)]">
            {search || filter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian.' : 'Belum ada pengguna yang terdaftar.'}
          </div>
        </div>
      )}

      {/* User list */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((u) => (
            <UserRow
              key={u.uid}
              user={u}
              isCurrent={u.uid === currentUser?.uid}
              isPending={pendingUid === u.uid}
              isSuperAdmin={isSuperAdmin}
              onPromote={() => promoteToAdmin(u)}
              onDemote={() => demoteToUser(u)}
              onBlock={() => blockUser(u)}
              onUnblock={() => unblockUser(u)}
              onDelete={() => deleteUser(u)}
            />
          ))}
        </div>
      )}

      {/* Confirm modal */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction}
          pending={pendingUid !== null}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Icons.User;
  accent: string;
}) {
  return (
    <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-4 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${accent} opacity-15 group-hover:opacity-25 transition-opacity`} />
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accent} text-white flex items-center justify-center mb-3 shadow-sm relative z-10`}>
        <Icon d={icon} size={18} />
      </div>
      <div className="text-2xl font-bold text-[var(--bq-paper-800)] tracking-tight relative z-10">{value}</div>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--bq-paper-500)] mt-0.5 relative z-10">
        {label}
      </div>
    </div>
  );
}

function UserRow({
  user,
  isCurrent,
  isPending,
  isSuperAdmin,
  onPromote,
  onDemote,
  onBlock,
  onUnblock,
  onDelete,
}: {
  user: AdminListedUser;
  isCurrent: boolean;
  isPending: boolean;
  isSuperAdmin: boolean;
  onPromote: () => void;
  onDemote: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[user.role];
  const protectedAccount = user.isBootstrapAdmin || isCurrent;

  return (
    <div
      className={`bg-white border rounded-2xl transition-all ${
        user.disabled ? 'border-rose-200 bg-rose-50/30' : 'border-[var(--bq-paper-200)] hover:border-[var(--bq-brown-300)] hover:shadow-sm'
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="relative shrink-0">
          <UserAvatar
            photoURL={user.photoURL}
            displayName={user.displayName}
            size={48}
            style={{
              border: '2px solid var(--bq-paper-200)',
              opacity: user.disabled ? 0.5 : 1,
              filter: user.disabled ? 'grayscale(0.5)' : 'none',
            }}
          />
          {user.role === 'super-admin' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md ring-2 ring-white">
              <Icon d={Icons.Crown} size={11} style={{ color: 'white' }} />
            </div>
          )}
          {user.disabled && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow-md ring-2 ring-white">
              <Icon d={Icons.Ban} size={11} style={{ color: 'white' }} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[var(--bq-paper-800)] truncate">
              {user.displayName ?? '(Tanpa nama)'}
            </span>
            {isCurrent && (
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--bq-brown-100)] text-[var(--bq-brown-700)] font-bold">
                Anda
              </span>
            )}
            <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${meta.tone}`}>
              <Icon d={meta.icon} size={10} />
              {meta.label}
            </span>
          </div>
          <div className="text-xs text-[var(--bq-paper-500)] truncate mt-0.5">
            {user.email ?? user.uid}
          </div>
          <div className="text-[10px] text-[var(--bq-paper-400)] mt-0.5 flex items-center gap-2">
            <span title={`Bergabung ${new Date(user.createdAt).toLocaleDateString('id-ID')}`}>
              Login terakhir: {formatDate(user.lastSignIn)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isPending ? (
            <div className="w-9 h-9 flex items-center justify-center">
              <div className="animate-spin w-4 h-4 rounded-full border-2 border-[var(--bq-paper-200)] border-t-[var(--bq-brown-500)]" />
            </div>
          ) : protectedAccount ? (
            <span className="text-[10px] font-semibold text-[var(--bq-paper-400)] px-2 py-1 rounded bg-[var(--bq-paper-100)]">
              {user.isBootstrapAdmin ? 'Terlindung' : 'Akun Anda'}
            </span>
          ) : (
            <button
              onClick={() => setOpen((v) => !v)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-[var(--bq-paper-500)] hover:bg-[var(--bq-paper-100)] hover:text-[var(--bq-paper-800)] transition-colors ${
                open ? 'bg-[var(--bq-paper-100)] text-[var(--bq-paper-800)]' : ''
              }`}
              aria-label="Aksi"
            >
              <Icon d={Icons.MoreVertical} size={18} />
            </button>
          )}
        </div>
      </div>

      {open && !protectedAccount && (
        <div className="border-t border-[var(--bq-paper-100)] p-2 flex flex-wrap gap-1.5">
          {isSuperAdmin && user.role === 'user' && !user.disabled && (
            <ActionPill icon={Icons.Crown} label="Jadikan Admin" tone="primary" onClick={() => { onPromote(); setOpen(false); }} />
          )}
          {isSuperAdmin && user.role === 'admin' && (
            <ActionPill icon={Icons.UserX} label="Cabut Admin" tone="warning" onClick={() => { onDemote(); setOpen(false); }} />
          )}
          {!user.disabled ? (
            <ActionPill icon={Icons.Ban} label="Blokir" tone="warning" onClick={() => { onBlock(); setOpen(false); }} />
          ) : (
            <ActionPill icon={Icons.UserCheck} label="Buka Blokir" tone="primary" onClick={() => { onUnblock(); setOpen(false); }} />
          )}
          {isSuperAdmin && (
            <ActionPill icon={Icons.Trash2} label="Hapus" tone="danger" onClick={() => { onDelete(); setOpen(false); }} />
          )}
        </div>
      )}
    </div>
  );
}

function ActionPill({
  icon,
  label,
  tone,
  onClick,
}: {
  icon: typeof Icons.User;
  label: string;
  tone: 'primary' | 'warning' | 'danger';
  onClick: () => void;
}) {
  const tones: Record<typeof tone, string> = {
    primary: 'bg-[var(--bq-brown-50)] text-[var(--bq-brown-700)] hover:bg-[var(--bq-brown-100)]',
    warning: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tones[tone]}`}
    >
      <Icon d={icon} size={13} />
      {label}
    </button>
  );
}

function ConfirmModal({
  action,
  pending,
  onCancel,
}: {
  action: ConfirmAction;
  pending: boolean;
  onCancel: () => void;
}) {
  const tones = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    primary: 'bg-[var(--bq-brown-500)] hover:bg-[var(--bq-brown-600)] text-white',
  };
  const iconBg = {
    danger: 'from-rose-400 to-rose-600',
    warning: 'from-amber-400 to-amber-600',
    primary: 'from-[var(--bq-brown-400)] to-[var(--bq-brown-600)]',
  };
  const iconKey = action.tone === 'danger' ? Icons.Trash2 : action.tone === 'warning' ? Icons.AlertCircle : Icons.ShieldCheck;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-md flex items-center justify-center p-4"
      style={{ animation: 'bq-fade-in 0.2s ease' }}
      onClick={pending ? undefined : onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl"
        style={{ animation: 'bq-slide-up 0.28s cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconBg[action.tone]} text-white flex items-center justify-center mb-4 shadow-lg`}>
          <Icon d={iconKey} size={26} />
        </div>
        <h3 className="text-lg font-bold text-[var(--bq-paper-800)] mb-2">{action.title}</h3>
        <p className="text-sm text-[var(--bq-paper-500)] leading-relaxed mb-6">{action.description}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={pending}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-100)] transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => action.onConfirm()}
            disabled={pending}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 inline-flex items-center gap-2 ${tones[action.tone]}`}
          >
            {pending && <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
            {action.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

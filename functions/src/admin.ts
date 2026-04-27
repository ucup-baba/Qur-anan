import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';

const BOOTSTRAP_ADMIN_EMAIL = 'baitulqowwam123@gmail.com';

function assertAdmin(request: CallableRequest): void {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Harus login terlebih dahulu.');
  }
  const claims = request.auth.token;
  const isClaimAdmin = claims.role === 'admin' || claims.role === 'super-admin';
  const isBootstrapAdmin = claims.email_verified === true && claims.email === BOOTSTRAP_ADMIN_EMAIL;
  if (!isClaimAdmin && !isBootstrapAdmin) {
    throw new HttpsError('permission-denied', 'Hanya admin yang dapat melakukan tindakan ini.');
  }
}

function assertSuperAdmin(request: CallableRequest): void {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Harus login terlebih dahulu.');
  }
  const claims = request.auth.token;
  const isSuperClaim = claims.role === 'super-admin';
  const isBootstrapAdmin = claims.email_verified === true && claims.email === BOOTSTRAP_ADMIN_EMAIL;
  if (!isSuperClaim && !isBootstrapAdmin) {
    throw new HttpsError('permission-denied', 'Hanya super-admin yang dapat melakukan tindakan ini.');
  }
}

interface ListedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'super-admin' | 'admin' | 'user';
  disabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastSignIn: string | null;
  isBootstrapAdmin: boolean;
}

export const listUsers = onCall<{ pageToken?: string }>(async (request) => {
  assertAdmin(request);
  const auth = getAuth();
  const result = await auth.listUsers(1000, request.data?.pageToken);

  const users: ListedUser[] = result.users.map((u) => {
    const claims = (u.customClaims ?? {}) as Record<string, unknown>;
    const role = claims.role as ListedUser['role'] | undefined;
    const isBootstrap = u.email === BOOTSTRAP_ADMIN_EMAIL && u.emailVerified;
    return {
      uid: u.uid,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      photoURL: u.photoURL ?? null,
      role: role ?? (isBootstrap ? 'super-admin' : 'user'),
      disabled: u.disabled,
      emailVerified: u.emailVerified,
      createdAt: u.metadata.creationTime,
      lastSignIn: u.metadata.lastSignInTime || null,
      isBootstrapAdmin: isBootstrap,
    };
  });

  return {
    users,
    nextPageToken: result.pageToken ?? null,
  };
});

export const setUserRole = onCall<{ uid: string; role: 'admin' | 'user' }>(async (request) => {
  assertSuperAdmin(request);
  const { uid, role } = request.data ?? {};
  if (!uid || (role !== 'admin' && role !== 'user')) {
    throw new HttpsError('invalid-argument', 'uid dan role wajib diisi (admin/user).');
  }
  if (uid === request.auth?.uid) {
    throw new HttpsError('failed-precondition', 'Tidak bisa mengubah role akun sendiri.');
  }

  const auth = getAuth();
  const target = await auth.getUser(uid);
  if (target.email === BOOTSTRAP_ADMIN_EMAIL) {
    throw new HttpsError('failed-precondition', 'Tidak bisa mengubah role super-admin utama.');
  }

  const existing = (target.customClaims ?? {}) as Record<string, unknown>;
  const nextClaims: Record<string, unknown> = { ...existing };
  if (role === 'user') {
    delete nextClaims.role;
  } else {
    nextClaims.role = role;
  }

  await auth.setCustomUserClaims(uid, nextClaims);
  await auth.revokeRefreshTokens(uid);

  return { success: true, uid, role };
});

export const setUserBlocked = onCall<{ uid: string; disabled: boolean }>(async (request) => {
  assertAdmin(request);
  const { uid, disabled } = request.data ?? {};
  if (!uid || typeof disabled !== 'boolean') {
    throw new HttpsError('invalid-argument', 'uid dan disabled wajib diisi.');
  }
  if (uid === request.auth?.uid) {
    throw new HttpsError('failed-precondition', 'Tidak bisa memblokir akun sendiri.');
  }

  const auth = getAuth();
  const target = await auth.getUser(uid);
  if (target.email === BOOTSTRAP_ADMIN_EMAIL) {
    throw new HttpsError('failed-precondition', 'Tidak bisa memblokir super-admin utama.');
  }

  await auth.updateUser(uid, { disabled });
  if (disabled) await auth.revokeRefreshTokens(uid);

  return { success: true, uid, disabled };
});

export const deleteUserAccount = onCall<{ uid: string }>(async (request) => {
  assertSuperAdmin(request);
  const { uid } = request.data ?? {};
  if (!uid) {
    throw new HttpsError('invalid-argument', 'uid wajib diisi.');
  }
  if (uid === request.auth?.uid) {
    throw new HttpsError('failed-precondition', 'Tidak bisa menghapus akun sendiri.');
  }

  const auth = getAuth();
  const target = await auth.getUser(uid);
  if (target.email === BOOTSTRAP_ADMIN_EMAIL) {
    throw new HttpsError('failed-precondition', 'Tidak bisa menghapus super-admin utama.');
  }

  await auth.deleteUser(uid);
  return { success: true, uid };
});

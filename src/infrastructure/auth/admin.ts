import type { User } from 'firebase/auth';

export const BOOTSTRAP_ADMIN_EMAILS = ['baitulqowwam123@gmail.com'] as const;

export type AdminRole = 'super-admin' | 'admin' | 'user';

export interface AdminClaims {
  role?: AdminRole;
}

export function isBootstrapAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return (BOOTSTRAP_ADMIN_EMAILS as readonly string[]).includes(email);
}

export function getRoleFromClaims(claims: Record<string, unknown> | null | undefined, email?: string | null): AdminRole {
  const role = (claims?.role as AdminRole | undefined) ?? null;
  if (role === 'super-admin' || role === 'admin') return role;
  if (isBootstrapAdminEmail(email)) return 'super-admin';
  return 'user';
}

export function isAdminRole(role: AdminRole): boolean {
  return role === 'admin' || role === 'super-admin';
}

export async function fetchAdminRole(user: User | null): Promise<AdminRole> {
  if (!user) return 'user';
  try {
    const tokenResult = await user.getIdTokenResult();
    return getRoleFromClaims(tokenResult.claims, user.email);
  } catch {
    return isBootstrapAdminEmail(user.email) ? 'super-admin' : 'user';
  }
}

// Legacy: still used in places that only have email — falls back to bootstrap check.
// Prefer fetchAdminRole(user) for accurate role-based checks.
export function isAdminEmail(email?: string | null): boolean {
  return isBootstrapAdminEmail(email);
}

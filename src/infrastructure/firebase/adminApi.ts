import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export interface AdminListedUser {
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

interface ListUsersResponse {
  users: AdminListedUser[];
  nextPageToken: string | null;
}

export async function listUsers(pageToken?: string): Promise<ListUsersResponse> {
  const fn = httpsCallable<{ pageToken?: string }, ListUsersResponse>(functions, 'listUsers');
  const result = await fn({ pageToken });
  return result.data;
}

export async function setUserRole(uid: string, role: 'admin' | 'user'): Promise<void> {
  const fn = httpsCallable<{ uid: string; role: 'admin' | 'user' }, { success: boolean }>(functions, 'setUserRole');
  await fn({ uid, role });
}

export async function setUserBlocked(uid: string, disabled: boolean): Promise<void> {
  const fn = httpsCallable<{ uid: string; disabled: boolean }, { success: boolean }>(functions, 'setUserBlocked');
  await fn({ uid, disabled });
}

export async function deleteUserAccount(uid: string): Promise<void> {
  const fn = httpsCallable<{ uid: string }, { success: boolean }>(functions, 'deleteUserAccount');
  await fn({ uid });
}

'use client';

import React from 'react';
import { AuthProvider } from '@/presentation/hooks/useAuth';
import { SyncProvider } from './SyncProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>{children}</SyncProvider>
    </AuthProvider>
  );
}

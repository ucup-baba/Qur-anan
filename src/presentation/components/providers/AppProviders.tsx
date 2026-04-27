'use client';

import React from 'react';
import { AuthProvider } from '@/presentation/hooks/useAuth';
import { SyncProvider } from './SyncProvider';
import { QuranAutoPrecache } from './QuranAutoPrecache';
import { ToastProvider } from '@/presentation/components/ui/Toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <SyncProvider>
          <QuranAutoPrecache />
          {children}
        </SyncProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

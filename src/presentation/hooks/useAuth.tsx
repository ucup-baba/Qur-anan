'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/infrastructure/firebase/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  isYoutubeSubscribed: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isYoutubeSubscribed, setIsYoutubeSubscribed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        const storedSub = localStorage.getItem(`yt_sub_${u.uid}`);
        if (storedSub === 'true') {
          setIsYoutubeSubscribed(true);
        }
      } else {
        setIsYoutubeSubscribed(false);
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        try {
          const res = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=UCp3PWQTp3E9nnJ5d-9XQJCw&mine=true`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            localStorage.setItem(`yt_sub_${result.user.uid}`, 'true');
            setIsYoutubeSubscribed(true);
          } else {
            localStorage.setItem(`yt_sub_${result.user.uid}`, 'false');
            setIsYoutubeSubscribed(false);
          }
        } catch (e) {
          console.error("Failed to check YT subscription", e);
        }
      }

      return result.user;
    } catch (err) {
      console.error('Google sign-in failed:', err);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isYoutubeSubscribed, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

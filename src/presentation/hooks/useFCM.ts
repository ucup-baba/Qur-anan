'use client';

import { useEffect, useRef } from 'react';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db, getFirebaseMessaging, requestFCMToken, onMessage } from '@/infrastructure/firebase/firebase';
import { useAuth } from './useAuth';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? '';

interface UseFCMOptions {
  onAdzan?: (prayerName: string) => void;
}

export function useFCM({ onAdzan }: UseFCMOptions = {}) {
  const { user } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (!user || initialized.current || !VAPID_KEY || typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    initialized.current = true;

    const setup = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const token = await requestFCMToken(VAPID_KEY);
      if (!token) return;

      await setDoc(doc(db, 'users', user.uid), {
        fcmTokens: arrayUnion(token),
        notifEnabled: true,
      }, { merge: true });

      const messaging = getFirebaseMessaging();
      if (!messaging) return;

      return onMessage(messaging, (payload) => {
        const mode = payload.data?.mode;
        const prayerName = payload.data?.prayerName ?? '';
        if (mode === 'getar') {
          navigator.vibrate?.([500, 100, 500, 100, 500]);
        } else if (mode === 'adzan' && prayerName) {
          onAdzan?.(prayerName);
        }
      });
    };

    let unsub: (() => void) | void;
    setup().then((u) => { unsub = u; });
    return () => { unsub?.(); };
  }, [user, onAdzan]);
}

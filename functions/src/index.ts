import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

initializeApp();

const db = getFirestore();

export { listUsers, setUserRole, setUserBlocked, deleteUserAccount } from './admin';

// Runs every minute — checks all users' prayer times and sends FCM if it's time
export const sendPrayerNotifications = onSchedule({
  schedule: '* * * * *',
  timeZone: 'Asia/Jakarta',
}, async () => {
  // Current WIB time as HH:MM (UTC+7)
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const hh = String(wib.getUTCHours()).padStart(2, '0');
  const mm = String(wib.getUTCMinutes()).padStart(2, '0');
  const currentTime = `${hh}:${mm}`;

  const snapshot = await db.collection('users')
    .where('notifEnabled', '==', true)
    .get();

  if (snapshot.empty) return;

  const messaging = getMessaging();

  for (const userDoc of snapshot.docs) {
    const data = userDoc.data();
    const prayerTimes: Record<string, string> = data.prayerTimes ?? {};
    const notifModes: Record<string, string> = data.notifModes ?? {};
    const fcmTokens: string[] = data.fcmTokens ?? [];

    if (!fcmTokens.length) continue;

    for (const [prayer, time] of Object.entries(prayerTimes)) {
      if (time !== currentTime) continue;

      const mode = notifModes[prayer] ?? 'hening';
      const openUrl = mode === 'adzan'
        ? `/sholat?adzan=1&prayer=${encodeURIComponent(prayer)}`
        : '/sholat';

      const result = await messaging.sendEachForMulticast({
        tokens: fcmTokens,
        data: { prayerName: prayer, mode, time, openUrl },
        notification: {
          title: `🕌 Waktu ${prayer}`,
          body: `${time} WIB — Mari menunaikan sholat`,
        },
        android: {
          priority: 'high',
          notification: {
            sound: mode !== 'hening' ? 'default' : undefined,
            channelId: 'sholat-notif',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: mode !== 'hening' ? 'default' : undefined,
              contentAvailable: true,
            },
          },
        },
        webpush: {
          notification: { silent: mode === 'hening' },
          fcmOptions: { link: openUrl },
        },
      });

      // Remove stale tokens
      const stale = fcmTokens.filter((_, i) => {
        const r = result.responses[i];
        return !r.success && (
          r.error?.code === 'messaging/invalid-registration-token' ||
          r.error?.code === 'messaging/registration-token-not-registered'
        );
      });
      if (stale.length) {
        await userDoc.ref.update({ fcmTokens: FieldValue.arrayRemove(...stale) });
      }
    }
  }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPrayerNotifications = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const messaging_1 = require("firebase-admin/messaging");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
// Runs every minute — checks all users' prayer times and sends FCM if it's time
exports.sendPrayerNotifications = (0, scheduler_1.onSchedule)({
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
    if (snapshot.empty)
        return;
    const messaging = (0, messaging_1.getMessaging)();
    for (const userDoc of snapshot.docs) {
        const data = userDoc.data();
        const prayerTimes = data.prayerTimes ?? {};
        const notifModes = data.notifModes ?? {};
        const fcmTokens = data.fcmTokens ?? [];
        if (!fcmTokens.length)
            continue;
        for (const [prayer, time] of Object.entries(prayerTimes)) {
            if (time !== currentTime)
                continue;
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
                return !r.success && (r.error?.code === 'messaging/invalid-registration-token' ||
                    r.error?.code === 'messaging/registration-token-not-registered');
            });
            if (stale.length) {
                await userDoc.ref.update({ fcmTokens: firestore_1.FieldValue.arrayRemove(...stale) });
            }
        }
    }
});

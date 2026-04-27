import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyDb25hksl_CYu-34bFK6xduDnVuS9kXOMA",
  authDomain: "quranan-qu.firebaseapp.com",
  projectId: "quranan-qu",
  storageBucket: "quranan-qu.firebasestorage.app",
  messagingSenderId: "679597523622",
  appId: "1:679597523622:web:ff746071a704501355aa67",
  measurementId: "G-KE29BYXHXH"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'us-central1');
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("https://www.googleapis.com/auth/youtube.readonly");

export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

let _messaging: Messaging | null = null;
export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window === "undefined") return null;
  try {
    if (!_messaging) _messaging = getMessaging(app);
    return _messaging;
  } catch {
    return null;
  }
};

export const requestFCMToken = async (vapidKey: string): Promise<string | null> => {
  const messaging = getFirebaseMessaging();
  if (!messaging) return null;
  try {
    const swReg = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: swReg });
    return token || null;
  } catch {
    return null;
  }
};

export { app, onMessage };

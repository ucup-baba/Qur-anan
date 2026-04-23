import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDb25hksl_CYu-34bFK6xduDnVuS9kXOMA",
  authDomain: "quranan-qu.firebaseapp.com",
  projectId: "quranan-qu",
  storageBucket: "quranan-qu.firebasestorage.app",
  messagingSenderId: "679597523622",
  appId: "1:679597523622:web:ff746071a704501355aa67",
  measurementId: "G-KE29BYXHXH"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics conditionally (client-side only)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export { app };

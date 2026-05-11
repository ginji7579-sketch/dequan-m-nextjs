import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// 這裡使用您提供的官方 100% 正確配置
const firebaseConfig = {
  apiKey: "AIzaSyDFXwMrwq8g_aYDzArFRlJKHwDGqAt3ZBY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dequan-m.firebaseapp.com",
  projectId: "dequan-m",
  storageBucket: "dequan-m.firebasestorage.app",
  messagingSenderId: "562809278262",
  appId: "1:562809278262:web:7f763a60969761ba3d2d97",
  measurementId: "G-VHWWJLVYTB"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const analytics =
  typeof window !== "undefined"
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : null;

export default app;

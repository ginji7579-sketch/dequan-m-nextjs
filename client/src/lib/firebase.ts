import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  // 關鍵：將 authDomain 設為與網站一致，解決手機 Safari ITP 攔截問題
  authDomain: "dequan-m.vercel.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const appConfig = {
  apiKey: String(firebaseConfig.apiKey ?? ""),
  authDomain: String(firebaseConfig.authDomain ?? ""),
  projectId: String(firebaseConfig.projectId ?? ""),
  storageBucket: String(firebaseConfig.storageBucket ?? ""),
  messagingSenderId: String(firebaseConfig.messagingSenderId ?? ""),
  appId: String(firebaseConfig.appId ?? ""),
  ...(firebaseConfig.measurementId
    ? { measurementId: firebaseConfig.measurementId }
    : {}),
};

const app = getApps().length === 0 ? initializeApp(appConfig) : getApp();
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const analytics =
  typeof window !== "undefined"
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : null;

export default app;

// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

/** 避免把 undefined 傳進 initializeApp（易在執行期觸發 auth/argument-error） */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const required = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
} as const;

for (const [k, v] of Object.entries(required)) {
  if (v == null || String(v).trim() === "") {
    const msg = `[Firebase] 缺少關鍵設定：${k}。請檢查 Vercel 的 Environment Variables 是否已設定並包含 VITE_ 前綴。`;
    console.error(msg);
    if (typeof window !== "undefined") {
      alert(msg);
    }
  }
}

if (
  typeof window !== "undefined" &&
  firebaseConfig.authDomain?.includes("vercel.app")
) {
  console.warn(
    "[Firebase] VITE_FIREBASE_AUTH_DOMAIN 不應設成 Vercel 網址。請改為「專案ID.firebaseapp.com」，否則 Google 重新導向登入會打到 /__/auth/handler 而得到 404。"
  );
}

const sanitizeAuthDomain = (domain: string | undefined, projectId: string | undefined) => {
  if (!domain) return projectId ? `${projectId}.firebaseapp.com` : "";
  // 如果被誤設為 Vercel 網址，強制修正回 firebaseapp.com
  if (domain.includes("vercel.app") && projectId) {
    return `${projectId}.firebaseapp.com`;
  }
  return domain;
};

const appConfig = {
  apiKey: String(firebaseConfig.apiKey ?? ""),
  authDomain: sanitizeAuthDomain(firebaseConfig.authDomain, firebaseConfig.projectId),
  projectId: String(firebaseConfig.projectId ?? ""),
  storageBucket: String(firebaseConfig.storageBucket ?? ""),
  messagingSenderId: String(firebaseConfig.messagingSenderId ?? ""),
  appId: String(firebaseConfig.appId ?? ""),
  ...(firebaseConfig.measurementId
    ? { measurementId: firebaseConfig.measurementId }
    : {}),
};

const app = getApps().length === 0 ? initializeApp(appConfig) : getApp();

/** 使用預設 getAuth；initializeAuth 在部分熱重載／雙重初始化情境曾觸發 auth/argument-error */
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

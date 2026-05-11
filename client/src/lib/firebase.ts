import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeAuth, 
  browserLocalPersistence, 
  browserPopupRedirectResolver, 
  indexedDBLocalPersistence,
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
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
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
} as const;

for (const [k, v] of Object.entries(required)) {
  if (v == null || String(v).trim() === "") {
    const msg = `[Firebase] 缺少關鍵設定：${k}。請檢查 Vercel 的 Environment Variables 是否已設定並包含 VITE_ 前綴。`;
    console.error(msg);
  }
}

const sanitizeAuthDomain = (domain: string | undefined, projectId: string | undefined) => {
  // 動態讀取設定，避免寫死域名導致不匹配
  if (domain) return domain;
  if (projectId) return `${projectId}.firebaseapp.com`;
  return "dequan-m.firebaseapp.com"; // 最後的後備
};

const appConfig = {
  apiKey: String(firebaseConfig.apiKey ?? ""),
  authDomain: sanitizeAuthDomain(firebaseConfig.authDomain, firebaseConfig.projectId),
  projectId: String(firebaseConfig.projectId ?? ""),
  storageBucket: String(firebaseConfig.storageBucket ?? ""),
  messagingSenderId: String(firebaseConfig.messagingSenderId ?? ""),
  appId: String(firebaseConfig.appId ?? ""),
};

const app = getApps().length === 0 ? initializeApp(appConfig) : getApp();

/** 
 * 手動初始化 Auth 以獲得最高相容性。
 * 使用 [indexedDBLocalPersistence, browserLocalPersistence] 的優先順序，
 * 這是解決 Safari ITP (Intelligent Tracking Prevention) 導致 internal-error 的業界標準做法。
 */
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver,
});

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const analytics =
  typeof window !== "undefined"
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : null;

export default app;

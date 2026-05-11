// client/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

/**
 * Google OAuth 會經多個網域再回 dequan-m.vercel.app；僅用 sessionStorage 時，
 * 部分 Safari／行動版會讀不到先前寫入的值。改為 session + local + 第一方 Cookie 三重備援。
 */
const GOOGLE_RETURN_KEY = 'dequan_google_auth_return';
const COOKIE_NAME = 'dequan_oauth_ret';
const RETURN_TTL_MS = 12 * 60 * 1000;

type ReturnPayload = { path: string; exp: number };

function safeInternalPath(path: string, fallback: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  return path;
}

function encodePayload(path: string): string {
  const payload: ReturnPayload = {
    path: safeInternalPath(path, '/admin'),
    exp: Date.now() + RETURN_TTL_MS,
  };
  return JSON.stringify(payload);
}

function decodePayload(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ReturnPayload;
    if (typeof data?.path !== 'string' || typeof data?.exp !== 'number') return null;
    if (Date.now() > data.exp) return null;
    return safeInternalPath(data.path, '/admin');
  } catch {
    return safeInternalPath(raw, '/admin');
  }
}

function persistGoogleReturnPath(path: string) {
  const encoded = encodePayload(path);
  try {
    sessionStorage.setItem(GOOGLE_RETURN_KEY, encoded);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(GOOGLE_RETURN_KEY, encoded);
  } catch {
    /* ignore */
  }
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  try {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(encoded)}; Path=/; Max-Age=720; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

function readRawGoogleReturn(): string | null {
  try {
    const s = sessionStorage.getItem(GOOGLE_RETURN_KEY);
    if (s) return s;
  } catch {
    /* ignore */
  }
  try {
    const l = localStorage.getItem(GOOGLE_RETURN_KEY);
    if (l) return l;
  } catch {
    /* ignore */
  }
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (m?.[1]) return decodeURIComponent(m[1]);
  } catch {
    /* ignore */
  }
  return null;
}

function clearGoogleReturnMarkers() {
  try {
    sessionStorage.removeItem(GOOGLE_RETURN_KEY);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(GOOGLE_RETURN_KEY);
  } catch {
    /* ignore */
  }
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  try {
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

/** 已登入且曾點過 Google 登入時，消費標記並導向（Cookie／storage 擇一可讀即可） */
function consumeGoogleReturnIfSignedIn(currentUser: User | null) {
  if (!currentUser) return;
  const raw = readRawGoogleReturn();
  const dest = decodePayload(raw);
  if (!dest) {
    if (raw) clearGoogleReturnMarkers();
    return;
  }
  clearGoogleReturnMarkers();
  if (window.location.pathname !== dest) {
    window.location.replace(dest);
  }
}

interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  /** 'popup' 時呼叫端可安全 setLocation；'redirect' 時整頁將離開，由 consume 標記導向 */
  loginWithGoogle: (returnTo?: string) => Promise<'popup' | 'redirect'>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (returnTo: string = '/admin') => {
    const provider = new GoogleAuthProvider();
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isLineWebview = /Line/i.test(ua);
    const isFbIgWebview = /FBAN|FBAV|Instagram/i.test(ua);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

    // Google blocks OAuth from WebView (Error 403: disallowed_useragent).
    if (isLineWebview) {
      const currentUrl = new URL(window.location.href);
      if (!currentUrl.searchParams.has('openExternalBrowser')) {
        currentUrl.searchParams.set('openExternalBrowser', '1');
        window.location.href = currentUrl.toString();
        return new Promise<'redirect'>(() => {});
      }
    } else if (isFbIgWebview) {
      alert("為保護您的帳號安全，Google 不允許在應用程式內建的瀏覽器登入。\n\n請點擊右上角選單（⋯ 或 ⋮），選擇「以系統預設瀏覽器開啟」（例如 Safari 或 Chrome）後，再試一次登入！");
      throw new Error("WebView not supported");
    }
    
    try {
      // 在行動裝置上，如果不是 LINE/FB，先嘗試 popup，失敗則自動切換為 redirect
      await signInWithPopup(auth, provider);
      clearGoogleReturnMarkers();
      return 'popup' as const;
    } catch (e: unknown) {
      const code =
        e && typeof e === "object" && "code" in e
          ? String((e as { code: string }).code)
          : "";
      
      // 在行動裝置上，任何「不支援」或「內部錯誤」通常都暗示應該改用 Redirect
      if (
        code === "auth/popup-blocked" ||
        code === "auth/operation-not-supported-in-this-environment" ||
        (isMobile && (code === "auth/internal-error" || code === "auth/network-request-failed"))
      ) {
        persistGoogleReturnPath(returnTo);
        await signInWithRedirect(auth, provider);
        return "redirect" as const;
      }
      throw e;
    }
  };

  const logout = () => {
    clearGoogleReturnMarkers();
    return signOut(auth);
  };

  useEffect(() => {
    let cancelled = false;
    // 必須先訂閱 onAuthStateChanged，不可先 await getRedirectResult：
    // 在部分 Safari／WebView 上 getRedirectResult 可能長時間不 resolve，
    // 會導致 loading 永遠 true、整站 children 不渲染（白畫面）。
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (cancelled) return;
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        consumeGoogleReturnIfSignedIn(currentUser);
      }
    });

    void (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          consumeGoogleReturnIfSignedIn(result.user);
        }
      } catch {
        /* redirect 未完成或已處理過時可忽略 */
      }
    })();

    const failSafe = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 12_000);

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth 必須在 AuthProvider 內使用');
  return context;
};
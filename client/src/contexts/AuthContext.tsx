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
const WEBVIEW_GOOGLE_LOGIN_MESSAGE =
  '為保護您的帳號安全，Google 不允許在應用程式內建的瀏覽器登入。\n\n請點擊右上角選單（⋯ 或 ⋮），選擇「以系統預設瀏覽器開啟」（例如 Safari 或 Chrome）後，再試一次登入！';

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
  redirectError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<string | null>(null);

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
    const isMetaWebview = /FBAN|FBAV|Instagram|Barcelona|Threads/i.test(ua);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

    if (isLineWebview) {
      const currentUrl = new URL(window.location.href);
      if (!currentUrl.searchParams.has('openExternalBrowser')) {
        currentUrl.searchParams.set('openExternalBrowser', '1');
        window.location.href = currentUrl.toString();
        return new Promise<'redirect'>(() => {});
      } else {
        // 如果已經帶有參數但還是在 LINE，說明自動跳轉失敗，需要手動提示
        const msg = "偵測到您正在 LINE 內使用。Google 不支援在 LINE 內登入，請點擊右上角「...」並選擇「以預設瀏覽器開啟」再試一次。";
        alert(msg);
        throw new Error(msg);
      }
    } else if (isMetaWebview) {
      const msg = "偵測到您正在 FB/Instagram 內使用。Google 不支援在應用程式內登入，請點擊下方（或右上方）圖示選擇「以預設瀏覽器開啟」再試一次。";
      alert(msg);
      throw new Error(msg);
    }
    
    try {
      // 如果是在 LINE 或 FB 內建瀏覽器，直接跳轉 (因為這些環境完全不支援彈窗)
      if (isLineWebview || isMetaWebview) {
        persistGoogleReturnPath(returnTo);
        await signInWithRedirect(auth, provider);
        return "redirect" as const;
      }

      // 其他環境（包括手機 Safari/Chrome），優先使用彈窗
      // 配合同網域代理 (Auth Proxy)，這現在是非常穩定的
      try {
        await signInWithPopup(auth, provider);
        clearGoogleReturnMarkers();
        return 'popup' as const;
      } catch (popupErr: any) {
        const code = popupErr?.code ?? "";
        console.warn('Popup failed, falling back to redirect:', code);
        
        // 只有在彈窗被阻擋或環境不支援時才跳轉
        if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
          persistGoogleReturnPath(returnTo);
          await signInWithRedirect(auth, provider);
          return "redirect" as const;
        }
        throw popupErr;
      }
    } catch (e: any) {
      console.error('Google Login Final Error:', e);
      throw e;
    }
  };

  const logout = () => {
    clearGoogleReturnMarkers();
    return signOut(auth);
  };

  useEffect(() => {
    let cancelled = false;
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
      } catch (error: any) {
        console.error('getRedirectResult failed:', error);
        setRedirectError(error.message || 'Google 登入跳轉驗證失敗，請改用一般瀏覽器重試。');
      }
    })();

    const failSafe = window.setTimeout(() => {
      if (!cancelled) {
        console.warn('Auth initialization timed out, forcing loading to false');
        setLoading(false);
      }
    }, 5000); // 縮短為 5 秒，避免用戶看到太久的白屏

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
    redirectError,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8] p-4 text-center">
          <div className="flex flex-col items-center gap-6 max-w-sm">
            <div className="w-12 h-12 border-4 border-[#2B8A8A] border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-2">
              <p className="text-[#2B8A8A] font-bold text-lg">正在準備登入環境...</p>
              <p className="text-gray-500 text-sm">如果等候超過 5 秒，請點擊下方按鈕重整，或確保您使用的是系統瀏覽器（Safari/Chrome）。</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#2B8A8A] text-white rounded-full font-medium shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              重新整理頁面
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth 必須在 AuthProvider 內使用');
  return context;
};

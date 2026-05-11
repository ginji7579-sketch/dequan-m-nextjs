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
import { isInWebView, hasOpenExternalBrowserFlag, forceOpenInSystemBrowserIfNeeded } from '../const';

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
    // 第一步：檢測是否在內建瀏覽器，如果是且還沒標記就強制轉向
    if (isInWebView() && !hasOpenExternalBrowserFlag()) {
      console.info('[Auth] Detected webview, forcing system browser...');
      forceOpenInSystemBrowserIfNeeded();
      // 程式碼不會執行到這裡（因為上面會 redirect），但為了型別完整性保留
      return new Promise<'redirect'>(() => {});
    }

    // 第二步：如果帶有 openExternalBrowser 標記但仍在 webview，提示用戶
    if (isInWebView() && hasOpenExternalBrowserFlag()) {
      const msg = '為保護您的帳號安全，Google 不允許在應用程式內建的瀏覽器登入。\n\n請點擊右上角選單（⋯ 或 ⋮），選擇「以系統預設瀏覽器開啟」（例如 Safari 或 Chrome）後，再試一次登入！';
      alert(msg);
      throw new Error(msg);
    }

    const provider = new GoogleAuthProvider();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    try {
      // 第三步：在手機上，為了最高穩定性，直接使用 Redirect 流程
      if (isMobile) {
        console.info('[Auth] Mobile detected, using redirect flow...');
        persistGoogleReturnPath(returnTo);
        await signInWithRedirect(auth, provider);
        return 'redirect' as const;
      }

      // 第四步：在電腦版，優先使用彈窗 (Popup)
      try {
        await signInWithPopup(auth, provider);
        clearGoogleReturnMarkers();
        return 'popup' as const;
      } catch (popupErr: any) {
        const code = popupErr?.code ?? '';
        const message = popupErr?.message ?? '未知錯誤';
        console.warn('[Auth] Popup login failed:', code, message);

        // 如果 Popup 被阻擋，降級到 Redirect
        console.info('[Auth] Falling back to redirect method...');
        persistGoogleReturnPath(returnTo);
        await signInWithRedirect(auth, provider);
        return 'redirect' as const;
      }
    } catch (e: any) {
      console.error('[Auth] Google login total error:', e);
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
      // 環境變數檢測
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      const authDomain = auth.config.authDomain;
      
      if (!apiKey) {
        alert("⚠️ 關鍵錯誤：找不到 Firebase API Key！\n請檢查 Vercel 後台的環境變數是否設定為 VITE_FIREBASE_API_KEY (必須以 VITE_ 開頭)。");
      }

      // 詳細診斷日誌
      console.group('🔐 Firebase Auth Config');
      console.log('API Key:', apiKey ? '✓ 已設定' : '✗ 未設定');
      console.log('Auth Domain:', authDomain);
      console.log('當前 Hostname:', window.location.hostname);
      console.groupEnd();

      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          consumeGoogleReturnIfSignedIn(result.user);
        }
      } catch (error: any) {
        console.error('getRedirectResult failed:', error);
        const code = error?.code || "unknown";
        const msg = error?.message || "驗證失敗";
        alert(`❌ 登入驗證失敗 (${code}):\n${msg}\n\n這通常是 Google Console 或 Firebase 後台設定不匹配導致。`);
        setRedirectError(msg);
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

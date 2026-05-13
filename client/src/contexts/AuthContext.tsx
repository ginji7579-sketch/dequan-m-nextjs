import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  sessionUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionUser, setSessionUser] = useState<AuthContextType['sessionUser']>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // 設定 persistence
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('✅ Firebase persistence set to local'))
      .catch((err) => console.error('❌ Persistence error:', err));
  }, []);

  // 檢查 server-side session cookie
  const checkServerSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setSessionUser(data.user);
        console.log('✅ Server session found:', data.user.email);
      } else {
        setSessionUser(null);
      }
    } catch (err) {
      console.warn('⚠️ Server session check failed (expected in dev):', err);
      setSessionUser(null);
    }
  }, []);

  // 聆聽 Firebase auth 狀態
  useEffect(() => {
    let mounted = true;

    // 先檢查 server session（獨立於 Firebase）
    checkServerSession();

    // 處理 Firebase 重定向結果（支援既有 Firebase redirect 流程）
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!mounted) return;
        if (result?.user) {
          console.log('✅ 重定向回來的用戶:', result.user.email);
        } else {
          console.log('ℹ️ 無重定向結果，為一般頁面載入');
        }
      } catch (error: any) {
        if (!mounted) return;
        const errorCode = error?.code || '';
        if (errorCode.includes('redirect-cancelled') || errorCode.includes('credential-already-in-use')) {
          console.warn('⚠️ 重定向結果可忽略:', errorCode);
          return;
        }
        console.error('❌ getRedirectResult 錯誤:', errorCode, error?.message || error);
      }
    };
    checkRedirect();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!mounted) return;
      console.log('🔥 onAuthStateChanged:', u?.email ?? '未登入');
      setUser(u);
      setFirebaseReady(true);

      // 只有在兩個來源都完成檢查後才停止 loading
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [checkServerSession]);

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async (): Promise<void> => {
    // 🚀 使用 popup 方式進行 Google 登入（手機也支援）
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      // 優先嘗試 popup 方式（手機 Chrome/Safari 都可）
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google popup 登入成功:', result.user?.email);
    } catch (popupErr: any) {
      // 如果 popup 被阻擋（或不可用），fallback 到 redirect
      if (popupErr?.code === 'auth/popup-blocked' || popupErr?.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ Popup 被阻擋，改用 redirect 方式');
        await signInWithRedirect(auth, provider);
        return;
      }
      throw popupErr;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    setSessionUser(null);

    // 清除 server session cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('⚠️ Server logout failed:', err);
    }
  };

  const value: AuthContextType = {
    user,
    sessionUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticated: Boolean(user) || Boolean(sessionUser),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
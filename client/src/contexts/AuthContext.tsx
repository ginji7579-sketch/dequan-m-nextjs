import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  Auth,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// 偵測是否為行動裝置（簡單的 UA 判斷）
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  // 監聽 Firebase 認證狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 處理重定向結果（手機登入後返回時自動完成登入）
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect result user:', result.user);
          // 可選：重定向完成後可以刷新頁面或導航
        }
      } catch (error: any) {
        console.error('Redirect login error:', error);
        // 可選：設定錯誤訊息到 state
      }
    };
    handleRedirectResult();
  }, []);

  // Email/密碼註冊與登入
  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  // Google 登入：自動選擇彈窗或重定向（手機上使用重定向）
  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      if (isMobileDevice()) {
        // 手機：使用重定向
        await signInWithRedirect(auth, provider);
        // 注意：執行 signInWithRedirect 後頁面會立即跳轉到 Google，不會繼續執行後面的程式碼
      } else {
        // 電腦：使用彈窗
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      console.error('Google 登入錯誤:', error);
      throw new Error(error.message || 'Google 登入失敗，請稍後再試');
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
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
} from 'firebase/auth';
import { auth } from '../lib/firebase';

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

  // 處理 redirect fallback 的結果（popup 被擋時才會用到）
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('Redirect login success:', result.user);
        }
      } catch (error: any) {
        console.error('Redirect login error:', error);
      }
    };
    handleRedirectResult();
  }, []);

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  // Google 登入：優先 popup，被擋才 fallback 到 redirect
  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      // 所有裝置（包含手機）都先用 popup
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user'
      ) {
        // popup 被瀏覽器擋住才改用 redirect
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('Redirect login error:', redirectError);
          throw new Error(redirectError.message || 'Google 登入失敗，請稍後再試');
        }
      } else {
        console.error('Google 登入錯誤:', error);
        throw new Error(error.message || 'Google 登入失敗，請稍後再試');
      }
    }
  };

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

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

interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (returnTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Redirect Error:", error);
      }
    };
    checkRedirect();

    return () => unsubscribe();
  }, []);

  const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

   const loginWithGoogle = async (returnTo?: string) => {
     const provider = new GoogleAuthProvider();
     const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
     const isMobile = /iPhone|iPad|iPod|Android|Line|FBAN|FBAV|Instagram/i.test(ua);
     const isLine = /Line/i.test(ua);

     if (isLine) {
       alert("⚠️ 請點擊右上角「⋯」，選擇「以系統瀏覽器開啟」再進行登入，以確保 Google 驗證成功。");
     }

     try {
       if (isMobile) {
         await signInWithRedirect(auth, provider);
       } else {
         await signInWithPopup(auth, provider);
       }
       return isMobile ? 'redirect' : 'popup';
     } catch (error: any) {
       if (error.code === 'auth/popup-blocked') {
         await signInWithRedirect(auth, provider);
         return 'redirect';
       } else {
         throw error;
       }
     }
   };

  const logout = () => signOut(auth);

  const value = {
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};